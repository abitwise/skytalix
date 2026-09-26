---
id: ABC-123
title: run-bounded.js — reject N above the timer's 2^31−1 ceiling (R2) and correct the stale process-model header (R3)
status: backlog
column: Backlog
size: XS
priority: P2
epic: EPIC-004
feature: —
---

# ABC-123 — the two owed fixes from `ABC-122`'s Security/NFR gate, at the next touch of `tools/grugops/`

> **Cut 2026-09-26 by BA/PM** (task `ticket-run-bounded-r2r3`, Workflow 07), on the owner's word,
> verbatim: *"both"* — in answer to the Orchestrator's dispatch naming R2 + R3 in
> `tools/grugops/run-bounded.js`
> (`.grugops/context/wave-2026-09-25/notes/20260926T235000Z-orchestrator-decision-c99c5919.md`).
>
> **Source: Security/NFR's own `ABC-122` gate, not re-derived.** The decision note
> (`.grugops/context/secnfr-ABC-122/notes/…-2749a2e6.md`) named R1, R2 and R3 as three separate
> residual items on `tools/grugops/run-bounded.js`. **R1 (the SIGKILL-class session-escape risk)
> was accepted by the owner separately and is explicitly out of scope here** (see `## Out of
> scope`). R2 and R3 were both named *"to be fixed / required, at the next licensed touch of
> `tools/grugops/`"*, owner: Software Engineer, scheduler: the Orchestrator. **This ticket is that
> touch, ticketed**, the same shape `ABC-122` itself was cut as `ABC-081`'s owed work.

## Problem

*User*: every role and every future hop that reads `tools/grugops/run-bounded.js` — as the
argument-validation guard on `npm test`'s own bound, and as the one place a reader learns what the
wrapper's process model actually is.

*Pain*, two independent gaps, both named at `ABC-122`'s Security/NFR gate and untouched since:

1. **R2 — `N` above the timer's own ceiling is accepted, not rejected.** `run-bounded.js` accepts
   any `Number.isInteger(timeoutMs) && timeoutMs > 0` value as a valid timeout. Node's own
   `setTimeout` silently clamps any value above `2147483647` (`2^31 − 1`) to `1` ms and prints
   `TimeoutOverflowWarning`. Measured at the `ABC-122` gate, at `2147483648`, `99999999999` and
   `9007199254740993`: the wrapper accepts the argument, then kills a **healthy** target
   immediately with exit `124` — a false red, not a hang and not a false green, but a real defect
   in the tool's own input validation (ASVS V2.2.1 — the input is validated as a positive integer,
   but not against the ceiling the mechanism it feeds actually has).
2. **R3 — the file's own header misdescribes both its status and its process model.** Two stale
   sentences, both present at `ca9f42d` (unchanged since): (a) *"NOT YET WIRED IN"*, obsolete
   since `ABC-122`'s `A4` landed the wrapper into `package.json`'s `test` script and
   `src/cli.test.ts`'s `SCRIPTS_AT_HEAD` pin; (b) *"leader of a NEW process group"*, which
   understates what `detached: true` actually does on POSIX (`setsid()` — a new **session**, not
   merely a new group) — and that understatement matters, because the new session is exactly why
   `ABC-122`'s own accepted risk R1 exists (a session detaches from every signal a group-level
   SIGKILL or a terminal hang-up would otherwise deliver). QE named this the same gap
   independently (`ABC-122` QE finding 1).

*Value*: `N` above the ceiling stops silently misbehaving the moment someone hand-runs the wrapper
with a large or miscalculated timeout, instead of failing red for a reason nobody wrote down; and
the header stops teaching the next reader two things that are no longer true — one of them (the
process-model sentence) is load-bearing context for reasoning about R1, the risk the owner already
accepted with his eyes open. Neither is a security finding (Security/NFR: both rated LOW, no ASVS
L1 requirement fails) and nothing is broken at `main` today with the committed `N = 60000` — this
is control debt on a tool every gate hop runs, closed at the touch the owner and Security/NFR both
named for it.

## Scope

1. **R2 — reject `N > 2147483647` (`2^31 − 1`) at the same validation point that already rejects
   `""`, `0`, `-5`, `abc`, `1.5`, `NaN` and `Infinity`.** Same failure shape: exit `2`, the
   existing usage line on stderr, no child spawned. The boundary value itself
   (`2147483647`) stays **accepted**, unchanged.
2. **R3 — correct the header comment in `tools/grugops/run-bounded.js`.** Remove or rewrite the
   *"NOT YET WIRED IN"* paragraph so it reflects the wired-in, delivered state (`A4`,
   `ca9f42d`), and state plainly that `detached: true` makes the child the leader of a new
   **session** (POSIX `setsid()`), not merely a new process group — and that this is precisely
   why the wrapper's own SIGHUP/SIGQUIT/SIGKILL-class residual (`ABC-122` R1, an accepted risk)
   exists. Comment-only; no behavior line changes.

