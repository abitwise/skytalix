---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T11:07:59Z
subtask: bapm-ABC-274-fold
role: ba-pm
ref: .grugops/context/bapm-ABC-274-fold/
branch: grugops/bapm-ABC-274-fold — worktree .claude/worktrees/bapm-ABC-274-fold (from main)
width: records only.
---
# Fold ADR-0067 F8 into the ABC-274 page
From arch-fold-1103b (decision …e16881f5; ADR-0067 F8 and the dated d8 block): on plans/tickets/ABC-274*:
- DoR row 10: the falsifier half is met (F8); the row stays ❌ until ABC-269 merges.
- S2 ruled (Orchestrator …690d3b30): nps reported only; G2 ≤ 1.05× and G6 "≥ base" graded.
- Coupling clause resolved: F3's cut C1 is incremental phase, not the packed score → ABC-274 keeps its whole scope; packed score is the recommended form; C1 must stay intact (no phase add back into the walk).
- New condition row: a packed build has a test that summed mg/eg scores fit 16 bits.
- A5 states its base (main with ABC-269 + C1 merged) and method (PREREG …e36ee7ca shape, mean of two sessions).
- F8 disposition referenced.
Fences: plans/tickets/ABC-274*, plans/traceability.md + your records. Not board.md, ADRs, src. No push, force, amend, rebase, merge into main.
Publish: sealed notes (task bapm-ABC-274-fold, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit (Result text included); ## Result; brief + claim to done/.

## Result

_by ba-pm (claude-opus-5-5, bapm-ABC-274-fold), 2026-11-03T11:14Z, records only, at `main` `4ea4d474`; nothing run (the note seal under the host lock)._

- **DoR row 10:** the falsifier half is met by `ADR-0067` F8. The row stays ❌ until `ABC-269` merges, which it has not (not an ancestor of `main`). § Falsifiers now points to F8 (a) / (b) / (c), and the `UNKNOWN - verify` disposition is struck.
- **S2 ruled** (`…690d3b30`): nps is reported only. A5 `G2` ≤ 1.05 × and A6 `G6` "≥ base" are graded. The pending and default lines are struck.
- **Coupling clause resolved:** C1 is an incremental phase, not the packed score. The scope stays whole and the size stays S. The packed score stays the recommended form, and scope 2 gives the reason. C1 stays intact: the phase stays an argument, no phase add goes back into the walk, and P5 stays green.
- **New row A9** (packed build only): one default-lane row bounds Σ mg / Σ eg inside int16, using `src/evaluate-params.ts`'s maxima. A red A9 is a failing test, and the bound is never widened (BA/PM's disposition, marked).
- **A5:** base is `main` + `ABC-269` + C1. The method has PREREG `…e36ee7ca`'s shape: shipped tapered entries, `ev(position, phase)`, two sessions with the second reversed, R = the mean ≤ 1.0500, and a void rule on the control. The `58fa3eb4` ratio is reported only. The reader is QE (BA/PM's reading, marked).
- **F8 referenced** in the frontmatter, the header, § Falsifiers, § Dependencies and DoR 5 / 10.
- **DoR 9/10, Backlog.** No bar moved.
- **Lines:** ABC-274 page +107 / −31 (`cd1db457`); traceability.md +1 row.
- **Notes:** decision `20261103T111306Z-ba-pm-decision-700a3a01`, observation `20261103T111306Z-ba-pm-observation-756260ea`; 2 / 2 read back.
- **Commits:** claim `58a046d3`; page `cd1db457`; notes + trace `ab9b01d9`; this Result and the move to done/ in the closing commit. Not pushed, not merged.
- **Open:** none owed by BA/PM. Orchestrator: Ready at `ABC-269`'s merge (row 10). Owner: `ADR-0067` acceptance (merge only), pending.
