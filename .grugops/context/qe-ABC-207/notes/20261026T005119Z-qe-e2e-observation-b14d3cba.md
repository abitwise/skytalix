---
id: 20261026T005119Z-qe-e2e-observation-b14d3cba
kind: observation
by: qe-e2e
at: 2026-10-26T00:51:19Z
verified_by: 
confidence: high (every command run by QE at 3d39c8ff; pre-registered; raw files read)
refs:
  - ABC-207
  - EPIC-008
  - NFR-005
  - NFR-004
  - NFR-008
  - ADR-0028
  - ADR-0031
  - ADR-0049
  - plans/tickets/ABC-207-mobility-is-weighted-per-piece-and-an-early-queen-trip-costs.md
  - owner-word-2026-10-24/20261024T093000Z-orchestrator-decision-4c3f7639
  - qe-ABC-205/20261025T034500Z-orchestrator-decision-10e61802
  - orch-2026-10-25ab/20261025T125052Z-orchestrator-decision-9bd65e3c
  - orch-2026-10-25aa/20261025T123439Z-orchestrator-decision-6eda769c
  - arch-design-ABC-207/20261025T123306Z-architect-design-decision-a21b7cc9
  - arch-design-ABC-207/20261025T123306Z-architect-design-observation-439d6f8c
  - ticket-to-pr-ABC-207/20261025T124944Z-software-engineer-decision-71735f56
  - ticket-to-pr-ABC-207/20261025T124944Z-software-engineer-decision-84f82342
  - ticket-to-pr-ABC-207/20261025T124944Z-software-engineer-observation-723cbf60
  - grugops/qe-ABC-207
  - 3d39c8ff
  - 7020cca3
  - 5477df21
  - G1
  - G3
  - G5
  - G8
  - G9
  - G10
  - A1
  - A2
  - A3
  - N8-LANE
  - quiescence ORACLE_AT_DEPTH_3
  - QE-207-b
  - QE-207-c
  - QE-207-d
  - QE-207-e
supersedes: 
seal: sha256:64d3e3eca4a8a9fb0306c8ced9c4202268232ad20204c8e33d19a30492a88a68
---

# ABC-207 QE gate at merge 3d39c8ff: A1–A3 MET by QE's own checks; the 12 moved rows are exactly the ruling's set (cross-run both ways); the A4 re-find holds on base and branch; 25 of 29 plants red their rows, 4 survive (named)

QE/E2E, task `qe-ABC-207`. Branch `grugops/qe-ABC-207` in `../wt-qe-ABC-207` = `grugops/ABC-207` `5477df21` + `main` `7020cca3`
(merge `3d39c8ff`, no conflict; `main` moved records only since the build base `26c43d28`). Base = merge-base `7020cca3`; its
`src`/`data`/`tools`/`package*.json` equal `5c91e2e4` (ABC-215's merge) and `26c43d28`. The merge's `src` equals the build
`5050cce9`. Own `npm ci --ignore-scripts`, node v26.11.1, Apple M3, Darwin 25.6.0. Scratch `<scratchpad>/qe207/` (`git archive`
trees); raw under `raw/` (redacted). No `src/` or `tools/` edit.

## Gates (at 3d39c8ff)
- `npm run lint` rc 0 (128 files); `typecheck` rc 0; `build` rc 0, `dist/` 22 files, 0 from `tools/`.
- `npm test`: 62 files, **2 097 / 2 097** (base 2 090 + 7), `last-run.json` success true, 0 failed / 0 pending / 0 todo.
  Duration 6.89 s (real 8.03 s), load1 7.43 at start, 0 vitest: **G8 MET** (≤ 10 s at load1 ≤ 8).
- Skip count 0; `test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`, rc 0.
- SEARCH_DEEP: search 57/57, ordering 38/38, transposition 40/40, quiescence 37/37, pvs-lmr 29/29.
- ENGINE_DEEP: engine 60/60, levels 41/41, transposition 26/26, pvs-lmr 21/21, legal 37/37, gameend 47/47 (real-clock rows
  included; disclosed: QE's deterministic criteria script ran beside the engine lane's first 2 min, all green).
- PUZZLE_DEEP (`G1`): 18/18, **solved 54/58, baseline 54/58** (MISSED the same four mate-in-3 seeds 24, 234, 288, 580).
- Printed levels, equal to the design probe: quiescence `A5` kiwipete 13.27 / 19.32 / 2.98x, position-6 4.19 / 9.68 / 1.93x
  (levels 180/50/70, 10/42/13); `ABC-121` `A1` d5 98.93 % within 25 cp of 187, max 45 cp (≤ 75); mate floor 0 of 180.
- `G9`: `src/levels.ts` diff base..merge empty. `G10`: no level reddened (every deep lane green).
- `N8-LANE` (Test note 1; taken after D): `lane-inventory.js` 62 collected = 62 tracked, `No findings.`; 0 new lane files; the
  7 new rows sit in `src/evaluate.king-mobility.test.ts` (default lane). Interleaved `npm test` sentinel (00:45:37–00:46:08Z,
  load1 2.98–3.92, 0 vitest): base 7.34 / 7.34 s, head 7.18 / 7.22 s. No lane growth.

## Criteria, QE's own reading
- **A1 MET.** QE's own pairs, found by a script that changes exactly one reachable square of the piece under test (QE's own
  reach counter confirms no other piece's reach moves) with the clamp out of play: steps Q 1, R 2, B 4, N 4 on 4 pairs per
  piece, white and black to move (32 pairs). Over a seeded 31 358-position random-playout corpus, `evaluate −
  evaluateWithoutMobility` equals QE's re-implementation `clamp(Σ weight × reach)` with N 4, B 4, R 2, Q 1, K 4 on every
  position (0 mismatches; 102 positions clamped).
- **A2 MET.** QE's own criterion pair (Qa4 v Qd1, both knights and bishops home, Black's queen home, a different pawn set):
  `evaluate` −15 < −8 (black to move: 15 > 8). The term alone (head − base `evaluateWithoutMobility`): 4 minors home −25,
  2 home −25, 1 home 0, all developed 0, queen home 0, no queen 0, knights on bishop squares 0, Black's early queen −25,
  both sides out 0, two endgames with no minors 0. Over the corpus the term equals QE's model of Scope 2 on every position
  (0 mismatches; a net charge on 3 589: 1 738 white, 1 851 black). None of the 3 589 is an endgame by the CPW
  simplified-evaluation definition (a side with a queen and ≥ 2 minors is never one), so "0 in an endgame" holds by
  construction.
