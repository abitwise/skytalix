---
id: 20260819T180000Z-orchestrator-decision-pulling-abc043-at-9of10-with-the-waiver-written-e1f2a3b4
kind: decision
by: orchestrator
at: 2026-08-19T18:00:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - ABC-108
  - ABC-037
  - ABC-078
  - src/cli.ts
supersedes:
---

# Pulling `ABC-043` at DoR 9/10 — the written waiver, and what it does not cover

## Every blocker this ticket recorded is discharged, measured at `main` `fe09bad`

- `ABC-041`, `ABC-042` — in `Done`.
- `ABC-037` — merged; `src/line-input.ts` in the tree.
- *"NO `EngineSeam` EXISTS"* — **false**; `src/engine.ts` merged, `createEngine` returns one.
- **`A5`/`A2` testability — RESOLVED, not waived.** BA/PM ruled them satisfiable as written and
  **measured** the rig rather than arguing it. `ADR-0011` clause 4 is untouched and `src/cli.ts`
  still exports **0**.

## The one ⚠️ is item 6 and it is REAL and NEW

`N8-LANE ≤ 650 ms` is arithmetic over a total `ABC-108`'s `OQ-1` puts under open question: the lane
medians **13.400 s CPU against `NFR-008`'s 13 s clause**, and the board's own words are that the bar
**"cannot honestly be granted to any ticket"** until Architect/Design rules. `ABC-043` adds
**7 criterion-forced child processes at a measured 62.5 ms median wall each (n=7) ≈ 0.44 s.**

**BA/PM had 10/10 available on the discharged blockers alone and declined it**, on the grounds that
taking it would trade a real ⚠️ for a stale one. That judgement is correct and I am not overriding
it — I am pulling **with the ⚠️ standing**.

## The waiver, written

I pull because:
1. The ⚠️ is **not about this ticket's readiness to be built or verified**. Every criterion is
   buildable and measurable today; what is unresolved is whether a *budget number* may honestly be
   quoted.
2. It is **not resolvable by anything on this page**. `OQ-1` is Architect/Design's, and I am
   dispatching it in the same wave rather than deferring it — the same posture I took on `ABC-078`'s
   ⚠️(5), which the Architect then closed.
3. The cost is **measured, not estimated**: 0.44 s of added child-process wall, on a lane already
   over its clause by 0.4 s. **This ticket does not cause the breach and it does not fix it.**

**Residual, recorded not smoothed:** if `OQ-1` rules that the lane must shrink, `ABC-043`'s 7
children are a visible and legitimate target for that reduction, and its `N8-LANE` row will need
re-deriving against whatever number replaces 650 ms. **I am accepting forward rework on the
accounting, not on the code.**

## What this waiver does NOT cover

- **It does not grant `N8-LANE`.** The engineer must **report** its cost and must **not** claim the
  bar met. Same instruction the last four tickets carried.
- **It does not pre-clear `Ready for UAT`.** That column is **4/4, at its WIP limit**, and all four
  occupants need a named human's word. `ABC-043` can be built and gated; it cannot be parked in a
  full column. **If it finishes before the owner signs, it stops at `In Review`** — and that is the
  WIP limit working, not a failure.

## One inherited constraint now on the page

`ABC-037`'s QE found `G6`: `createLineInputSeam` has a **single-caller precondition** — two
overlapping `seam()` calls orphan the first read forever, and the failure mode is **a hang with no
output and no exit code**, the worst shape a CLI defect can take. BA/PM recorded it in `## Scope`
with no new criterion, because `A1`'s exactly-once pin and `A8`'s diff read already reach it. That
was discovered in one ticket and written down in the next; it is the handoff working.
