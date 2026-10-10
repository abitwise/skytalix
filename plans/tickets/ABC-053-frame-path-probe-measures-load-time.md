---
id: ABC-053
title: The frame-path probe measures LOAD-time closure, and `NFR-002`'s premise is the PER-FRAME path — the two stopped matching at `ABC-041`
status: backlog
column: Backlog
size: S
priority: P1
epic: —
feature: —
---

# ABC-053 — the probe measures the wrong time, and `ABC-041` is the hop where that became visible

> **Cut 2026-08-13 by BA/PM** (task `gate-abc041-2026-08-13`, subtask `refinement-ABC-041-a4`,
> Workflow 07), out of the QE gate's gap 7 on `ABC-041`. **This ticket is a RULING, not an
> implementation** — what the guard should measure is `ADR-0011`'s own question, and its owner is
> named in that ADR.

## Problem

*User*: every player, indirectly — `NFR-002` is the render-latency NFR, and this is the guard that is
supposed to hold its structural premise.

*Pain*: **the merged frame-path probe (`src/history-pane.nfr.test.ts`) measures the module closure at
LOAD time. `NFR-002`'s premise is about the PER-FRAME path.** For every module before `ABC-041` those
were the same thing, because the frame path was a module graph. `ABC-041` is the first module where
the frame path is a **function call**, and the probe's reach did not move with it.

Measured at the `ABC-041` gate (QE, `X5b`), not argued: a lazy
`void import("./history.ts").then((m) => m.gameStatusOf(history))` placed **inside the returned
closure** is green on **19/19** across `src/render-seam.test.ts` and `src/history-pane.nfr.test.ts`.
Three guards miss it at once, each for its own reason:

- the `A6`/`A7` text check greps `from "./history.ts"` — a dynamic `import()` has no `from`;
- the merged licence regex is anchored to statement form `^(?:import|export)\s+…` — an `import()`
  expression is neither;
- **the closure probe imports the root module and never calls the seam**, so a per-frame edge never
  fires during the measurement.

`ABC-041`'s `A2` spies miss it too: they are synchronous and the derive is a microtask.

*Value*: `NFR-002`'s structural claim — *zero derives added to the per-frame path* — is the claim
`plans/nfr-catalog.md`'s `O(window)` row rests on, and the frame path is the one path in this
codebase where an `O(plies)` replay per frame is the difference between a playable board and a
visibly slow one. A guard that cannot see the per-frame edge is a guard that reports the premise held
when it did not.

## Scope

**One ruling, recorded as an ADR amendment or an ADR, plus whatever guard change the ruling requires.**

- **Decide what `ADR-0011` clause 2's probe MEASURES**: the load-time module closure (what it does
  today), the per-frame call closure, or both as two separate guards with two separate names.
- **Decide whether the closure list stays DECLARED or becomes DERIVED.** The same docblock
  (`src/history-pane.nfr.test.ts:181-186`) carries its own dated expiry — *"Owner: Architect/Design,
  at the next hop that adds a frame producer. Dated expiry: `EPIC-006`, where the entry point
  assembles a frame, composition becomes an import, and this declaration is replaced by
  `closure(<assembly module>)` and DELETED."* **Both halves of that trigger are now live**:
  `ABC-041` added a frame producer, and `src/render-seam.ts` is the first module in the repository to
  import all four frame producers, so `closure("render-seam.ts")` is finally derivable — it yields
  four of the five declared roots, and the fifth (`glyph-mode.ts`) is reachable from no frame
  producer at all and needs its own answer.
- **If the ruling requires a guard that fires on a per-frame edge, that guard is in scope here.**

## Out of scope

- **Changing `src/render-seam.ts`.** It is correct; `X5b` is a mutant, not a defect in the delivered
  module. Nothing on this ticket is a re-open of `ABC-041`.
- **The import-statement-vs-consumer blind spot** — that is `ABC-054`, a different regex and a
  different question, cut separately on purpose.
- **A wall-clock measurement of `NFR-002`.** Frame WRITE is still `UNKNOWN - verify` in
  `plans/nfr-catalog.md` and this ticket does not close it.
- **Deleting the declared list before the ruling.** Replacing a declared list with a derived closure
  is a change to the guard's own rule.

## Acceptance (Given/When/Then)

- **`A1` (the ruling exists and is citable).** A dated ADR or ADR amendment under
  `memory-bank/50-decisions/` states, in one sentence each, **what the probe measures** and **whether
  the root list is declared or derived**, and names the docblock's dated-expiry trigger as
  discharged or re-dated. *(A ruling that leaves either open has not been made.)*
- **`A2` (the load-time/per-frame distinction is named where it is read).** The probe's docblock
  states which of the two it measures. **Given** a reader who opens
  `src/history-pane.nfr.test.ts` cold, **then** the answer is in the file, not in an ADR they have to
  find.
