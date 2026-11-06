---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-06T20:22:07Z
subtask: qe-ABC-291-k1
role: qe-e2e
ref: .grugops/context/qe-ABC-291-k1/
branch: new grugops/qe-ABC-291-k1 from grugops/ABC-291 at 63af973e — worktree .claude/worktrees/qe-ABC-291-k1
width: K1's fixtures after the fact, and one drift outlier. No src or test edit, no game, no timing read.
---
# K1's fixtures and the drift report
ADR-0075 K1 (c) and ABC-291 test note 1 say QE freezes the seam fixtures before the build. That did not happen: the Orchestrator dispatched the build without it, so SEAM_ROWS (36 rows) are the engineer's. A freeze now is after the build; record it as that, never as "before".
1. **Fixtures, blind first.** Before opening SEAM_ROWS or the d1–d4 code, derive your own fixture list and expected values from ADR-0075 d1, d2 alone: one per definition per colour, one per edge file per definition, each clause of Backward failing alone, d1's exclusions. Seal that note first. Only then read SEAM_ROWS and compare. Report rows missing, values that differ, clauses not covered, and run your rows against the tip. Corrections are findings; do not edit src or tests.
2. **Drift.** se-ABC-291 reads drift at d5 96.79 % within 25 cp, largest 89 (position-6/e2d2, 12 → 101), against the probe's 100 %, 24 at cc6e64d1, on the same values. It is a report with no bar, and the build's base has since gained the bundle. Say why it moved: split the 89 into static term and tree, and read the probe's figure against the same base if that can be done in one short run. State defect (F1) or no defect, with the evidence. Do not re-tune, and make no merge call from it.
Every test or engine run goes under the host lock the dispatch prompt gives. Deep-lane spelling: ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run <file>; "no tests" is a failure. Read counts, not exit codes.
Fences: your records only. No push, force, amend, rebase or merge into main.
Publish: sealed notes (contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`. Write scratch paths only as `<scratch>/<home>/<repo>` placeholders.
