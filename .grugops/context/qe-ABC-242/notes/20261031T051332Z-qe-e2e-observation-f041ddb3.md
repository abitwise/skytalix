---
id: 20261031T051332Z-qe-e2e-observation-f041ddb3
kind: observation
by: qe-e2e
at: 2026-10-31T05:13:32Z
verified_by: 
confidence: high: oracle run out of tree against the real base and head trees; 362 checks, 0 FAIL
refs:
  - qe-ABC-242
  - ABC-242
  - EPIC-010
  - ADR-0054
  - ADR-0032
  - ADR-0046
  - NFR-004
  - NFR-008
  - NFR-009
  - QE-230-a
  - ABC-230
  - ABC-241
  - ABC-244
  - ABC-228
  - R1
  - R2
  - R3
  - R4
  - QE-242-a
  - QE-242-b
  - QE-242-c
  - SE-242-a
  - SE-242-c
  - SE-242-e
  - se-ABC-242/20261031T043705Z-software-engineer-decision-8b42a94e
  - se-ABC-242/20261031T043705Z-software-engineer-observation-712a6bb4
  - se-ABC-242/20261031T043705Z-software-engineer-observation-76069fd1
  - se-ABC-242/20261031T043705Z-software-engineer-observation-c0e5e0fa
  - grugops/ABC-242
  - 6884d61a
  - 4387d4e8
  - grugops/qe-ABC-242
  - 5da281c9
  - src/levels.ts
  - src/levels.test.ts
  - src/cli.test.ts
  - src/uci-session.test.ts
supersedes: 
seal: sha256:411154b1595ecb92fefa6707e1ae7eca271d4fe39b540dff19808ae4ac7b1d1d
---

# `ABC-242` A1, A2, A3, A5 and A6, read against the REAL base tree `4387d4e8` (out of tree), plus a 1 099-root differential sweep: 362 checks, 0 FAIL

**Harness.** `raw/qe-scripts/oracle.mjs` with `shim.mjs`, frozen in `PREREG.txt` (`5da281c9`); output in `raw/oracle/oracle.txt`.
- Trees: B = `git archive 4387d4e8`, H = `git archive 6884d61a`. Each was copied with a shim `engine.ts` that wraps
  `chooseMove` to count the child searches and log the budget each one is handed. This does not use the SE's in-file spy.
- Level 1's 100 ms, rate 1, seed 1, `virtualClock(10)` (the lane form) and `virtualClock(1)`.

## SE-242-e: the SE's test-local `base()` is base's real blunder
- B's real `createLevel` blunder equals the SE's `base()`, transcribed line for line and run on B's modules. The compared
  fields are the list, depth, nodes, elapsedMs and the child-search count.
- **42 of 42 checks equal**: 7 fixtures × {keys, no keys, `[]`} × steps {10, 1}.
- `git diff 4387d4e8 6884d61a -- src/levels.ts` is additions only: the header bullet, the constant, the helper, the doc lines,
  and the 5-line check inside `blunder`'s `try`. So H's `blunder` is base's, plus the check.

## A1–A3 against the real base (all PASS at steps 10 and 1)
| fixture | step 10: H | step 10: real B | searches H / B |
|---|---|---|---|
| probe (Black, losing) | `[d8e8 0, d8c8 −990, d8d7 −1012, d8e7 −1003, d8c7 −1002]`, plays d8c8 | `[−1005, −1000, −1012, −1003, −1002]`, plays d8c7 | 4 / 5 |
| last (repeat last in order) | `[e8f8 −1000, e8d8 −1010, e8e7 −1016, e8f7 −1006, e8d7 0]` | the same, but e8d7 −1012 | 4 / 5 |
| white losing | d1e1 **0** | d1e1 −1010 | 4 / 5 |
| white winning | f1g1 **0** | f1g1 545 | 4 / 5 |
| black winning | f8g8 **0** | f8g8 545 | 4 / 5 |
| A2 (second occurrence) | H = B in full (list, depth, nodes, elapsedMs); d8e8 −1005 | | 5 / 5 |
| A3 (clock 0, 7 keys untrimmed) | H = B in full | | 5 / 5 |

- At step 1, probe: H `[0, −1010, −1011, −1016, −1016]`, real B `[−1016, −1015, −1011, −1016, −1016]`. The third-occurrence
  moves read −1016, 633 and 633 at B and 0 at H. A2 and A3 give H = B in full.
- On every fixture, H's entries before the repeat equal B's. On `last`, the whole list is B's except its last entry, which
  is 0.
- **A6:** with no keys and with `[]`, all 7 fixtures at both steps give H = B in full, elapsedMs included (28 checks).

## Differential sweep (step 10; an independent count, not the SE's walk)
- **Set-up:** 6 starts × 4 seeded games × up to 48 plies, built to repeat. The starts are KQ v K (both colours), KRP v KP
  (both colours), `startpos`, and KQ v K from clock 90, so roots reach clock 137.
- **The check at every root:** for each child, count its earlier occurrences in `repetitionKeyHistory` at distance
  ≤ min(child clock, 101).
  - A child with ≥ 2 earlier occurrences must score 0 at H and must not be searched.
  - Every other child must be searched.
  - The entries before the first such move must equal B's.
  - A root with no such child must equal B in full.
  - A5's pick (the strict second-best, ties to the first) is recomputed from H's list.
- **Result:** 1 099 roots. 273 had a third-occurrence move (280 such moves), and 204 moves were second occurrences, which
  H searched. 826 roots were identical to B in full. **0 FAIL; A5 recomputed equal on every root.**
- **Limit:** the generator returns to a position quickly, so its repeats are short. A cap-50 copy also reads 0 FAIL
  (`posthoc-oracle-cap50.txt`; see the plants note, QE-242-b).

## The child budgets actually handed (the input to the R1 / condition-2 reading, QE-242-a)
- **Step 10, B, every fixture:** the 5 children are handed **10, −10, −30, −50, −70 ms** and each reaches depth 1. The blunder
  call's elapsed time is **210 ms** of its 100 ms budget.
- **Step 10, H, probe:** the children are handed 30 ms (depth 2; this child inherited the skipped slice), then −10, −30
  and −50 ms.
- **Step 1, B:** the children are handed 19, 17, 17, 17, 17 ms and reach depths 5 to 9. Elapsed time is 103 ms.
- **The cause:** each `chooseMove` reads the clock about 3 times (entry, iteration, return). At step 10 that is about 30
  virtual ms against a 20 ms slice. So from the second child on, the shared deadline has already passed, and each child
  runs the engine's unabortable depth 1 on a non-positive budget.
