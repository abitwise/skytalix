# arch-ABC-291-probe readings: `ADR-0075` d10's rows, PR1 to PR11, under the PREREG `…2a579895`

Architect/Design. The PREREG was committed at `d033ea0e`, before the first measured run. Every row ran once, on scratch copies of `src/` tree `cc6e64d1`, in the sealed order, under the host lock, one core, one worker. No miss was re-played and no fix was needed: `cand` is `patch_e4b.py` as sealed. Outputs are in `raw/out/`.

## Row by row
| row | reading | bar | read |
|---|---|---|---|
| **PR1** | 7 of 7 rows: OFF's nodes, score and move equal unpatched `main`'s, byte for byte | exact | **holds** |
| **P0** | below | none | reading |
| **PR2** | 230 pairs (`G3` 184, `TAPER_MIRROR_POSITIONS` 30, the probe's 16): 0 mismatches. The term moves 171 of them | 0 | **holds** |
| **PR3** | 28 126 positions (`G3` 184, the taper mirror set 30, the 16, the games 27 896): 0 mismatches. Non-zero on 19 175 of them, so the row is not vacuous. The labeller's 6 hand rows: 0 bad. `hot`: 0 on every set | 0 | **holds. d1's words stand** |
| **PR4** | a hit equals a fresh call on 28 126 positions; 1 068 forced collisions; ON then OFF on one slot on 28 126; OFF `Object.is`-equal to `main` on 28 286 (`G3`, taper mirror, `TAPER_DOOR_CORPUS` 176, the games), `evaluateWithoutTaper` too: 0 mismatches in all | 0 | **holds** |
| **PR5** | door d4 → ON d5: 0 violations of 163 mates. d5 → d5: 0 violations of 191 mates. Corpus 287 | 0 | **holds** |
| **PR6** | all seven rows play the recorded move, `zugzwang.001` e1f1 at depth 9 among them | 7 / 7 | **holds** |
| **PR7** | ON 54 / 58, OFF 54 / 58, the same four missed. No NEWLY-MISSED line, none newly solved. Both inside the baseline's `unsolved` | no NEWLY-MISSED | **holds** |
| **PR8** | r₁ = 1.02720 (c₁ = 1.00427), r₂ = 1.05855 (c₂ = 1.01355). **R = 1.04287.** Both controls are inside [0.970, 1.030], so both sessions stand | R ≤ 1.03 | **above the bar: rule 3** |
| **PR9** | **4 106 of 27 896 positions, 14.72 %.** 200 games, 0 replay failures. 4 106 × 20 = 82 120 ≥ 27 896 | ≥ 5.0 % | **holds** |
| **PR10** | below | none | reports |
| **PR11** | below | none | report |

## P0: K0 (c)'s counts, at `src/` tree `cc6e64d1`
| row | `main` / OFF nodes, score, move | ON nodes, score, move |
|---|---|---|
| `chooseMove` kiwipete d8 | 707 548, −89, d5e6 | 693 584, −87, d5e6 |
| `chooseMove` kiwipete d9 | 1 595 095, −110, e2a6 | 1 517 556, −110, e2a6 |
| `chooseMove` position-6 d8 | 101 425, 71, c3d5 | 120 104, 74, c3d5 |
| `chooseMove` position-6 d9 | 226 171, 78, c3d5 | 250 777, 74, c3d5 |
| `chooseMove` position-6 d10 | 471 434, 83, c3d5 | 511 558, 75, c3d5 |
| `search()` kiwipete d8 | 523 847, −89, d5e6 | 521 532, −87, d5e6 |
| `search()` position-6 d8 | 234 214, 74, c3d5 | 271 572, 74, c3d5 |

## PR8's detail
- **Arms' means, ns a call on the six roots:** session 1 B 315.1, C 316.5, H 323.7; session 2 B 315.4, C 319.7, H 333.9. |r₁ − r₂| = 0.031. |R − 1.03| = 0.0129, inside one session's spread (the reference 0.037). That label grades nothing, and the miss stays a miss.
- **H's rounds read two levels and B's read one.** Rounds 2 to 6: H 332.9, 335.7, 316.5, 316.2, 317.1 in session 1, and 333.5, 328.0, 335.9, 335.2, 336.7 in session 2. B stayed at 314.6 to 316.6 in all ten. So R is a mix of about 1.00 and about 1.06. The cause is `UNKNOWN - verify`. QE should expect K4 to read the same way.
- **The endgame report set:** eg r 1.0078 and 1.0312, mean 1.0195; eg c 1.0049 and 1.0232.
- **The host:** load 2.14 at the hold's start, 2.17 at its end. `vmstat` read 2 to 3 runnable and about 89 % idle on 24 cores, so about one core of foreign work ran beside the hold. Another project's vitest was on the host. Nothing was touched. It voided no `G2` session.

## PR10
- **Reach at 47 000:** mean depth 6.868 OFF, 6.900 ON, 190 rows.
- **Drift at d5:** 187 non-mate rows, 100 % within 25 cp, largest 24 (position-5/e1f2, −212 → −236). 4 moves differ. 0 mate flips, 0 sign flips.
- **ns per node, `search()` d8 on the six roots:** ON over `main` 1.0108 and 0.9655 (mean 0.988); control 1.0007 and 1.0027. ON visits 3.45 % more nodes (1 130 499 → 1 169 527). So in search the per-node cost does not show at this instrument's width.
- **The memo in search, `chooseMove` d8, memo emptied before each root:** 906 509 hits, 46 876 misses, 95.083 %.
- **The per-call ratio with the memo bypassed: VOID.** r 1.034 and 1.065, but c 0.9690 and 1.0700, both outside [0.970, 1.030]. It was a report and decides nothing, so it was not re-run. Those two r values carry no weight. The miss path's cost stays `UNKNOWN - verify`. Each arm ran 50 000 calls a root, a quarter of `G2`'s, and the same foreign load was present, so whether the load caused it is not established.
- **The endgame report set:** under PR8 above.
- **PR9 by part, per position, |white − black| of the part:** connected non-zero 16 540, ≥ 10 cp 3 206; phalanx 5 105 and 364; backward 5 965 and 5 965. Any part: 17 300 non-zero (62.02 %), ≥ 25 cp 440 (1.58 %), in 35 games.

## PR11
- **`main`:** 2 709 tests, all green, every suite loaded. **`cand`:** 2 651 green, **58 red**, in 12 files. None is red on both. `raw/out/G-lane-summary.md` lists them, and the decision note sorts them.
- **`npx tsc --noEmit` on `cand`** (not a row): 9 errors, every one a `futilityNode` call in `src/search.futility.test.ts`. Four of those lines sit in rows that stay green with the wrong argument.

## After the rows: a check of the list (not a d10 row, decides nothing)
A vitest row stops at its first failed assertion, so PR11 alone could not show what sat behind each red. `k2_edits.py` wrote the list as edits on a copy of `cand`, and the lane ran on it (batch K, written after PR11, so it is not in the PREREG). No d10 row was re-read, and no file on any branch changed.
- **First pass:** 3 red. It showed two more pins behind a first failure, and one lost fixture property.
- **Last pass:** 2 709 tests, 2 708 green, 1 red: `ABC-282` A2 (b), the lost fixture property, which no pin can fix (`raw/out/K-lane2-summary.md`). `npx tsc --noEmit` on that copy: 0 errors.

## Time and leftovers
- **Lock held:** 206 s by `raw/out/holds.txt`, batch K's two passes included, plus a few seconds for three `tsc` runs. About 3.5 minutes, far under the 55.
- **One stray file:** `tsconfig.probe.json` stayed in `cand`'s root during PR11. Removing it was refused by the host's safety check, and no test reads it. `main` was all green and the reds name rows only, so it touched no reading.
- **Fence kept:** no margin on `zugzwang.001`, no v(e1f1) − v(e1e5), no per-part read of it, no singles on a safety row. PR6's output holds the played move only.