- **`A3` (armed, and the mutant that motivated it is the arming control).** **Given** the ruling's
  guard as delivered, **when** `X5b` — a dynamic `import("./history.ts")` inside a returned frame
  closure — is applied, **then** it goes **RED** if the ruling says per-frame edges are covered, and
  the guard's docblock says **in words** that it is not covered if the ruling says they are not.
  *(Either answer is acceptable; silence is not. A guard that cannot go red proves nothing — this
  project's own standard, stated three times in that file.)*
- **`A4` (`glyph-mode.ts` is answered).** The ruling states whether `glyph-mode.ts` is a frame-path
  root, given that it is reachable from no frame producer. **Then** the root set has a stated
  membership rule rather than a list nobody can re-derive.
- **`A5` (no production change).** `git diff --numstat` touches no non-`.test.ts` file under `src/`
  unless the ruling explicitly requires one, in which case the ticket says so before the code lands.

## Dependencies

- **`ADR-0011` is the subject and its clause 2 is the clause.** The ADR names Architect/Design as the
  owner of exactly this question, by its own words.
- **`ABC-042` is the natural pairing, not a blocker.** The Engineer's flag and QE's gap 7 both name
  `ABC-042` as the hop where the entry point assembles a frame and the expiry's second half fires.
  This ticket can be ruled before `ABC-042` and should be, because `ABC-042` is where a wrong answer
  gets built on.
- **`ABC-041` does not block it and it does not block `ABC-041`.** The gate's verdict on `ABC-041` is
  explicit that gap 7 is a merged guard's reach, predates that branch, and does not block it.

## Security / NFR triggers

- **`NFR-002` (render latency < 16 ms) is the subject.** Carried structurally, as `ABC-041` carries
  it: the guard must be able to observe the per-frame path, or say that it cannot. **No wall clock is
  asserted by this ticket** and none should be manufactured for it.
- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU**, scope = every file the branch adds under
  `src/`. **This ticket plans 0 new test files**: any guard change lands in the existing
  `src/history-pane.nfr.test.ts`.
- **Security: not triggered.** Four clauses, each with its own subject, per `ABC-041`'s repaired
  threshold: **(a)** fires on a `dependencies` key or any touch of `package.json` /
  `package-lock.json`; **(b)** fires if any non-`.test.ts` file under `src/` imports a Node builtin,
  reads `process.`, or calls `spawn`/`exec`/`fetch`/`eval`/`new Function`; **(c)** fires if a test
  file in the diff adds network, a filesystem write outside a temp dir, or a new `child_process`
  spawn — the probe's existing `spawnSync` is precedent and does not fire, a **second** one does;
  **(d)** fires if the diff touches any file under `src/` other than the probe. **On a disputed
  reading it fires and the gate resolves it.**

## Test notes

1. **`X5b` is the arming control and it is already written down** — QE's mutant table in
   `.grugops/context/quality-gate-ABC-041/notes/`. Rebuild it, do not re-derive it.
2. **Run the probe both ways, as `ABC-041` `A9` requires**: rooted at the module under test (green)
   and rooted at `src/turn-loop.ts` (still reports `history.ts`, so still armed).
3. **A per-frame guard has to CALL the seam.** The reason the current probe misses `X5b` is that it
   imports a root and stops; any guard that claims per-frame reach must exercise a frame.
4. **The derive in `X5b` is a microtask**, so a synchronous spy cannot see it. Whatever the ruling
   adopts must survive that or say it does not.

## Lane cost — how many test FILES this ticket implies

**Zero.** Any guard change lands in the existing `src/history-pane.nfr.test.ts`. If the ruling
requires a genuinely new probe file, **that is a re-size to `M` and it is stated here so nobody
absorbs it quietly** — `EPIC-003` plans 7–8 new files and `EPIC-006` 3–4 against a post-`threads`
planning number of ~10, and this ticket is not entitled to one of them by default.

## Size and priority rationale

**Size `S` (2).** The analysis is done and is in the gate's notes; what is left is a decision, a
docblock, and at most one guard. The work that is not trivial is deciding declared-vs-derived, which
is one ADR paragraph.

**Priority `P1`.** Not `P0`: nothing is broken in the delivered tree and no ticket is blocked on it.
Not `P2`: `ABC-042` is the next pull, it is where the entry point assembles a frame, and it is where
a wrong answer stops being cheap.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-13**. **Result: 9 of 10 — NOT MET.** ⚠️×1.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the probe measures load time, `NFR-002`'s premise is per-frame, and `X5b` is 19/19 green |
| 2 | scope and out-of-scope clear | **✅** one ruling plus its guard; four fences, including "do not touch `src/render-seam.ts`" |
| 3 | INVEST-shaped | **✅** independent of `ABC-041` and `ABC-054`; small; testable via `X5b` |
| 4 | acceptance testable and measurable | **✅** five criteria; `A3` is a named mutant with a stated red/green outcome for either ruling |
| 5 | dependencies known | **✅** `ADR-0011` clause 2 and its own dated expiry; `ABC-042` named as pairing, not blocker |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-002` structural, `N8-LANE` ≤ 650 ms with 0 files planned, security's four clauses |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `S` (2), with the re-size trigger named |
| 9 | priority assigned | **✅** `P1` |
| 10 | no major unresolved blocker | **⚠️ NOT MET** — the ruling itself is the unresolved question, and it is **Architect/Design's**, not BA/PM's. This ticket is Ready to be *assigned*, not Ready to be *built*: an engineer pulling it today would be choosing what `ADR-0011` measures, which is exactly the wrong decider. **→ RULED 2026-10-10 by Architect/Design in [`ADR-0029`](../../memory-bank/50-decisions/ADR-0029-the-frame-path-guard-measures-load-and-per-frame-from-one-composition-root.md) (`proposed`, owner acceptance owed).** It covers both phases, measured by module loads, from one declared root; `glyph-mode.ts` is off the path. Not re-scored: the verdict is BA/PM's |