## Out of scope

- **R1 itself — the SIGKILL-class session-escape residual.** Already an accepted risk, owner
  Olger Oeselg, per `ABC-122`'s Security/NFR decision. Nothing here reopens it, forwards
  `SIGHUP`/`SIGQUIT`, or changes the wrapper's signal-handling behavior in any way.
- **The committed default timeout (`60000` ms in `package.json`) and `ABC-122` `A4`'s formula
  bound (`≥ 5×` median lane wall, `≤ 120000`).** Both stay byte-identical; R2 only narrows what a
  *hand-run* invocation of the wrapper accepts as an argument, it does not touch the wired-in
  default.
- **Any change to `package.json`, `src/`, `AGENTS.md`, `plans/nfr-catalog.md`, `plans/board.md`,
  or any ADR.** Fenced from this cutting hop, same discipline `ABC-122` held. `AGENTS.md`'s
  `### Test` line already reflects the wired-in wrapper (Scribe, `scribe-test-line-122`) and
  needs no change here since the documented command line and bound are unaffected.
- **`run-bounded.hang-fixture.js`.** Untouched; R2/R3 concern argument validation and the header
  comment only, not the synthetic-hang fixture `A3`'s proof depends on.
- **Any other malformed-`N` informational item named at the `ABC-122` gate** (`1e3`, `0x3e8`,
  `" 1000 "`, leniency in general — Security/NFR rated these harmless, informational, not a
  finding). Not touched; R2 adds one new upper-bound check, it does not tighten the existing
  lenient parsing.
- **A CI job, a pre-commit hook, or any control that is not hand-run.** Same standing fence as
  `ABC-122` (`AGENTS.md` § Deployment posture) — this project has no CI and no git remote.

## Acceptance (Given/When/Then)

**R2 — the ceiling**

- **`A1` (`N` above the ceiling is rejected, not silently clamped).** **Given** a timeout argument
  at or above `2147483648` (`2^31`), **when** `run-bounded.js` is invoked with that `N` against a
  fast, deterministic target command, **then** it exits `2` with the same usage/malformed-`N`
  stderr line the existing invalid-`N` cases already print, **before spawning the target** (the
  target's own stdout must not appear). Checked by an extension to the committed
  `run-bounded.proof.js` (or an equivalent committed proof in the same file, following its
  existing `row(...)` pattern) asserting exit `2` and zero target-side effects at
  `2147483648`, `99999999999` and `9007199254740993` — the exact three values Security/NFR
  measured at the `ABC-122` gate. **Run this proof against the pre-fix wrapper first and report
  the RED reading** (today: exit `124`, the target killed alive, per the gate's own measurement)
  **before reporting the fixed, GREEN reading** — a red proof demonstrated, not claimed, the same
  discipline `ABC-122` `A3`/`A7`/`A9` used.
- **`A2` (the boundary is exact — nothing moves it).** **Given** `N = 2147483647` (`2^31 − 1`)
  against a target that exits well inside that bound, **when** run through the wrapper, **then**
  the run behaves exactly as before the fix (the target's own exit code and output pass through
  unchanged) — asserted by the same proof extension, on the same row style as `A2` in the existing
  `run-bounded.proof.js`, demonstrating the new check does not narrow the accepted range by even
  one value.
- **`A3` (existing lenient/rejected `N` cases are unaffected).** The full existing malformed-`N`
  behavior (`""`, `0`, `-5`, `abc`, `1.5`, `NaN`, `Infinity`, a missing `N`, and the lenient
  accepted forms `1e3`, `0x3e8`, `" 1000 "`, `1000.0`, `0b1111101000`) is re-run and reported
  unchanged at delivery — a regression here would silently narrow or widen a boundary Security/NFR
  already measured and rated.

**R3 — the header**

- **`A4` (the stale status paragraph is gone).** **Given** the delivered file, **when** grepped
  for the literal string `"NOT YET WIRED IN"`, **then** it is not present — checked and reported
  as a plain grep count (`0`), the same "checked, not assumed" discipline the file's own proof
  script uses elsewhere.
- **`A5` (the process-model sentence is corrected).** **Given** the delivered file's header,
  **when** read, **then** it states that `detached: true` makes the child the leader of a new
  **session** (not merely a new process group), and it names that session as the reason the
  wrapper's own accepted risk (`ABC-122` R1: a SIGKILL-class stop of the wrapper leaves the tree
  running unbound) exists. Checked by a grep for the word `"session"` appearing in the same
  paragraph as the `detached`/process-group explanation (count ≥ 1), plus a manual read quoted on
  the delivering page — this is a doc-accuracy criterion, so the check is textual, not a runtime
  assertion.
- **`A6` (comment-only, no behavior line touched for R3).** `git diff --numstat` on this ticket's
  contribution to `tools/grugops/run-bounded.js`, isolated to R3's lines, touches only comment
  lines (lines beginning `//`), never a code line — checked by reading the diff hunk at delivery,
  named explicitly so R3 cannot quietly carry a behavior change riding on a doc fix.

**Both**

- **`A7` (production behavior otherwise unchanged).** `npm test` (through the wrapper, unchanged
  default `N = 60000`) is green at the same counts `ABC-122` last delivered (47 files / 1446
  tests, 0 skipped) plus this ticket's own added proof rows — reported, not assumed, at delivery.
  `npm run lint`, `npm run typecheck` and `npm run build` each exit `0`.
- **`A8` (the fence, checkable from git).** `git diff --numstat <base>...HEAD` touches only
  `tools/grugops/run-bounded.js` and `tools/grugops/run-bounded.proof.js` — no line under `src/`,
  no line in `package.json`, no line in `AGENTS.md`, `plans/nfr-catalog.md`, `plans/board.md` or
  any ADR. `ABC-122`'s own delivered files (`run-bounded.hang-fixture.js`,
  `src/search.capacity.test.ts`, `src/engine.capacity.test.ts`) are untouched.

