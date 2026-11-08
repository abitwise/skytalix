# arch-ABC-292-probe readings, stage A: PR1 exact; PR2, PR3, PR4 0 mismatches; PR5 0 violations; PR6 7 / 7; **PR7 misses: one NEWLY-MISSED line, seed 1700, real after the defect check.** By the PREREG the probe ended there: PR9, PR10, PR11 and stage B were not run

Architect/Design, task `arch-ABC-292-probe`, under the PREREG `20261108T092441Z-architect-design-decision-e158a4a0` (commit `e9e23d8f`, a descendant of the freeze commit `e88e91f9`) and addendum 1 `…9e29be9d` (commit `7f109cd2`). The probe's tree is `main` `3cbf5374`, `src/` tree `bba42fb7`. Every figure below is copied from `raw/out/`. Every run was under the host lock, alone, on one core.

## The rows, against their bars
| row | reading | bar | state |
|---|---|---|---|
| **PR1**, instrument | OFF = unpatched `main` on all 7 rows: nodes, score and move (`A-OFF-*` = `A-MAIN-*`) | exact | **held** |
| **P0**, counts | below | a reading | read |
| **PR2**, mirror | 271 pairs (`G3` 184, `TAPER_MIRROR_POSITIONS` 30, QE's K1 (a) 15, QE's K1 (c) and K2 boards 42): 0 mismatches. The term moves 67 of the 271 | 0 | **held** |
| **PR3**, arithmetic | the labeller's 6 hand rows: 0 bad. QE's frozen parts, 84 rows (42 and their mirrors): 0 mismatches, K1 (d)'s relation 0 bad, labeller against QE 0. Labeller over `G3` 184, `TAPER_MIRROR_POSITIONS` 30, the frozen 114 and the games' 27 896 positions: 0 mismatches, `hot` 0 on every set | 0 | **held** |
| **PR4**, memo and off | (a) 28 400 positions: hit against fresh 0 bad, every second read a hit, memo bypass against `evaluate` 0 bad, 1 084 forced collisions 0 bad. (b) ON then OFF on one slot: 0 bad. (c) OFF against `main`'s `evaluate`, and `evaluateWithoutTaper` against `main`'s: 0 bad on `G3`, taper mirror, taper door 176, frozen 114, games 27 896; QE's K1 (b) `newRows` 116: 0 and 0. (d) `cut` against `cand`, six entries: 0 bad on every set | 0 | **held** |
| **PR5**, mate floor | the door at 4 against ON at 5: 163 door mates, 0 violations. The door at 5 against ON at 5: 191, 0 violations. 0 longer in both | 0 violations | **held** |
| **PR6**, zugzwang | 7 / 7: e1f1, b6c6, c6d6, d6e6, e6f6, h3h4, f4d5, each at its recorded depth, played move only | 7 / 7 | **held** |
| **PR7**, `G1` | OFF 54 / 58, every miss in the baseline's `unsolved`. **ON 53 / 58. NEWLY-MISSED against OFF and against the baseline: "win material, seed 1700: black R+B+N+2P against 2B+2N+P".** No NEWLY-SOLVED | no NEWLY-MISSED line | **MISSED** |
| PR8 | not run: stage B, not asked for after rule 2 | rule 3 | not read |
| PR9 | not run: the PREREG ends the probe on a real rule 2 miss | ≥ 5.0 % | not read |
| PR10 | not run, for the same reason | none | not read |
| PR11 | not run, for the same reason | none | not read |

**P0, ON on K0 (a)'s rows** (it would have become K0 (c); moot now):

| row | `main` and OFF: nodes, score, move | ON: nodes, score, move |
|---|---|---|
| `chooseMove` kiwipete d8 | 573 518, −114, e2a6 | 527 619, −67, e2a6 |
| `chooseMove` kiwipete d9 | 1 320 857, −128, e2a6 | 1 034 062, −61, e2a6 |
| `chooseMove` position-6 d8 | 94 911, 45, c3d5 | 129 747, 40, c3d5 |
| `chooseMove` position-6 d9 | 234 984, 34, c3d5 | 264 027, 41, c3d5 |
| `chooseMove` position-6 d10 | 523 610, 64, c3d5 | 429 022, 66, c3d5 |
| `search()` kiwipete d8 | 311 546, −81, e2a6 | 277 139, −54, e2a6 |
| `search()` position-6 d8 | 163 523, 71, c3d5 | 205 302, 46, b2b4 |

**Row 1632, PR7's watch** (`C-PR7-row1632.out`). The budget run solves it on both forms, depth 5, 20 534 nodes. The first fixed-depth iteration that plays e7e2 is depth 5 on both: OFF 16 838 nodes, the figure `ADR-0075` and `ADR-0076` quote, and ON 16 844.

## Rule 2's defect check (addendum 1, batch K; its form sealed before it ran)
1. **The instrument, by reading:** the probe's `g1` mode scores as `src/puzzle-suite.test.ts`'s `runSuite` does. Budget 25 ms, step 1, solved iff the move is in `accept` (g6g7, g6h6). **Holds.**
2. **Determinism, fresh process** (`K-det.out`): OFF plays g6g7, solved, depth 6, 19 723 nodes. ON plays **g6d6**, not solved, depth 6, 19 722 nodes. **The miss reproduces.**
3. **The source** (`K-callsites.txt`, and by reading): the three evaluation sites in `src/search.ts` (futility, leaf) and `src/quiescence.ts` (stand pat) read `evaluateAtPhase` when the switch is on. `pieceTerms: true` stands exactly twice in `src/search.ts` and twice in `src/engine.ts`: the rules record and the shipped record, as K1 (h) words it. **Holds.**
4. **The arithmetic on this puzzle** (`K-tree.out`): 19 145 positions of the full-width tree to depth 3 from its root. The seam against the labeller: 0 mismatches. `evaluate` minus the off evaluation against the labeller's signed net: 0 mismatches. **Holds.**
- **So the prototype computes d2 to d5 as written, and the miss is real.** The same depth and nearly the same nodes play a different move. That is the term's evaluation, not a cost in depth. Nothing here reads which part did it: per-term reads of a safety row are fenced (d13).

## Lock time
- Logged in `out/holds.txt`: S 4 s, A 16 s, B 2 s, C 10 s, K under 1 s. **About 32 s.**
- Not logged: four short checks under the lock (two parse checks, two type-checks of probe scripts), each a few seconds. **Under 1 min in all**, against the 55 min stop and the brief's 1 h.

## What these readings do not say
- Nothing about cost, `G2`, firing, drift, reach, `NFR-008` or K2's list. Those rows were not read, and every figure for them stays `UNKNOWN - verify`.
- Nothing about whether these terms pay in play. A puzzle row is not a game result.
- Nothing about which of the two terms moved g6g7 to g6d6. That is fenced, and no subset is open (rule 2).
- The labelled non-zero counts in `B-PR3-arith.out` (for example 21 779 of the games' 27 896 positions) count positions where either side holds any part. They are not PR9's |Δ| ≥ 10 share, which was not read.
