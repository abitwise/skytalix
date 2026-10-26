---
subtask: qe-gate-ABC-208
role: qe-e2e
ticket: plans/tickets/ABC-208-null-move-pruning-behind-a-test-only-off-door-with-a-zugzwang-guard.md
ref: .grugops/context/qe-gate-ABC-208/
branch: new grugops/qe-gate-ABC-208 from grugops/ABC-208 (80345eb9), worktree ../wt-qe-gate-ABC-208
width: 1 of 3 — NOT alone: no real-clock timing (no G2, G5, G6, G8, D)
---

# QE static gate for ABC-208 (null-move pruning, ADR-0050 PROPOSED)

> Split per Orchestrator `orch-2026-10-26g`. The ALONE real-clock reading (G2, G5, G6, G8, D under S1) is a later hop, `qe-ABC-208`, queued only after the owner accepts ADR-0050.

## Do
- Merge current `main` first (report sha). Own `npm ci --ignore-scripts`.
- Check the page's criteria A1–A4 independently against the `## Design ruling`, the dated amendment lines, ADR-0050 (Architect `…012b1053`, `…bae20026`) and the build (SE `…e0666f5b`, `…83c40265`). Real-clock parts are left for the later hop.
  - A1: run the cross-build check out of tree on the ABC-078 A3 corpus at that sweep's budgets.
  - Rule on the SE's flag: shipped `chooseMove` differs on 5/6 roots at d6, not the 6/6 the Architect's note states (position-3 is guarded out). Is A1 met as written?
  - A2: 7/7 at the per-row depths.
  - A3: the oracle and the mate floor at d5.
  - Re-run the load-bearing plants. Name the blind spots.
- Audit the 14 moved rows: cross-run each tree's code against the other's tests.
- Class the SE's flag on the ENGINE_DEEP real-clock "A2 — depth completed in the default budget" report row (still on `chooseMove`).
- Gates: lint, typecheck, build, `npm test` + `last-run.json`, skips, SEARCH_DEEP (including the new null-move lane), ENGINE_DEEP (deterministic rows), PUZZLE_DEEP (G1 54/58). Report the frozen-clock pre-check counts (base vs head).
- Verdict for the static part only (GATE PASS / FAIL with findings). UAT is not signed here; it is signed after the reading.

## Fences
- Only your worktree and `<scratchpad>/qe208gate/`. No `src/`/`tools/` edits. No real-clock timing. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only (ADR-0049 d4).

## Publish
- Seal notes (task `qe-gate-ABC-208`), `at` from `date -u`, with a `kind: decision`. Commit on your branch. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