## Dependencies

- **None blocking.** `ABC-122` is `Done` and merged to `main`; this ticket is itself the "next
  licensed touch of `tools/grugops/`" both R2 and R3 were deferred to, and no other ticket at this
  cut is in flight against `tools/grugops/run-bounded.js`, `run-bounded.hang-fixture.js` or
  `run-bounded.proof.js` (checked: `ABC-116`, `ABC-117`, `ABC-119` and the other open `Backlog`
  items touch `src/cli.ts`/`src/cli.test.ts` or unrelated files, none touch `tools/grugops/`).
- **R1 stays fenced.** This ticket must not be read as discharging R1 — that risk remains the
  owner's accepted residual, tracked on `ABC-122`'s own page, not reopened here.
- **QE hop owed** before `In Review` is exited (owner's standing rule, 2026-08-17). UAT: this
  ticket touches only `tools/grugops/` (no `src/` line), so the 2026-08-17 zero-production-lines
  UAT waiver's literal measurement (`git diff --name-only … | grep -v '\.test\.ts$' | grep
  '^src/'`) is **expected to come back empty** — same open reading question `ABC-122`'s own
  Security/NFR gate flagged for the Orchestrator, not resolved here.

## Security / NFR triggers

- **`N8-LANE` — not engaged.** No new file lands under `src/`; the only files touched are under
  `tools/grugops/`, which `N8-LANE`'s standing bar does not charge (the same ruling `ABC-122`'s own
  Security/NFR gate made about the wrapper file itself). Report `0` new `src/` files at delivery
  rather than assuming it silently.
- **`N8-SPAWN` — engaged, and it must be re-derived, not assumed 0.** `A1`/`A2`'s proof extension
  spawns at least the wrapper plus its target for each of the four new rows (three rejected,
  one boundary-accepted) — the delivering hop states the exact child count these rows force and
  checks it against `N8-SPAWN`'s charging test, its exclusions and its stops
  (`plans/nfr-catalog.md` § `N8-SPAWN`), the same discipline `ABC-122`'s own `N8-SPAWN` trigger
  used, since the proof already lives outside the default lane (`ABC-122` `A3`'s own precedent:
  `run-bounded.proof.js` is a `.js` under `tools/`, not collected by vitest).
- **Security: ASVS L1, one item, unchanged shape.** The fix narrows an already-validated numeric
  argument; it introduces no new spawn shape, no shell, no external input path. **Firing
  threshold, falsifiable, identical to `ABC-122`'s own:** any spawn in the delivered diff that
  interpolates an external string into a shell command, or sets `shell: true`. Re-confirmed at
  delivery, not assumed carried over.

## Test notes

1. **`A1`'s red-then-green reading is the criterion that decides whether R2 was worth doing** —
   the same reasoning `ABC-122` `A3`/`A7`/`A9` used: a fix that is never shown failing on the
   unfixed code, then passing on the fixed code, is an assertion of intent, not a demonstration.
2. **`A2` is the guard against over-correcting** — a boundary fix that quietly narrows the
   accepted range by one value would trade one measured defect for a smaller, unmeasured one.
3. **`A5`'s check is textual, not a runtime assertion**, because the defect is what the comment
   tells the next reader, not the guard's own behavior — the same class of defect `ABC-122`'s own
   K3/K4 header commentary problem was (QE's finding 1), and the same honest limit: this criterion
   only catches a header that still says the wrong thing, not a header that says the right thing
   for the wrong reason.
4. **Report the exact `N8-SPAWN` count the extended proof forces**, the same discipline
   `ABC-122`'s own delivery used, rather than assuming the account nets to zero because the proof
   runs outside the lane.

## Size and priority rationale

**Size `XS`.** One small validation check (a single new upper-bound comparison, mirroring an
existing pattern in the same function) plus one comment-only doc correction in the same file; no
new production feature, no algorithm change, no new file, no new dependency. Calibrated against
`ABC-057`/`ABC-059`/`ABC-104` (each `XS`: a docblock or comment fix plus, at most, one small
guard), each with one narrow acceptance surface and zero `src/` lines — this ticket has slightly
more moving parts (one numeric guard plus one proof extension) but every part stays inside one
file plus its proof.

**Priority `P2`.** Not `P0`: nothing is broken at `main` today with the committed default, both
gaps are rated **LOW** by Security/NFR, and R2's failure mode is closed (a false red, never a
hang or a false green). Not `P1`: unlike `ABC-122` itself, the owner gave no explicit ordering
instruction ahead of any other named ticket — Security/NFR deferred both items to "the next
touch" without naming an urgency, and R3 (QE's own gap 1) was rated "a required fix, non-blocking"
at the `ABC-122` gate itself, the same phrase. Not `P3`: R3 is a **required** fix (not merely
optional polish) per Security/NFR's own ruling, and R2 is a real, if narrow, input-validation
defect (ASVS V2.2.1) that a future hand-run invocation could hit; leaving both to rot indefinitely
past "the next touch" the owner and the gate both named for them would be smoothing over a named
obligation.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at this cutting hop,
**2026-09-26**. **Result: 9 of 10 MET, 1 ⚠️ — PULLABLE TODAY.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** two independently-named gaps (R2, R3), both traced to `ABC-122`'s own Security/NFR gate note, neither re-derived; the value (a validated ceiling instead of a silent false red; a header that teaches the true process model behind the owner's already-accepted R1 risk) is stated without overclaiming — Security/NFR rated both LOW and nothing is broken today |
| 2 | scope and out-of-scope clear | **✅** two scoped deliverables, six fences including R1 itself, the committed default timeout, the hang fixture, and every other informational item named at the `ABC-122` gate |
| 3 | INVEST-shaped | **✅, with the bundling made explicit rather than smoothed over.** Both fixes land in the same file (`run-bounded.js`) on disjoint lines (one numeric guard, one comment paragraph) — bundled into one ticket on the owner's own explicit word (*"both"*), the identical shape `ABC-122` itself used to bundle its own K3/K4 halves; each half is independently testable and each acceptance criterion below is a runnable, falsifiable check |
| 4 | acceptance testable and measurable | **✅** eight criteria: three exact `N` values with an exit-code assertion, one boundary-exactness assertion, a red-then-green demonstration discipline, two grep-checkable doc-accuracy assertions, a line-class check (comment-only), and a git-diff fence |
| 5 | dependencies known | **✅** none blocking; checked for overlap against every other open `Backlog` ticket touching `tools/grugops/` (none found); R1's fence stated explicitly so this ticket cannot be misread as discharging it; the QE hop and the expected-applicable UAT waiver both stated |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` explicitly not engaged (no `src/` file), with the reasoning stated rather than left silent; `N8-SPAWN` flagged as engaged, with the exact check named, mirroring `ABC-122`'s own trigger; ASVS firing threshold unchanged and falsifiable |
| 7 | test notes present | **✅** four, each naming the criterion that actually decides the fix's worth (`A1`'s red-then-green, `A2`'s over-correction guard, `A5`'s textual-check limit, the `N8-SPAWN` count) rather than restating the acceptance list |
| 8 | size assigned | **✅** `XS`, calibrated against three named comparables with the one added moving part (the proof extension) stated |
| 9 | priority assigned | **✅** `P2`, with the not-`P0`, not-`P1` and not-`P3` arguments all stated, anchored to Security/NFR's own words ("required fix, non-blocking") rather than BA/PM's judgment alone |
| 10 | no major unresolved blocker | **⚠️ ONE, and it is a DELIBERATE OPEN JUDGMENT CALL, not a blocker.** `A5`'s exact replacement prose for the header's process-model sentence is not supplied on this page — the acceptance names the checkable facts (the word "session" present, R1's reason named) but leaves the exact wording to the delivering hop, the same shape `ABC-122`'s own DoR ⚠️ used for `A4`'s formula-not-constant default. **Not smoothed to ✅**: BA/PM does not author production (or documentation) prose; supplying exact replacement text here would be designing the fix, not scoping it. Falsifiable either way, so it does not block the pull. |

Column moves are the Orchestrator's.