- **A3 MET.** `G3`: every `src/evaluate*.test.ts` row green (`ABC-083` `A1`, `A2`, `A3`, `A4` ±100, `A6`). The mirror is exact and
  the position byte-identical after `evaluate` on all 31 358 corpus positions. The new row adds 22 positions (≥ 10). Read
  strictly ("each exercising both terms"), QE's corpus holds 3 514 such positions, all mirror-exact and within ±100 (the
  row's own 22: term charged on 6, weights matter on 16, both on 5; `QE-207-d`). `G2`: the timing observation of this task.
- **A4:** `G1`, `G5`, `G8`, `G9`, `G10` above; `G6` in the timing observation. **A5:** the D observation.

## The 12 moved rows (cross-run, `raw/cross/`)
- **X1 = head `src` + base's five test files:** exactly **12 distinct red rows**, the ruling's set: ordering `A4` p6 d2
  (11 220 v 10 371), `G1` (364 v 342), pvs-lmr `A4` `search()` (premise lost: 10 v 2) and `chooseMove()` ([−12, b3h3] v
  [−7, b3f3]), transposition knight-g1 ×2 (911 v 939), position-3 (1 355 v 1 377), `A5` ×2 (7 629 v 7 295; −498 v −485),
  quiescence `A4` (2 358 v 2 398) and `A5` oracle ×2 (20 v 8; 78 v 85).
- **X2 = base `src` + head's test files:** the same rows minus the re-found `search()` row (green on base), plus the two new
  relation rows (`A1`: Q clamped at 100; `A2`: 31 v −29). 13 distinct.
- **pvs-lmr `A4` re-find under `ADR-0028` d2, re-run by QE** (`ticket-to-pr-ABC-083/probe/a4scan.ts`, fixed depth 4, 467
  positions): head 2 hits, the first is the new fixture (position-3 after 1. Rb3 Kg5): correct −1 / b3c3, `noLmrResearch`
  and `noResearch` −12 / g2g3. On base the same fixture is also a hit (−1 / b3c3 against −11), and the old one (1. Rb3 Rd5)
  is a hit only on base. Same theme, measured on base and branch; no level moved.
- **Oracle rule, re-run by QE** (plain node): `searchWithoutPruning(p, 3)` = `searchWithoutPvsOrReductions` = `search()`:
  kiwipete 20 / e2a6 (70 389 552 oracle nodes), position-6 78 / c3d5 (14 332 220). Equal to the pins.
- Each moved row carries a `RE-PINNED` / `RE-FOUND at ABC-207` comment with before → after. 0 relations, 0 levels moved.

## Plants (`raw/plants/`; scratch copies, the worktree's `src/` untouched; baseline 91/91)
- **Red (25):** queen weight 4, 2 (= rook), 3, 0; rook 1, knight 1, bishop 1 (each = queen); `NO_MOBILITY` non-zero; clamp
  removed; term 0; term sign flipped; minors condition dropped; white-only term; queen home e1/e8; minor squares swapped;
  term inside the clamp; `N3` (G1 reads 361); `noLmrResearch`, `noResearch` and their four single-recursion variants;
  discard-the-re-search in `search.ts`; base `evaluate.ts` put back (10 rows: the 2 new relations and 8 moved default rows).
- **Survived (4), named:** term 20 cp (`QE-207-e`); the minors threshold at ≥ 1 and at ≥ 3 (`QE-207-b`);
  discard-the-re-search in `engine.ts` (`QE-207-c`).
