# arch-bundle-1 readings, under PREREG `…aa5c4dc1` (sealed and committed at `59a98278` before any run). Neither premise is met on Step C's graded rows. The mate floor reads 0 with both parts on and per part, on the forms the rules picked

Scratch copies of `main` `0cc9afd1` `src/`, under the host lock, one core. Measured wall about 13.5 min of the 1 h cap (`raw/out/exits.txt`). No games. Raw: `raw/out/`; patch, driver, forms, batches: `raw/probe/`. Ratio order: `search()` kiwipete, `chooseMove` kiwipete, `search()` position-6, `chooseMove` position-6.

## Disclosed
- **One instrument defect.** Step B's first attempt crashed in `chooseMove` at the first P4 node: the patch had not imported `EMPTY` into `src/engine.ts`. Six of seven jobs exited 1 with no result; `raw/out/b-attempt1-exits.txt` keeps the lines. The import was added to the patch, the copy rebuilt, the check re-read (24 / 24) and all of Step B run again. No form, bar or rule moved. Step A is unaffected: that line sits behind `lmpLimit > 0`. The audit and the `search()` drift rows of the crashed attempt equal the re-run's, as they reach no `engine.ts` code.
- **Two read-outs seen in the crashed attempt** (the audit, the `search()` drift) before the re-run. They equal the re-run, so nothing was chosen on them.
- **`fire` counters:** `cutQCounterPct` of 0.05–0.06 on the `MAIN` and `M3` arms is a stale table read by the counter only, in the same process. Ordering is gated and unaffected.
- **R1's door here is `main`'s own d6,** so 0 / 209 is not the "2 / 209" of `R-283-LMR`, which reads against `chooseMoveWithoutBundle`. That row was not re-read.

## Step 0, the instrument
`check` 24 / 24, twice: nodes, score and move equal `base/`, in both recursions and at the all-off doors, d6–d8. `main`'s d8: 523 847 / 707 548 / 234 214 / 101 425, the pinned figures.

## Step A, O2c alone, door `MAIN`
| form | d8 ratios | geomean | reach (6.868 →) | drift `search()` / `chooseMove` | B1 / B2 / R1 | zug | `G1` |
|---|---|---|---|---|---|---|---|
| **C1** CM | 0.9848 / 0.9922 / 0.9298 / 1.1190 | 1.0041 | +0.032 (6 deeper, 0 shallower) | 100 %, 0 / 100 %, 12 | **0 / 0 / 0** | 7 / 7 | 54 / 58 |
| C2 CH1 | 0.9989 / 0.9998 / 1.0068 / 0.9996 | 1.0013 | 0.000 (2, 2) | 100 %, 0 / 100 %, 0 | **1** / 0 / 0 | 7 / 7 | 54 / 58 |
| C3 CM + CH1 | 0.9830 / 0.9921 / 0.9260 / 1.1207 | 1.0030 | +0.027 (7, 2) | 100 %, 0 / 100 %, 12 | **1 / 1** / 0 | 7 / 7 | 54 / 58 |
| C4 CM + CH1 + CH2 | 0.9831 / 0.9924 / 0.9302 / 1.1207 | 1.0042 | 0.000 (4, 4) | 100 %, 0 / 100 %, 12 | **1 / 1 / 1** | 7 / 7 | 54 / 58 |

**Rule A picks C1,** the only form meeting Safety. Continuation history buys no node, and it loses KQK mates (`8/1k6/8/1K6/8/8/8/1Q6 w`, `8/6k1/8/6K1/8/8/8/6Q1 w`; d6 `k7/8/8/1K6/8/8/8/1Q6 b`). B3's older-door rows are 0 for all four.

## Step B, P4 alone over history, door `MAIN` (`ADR-0063` d11's joint probe)
| form | d8 ratios | reach | drift `search()` / `chooseMove` | floor B2 | `G1` | audit flips; ≥ 200 / ≥ 300 cp |
|---|---|---|---|---|---|---|
| M1 4 / 7 / 12 | 0.5929 / 0.8107 / 0.7046 / 0.9360 | +0.116 | 90.91 %, 123 / 93.58 %, 79 | **1** | **53, 1 newly missed** | 383 of 2 331 (16.43 %); 24 / 5 |
| M2 + key 0 | 0.5929 / 0.8107 / 0.6385 / 0.9368 | +0.127 | 90.91 %, 123 / 93.58 %, 79 | **1** | **53, 1 newly missed** | 374 of 2 340 (15.98 %); 29 / 6 |
| **M3** + three pieces | 0.5929 / 0.8107 / 0.6385 / 0.9368 | +0.111 | 93.05 %, 80 / 94.12 %, 79 | 0 | 54 | 315 of 1 917 (16.43 %); 28 / 5 |
| M4 d ≤ 2 | 0.7428 / 0.8353 / **1.0030** / 0.8986 | +0.132 | 91.44 %, 123 / 94.12 %, 79 | **1** | **53, 1 newly missed** | 370 of 2 103 (17.59 %); 25 / 12 |
| M5 T doubled | 0.6936 / 0.8813 / **1.0056** / 0.8202 | **+0.095** | 93.05 %, 80 / 96.26 %, 79 | 0 | 54 | 285 of 2 058 (13.85 %); 11 / 5 |

