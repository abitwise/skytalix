---
id: 20261009T215422Z-qe-e2e-decision-abc084-verdict-pass-gate-coarse-927320d8
kind: decision
by: qe-e2e
at: 2026-10-09T21:54:22Z
verified_by:
confidence: high
refs:
  - ABC-084
  - ABC-079
  - ABC-077
  - ADR-0027
  - ADR-0028
  - RISK-003
  - N8-LANE
  - src/puzzle-corpus.ts
  - src/puzzle-suite.test.ts
  - src/puzzle-suite.baseline.json
  - src/quiescence.test.ts
  - 20261009T215422Z-qe-e2e-observation-abc084-five-focus-readings-17-weakenings-80be6044
  - 20261009T213713Z-software-engineer-decision-abc084-corpus-module-runner-lanes-config-99ac852f
  - 20261009T213713Z-software-engineer-observation-abc084-gates-criteria-baseline-n8lane-26f28829
  - 20261009T213713Z-software-engineer-claim-abc084-agents-md-line-and-owed-a9bf6ab2
supersedes:
---

# `ABC-084` QE verdict: **PASS** at `e426e91` for `A1`–`A7`. `A8` has not landed (Scribe). The gate's resolution is coarse

Hand-authored, no seal. This is a `decision`, not a `finding`: this install has no `§14-gate` verdict.
Diff under review: `7b54dae...e426e91`. QE reproduced every criterion in its own worktree (`grugops/qe-ABC-084`).
Detail and raw files: observation `…80be6044`, `probe/`.

| | reading | result |
|---|---|---|
| `A1` | `PUZZLE_DEEP=1`, 3 processes: mates **10/10** each time | **MET** |
| `A2` | do-not-hang **0/24 losing** (bar ≤ 1); win-material 6/6 | **MET** |
| `A3` | `PUZZLE_DEEP=weakened`: **10/40**, the gate row red (`expected 10 to be >= 40`), exit **1**, 12.50 s (13.63 s real) | **MET** |
| `A4` | 3 separate processes: the 40 rows are `cmp`-identical to each other **and to the build's own** `raw-out-a4-process1.rows.txt`. Plain `node` at step 1 gives the same rows byte for byte. The step guard's 5 rows are green | **MET** |
| `A5` | gating run 13.65–14.53 s in vitest (14.6–15.5 s real), load1 8–10; ≤ 60 s | **MET** |
| `A6` | every row has a FEN, its move(s), a class and a source. **QE's independent oracle** (its own move generator, perft-checked, 0 imports from `src/`) confirms all 40 rows: the mate keys are exactly the mate-in-2 first moves and no row has a mate in 1, the win-material keys are exactly the material-best moves, and every losing capture loses 2–8 pawns. No two rows are the same position | **MET** |
| `A7` | `a287461` touches only `src/puzzle-suite.baseline.json` and states a reason. Measured at `b3321f0`, which descends from `0de4a93`. Budget, step, machine, load and wall are recorded. 0 trigger-list files in `7b54dae..e426e91` | **MET** |
| `A8` | not on the branch: `grep -c PUZZLE AGENTS.md` = 0, 22 451 B. It is the Scribe's subtask `scribe-abc084-lane` (pending), not this build | **OWED — re-check after it lands** (`grep` + `wc -c` ≤ 24 576) |

Gate: lint, typecheck and build exit 0. `npm test` exit 0, 50 files / 1539 passed / 0 skipped. Integrity
`No findings.` (skip count 0). Host check exit 2, `UNKNOWN - verify`, never a pass. `SEARCH_DEEP` quiescence:
37 passed (29 default).

**Why PASS while the gate is coarse.** `A3` asks for the constant evaluator to go red, and it does. QE
planted 17 subtler weakenings: **7 red, 10 survive**. The survivors include quiescence off, depth capped at 3
or 4, and PST off. The suite reaches 40/40 already at 5 virtual readings per move (depth 3–4). That does
not break any criterion as written. It does bound what a green run means, so it is named as a gap below
and not hidden behind the PASS.

**Gaps (advisory; none blocks `A1`–`A7`):**
- **QE-084-a, MEDIUM: low resolution.** Red: depth cap 2, interior mate scored as stalemate, TT accepting a
  shallower entry, N↔R values swapped, Q=300, P=300, eval ignoring the side to move (and `A3`'s constant).
  **Survive:** quiescence off (both as `QUIESCENCE_MAX_PLY=0` and as the engine's leaf only), quiescence
  1 ply, depth cap 3, depth cap 4, PST off, mate score ignoring ply, LMR reducing checks, LMR by 2, ordering
  off. The default lane catches every survivor, but only through exact pins and identity oracles (node
  counts, engine vs `search()` identity, the LMR predicate, the no-ceiling test). A value-changing change
  legitimately re-records those pins (`ADR-0026` decision 10), so for these regressions **no strength
  reading** would go red. To BA/PM: harder rows (mate-in-3, quiet-move tactics, rows that need depth ≥ 5,
  rows where the leaf's quiescence decides at the depth reached).
- **QE-084-b, MEDIUM: ceiling.** The baseline is 40/40 = total, so it cannot be raised, and the suite cannot
  substantiate a strength *improvement* (the page's `## Problem` names `ABC-079`/`080`/`082`/`083`). It only
  detects a drop. This compounds QE-084-a.
- **QE-084-c, LOW.** The win-material keys are re-proven in no lane: the build's oracle is a probe, and only
  the mate keys are re-checked by a default-lane row. QE's oracle confirms all 6 today. Suggest a
  `PUZZLE_DEEP` row.
- **QE-084-d, LOW: tactical breadth.** There are 40 distinct positions but about 24 themes: the 10 mates are
  6 patterns plus 4 colour mirrors, and the 24 hanging rows are 12 plus 12 mirrors. All 6 win-material rows
  have white to move; the side-to-move mutant was caught by 2 hanging mirrors only. The K+R mate is
  `ABC-077`'s `MATE_IN_2`, and its source says so.
- **QE-084-e, LOW, inherited.** The moved doc comment says no row starts in check, but 2 rows do (QE's oracle
  confirms). The build already reported it; it is unchanged under `ADR-0028`.
- **Not QE's:** `N8-LANE` belongs to Security/NFR (the build reads +790 / +400 / +120 ms net). The UAT-waiver
  grep counts `src/puzzle-corpus.ts` and the baseline JSON (Orchestrator's call).

Board move: the Orchestrator's. Not merged, not pushed.
