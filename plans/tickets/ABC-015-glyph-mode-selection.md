---
id: ABC-015
title: Glyph mode selection — precedence, signal set, and the --unicode override
status: ready
column: Ready
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

**Both flags true is an ORDERED-TABLE case, not an error case — ruled 2026-08-08, see the correction
block under `## Acceptance`.** The two flags arrive as two independent booleans, so the tuple is
constructible, and rows 1 and 2 both match it. **The rows are evaluated in order: row 1 wins and the
answer is ASCII** — the fail-safe direction, readable on every terminal, which is what `RISK-005`'s
mitigation is for. **This function does not throw and does not print.** Rejecting `--ascii
--unicode` with a message naming the conflict is `EPIC-006`'s obligation (below), and the same rule
in two places is how two places come to disagree.

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

Nine input tuples, each a pure function call with no terminal attached and each with one exact
output, then two session criteria. *(Amended 2026-08-08: the lead-in read "one criterion per row of
the table", which stopped being true at the eighth bullet — the `win32` guard is not a table row
either. See the correction block below.)*

- **Given** `--ascii` passed, a TTY, and `LANG=en_US.UTF-8`, **when** the mode is selected, **then**
  it is `ascii`. *(The flag beats every signal.)*
- **Given** `--unicode` passed, **no** TTY, and `LANG=C`, **when** the mode is selected, **then** it
  is `unicode`. *(The flag beats every signal in the other direction — this is the override that
  did not exist before.)*
- **Given** **both** `--ascii` and `--unicode` passed, a TTY, and `LANG=en_US.UTF-8`, **when** the
  mode is selected, **then** it is `ascii`, and **nothing is thrown and nothing is printed** — the
  rows are evaluated in order and row 1 wins. *(**Added 2026-08-08**: this tuple is constructible
  from two independent booleans and previously had no stated output. Rejecting the conflict with a
  message is `EPIC-006`'s, not this function's.)*
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
- **Given** any signal tuple, **when** the selection rule is called twice with that same tuple and
  the ambient `process.env` and `process.stdout.isTTY` are rewritten between the two calls to values
  that would produce the **other** answer, **then** both calls return the same value — the rule
  reads **no** ambient global. *(Falsifiable, and this is the point: an implementation that reads
  `process.env` directly passes every row above and fails only here.)*
- **Given** the session's mode has already been selected, **when** the ambient signals are rewritten
  to values that would produce the other answer and the session's mode is requested again, **then**
  the same value is returned — **and** the selection rule, called directly with the **new** signals,
  returns the **other** value. *(The second half is what makes this falsifiable: it proves the value
  is cached rather than coincidentally equal. **Replaces, 2026-08-08, the criterion this ticket
  carried until then**, which no implementation in scope could fail.)*

