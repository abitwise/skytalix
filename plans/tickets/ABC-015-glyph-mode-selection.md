---
id: ABC-015
title: Glyph mode selection — precedence, signal set, and the --unicode override
status: backlog
column: Backlog
size: S
priority: P1
epic: EPIC-002
feature: —
---

# ABC-015 — Glyph mode selection: precedence, signal set, and the `--unicode` override

## Problem

*User*: the player whose terminal draws `????????` where the pieces should be, and who has no idea
why or what to do about it. Also the player on a modern terminal who should never have to think
about this at all.

*Pain*: `RISK-005` — Unicode chess glyphs behave differently across Windows Terminal, iTerm2, tmux
and CI — and its mitigation is explicitly *"the ASCII fallback being built in from the start rather
than retrofitted"*. Nothing decides which mode a session uses.

*Value*: the majority get figurines with no flag and no prompt; the minority get a readable board
and one documented flag to reach it.

## The ruling this ticket implements, and its honest limit

Wave 1 established that **the original epic acceptance criterion #2 could not be met by any
in-process detection.** A process can read whether stdout is a TTY, what the locale claims, and the
platform. It **cannot** read whether the installed font has glyphs for `U+2654`–`U+265F`, and it
cannot observe what the terminal actually drew. BA/PM ruled the product answer on 2026-07-30 and
amended the criterion in `plans/epics/EPIC-002-terminal-board-and-game-loop.md` (amendment `[A1]`,
criteria `2a` / `2b` / `2c`). **This ticket does not re-decide any of that**; it implements `2b` and
carries the residual named in `2c`.

**Residual, carried openly:** a UTF-8 TTY whose font lacks the figurines still draws tofu, and no
signal in the table below predicts it. The remedy is `--ascii`, documented in `--help`.

## Scope

**One selection function**, called **exactly once at startup**, returning a value the renderer
consumes for the rest of the session.

Precedence: **explicit flag > signal > default**, and the default is **Unicode**.

| # | Input | Mode |
|---|---|---|
| 1 | `--ascii` passed | **ASCII** |
| 2 | `--unicode` passed | **Unicode** |
| 3 | no flag, and `process.stdout.isTTY` is falsy | **ASCII** |
| 4 | no flag, a TTY, and the first **set** of `LC_ALL` / `LC_CTYPE` / `LANG` does **not** match `/utf-?8/i` | **ASCII** |
| 5 | no flag, a TTY, and the locale is unset **or** matches `/utf-?8/i` | **Unicode** |

Three things the table encodes deliberately, each recorded so it is not "improved" later:

- **`process.platform` is NOT a signal.** `win32` is a proxy for "legacy conhost", and Windows
  Terminal — the default on Windows 11 — renders the figurines correctly, so the proxy is wrong on
  the majority of Windows machines today. Defaulting Windows to ASCII would give the largest
  desktop platform the worse board to protect a shrinking tail.
- **Row 4 tests *set and not UTF-8*, never *unset*.** Unset is the normal Windows case and carries
  no information; treating it as a negative signal would smuggle the platform rule back in through
  the side door.
- **Non-TTY means ASCII** because a sink that cannot be seen and cannot be asked should receive the
  portable form. This is also what makes `EPIC-006`'s pipe-driven end-to-end test deterministic.

**`--unicode` is a new flag** and it exists because under any automatic rule a wrong detection needs
an override, and today only the ASCII direction has one. It and `--ascii` are **mutually
exclusive**.

## Out of scope

- **argv parsing.** `EPIC-006` owns argv (*"via prompt or CLI flags"*). This ticket owns the
  **rule**; it takes the two flags as already-parsed booleans. See the cross-epic obligation below.
- **Rendering anything** — `ABC-014` consumes the answer.
- **Re-probing per frame.** The result is a session constant. Per-frame probing would be waste
  against a 16 ms budget and a mid-game switch would make the session's own scrollback internally
  inconsistent.
- **Colour mode.** ANSI colour is cut from the MVP by epic amendment `[A4]`; there is no second
  capability decision to make and no `NO_COLOR` handling in this epic.
- **Asking the player.** Rejected on product grounds and recorded in epic criterion `2c` as the one
  choice a human can reverse.
- **Font detection of any kind.** It does not exist. Do not invent a probe.

## Cross-epic obligation this ticket creates (recorded, not assumed)

**`EPIC-006` gains two argv items at its decomposition:** the `--unicode` flag, and rejecting
`--ascii --unicode` together at startup with a message naming the conflict. Written here so it is
picked up rather than discovered. `EPIC-006` is undecomposed; this is a note for that decomposition,
not a change to its scope made by this ticket.

## Acceptance (Given/When/Then)

One criterion per row of the table, each a pure function call with no terminal attached:

- **Given** `--ascii` passed, a TTY, and `LANG=en_US.UTF-8`, **when** the mode is selected, **then**
  it is `ascii`. *(The flag beats every signal.)*
