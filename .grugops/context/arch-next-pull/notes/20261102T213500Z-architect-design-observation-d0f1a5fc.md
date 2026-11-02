---
id: 20261102T213500Z-architect-design-observation-d0f1a5fc
kind: observation
by: architect-design
at: 2026-11-02T21:35:00Z
verified_by: 
confidence: high on part 1 (deterministic fixed-depth and maxNodes runs on a scratch copy of main's src 58fa3eb4; P1-over-H1 reproduces arch-ABC-233's counts to the node; every exit 0); medium on part 2 (deterministic, but 145 positions from one control against a Stockfish depth-16 reference)
refs:
  - arch-next-pull
  - grugops/arch-next-pull
  - EPIC-011
  - O1h
  - P1
  - P4
  - P5
  - E1
  - E2
  - ABC-233
  - ABC-234
  - ABC-236
  - ABC-231
  - ABC-232
  - ABC-239
  - ADR-0063
  - ADR-0060
  - ADR-0061
  - ADR-0056
  - ADR-0055
  - ADR-0050
  - RISK-EPIC011-08
  - Q-3K-4
  - Q-3K-7
  - NFR-005
  - e72487e1
  - a6039c5b
  - b6deb4e4
  - arch-next-pull/20261102T212832Z-architect-design-decision-4de572aa
  - arch-ABC-233/20261102T210820Z-architect-design-decision-4d5a0fe3
  - arch-ABC-233/20261102T212011Z-architect-design-observation-9f0b5da7
  - arch-ABC-233/20261102T212011Z-architect-design-decision-f3a4dac0
supersedes: 
seal: sha256:bec00506d18295ee34f30e26a3f1b3794e391f6da03f875ba0ef993457619bf3
---

# arch-next-pull results: (1) no form of the joint O1h + P1 set meets every bar. Every form loses `zugzwang.004` (the hard gate) and drifts 69 cp in `chooseMove`, against a 27 cp cap. J3 is the closest: it meets `A4` (a), reach and the mate floor, and misses only those two. (2) Evaluation probe: 31 of the 48 errors at 47 000 nodes (65 %) are still errors at 188 000. By the pre-registered rule, evaluation reads as the bigger lever

Architect/Design, task `arch-next-pull`, by the PREREG `…4de572aa`, sealed and committed `b6deb4e4` before any run.
- **Base:** a scratch `git archive` of `main` `a6039c5b` (`src/` `58fa3eb4`).
- **Batches:** four, each under `flock <host-test.lock> timeout 300`. Walls 35 s, 26 s, 6 s and 47 s. Every exit was 0.
- **Readings:** node counts only.
- **Raw:** `raw/probe/out/`.

## Part 1, instrument check: exact
- `P1H1@H1` reproduces `arch-ABC-233`'s diagnostic to the node:
  - H1 door: `search()` d8 889 792 / 1 005 878, `chooseMove` d8 1 274 487 / 384 890;
  - head: 667 778 / 799 895 and 913 338 / 298 252;
  - H1 reach 5.926 → P1H1 6.274.
- Diagnostic: J1 with `hLess` 0, a no-op term, equals P1H1 node for node on the drift row. So the term's wiring changes nothing when it is off.

## Part 1, gates (d8 ratios; reach at 47 000 on the 190; door H1 unless "main")
| form | `A4` (a) vs H1: `search()` kiwi / pos-6, `chooseMove` kiwi / pos-6 | vs `main` (max) | reach vs H1 (vs `main`) | drift d5 vs H1 `search()` / `chooseMove` (within, max) | mate H1 d4→d5; d5 | zugzwang | `G1` | misses |
|---|---|---|---|---|---|---|---|---|
| J1 h>0 −1 | 0.7568 / 0.8088, 0.7375 / **0.8787** | **0.8640** | **+0.232** (+0.321) | 100 %, 25 / 98.40 %, **69** | 0/163; 3/194 | **4 / 7** (`.001` e1e7, `.004` g7f6, `.005` f4e2) | 56/58 (+2) | A4 (a), reach, cap, zug |
| J2 ±1 | 0.7548 / 0.7855, 0.7367 / **0.8772** | **0.8625** | +0.263 (+0.352) | 100 %, 25 / 98.40 %, **69** | 0/163; 7/194 | **5 / 7** (`.001` e1e6, `.004`) | 56/58 (+2) | A4 (a), cap, zug |
| **J3** ±1, cap 3 for h<0 | 0.7405 / 0.8169, 0.6459 / 0.7933 | 0.7800 | **+0.321** (+0.410) | 100 %, 25 / 98.40 %, **69** | 0/163; 7/194 | **6 / 7** (`.004` g7f6) | 56/58 (+2) | **cap, zug** |
| J4 h>0 not reduced | 0.7725 / **1.0104**, 0.8071 / **0.9554** | **0.9394** | **+0.211** (+0.300) | 98.40 %, **63** / 98.40 %, **69** | 0/163; 3/194 | **6 / 7** (`.004`) | 56/58 (+2) | A4 (a), reach, cap, zug |
| *P1H1 (ref., `arch-ABC-233`)* | 0.7505 / 0.7952, 0.7166 / 0.7749 | 0.7619 | +0.348 (+0.437) | 100 %, 25 / 100 %, 11 | 0/163 | 5 / 7 | — | zug |

