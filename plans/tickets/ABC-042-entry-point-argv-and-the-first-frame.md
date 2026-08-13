---
id: ABC-042
title: The entry point — argv, the resolved colour, and the first frame a human can actually see
status: backlog
column: Backlog
size: M
priority: P0
epic: EPIC-006
feature: —
---

# ABC-042 — `npm run` prints a board: the composition root, flat in `src/`, exporting nothing

> **Cut 2026-08-13 by BA/PM** (task `epic006-2026-08-13`, subtask `epic-to-tickets-EPIC-006`,
> Workflow 03) at `EPIC-006`'s decomposition.
>
> **THIS IS THE THIN SLICE.** It is the single ticket that first makes `npm run` put a chess board on
> a human's screen, and it is the one the Factory Coach's ruling (*"carve a thin 'it runs' slice out
> of `EPIC-006` and pull it next"*, `.grugops/context/audit-delivery/notes/`) asks for. **Read
> `## What this ticket does NOT make runnable` before assuming it delivers a playable game — it does
> not, and the reason is not this ticket's to fix.**

## Problem

*User*: the project owner, and every human who will ever try this product — none of whom can run it
today.

*Pain*: **there is no entry point.** `AGENTS.md:48` records `Dev / run: UNKNOWN - verify` with the
comment *"no CLI entry point until EPIC-006"*; `package.json` has no `bin` and no `main`; every one of
the 25 `Done` tickets records *"UAT deferred → `EPIC-006`, explicitly NOT passed"*; and one of the nine
frozen metrics (`Escaped defects`) is structurally unmeasurable as a direct result. 17 production
modules, 816 tests, and nothing a person can start.

*Value*: **after this ticket a human types one command and sees a chess board.** `Dev / run` gets a
real value, UAT gets a destination, `src/turn-loop.ts` is the only production module left with no
production importer, and for the first time a quality signal in this repository can come from outside
the repository.

## Scope

**Two modules, both flat in `src/`, and one line of `package.json`.**

1. **The entry point.** Exports **nothing** (`ADR-0011` clause 4). It is the only place that reads
   `process.argv` and the only place that supplies `process.stdout` as a `FrameSink`. It resolves the
   options, begins the glyph session, builds the game, builds `ABC-041`'s seam, writes **one** frame
   through `beginFrameSession`, and exits **0**.
2. **The argv resolver.** A pure function `(argv: readonly string[]) => resolved options | a usage
   error`. **It is a separate, exported module because this ticket requires the `random`-resolution
   property to be testable without spawning a process** — see `## Why the resolver is separate`. It
   reads no ambient signal and writes nothing.
3. **`package.json` gains exactly one `scripts` entry** so `npm run <name>` starts it, and **nothing
   else** — see `A10`, which is the fence that keeps the reserved distribution decision unmade.

**The argv surface, complete:**

| argument | effect |
|---|---|
| `--colour white` / `--colour black` | the human's colour, and the board orientation that follows it (`ABC-041`) |
| `--colour random` | **resolved to `white` or `black` before anything else sees it** (`ABC-019` `[D24]`) |
| `--ascii` / `--unicode` | `GlyphFlags` into `beginGlyphModeSession` (`src/glyph-mode.ts:113`) |
| no arguments | `--colour white`, no glyph flags — the mode is then `selectGlyphMode`'s answer for the real signals |
| `--ascii --unicode` together | **rejected with a message naming both flags, non-zero exit, no frame** — the obligation `src/glyph-mode.ts:76-80` assigns to this epic by name |
| anything else, including `--difficulty` | **rejected with a usage message naming the offending argument, non-zero exit, no frame** |

## What this ticket does NOT make runnable, said before anyone reads the title and assumes otherwise

**It prints a board. It does not play a game.** No move can be typed, because the production
`InputSeam` is `ABC-037` (`EPIC-003`, cut, `P0`, two open ordering dependencies) and no `EngineSeam`
implementation exists anywhere (`EPIC-004` is undecomposed). `ABC-043` is the ticket that drives
`runTurnLoop`, and it is blocked on both. **This distinction is the honest version of "it runs", and
compressing it into "it works" is the failure this section exists to prevent.**

## Why the resolver is separate — a testability requirement, not a design

`ADR-0011` clause 4 defines an entry point as **a production module that exports nothing**, and that
is what keeps it off the frame path and out of the probe. A module that exports nothing **cannot be
imported by a test**, so everything inside it is provable only by spawning a child process. The
`random` property ("every resolution is `white` or `black`, and both occur") needs hundreds of
evaluations: at one spawn each it is unaffordable on this lane, and at 8 spawns it flakes 1 run in 128.
**Neither is testable-and-measurable, so neither passes the Definition of Ready.** Putting the pure
resolver in its own exported module makes it a normal unit test at zero spawn cost, and leaves the
entry point genuinely thin — which is also what keeps this ticket's test file near median weight.
**The requirement is testability; the file layout is the engineer's.**

## Out of scope

- **`runTurnLoop`, stdin, any `InputSeam`, any `EngineSeam`** — `ABC-043`.
- **The result screen** — `ABC-044`. Nothing terminal can happen in one frame.
- **`undo` / `resign` / `new` / `quit`** — `ABC-045` / `ABC-046`, and `undo` is not cut at all.
- **`--difficulty`** — it needs `EPIC-004`. Today it is an unrecognised argument (`A6`), and
  **`EPIC-006` acceptance criterion #4 is therefore NOT met by this ticket.** Named, not smoothed.
- **PACKAGING AND DISTRIBUTION, ENTIRELY.** No `bin`, no `main`, no `files`, no `publishConfig`, no
  change to `private: true`, no `npx` path, no install step. `ADR-0007` and `AGENTS.md` § Deployment
  posture reserve that decision to this epic **and it is not made here** — `A10` is the measurable
  fence. **`EPIC-006` acceptance criterion #1 (`npx <package>`) is NOT met by this ticket and cannot
  be met by any ticket until a human decides.**
- **Anything with a second output channel** — no logging, no verbosity flag, no `--help` beyond the
  usage message the error paths already print (coding rules 5 and 7).

## Acceptance (Given/When/Then)

`A1`, `A4`–`A9` run the delivered entry point **as a child process with stdout as a pipe** — the mode
`EPIC-002` `4c` names and the only mode in which "a human can run it" is actually proved. `A2`, `A3`,
`A10` and `A11` are read off the diff. **The resolver's own criteria (`A4` in part, `A5`, `A6`) are
unit tests with zero spawns.**

- **`A1` (a human can run it — the criterion this whole ticket exists for).** **Given** a checkout
  with `npm install` done and **no other setup**, **when** `npm run <name>` is executed with stdout as
  a pipe, **then** the process writes a frame of exactly
  `frameHeight({ board, status: STATUS_ROWS, history: HISTORY_ROWS })` rows containing the eight ranks
  of the start position, and exits with code **0**. **`AGENTS.md`'s `Dev / run: UNKNOWN - verify` is
  replaced with this exact command in the same diff, having been run.**
- **`A2` (it is an entry point by `ADR-0011` clause 4).** The delivered entry-point module contains
  **zero** `export` statements — asserted textually over the diff — so nothing can import a binding
  from it, it is never on the frame path, and it is never a probe root.
- **`A3` (flat in `src/`).** The delivered entry point is **directly in `src/`**, not in a
  subdirectory. *(`ADR-0011` clause 1's amendment names this ticket as the trigger for its deferred
  fix — non-recursive enumeration plus a depth-fixed specifier. **Flat means the trigger does not
  fire and the fix is not owed here.** A build that places it at `src/cli/main.ts` passes every other
  criterion on this page and silently drops the licence guard's reach.)*
- **`A4` (`--colour`, including `random`, resolved before anything sees it).** **Given** the resolver
  and the argv `["--colour","random"]`, **when** it is evaluated **1000 times**, **then** every result
  is exactly `"white"` or `"black"` and **both occur** — **zero child spawns**. **And given** the
  running entry point with `--colour white` and again `--colour black`, **then** the frame's board
  region is byte-identical to `renderBoard(startPosition, mode, "white-bottom")` and
  `"black-bottom"` respectively, and with `--colour random` it is byte-identical to exactly one of the
  two. **The string `random` reaches no renderer and no seam.**
- **`A5` (`--ascii --unicode` is rejected here, and the mode rule stays in one place).** **Given**
  both flags, **when** the entry point runs, **then** a message naming **both** flags is written, the
  exit code is **non-zero**, **zero** frame rows are written, **and `selectGlyphMode` is called 0
  times** (spied at the resolver level). *(`src/glyph-mode.ts:76-80` states the obligation and states
  why: its own `(true, true)` → `ascii` fail-safe row exists so a caller can never crash, and
  *"the same rule in two places is how two places come to disagree"*. Production never constructs that
  tuple; the row stays reachable as a pure-function property and its merged tests are untouched.)*
- **`A6` (an unrecognised argument never starts a game).** **Given** each of `--difficulty 3`, `-x`,
  `--colour purple` and `foo`, **then** a usage message **naming the offending argument** is written,
  the exit code is **non-zero**, and **zero** frame rows are written. *(The channel — stdout or
  stderr — is the engineer's. **If stderr is used, the entry point is also the only module that may
  name `process.stderr`**, by the same reasoning the architecture audit applied to `process.stdout`;
  flagged for Architect/Design, not decided here.)*
- **`A7` (the glyph mode reaches the frame through the merged rule).** **Given** stdout is a pipe and
  no flags, **then** the entire emitted stream carries **zero** code points above `U+007F`
  (`selectGlyphMode` row 3 — a sink that cannot be seen gets the portable form). **Given** `--unicode`
  on the same pipe, **then** the board region carries at least one code point in `U+2654`–`U+265F`.
- **`A8` (append strategy on a pipe, chosen once).** **Given** stdout is a pipe, **then** the emitted
  stream contains **zero** `\x1b[` sequences and ends with exactly one `\n` after the last row —
  `beginFrameSession`'s append branch (`EPIC-002` `4c`). `beginFrameSession` is called **exactly
  once**, with the first frame's own `.length` (`ADR-0009` clause 9a): the delivered modules contain
  **no numeric row-count literal**.
- **`A9` (`process.stdout` is acquired here and nowhere new).** **Given** the delivered diff, **then**
  the entry point is the only **new** file containing `process.stdout`, it passes it **only** as the
  injected `FrameSink`, and no other new module contains `process.` at all. *(**Stated because the
  audit's one-sentence rule is already false of merged code as literally worded:**
  `src/glyph-mode.ts:117-118` names `process.stdout.isTTY` and `process.env` inside
  `beginGlyphModeSession` — a **read of ambient signals, once, at session start**, not the acquisition
  of a writable handle. See `## The one correction this ticket makes to the audit's proposed rule`.)*
- **`A10` (the reserved distribution decision is measurably unmade).** `git diff --numstat` shows the
  entry point, the resolver, their test file(s), `package.json` and `AGENTS.md`, and **nothing else**.
  **`package.json` gains exactly one key under `scripts` and gains no `bin`, `main`, `files`,
  `publishConfig` or `dependencies` key, and `private` is still `true`** — asserted key by key against
  `HEAD`, not by reading the diff. Suite green, skip **0**; `src/` otherwise byte-identical.
- **`A11` (startup cost, recorded, without touching the catalog).** **Given** the entry point run as a
  child ≥ 5 times, **then** the median wall time from process start to the last byte of the first
  frame is **≤ 1 s**, and the figure is recorded in this ticket with its machine. *(This is **not**
  `NFR-007`: that row is `npx`-to-first-board **< 2 s with a warm npm cache**, and there is no package
  and no `npx` path, so it does not fire. Its catalog row is owed a reading the day distribution is
  decided — owner Architect/Design. **`plans/nfr-catalog.md` is not edited by this ticket.**)*

## The one correction this ticket makes to the audit's proposed rule

The architecture audit proposed one sentence to survive decomposition
(`.grugops/context/audit-architecture/notes/…stdout-hazard-already-contained…`):

> *"The entry point is the only module that may name `process.stdout`, and it may only pass it as the
> injected `FrameSink`."*

**As literally worded that sentence is already false on `main`, and a criterion written from it word
for word would fail on green code.** Measured 2026-08-13 by `grep` over non-`.test.ts` files under
`src/`: `src/glyph-mode.ts:117-118` contains `process.stdout.isTTY` and `process.env` in **executable**
code. Four other matches (`frame.ts`, `render.ts`, `status-panel.ts`, `turn-loop.ts`) are in comments
only.

**The audit's own body already says this** — *"`glyph-mode.ts` is the only module that reads ambient
terminal signals (`isTTY`, `env`), and it reads them **once**, inside `beginGlyphModeSession`"* — so
this is a wording correction, not a disagreement, and the audit's ruling is adopted whole. The precise
form, which `A9` tests:

> **The entry point is the only module that may acquire `process.stdout` as a WRITABLE HANDLE, and it
> may only pass it as the injected `FrameSink`. `beginGlyphModeSession` is the one merged exception and
> it READS ambient signals once; no module below the entry point acquires an I/O handle or writes.**

## Dependencies

- **`ABC-041` must land first — OPEN, and it is this ticket's only open dependency.** Composing the
  four panels inline instead would duplicate it.
- **Everything else is MERGED and named:** `beginGlyphModeSession` / `selectGlyphMode`
  (`src/glyph-mode.ts:81,113`), `newGame` (`src/history.ts:73`), `beginFrameSession` and
  `frameHeight` (`src/frame.ts:106,233`).
- **`ABC-037` and `EPIC-004` are NOT dependencies of this ticket** — the direction matters: this
  ticket writes one frame and exits, so it needs neither seam. They are `ABC-043`'s.
- **There is no exported start-position constant under `src/`** — measured: each test file defines its
  own `START_FEN`. The entry point holds the literal it passes to `newGame`. Promoting it to a shared
  export is a change to a merged module and is **not** this ticket's.

## Security / NFR triggers

- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU**, same instrument and protocol as every ticket
  since `ABC-026`. **This ticket is the most likely in either epic to test that bar**, because its
  file spawns child processes — see `## Lane cost`.
- **`NFR-002` — not triggered.** This module composes no frame row; `ABC-041`'s seam does. `A8`'s
  "no row-count literal" is the structural guard.
- **`NFR-007` (cold start) — does NOT fire, and that is a ruling, not an omission.** It is an `npx`
  clause and there is no package. `A11` records a stricter, differently-defined reading instead, and
  the catalog is not touched.
- **`ADR-0011` census: this adds TWO production modules**, one of which is the repository's second
  **entry point** under clause 4 (`perft-bench.ts` is the first) — *"`EPIC-006`'s CLI entry point will
  be the second, and clause 4 classes it correctly the day it lands."* The count moves deliberately.
- **Security: triggered, and NOT waived — this is the first production module in the repository that
  reads `process.argv`.** Three measurable bars:
  1. **Arguments are data, never code.** Zero occurrences of `eval`, `Function`, `child_process`,
     dynamic `import(` of anything derived from argv, and no shell — asserted over the delivered diff.
  2. **No argument reaches the terminal unsanitised.** `A6`'s usage message echoes the offending
     argument; every echoed byte is either passed through `assembleFrame`'s sanitizer
     (`src/frame.ts:123-132`) or the message contains **zero** C0 control characters and zero
     `\x1b` — asserted byte-level over an argument containing `\x1b[2J`.
  3. **No filesystem and no network.** Zero `fs`, `net`, `http`, `dns` imports in the delivered diff.
  **Firing threshold, falsifiable:** the security half fires — and the added lines get read before the
  ticket leaves review — if the diff adds a runtime dependency, imports any Node builtin other than
  none, or touches any file under `src/` other than the two new modules and their test file(s).

## Test notes

1. **The proof is a child process, not an import.** `A1` must actually run the delivered command;
   an assertion against an imported function proves the composition, not that a human can start it.
   `src/history-pane.nfr.test.ts:566-590` is the merged precedent for spawning here.
2. **Keep the spawn count small and STATE it in the ticket at build time** (see `## Lane cost`). Every
   spawn-provable criterion that can share one child's output should share it.
3. **`A4`'s 1000 evaluations must not spawn.** If the delivered shape makes that impossible, the shape
   is wrong for this ticket, not the criterion.
4. **Assert zero frame rows on the error paths** (`A5`, `A6`), not just the exit code. A build that
   prints the board and *then* complains passes an exit-code-only assertion.
5. **Assert `package.json` key by key against `HEAD`** (`A10`), not by eyeballing the diff. The
   distribution decision is reserved, and this is the mechanical guard on it.
6. **`A11` is a recorded reading with its machine, never a suite assertion.** This suite asserts no
   wall clock (`src/gameend.nfr.test.ts:16-17`).

## Lane cost — how many test FILES this ticket implies

**One, and it is the HEAVIEST file either `EPIC-003` or `EPIC-006` adds.** Both new modules share one
`*.test.ts`; no `vi.mock`, so **no `*.nfr.test.ts`**.

**Weight, stated rather than assumed** — this is the gap QE routed to BA/PM at the next cut (mean
309 ms vs median 94.2 ms per file, one file at 25.7% of all file time). This file **spawns child
processes**, which the per-file floor does not include: the floor was fitted on trivial files that
import nothing. The one measured anchor available is the merged fd-3 probe child at **66 ms** for an
11-module closure (architecture audit, 2026-08-12); this entry point's closure is larger. **Plan for
this file at several times the 94 ms median, and keep the spawn count in single digits.** `N8-LANE`'s
650 ms is the control that catches it, and it is inherited by name above. **Do not treat the ~160 ms
floor as this file's cost.**

## Size and priority rationale

**Size `M` (3).** Two modules; a complete argv surface with three distinct rejection paths; the
`random` resolution; the glyph session; the composition; the writer; one `package.json` line; the
repository's first child-process-driven test; and the first module that reads `process.argv`, which
carries a real security section. Calibrated against `ABC-018` (`M` — the other I/O-boundary ticket)
and `ABC-037` (`M`). It is below `L` (`ABC-019`) because there is no state machine and no open design
decision.

**The Factory Coach recommended `S` for this slice, and I am recording that I did not take it.** That
recommendation was a scale judgement against *"promote the whole epic"* and it holds in spirit — this
is one small ticket, not an epic. Measured against this board's own calibration it is an `M`, and
shaving a size to match a recommendation is how a ticket arrives mid-build with unestimated work in it.

**Not `XL`. The split line if it moves:** **(a)** the resolver and its rejections — `A4`(unit), `A5`,
`A6`; **(b)** the entry point, the composition and the frame — `A1`, `A2`, `A3`, `A7`–`A11`. Part (a)
is `S` and ships alone; part (b) cannot ship without it.

**Priority `P0`.** It is the thin slice. `AGENTS.md` records `Dev / run: UNKNOWN - verify`, 25 `Done`
tickets record UAT deferred to this epic with no destination, and `Escaped defects` is unmeasurable
until a human can run something. **Not `P1`:** every other ticket in this epic is behind it, and the
factory currently has no feedback channel from reality at all.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-13**. **Result: 8 of 10 clean, 2 recorded ⚠️ — NOT fully met; stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the owner and every future user; `AGENTS.md:48`, no `bin`/`main`, 25 tickets' UAT with no destination, one unmeasurable metric — all measured, none argued |
| 2 | scope and out-of-scope clear | **✅** two modules and one `package.json` line; a complete argv table; six fences, two of which (`--difficulty`, packaging) name the epic acceptance criteria they leave unmet |
| 3 | INVEST-shaped | **⚠️** valuable, negotiable, estimable, small, testable — **not independent**: `ABC-041` must land first. It IS independent of `ABC-037` and `EPIC-004`, in the direction that matters |
| 4 | acceptance testable and measurable | **✅** eleven criteria: a real `npm run` with exit **0**, **zero** `export` statements, a flat path, **1000** spawn-free resolutions with both outcomes, **zero** frame rows on three rejection paths, **zero** code points above `U+007F`, **zero** `\x1b[`, `beginFrameSession` called **exactly once**, `package.json` asserted key by key, a **≤ 1 s** recorded median |
| 5 | dependencies known | **✅** one open (`ABC-041`); five merged contracts named with line numbers; `ABC-037`/`EPIC-004` named as **not** dependencies with the direction stated; the missing shared start-FEN constant measured and left alone |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ **650 ms CPU**; `NFR-002` not triggered with the structural reason; `NFR-007` ruled not-firing with the catalog untouched; three security bars with a falsifiable firing threshold — **first module to read `process.argv`, not pre-waived** |
| 7 | test notes present | **✅** six |
| 8 | size assigned | **✅** `M` (3), calibrated, with the split line named and the Coach's `S` addressed rather than quietly overridden |
| 9 | priority assigned | **✅** `P0` |
| 10 | no major unresolved blocker | **⚠️** **one ordering dependency is OPEN — `ABC-041`.** Nothing else is open: the `--ascii --unicode` obligation is **ruled** on this page, the `process.stdout` rule is **corrected and stated**, and the distribution decision is **not touched** rather than deferred |