- **Given** `--unicode` passed, **no** TTY, and `LANG=C`, **when** the mode is selected, **then** it
  is `unicode`. *(The flag beats every signal in the other direction — this is the override that
  did not exist before.)*
- **Given** no flag and `process.stdout.isTTY` falsy, **when** the mode is selected, **then** it is
  `ascii`, regardless of locale.
- **Given** no flag, a TTY, and `LC_ALL=C` with `LANG=en_US.UTF-8` set as well, **when** the mode is
  selected, **then** it is `ascii` — **`LC_ALL` is consulted first and it wins**.
- **Given** no flag, a TTY, `LC_ALL` unset, `LC_CTYPE=en_US.utf8`, **when** the mode is selected,
  **then** it is `unicode` — the match is case-insensitive and tolerates the hyphen-less spelling.
- **Given** no flag, a TTY, and **none** of `LC_ALL` / `LC_CTYPE` / `LANG` set, **when** the mode is
  selected, **then** it is `unicode`. *(Unset is not a negative signal — this is the Windows case.)*
- **Given** no flag, a TTY, and `LANG=en_US.ISO-8859-1`, **when** the mode is selected, **then** it
  is `ascii`.
- **Given** `process.platform` is `"win32"` with a TTY and a UTF-8 locale, **when** the mode is
  selected, **then** it is `unicode` — **identical to every other platform**. *(A regression guard
  on the deliberate decision not to use the platform as a signal.)*
- **Given** a session that has selected a mode, **when** the selection function's inputs change
  mid-session (e.g. an env var is rewritten), **then** the mode already handed to the renderer is
  unchanged — the selection is made once, before the first frame, and cached.

## Dependencies

- **`ABC-014`** — declares the `GlyphMode` type this returns. Not a deep dependency; it is why this
  ticket sits behind `ABC-014` in `Backlog` rather than beside it in `Ready`.
- **Sequencing constraint, from `RISK-005`'s own mitigation wording**: this ticket merges **with or
  before** `ABC-014` reaches `Done`, never after. `RISK-005` is mitigated by the fallback being
  *"built in from the start rather than retrofitted"*, and a renderer that ships with a hardcoded
  mode and gains selection later is precisely the retrofit that wording rules out.
- No dependency on `ADR-0004`, `ABC-012` or `ABC-013`.

## Security / NFR triggers

- **No performance trigger.** The function runs once per process. Naming a µs bar for a
  once-per-session call would be ceremony.
- **`NFR-007` (`npx` to first board < 2 s, `EPIC-006`)** — this runs inside that window and must not
  spawn a subprocess, read a file, or perform any I/O to reach its answer. Measurable bar: the
  selection performs **zero** filesystem and **zero** process operations; it reads
  `process.stdout.isTTY` and `process.env` only.
- **No security trigger.** It reads two environment variables and a boolean. It writes nothing and
  interprets no user text.

## Test notes

Every case above is a pure table-driven unit test with the environment injected, **not** read from
the real `process.env` and **not** requiring a TTY. If the function reads globals directly it
cannot be tested for eight cases in one run — take the signals as an argument.

- **Test the `LC_ALL` > `LC_CTYPE` > `LANG` precedence with conflicting values set at once**, not
  one variable at a time. One-at-a-time tests pass on an implementation that reads the wrong one.
- **The `win32` case is a regression guard on a decision, not a platform test.** Label it as such
  in the test name, so a future reader does not "fix" it by adding the platform rule back.
- **Do not test that a terminal renders anything.** That is the thing wave 1 established is not
  observable, and a test claiming to check it would be a fabricated verification.

## Size and priority rationale

**Size `S` (2).** One function, five enumerated rows, one cached value, and a table of nine unit
tests. No new module of consequence, no chess logic, no I/O. Calibrated against `ABC-011` (one
guarded condition plus two test shapes, `S`) and `ABC-006` (`S`). Not `XS`, because the precedence
between the three locale variables and the deliberate non-use of the platform are real behaviour
with real regression risk, not a one-liner.

**Priority `P1`.** The game runs without it — the default is Unicode and most terminals render it.
It is not `P2` because it is the whole of epic acceptance `2b`, it is `RISK-005`'s named mitigation,
and its sequencing constraint means deferring it past `ABC-014` converts it from a small ticket into
a retrofit.

## Definition of Ready

Problem ✅ · scope + out-of-scope ✅ · INVEST ✅ · acceptance measurable ✅ (nine enumerated input
tuples, each with one exact output) · dependencies ✅ (`ABC-014`, with a stated sequencing
constraint) · NFR triggers ✅ (zero-I/O bar; no perf bar, with the reason) · test notes ✅ ·
size `S` ✅ · priority `P1` ✅ · no blocker ✅

Sits in `Backlog` behind `ABC-014`. Promotion to `Ready` is a separate BA/PM step, taken when
`ABC-014` clears.
