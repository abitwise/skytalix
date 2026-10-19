---
id: 20261019T195500Z-qe-e2e-observation-abc174-a3-step-ruling-c41d7e2a
kind: observation
by: qe-e2e
task: qe-ABC-174
at: 2026-10-19T19:55:00Z
verified_by:
confidence: high
sealed: false
refs:
  - ABC-174
  - ADR-0045
  - NFR-008
  - QE-174-a
  - .grugops/context/qe-ABC-174/probe/a3probe.mjs
  - .grugops/context/qe-ABC-174/probe/a3probe.out
  - .grugops/context/qe-ABC-174/probe/a3probe-fixed.out
  - 20261019T195000Z-qe-e2e-observation-abc174-mutants-and-pins-8a2e5b90
supersedes:
---

# ABC-174 A3 at step 1000 (budget/3): it still discriminates, with one blind band. **Keep the step; tighten the row cheaply (`QE-174-a`, LOW)**

Hand-authored and unsealed. All figures below are readings. Nothing was estimated.

**The question (brief item 4).** The page asks for "two fresh virtual clocks of the same step". The SE chose step
`LEVELS[DEFAULT_LEVEL].budgetMs / 3` = 1000, not "10 or 100". Does the A3 equality row still red a build that changes
move, depth or nodes at level 5?

**Instrument.** `probe/a3probe.mjs` copies the row's logic exactly: the same 30 `THIRTY` positions, seeds 1 and 87, and
equality on kind, move label, depth and nodes against `chooseMove(…, { budgetMs: 3000 })`. It runs on the `be6a5599`
tree, with a synthetic level-5 entry (budget b, rate r) and a chosen step. Reference depths: step 1000 → 3; step 100
→ 6–9; step 10 → 9–12.

| level-5 mutant | step b/3 (the row) | fixed 1000 | step 100 | step 10 |
|---|---|---|---|---|
| b 2000 / 2500 / 2900 | RED | 2000 RED; 2500 and 2900 green | RED | RED |
| b 2990 | RED | green | green | RED |
| b 2999 | RED | green | green | green |
| b 3000 (control) | green | green | green | green |
| b 3001 / 3010 / 3100 / 3500 | **green** | RED | RED | RED |
| b 4500 | RED | RED | RED | RED |
| rate 0.01 | green (no draw < 0.01 on these seeds) | green | green | green |
| rate 0.05 | RED (seed 87) | RED | RED | RED |
| cost of one row run | ≈ 45 ms | ≈ 85 ms | ≈ 4.4 s | ≈ 46 s |

**What it means.**
- Any virtual step s leaves a blind band about s wide around the budget. That is the price of a coarse step.
- The row derives its step from the level under test. A table change to level 5's budget therefore moves both clocks
  together, and **the row is blind to raises from 3001 up to 4499 ms**. M08 (3000 → 3500) confirms it in vitest: 15
  rows red, but not the A3 row.
- For a mechanism change in `createLevel`, the step stays at 1000. The row reds raises (M18 +300, M19 ×1.4), but it is
  blind to small cuts: M20 (−1 ms) is green on the row.
- **At build level nothing gets through.** Every table mutant is killed by the D1 deep-equal, A2, A7 and A6 rows.
  M20 is killed by the QE-087-a spy. 22 of 22 were killed (`…8a2e5b90`).
- **The cost argument holds.** Step 100 costs about 4.4 s and step 10 about 46 s, on a lane whose `NFR-008` bar is
  10 s wall. 45 ms is what the default lane can carry.

**Ruling: KEEP step 1000.** The row discriminates any wrong build that changes level 5's play by more than one step
of clock in the downward direction, and every raise in the mechanism. Its blind band is covered by the data rows.
The brief's "10 or 100" would cost 0.1–1 s per row and buys nothing the data rows do not already catch.

**Recommended tightening (`QE-174-a`, LOW, test-only, optional before merge).** Run each side a second time on a
literal `virtualClock(1_000)` that does not depend on the level under test. The union of "b/3" and "fixed 1000" is red
for every budget in the table above except 3000, for about 85 ms more. With it, the row alone carries the "plays as
today" promise for table raises, rather than leaning on the data rows. The owner or Orchestrator may accept the gap
instead. It blocks nothing.