All five: zugzwang 7 / 7, B1 0, 0 mate sign changes. **No form meets every bar.** Rule B carries **M3**, the only form meeting Safety and Pay. The red floor row of M1, M2 and M4 is `6k1/R7/5K2/8/8/8/8/8 w`, the KRK row `ABC-283` lost; the newly missed `G1` line is "mate in 3, seed 1632".

## Step C, the bundle `C1+M3`
- **Mate floor, all on and per part, door `MAIN`:**

  | row | `C1+M3` | `M3` | `C1` |
  |---|---|---|---|
  | B1 `search()` d5 | 0 / 191 | 0 / 191 | 0 / 191 |
  | B2 `chooseMove` d5 | 0 / 189 | 0 / 189 | 0 / 189 |
  | B3 `searchWithoutBundle`, `…Futility`, `…SeePruning`, `…Taper` d5; `…Taper` d4 | 0 / 190, 189, 190, 189, 163 | the same | the same |
  | B3 `chooseMoveWithoutBundle` d5 | 0 / 188 | 0 / 188 | 0 / 188 |
  | R1 `chooseMove` d6, a report | 0 / 209 | 0 / 209 | 0 / 209 |
  | `krk`, a report: d5, d5, d6 | 0 / 17, 17, 29 | the same | the same |
- **Zugzwang 7 / 7. `G1` 54 / 58,** none newly missed.
- **All on against `MAIN`:** d8 0.5947 / 0.8106 / 0.6982 / 0.9358; counts 311 546 / 573 518 / 163 523 / 94 911; reach 6.868 → 7.016 (+0.148; 37 deeper, 12 shallower, 22 moves differ); drift 93.58 %, 80 / 94.12 %, 79; 0 sign changes. At d8 kiwipete's root move changes, d5e6 → e2a6 (−89 → −81 in `search()`, −114 in `chooseMove`).
- **P4's own door** (`C1+M3` over `C1`):
  - L4 met: d8 0.6039 / 0.8170 / 0.7509 / 0.8363; reach 6.900 → 7.016 (+0.116; 33 deeper, 13 shallower).
  - **L2 missed.** Drift 93.58 %, 80 cp / 94.12 %, 79 cp against ≥ 95 % and ≤ 75 cp. Audit **288 of 1 886 (15.27 %)**, 29 errors ≥ 200 cp, 9 ≥ 300, 0 ≥ 500, against ≤ 0.5 % and 0. By depth: d1 22.97 %, d2 5.84 %, d3 15.24 %. 285 of the 288 are the head failing low where the door fails high.
- **O2c's own door** (`C1+M3` over `M3`): **CH3 missed on all four,** 1.0031 / 0.9999 / 1.0935 / 0.9989 against ≤ 0.95. Drift 100 %, 9 / 100 %, 4.
- **The firing figure at 100 ms** (`chooseMove`, 47 000 nodes, the 190; 8 973 453 nodes):
  - P4 fires at 53 048 nodes: 5.91 per 1 000 nodes visited, 7.47 % of 709 943 eligible, 1 284 601 moves skipped.
  - O2c changes the order at 8.74 % of 1 103 165 full-width nodes (9.88 % alone). A countermove is in the list at 33.55 %.
  - Quiet cutoffs: killers 84.65 %, the countermove 4.55 %, mean index 0.401 (`MAIN` 88.45 %, 0.420). 93.77 % of cutoffs fall on the first move.
- **`nps`, a report** (best of 5, the probe's overhead on every arm): door / arm kiwipete 0.9921, position-6 1.0537, mean 1.0229 for `C1+M3`. `M3` alone 0.9873 / 1.0508; `C1` alone 1.0042 / 1.0093. One clear with C1 on: 0.2 µs.

## Step D, the default-lane cost
`clearHistory` ran **2 636** times in one default lane; 2 636 × 0.2 µs ÷ 2 workers is under 1 ms. The 2 636 is a floor: 2 of the 71 files did not load on the copy (`src/pgn.test.ts`, `tools/grugops/qe-hop-integrity.test.ts`). 9 rows failed, each because the copy has no `AGENTS.md`, `plans/` or `.grugops/`, or on the counter's own `process` read (`raw/out/d-lane-summary.txt`). The lane's wall was not graded.

## Exploratory, after the reads (it moves no bar)
Six of the red rows (C2 B1; C3 B1 and B2; C4 R1; M1 and M4 B2) return the door's mate with LMR off and every other switch unchanged (`raw/out/diag-lmr.jsonl`). P4 stays on in the M rows, so the loss runs through LMR, not through P4's own skip. That places them in `R-283-LMR`'s class. It is six rows, not a node trace: which move LMR reduced was not read, and the other red rows (C4 B1 and B2, M2 B2) were not re-read.

## Not read
Why the audit reads higher than `ADR-0061`'s 11.5–11.9 %. One difference is on record: futility is now in force and takes the nodes far below alpha first, so P4 fires nearer alpha. That it causes the rise is `UNKNOWN - verify`.