- **Against `main`:**
  - drift is the same as above: max 25 in `search()`, and 69 in `chooseMove` (J4: 63 / 69);
  - every form has 0 sign changes and 0 mate-status flips;
  - root moves at d8 are unchanged on kiwipete and position-6, in both recursions, for every form.
- **Verdict by the PREREG rule:** **no form meets every gate.**
  - No joint ADR is written.
  - No form is tuned after the read.

## Part 1, reports
- **`zugd` on `zugzwang.004`** (move at depths 10 / 11 / 12 / 13):

  | form | d10 | d11 | d12 | d13 |
  |---|---|---|---|---|
  | J1 | g7f6 | g7f6 | g7f6 | h3h4 (1 466 114 nodes) |
  | J2 | g7f6 | g7f6 | g7f6 | h3h4 (1 791 938) |
  | J3 | g7f6 | g7f6 | g7f6 | g7f6 (602 714) |
  | J4 | g7f6 | g7f6 | h3h4 (1 358 316) | h3h4 |
  | P1H1 | g7f6 | g7f6 | g7f6 | h3h4 (1 551 829) |

  For comparison, the door (`main`) plays h3h4 from d11, with 905 900 nodes. No form keeps the row at its recorded depth, and J3 has not found it by d13.
- **Diagnostic** (added after batch B; not pre-registered; it decides nothing). The 69 cp row is position-6/f3h4 in `chooseMove`, move g4e2 throughout:

  | search | d4 | d5 | d6 |
  |---|---|---|---|
  | H1 and P1H1 | 629 | 629 | 578 |
  | J1 and J3 | 629 | **560** | 578 |

  The term moves the d5 value towards the d6 value. The cap counts the move as drift all the same, and the bar stands.

## Part 2: the evaluation-lever probe (145 positions from 50 self-play games at 0.1 s; Stockfish 19 depth 16)
| skytalix nodes | mean depth | mean loss (cp) | median | SF's best | loss ≥ 50 | ≥ 150 | ≥ 300 |
|---|---|---|---|---|---|---|---|
| 47 000 (1×) | 6.09 | 54.1 | 14 | 46.2 % | 48 | 15 | 7 |
| 94 000 (2×) | 6.92 | 45.7 | 6 | 48.3 % | 37 | 13 | 5 |
| 188 000 (4×) | 7.72 | 52.8 | 0 | 51.0 % | 34 | 12 | 5 |

- **Persistence:**
  - of the 48 errors at 1×, 35 are still errors at 2× and **31 at 4× (64.6 %)**;
  - of the 15 errors of 150 cp or more at 1×, 9 remain at 4×;
  - 19 of the 48 play the same move at 4×.
- **Mean loss is dominated by a few large losses:** it rises from 2× to 4× on a handful of positions. The error counts are the steadier reading. One doubling removes 11 of 48 errors, and the second removes 3 more.
- **By phase** (a report, not pre-registered; from the same data):

  | after | positions | errors 1× / 2× / 4× | persist at 4× |
  |---|---|---|---|
  | 20 plies | 50 | 17 / 10 / 8 | 8 of 17 |
  | 40 plies | 50 | 18 / 17 / 13 | 12 of 18 |
  | 60 plies | 45 | 13 / 10 / 13 | **11 of 13** |

  The later the position, the less search helps.
- **Assessment** (skytalix's 47 000-node score against SF's best, 141 non-mate positions):
  - Pearson 0.896;
  - raw MAE 148.8 cp; fitted MAE 123.6 cp, with slope 1.49. SF 19's centipawns are win-rate normalised, so the slope is not an evaluation defect by itself;
  - 3 sign disagreements among the 80 positions where |SF| ≥ 100.
- **Reading by the PREREG rule:** 64.6 % ≥ 50 %. **Evaluation reads as the bigger lever.** Two doublings of search, more than every open pruning or ordering item together, leave about two thirds of the errors standing.
- **Limits, as pre-registered:** SF at depth 16 is a reference; the sample is 145 positions from one control; a residual error can be a horizon miss rather than an evaluation one.
