---
id: 20261010T104245Z-architect-design-observation-r1-depth-signatures-and-drop-arithmetic-w14-only-loss-dde9adf4
kind: observation
by: architect-design
at: 2026-10-10T10:42:45Z
verified_by:
confidence: high
refs:
  - ABC-127
  - ABC-083
  - ABC-084
  - RISK-003
  - ADR-0028
  - ADR-0034
  - src/puzzle-suite.baseline.json
  - src/puzzle-corpus.ts
  - .grugops/context/ruling-puzzle-edge/probe/classify.mjs
  - .grugops/context/ruling-puzzle-edge/probe/classify.out.txt
  - .grugops/context/secnfr-ABC-127/notes/20261010T102840Z-security-nfr-observation-abc127-a7-quiet-20-24s-n8lane-225ms-net-budget-edge-4pct-red-6a3b6274.md
  - .grugops/context/qe-ABC-127/notes/20261010T094235Z-qe-e2e-observation-abc127-readings-a3-17of17-identical-oracle-38of38-f5e127b9.md
supersedes:
---

# R1 arithmetic: dropping the four edge rows leaves **14/17 red** (only `W14` survives again), turns E1/E3/E4 green and leaves E2/E5 red on win-material rows. **Shallower depth is how search weakenings read too, so depth alone cannot clear a red**

This note is hand-authored and unsealed: `human_admission` is `off`, and this install has no sanctioned writer.

- **No engine was run.** The probe only does arithmetic. `classify.mjs` reads committed files with `git show`
  at `f063ebce` (`grugops/ABC-127-harder-puzzles`):
  - QE's base run, `raw-deep-process1.rows.txt`;
  - QE's 17 files `a3/W*.rows.txt`;
  - Security/NFR's five files `plant-E*-run1.txt`.
- The output is `../probe/classify.out.txt`. Re-run it with `node classify.mjs f063ebce` from any checkout that
  has the branch.
- **Assumption: rows are independent.** Each move gets a fresh `virtualClock` (`ABC-084` `A4`), and the table
  is cleared per search (`ADR-0025`). So dropping a row removes exactly that row's line.

## Depth signature of each missed row against base (shallower / same / deeper)

| run | signature | note |
|---|---|---|
| `W3`, `W4`, `W5`, `W16` (search) | all shallower | 23, 14, 10, 10 rows |
| `W9` (eval ignores side) | 12/0/0 | also reds `ABC-084` `A2` (do-not-hang) |
| `W13` (LMR reduces checks) | 0/3/0 | seeds 1, 69, 1982, all at d5, the depth that proves a mate in 3 |
| `W14` (LMR by 2) | 1/1/0 | 1008 d5 → d4; **1075 d6 → d6, wrong move** |
| `W12` | 4/6/0 | includes 1075 at d6 |
| `W1` (quiescence off) | 2/9/0 | nine win-material rows at the same depth |
| `W6`–`W8` (piece values) | mostly the same depth | do-not-hang rows; red `ABC-084` `A2` |
| E1, E4 | 1/0/0 | 1008 / 1982, d5 → d4 |
| E2 | 3/2/0 | three edge rows d5 → d4, plus win-material 1700 and 5061 at d5 → d5; seed 24 newly solved |
| E5 | 2/1/0 | 1982 d5 → d4; **5180 d6 → d5**; 5527 d5 → d5 |

**Correction to `…6a3b6274`.** It says E2/E5's win-material misses "sit at the recorded d5". Three of the four
do. 5180 under E5 is one ply shallower than base.

## If seeds 1008, 1075, 1424 and 1982 are dropped (baseline 54/58)

- **The weakenings `W*`: 14/17 red, down from 15/17.**
  - The required ones stay red, against 54: `W1` 43, `W1b` 41, `W4` 44, `W5` 48.
  - The optional ones stay red: `W2` 50, `W13` 52, `W16` 47.
  - **`W14` reads 54 and survives.** `W10` and `W11` survive, as before.
- **The planted terms `E*`:**
  - E1, E3 and E4 read 54, green.
  - E2 reads 53 and E5 reads 52. Both are red on two win-material rows each.
- **`A1`'s counts:** mate-in-3 goes 12 → 8, quiet-key 14 → 11, `depth≥5` 10 → 6, and `quiescence` stays 11.
  The tags were read from `src/puzzle-corpus.ts` at `f063ebce`. 1008, 1075 and 1982 carry quiet-key and
  `depth≥5`; 1424 carries `depth≥5` only.

## Growth each row tolerates, from Security/NFR's sweep (readings = 25 / step)

| row | solved at | missed at | growth tolerated at 25 readings | at 28 readings, option (c) |
|---|---|---|---|---|
| 1982 | 25 | 23.81 | 0–5 % | 12–18 % |
| 1008, 1424 | 23.81 | 22.73 | 5–10 % | 18–23 % |
| 1075 | 22.73 | 21.74 | 10–15 % | 23–29 % |
| every other solved row | 20 (step 1.25) | not reached | ≥ 25 % | ≥ 40 % |

The tolerance is treated as `readings / readings-needed − 1`. That assumes the tree grows evenly with readings,
which is an approximation, `UNKNOWN - verify` per row. The real evaluation reference is `ABC-082`: +14.6 % nodes
to depth 7 on `kiwipete` (532 363 → 610 179).
