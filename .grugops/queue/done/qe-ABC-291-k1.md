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

## Result

_by qe-e2e (claude-opus-5-5, qe-ABC-291-k1), 2026-11-06T20:37:18Z, branch `grugops/qe-ABC-291-k1` from `grugops/ABC-291` at `63af973e`. No src or test edit, no game, no timing read, nothing tuned, nothing pushed or merged. This is no verdict on the ticket and no merge call._

**K1's fixtures: frozen after the build, not before. No value differs, and no d1–d4 defect was found. `SEAM_ROWS` needs rows. Drift: no defect.**

- **Order:** blind note `…2e186a33` sealed and committed at `4948aad0`, before `SEAM_ROWS`, `src/` or se-ABC-291's notes were opened.
- **My rows at the tip:** 88 rows, 352 images, 704 reads. Seam 0 misses, hot path 0, memo 0.
- **`SEAM_ROWS`:** 36 rows, 0 values differ against my labeller. `src/evaluate.pawns.test.ts` 95 of 95 default, 96 of 96 `ENGINE_DEEP`.
- **K1 (c)'s letter:** met, except d1's exclusions: **double step and en passant have no row**.
- **Rows missing (`…b850a2ad`):** 13 of 31 labeller mutants pass `SEAM_ROWS` unseen. The chief one is clause (b) with a neighbour two or more ranks behind (L4). Also (c)'s near squares, a friend on an attacked stop, pieces on (c)'s squares, a/h wrap, phalanx R5, edge-file backward by the stop arm. Every clause of Backward has a row; these are forms of a clause. Correction owed: at least L4, N13, N14, N16, N17, from `raw/k1-rows.mjs`.
- **Drift (`…a223d29a`): no defect, F1 does not fire.** Bundle off reads the probe's figure on every field: 187, 100 %, 24, position-5/e1f2. M3 off alone: 100 %, 16. Countermove off: unchanged. Of the 89, **10 is the term and 79 the tree**. Full width reads 12 on both forms, Δ 0, so ON's 101 is a missed line. Δ by depth: 10, 10, 10, 7, 89, −2, −1, 23, 49, 5. The off door equals the base on all 190 corpus rows.
- **Open:** why M3 reacts is by reading only, and no control term ran, `UNKNOWN - verify`. Whether it costs play is C2′'s. Test note 1's "(b) rows" were outside this brief, not read. PR10's figure may want a dated line, the Architect's.
- **Correction:** `…5de6a358`, two record slips, no reading moved. One first-form row of mine was void and is not used (`…a223d29a`).
- **Host:** 7 node main-thread processes present throughout, counted and not opened. None was mine and none was touched. No timing was read.
