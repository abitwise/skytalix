---
id: 20261025T124944Z-software-engineer-observation-723cbf60
kind: observation
by: software-engineer
at: 2026-10-25T12:49:44Z
verified_by: 
confidence: high (deterministic counts, gates as run); G2/G6/D are UNKNOWN - verify until QE reads them
refs:
  - ABC-207
  - EPIC-008
  - ADR-0031
  - ADR-0028
  - plans/tickets/ABC-207-mobility-is-weighted-per-piece-and-an-early-queen-trip-costs.md
  - arch-design-ABC-207/20261025T123306Z-architect-design-decision-a21b7cc9
  - arch-design-ABC-207/20261025T123306Z-architect-design-observation-439d6f8c
  - orch-2026-10-25aa/20261025T123439Z-orchestrator-decision-6eda769c
  - grugops/ABC-207
  - 26c43d28
  - 5050cce9
  - G1
  - G2
  - G6
  - NFR-005
  - src/evaluate.king-mobility.test.ts
supersedes: 
seal: sha256:42f4d40aa4bb223f7c351610c22ced6cbc6e5b9c755460c89142f191ae45b1d3
---

# ABC-207 red-first, plants, frozen-clock counts and gates, all run by the SE (no real-clock search, no G2, no G6, no games)

Scratch: `<scratchpad>/se207/`. It holds copies of the worktree and a base `src/` extracted from `main` `26c43d28`; no plant touched the worktree's `src/`. Plain node; deterministic clocks only. Code `5050cce9`.

## Red-first (the page names no plants, so the new rows were run against base `src/evaluate.ts`)
- 7 new rows in `src/evaluate.king-mobility.test.ts`. At base: **2 red**, 5 green.
  - `A1` is red: the lone queen's mobility is clamped at 100 at base, so the pair cannot read the weight.
  - `A2`'s criterion row is red: Qa4 31 against Qd1 −29.
  - The 5 green at base are expected: the two zero-term rows, the ≥ 10 count, the mirror and bound row, and the clamp-exact row.
- On head: 7 / 7 green.
  - `A1` steps: Q 1, R 2, B 4, N 4.
  - `A2`: `evaluate` −7 (minors home); the term read through `evaluateWithoutMobility` is −25 / 0 / 0. These equal the ruling's premises.
- **Plants** (scratch copies; only the ABC-207 rows run; baseline 7 / 7 green). Each turns at least one row red:
  - queen weight 4: 2 red (`A1`, `A2`);
  - queen weight 2 (= rook): 2 red;
  - term 0: 1 red (`A2`);
  - minors condition dropped: 3 red (developed 0, no-minors 0, mirror/bound);
  - white-only term: 1 red (mirror);
  - term moved inside the clamp: 2 red. The first plant run had no row for this. I added `CLAMPED_EARLY_QUEEN` (white mobility clamped at +100, queen off home, both knights home) and a row that reads the cap exactly.
- **Bite checks on moved rows:**
  - `N3` turns G1 364 red (it reads 361).
  - `noLmrResearch` and `noResearch` each turn both `pvs-lmr` `A4` rows red.
  - Each recursion's plant alone turns only its own row red (4 single-recursion plants, 1 red each).

## Frozen-clock pre-check (Test note 4; `chooseMove`, `now: () => 0`, `maxDepth: k`; nodes to complete depth k; a count, not a reading)
| tree | kiwipete d7 | kiwipete d8 | position-6 d7 | position-6 d8 |
|---|---|---|---|---|
| base `26c43d28` `src/` | 609 900 | 1 735 339 | 586 333 | 1 355 149 |
| head `5050cce9` | 602 091 | 1 700 946 | 469 639 | 1 111 000 |
- All 8 equal the ruling's table. Not graded. `G6` is QE's.

## Gates on `5050cce9`
- lint, typecheck and build: rc 0.
- `npm test`: 62 files, **2 097 / 2 097** (base 2 090 + 7 new). `.test-results/last-run.json`: success, 0 failed, 0 pending, 0 todo. Duration 6.94 s (not a reading).
- Skips: count 0, `test-skip-integrity.js`: `No findings.`
- Deep lanes, real-clock rows filtered out by name (`real clock|REAL clock|wall clock|NFR-005`):
  - `PUZZLE_DEEP` 18 / 18, `G1` **54 / 58** (baseline 54 / 58);
  - `SEARCH_DEEP`: search 57, ordering 38, transposition 40, quiescence 37, pvs-lmr 29, all green;
  - `ENGINE_DEEP`: engine 54 green + 6 filtered, levels 37 green + 4 filtered.
- Levels (deterministic) on head equal the ruling:
  - `ABC-079` `A5` cells: kiwipete 13.27 / 19.32 / 2.98x (180 / 50 / 70); position-6 4.19 / 9.68 / 1.93x (10 / 42 / 13);
  - `ABC-121` `A1` d5 drift 98.93 % within 25 cp, max 45 cp (≤ 75), 0 mate flips.
- Production diff: `src/evaluate.ts`. UAT is owed; the QE verdict signs it.

## Not run (QE's)
- Real-clock rows, `G2`, `G5`, `G6`, `G8`, `G9`, `G11`, D, `N8-LANE`.