> ### CORRECTED IN PLACE 2026-08-08 by BA/PM (task `ticket-to-pr-ABC-015`, subtask `bapm-abc015-promote`, Workflow 07)
>
> **Two acceptance defects were fixed at the `Backlog → Ready` exit, before promotion, not after.**
> Both are stated so they can be checked rather than inherited. **Nothing else moved**: scope, size
> `S`, priority `P1`, the signal table's five rows, the `RISK-005` mitigation, the merge-order
> constraint and the `## Out of scope` list are all untouched.
>
> **1 — An input tuple had no stated output.** `--ascii` and `--unicode` arrive as **two independent
> booleans** (argv is `EPIC-006`'s; this ticket takes them already parsed), so `(true, true)` is
> constructible, and rows 1 and 2 of the table **both** match it. The ticket declared the flags
> "mutually exclusive" and handed the rejection to `EPIC-006` — which is **undecomposed and merges
> later**, so no merged code holds that precondition at the moment this function gets its first
> caller. An engineer had three defensible guesses (throw · row order · last flag wins) and the
> ticket picked none. **Ruled: row order, ASCII, no throw, no message.** It costs zero code — the
> ordered table already yields it — and it pins the behaviour so a later "improvement" is caught.
>
> **2 — The session criterion could not fail.** The old criterion read *"the mode already handed to
> the renderer is unchanged — the selection is made once, before the first frame, and cached"*. With
> the signals injected as arguments — which the `## Test notes` **require** — the only test that
> criterion admits is `const m = select(...); process.env.LANG = "C"; expect(m).toBe("unicode")`,
> which asserts that a `const` does not mutate. It tests JavaScript, not this ticket. Its one
> failing form, a module-level accessor that re-reads `process.env` on every call, is the thing the
> test notes forbid. **This is exactly the shape QE found in `ABC-014`** (*"not the white frame with
> its rows simply reversed"*, unfalsifiable as written) — caught here **before** an engineer writes
> against it rather than at the gate.
>
> **The ownership seam this exposed, closed rather than noted.** Epic acceptance `2b` requires the
> mode to be *"decided exactly once, before the first frame"* and to not change for the session.
> `ABC-015`'s `## Scope` handed startup to `EPIC-006`; `ABC-018` (its `## Dependencies`) says
> *"`ABC-015` owns that rule and runs it once at startup"*. **Both pointed away, so no ticket owned
> the once-ness and no ticket could test it.** Ruled to **this** ticket: it is the ticket with the
> rule in it, and `ABC-018` already writes that in its own words. **`ABC-018` and `EPIC-006` are not
> edited by this ruling** — nothing in either had to change.
>
> **Where the cache lives is NOT decided here.** A memoised accessor, a closure, a value the caller
> holds — that is structure, and it is the engineer's. What is required is the observable outcome:
> the same value for the rest of the session, and a rule that reads no ambient global so all nine
> table rows stay testable in one run.
>
> **Size re-checked, not assumed: still `S` (2).** The corrections add one cached value and two
> tests. No argv, no I/O, no new module of consequence.

## Dependencies

- **`ABC-014`** — declares the `GlyphMode` type this returns. Not a deep dependency; it is why this
  ticket sits behind `ABC-014` in `Backlog` rather than beside it in `Ready`.
- **Sequencing constraint, from `RISK-005`'s own mitigation wording**: this ticket merges **with or
  before `ABC-018`**, never after. `RISK-005` is mitigated by the fallback being *"built in from the
  start rather than retrofitted"*, and a build that puts a board in front of a player with a
  hardcoded glyph mode, and gains selection afterwards, is precisely the retrofit that wording rules
  out. **`ABC-018` is that build** — it is the ticket that makes the frame a display rather than a
  value, and it is the first thing in this epic a player can see.
- No dependency on `ADR-0004`, `ABC-012` or `ABC-013`.

> ### CORRECTED IN PLACE 2026-08-04 by BA/PM (task `refinement-2026-08-04`, Workflow 07)
>
> **This clause previously read "merges with or before `ABC-014` reaches `Done`, never after". That
> wording was wrong and it was a cycle.** Stated so the correction can be checked rather than
> inherited:
>
> - This ticket **needs** `ABC-014` first — `ABC-014` declares the `GlyphMode` type this function
>   returns, which is why the board holds it `blocked-until: ABC-014`. **That is unchanged and
>   correct.**
> - In this project `Done` **means merged** (`mode=lean`, `autonomy=pr`). So the old clause required
>   this ticket to merge no later than the ticket it cannot be written without. The two statements
>   are jointly satisfiable only if both merge in the same act — i.e. only if they are one ticket,
>   which `ABC-014`'s own size rationale deliberately rejects (*"folding all three into one renderer
>   ticket gives an 8-point `XL` and an automatic `SPLIT_REQUIRED`"*).
> - It was **flagged twice by the Orchestrator** (2026-08-02, 2026-08-03), which twice declined to
>   pull `ABC-014` — a `P0` — rather than walk into it. It is a stopped lane, not a documentation
>   nit.
>
> **Which document was wrong, and why this one:** `ABC-014`'s `## Dependencies` already said the
> right thing — *"`ABC-015` … must merge **with or before this ticket's first user-visible use**"* —
> and this ticket's clause is the one that mis-copied it as `ABC-014` reaching `Done`.
> **`ABC-014` reaching `Done` is not a user-visible use of anything.** `ABC-014` is scoped as a pure
> function that *"returns a frame as a value … and writes nothing"*, and it takes the glyph mode as a
> **parameter** it does not choose. So merging `ABC-014` alone cannot realise `RISK-005`: there is no
> player, no terminal, and structurally no hardcoded mode to retrofit. The retrofit becomes possible
> only where a caller must supply a mode to draw something a player sees, and that caller is
> `ABC-018`.
>
> **What did NOT change, deliberately:** `RISK-005`'s severity, its mitigation strategy, this
> ticket's size, priority, scope, acceptance criteria and `Backlog` position, and the board's
> `blocked-until: ABC-014`. Only the event the merge-order constraint binds to moved — from
> `ABC-014`'s merge to `ABC-018`'s. If anyone reads this as changing the *mitigation* rather than its
> sequencing, that is Security/NFR's call and not this one's; BA/PM ruled the sequencing under the
> owner's 2026-08-03 delegation of scope, sizing and priority to this role.
>
> **Consequence for the pull order:** `ABC-014` is unblocked and pullable now. The resulting chain is
> `ABC-014` → `ABC-015` → `ABC-018`, with no cycle anywhere in it.

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
- **The two session criteria are written against a named mutant** (added 2026-08-08): the
  implementation that reads `process.env` on every call passes all nine table rows and must fail
  only these two. If a session test passes on that mutant, the test is decoration — rewrite it, do
  not weaken the criterion.

## Size and priority rationale

**Size `S` (2).** One function, five enumerated rows, one cached value, and a table of eleven unit
tests — **nine input tuples plus two session criteria; recounted 2026-08-08**, and it read "nine
unit tests" against eight tuples before the corrections above. No new module of consequence, no chess logic, no I/O. Calibrated against `ABC-011` (one
guarded condition plus two test shapes, `S`) and `ABC-006` (`S`). Not `XS`, because the precedence
between the three locale variables and the deliberate non-use of the platform are real behaviour
with real regression risk, not a one-liner.

**Priority `P1`.** The game runs without it — the default is Unicode and most terminals render it.
It is not `P2` because it is the whole of epic acceptance `2b`, it is `RISK-005`'s named mitigation,
and its sequencing constraint means deferring it past `ABC-018` converts it from a small ticket into
a retrofit. *(Read `ABC-018` here, not `ABC-014` — corrected 2026-08-04, see `## Dependencies`.)*

## Definition of Ready

Problem ✅ · scope + out-of-scope ✅ · INVEST ✅ · acceptance measurable ✅ (**nine** enumerated input
tuples, each with one exact output, **plus two falsifiable session criteria** — see the correction
block; it read "nine tuples" against eight until 2026-08-08) · dependencies ✅ (`ABC-014`, with a
sequencing constraint that is **no longer a cycle** — corrected 2026-08-04) · NFR triggers ✅
(zero-I/O bar; no perf bar, with the reason) · test notes ✅ · size `S` ✅ · priority `P1` ✅ · no
blocker ✅

**PROMOTED `Backlog → Ready` 2026-08-08 by BA/PM** (task `ticket-to-pr-ABC-015`, subtask
`bapm-abc015-promote`, Workflow 07) — the `Backlog` exit this role owns. `Ready` 3/8 → 4/8; no limit
approached and no override taken.

**The one check this ticket failed on 2026-08-04 now passes, verified at the source rather than read
off a close-out note:** `ABC-014` merged 2026-08-08 (`ed42d26` → `c1d694f`) and is in `Done`, and
`git show main:src/render.ts` has `export type GlyphMode = "unicode" | "ascii";` at line 61. The
board's own `Ready` test — *"no unbuilt dependency"* — holds, and the `Blocked` column is empty.

**It was not promoted as it stood.** Two acceptance defects were found at this exit and fixed in
place first (an input tuple with no stated output; a criterion no implementation could fail). The
Definition of Ready is met **after** those corrections, which is what refinement is for — see the
correction block under `## Acceptance`.

**This is not the pull gate.** The Definition of Ready is applied again by the Orchestrator at
`Ready → In Development` (Workflow 04 step 1); promotion makes this ticket pullable, nothing more.
The merge-order constraint still binds: it merges **with or before `ABC-018`**.
