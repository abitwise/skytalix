---
id: 20261029T195200Z-architect-design-observation-9d172446
kind: observation
by: architect-design
at: 2026-10-29T19:52:00Z
verified_by: 
confidence: high on the counts read from the raw files; medium on the mechanism (records cannot split ABC-215 from ABC-208, or opponent from time)
refs:
  - arch-epic008-rd
  - EPIC-008
  - M1
  - RISK-EPIC008-03
  - ABC-208
  - ABC-215
  - ADR-0050
  - ADR-0048
  - 3497aad2
  - ba74b71d
  - b5c67ab7
  - orch-2026-10-29g/…517260b8
  - orch-2026-10-29g/…ef6ab697
  - qe-epic008-q4c/…8d08e519
  - qe-epic008-q4c/…83be15a1
  - qe-epic008-q4c/…311eb14b
  - qe-epic008-q4c/…172ff9be
  - qe-epic008-close/…f361ab33
  - qe-epic008-close/…e8d5c13a
  - qe-epic008-close/…bdbccbbf
  - bapm-close-EPIC-008/…e53131ba
  - qe-ABC-208/…0477ac64
  - qe-ABC-215/…c2c3540f
  - ADR-0049
supersedes: 
seal: sha256:221f4228bade594ffaac850a5ad13596d6a84df697f4b72b284976a1f4e335c4
---

# R/D disagreement on main vs 3497aad2: seven candidate explanations, each checked against the raw files

R (`qe-epic008-close`, against Stockfish 19 at E = 1 910, skytalix at 3 000 ms, width 2) reads main at **−82.9 ± 73.8** from `3497aad2`. The 100-game D look (`qe-epic008-q4c`, self-play at 1 500 ms, width 1) reads **+52.5 ± 46.8**. This note sets out the evidence for and against each explanation. The ranking and the next step are in the decision note sealed with it.

**Method.** Records only: no games, no `rating.ts` runs and no engine probes (0 s of engine CPU). The analysis parsed the three PGNs and the three `-debug all` logs (`raw/r1/r.pgn`, `raw/r1/r.out.gz`, `raw/r2/…`, `qe-epic008-q4c/raw/d/d.pgn`, `d.out.gz`). The scripts and their outputs are in this task's `raw/` folder. Stockfish's own eval in the R PGNs is used as the judge of a position. Game phase is the number of men on the board: ≥ 26 is the opening, 14–25 the middlegame and ≤ 13 the endgame. It is counted from the FEN, less one per capture.

## What actually changed (`git diff 3497aad2 b5c67ab7 -- src data`)
- 17 files differ, and 11 of them are tests. Two engine changes: **`ABC-215`** (`src/evaluate.ts`: new piece values and all six piece-square tables) lands between `3497aad2` and `ba74b71d`. **`ABC-208`** (null-move pruning, R = 3, guarded below three non-pawn pieces, in `search.ts`, `engine.ts`, `apply.ts` and `zobrist.ts`) lands between `ba74b71d` and `b5c67ab7`. `gameend.ts` changes in a comment only. `data/` is identical.
- `ABC-215` changed the tables in ways that touch the middlegame. Rank-2 pawns lose the old table's f2–h2 bonus (+10, +10, +5) and its d2/e2 −20. Rank-7 pawns drop from +50 to between 0 and +30. The king's castled squares drop from +30 to 0. Its own D reading was NEUTRAL, +15.6 ± 23.8 (`qe-ABC-215/…c2c3540f`). It shipped under S3, which asks only for "not LOSS", so a gain was never shown.
- `tools/rating/rating.ts` cites no ADR by number. The two ADRs behind the changed code are `ADR-0050` (null move) and `ADR-0048` (the tables that `ABC-215` re-derived).

## 1. Opponent: self-play against a near-twin vs. Stockfish limited to 1 910
- **For.**
  - The D sign is replicated. On the previous host at width 3, `ABC-208` read +38.4 ± 23.3 and `ABC-215` read +15.6 ± 23.8. Their sum is +54.0 ± 33.3, and this look reads +52.5 ± 46.8 on this host at width 1. Three independent D results across two hosts and two widths agree, so the self-play gain is real at 1 500 ms.
  - R and D sample very different games. **D: 53 of 100 games are 3-fold repetition draws. R: 7 of 200 draws (R1) and 9 of 200 (R2); every decisive game ended in mate.**
  - R2's extra losses come from the middlegame. R1 has 146/47/7 and R2 has 125/66/9. The turning point of a lost game is defined as the move after which Stockfish's eval stays ≥ +300 to the end. It fell in the middlegame in **16 of R1's 47 losses and in 35 of R2's 66**. In the endgame it fell in 29 and 27, and in the opening in 2 and 4. The median turning ply moved from 101 to 73.5, and the median length of a lost game from 125 to 102 plies.
  - The middlegame is where both changes act. Null move adds depth there: +1.09 ply in R and +1.02 in D. In the endgame it adds only +0.37 in R and −0.10 in D, because the zugzwang guard turns it off. The `ABC-215` table changes above are middlegame terms as well.
  - A base that shares the candidate's blind spots cannot punish them, and Stockfish can. This is `RISK-EPIC008-03` in its strong form: self-play does not just overstate the gain, it gets the sign wrong.
- **Against.**
  - The records show no single class of error. "Unseen" errors were counted: a skytalix move from a level position (Stockfish |eval| ≤ 150) after which Stockfish's eval rose by 250 or more while skytalix's own eval stayed ≥ −50. There were 71 in R1 and 75 in R2. Per 100 level positions: opening 0.97 → 1.53, middlegame 3.13 → 3.37, endgame 1.38 → 0.37. That is not a clear rise.
  - Null-move pruning usually transfers to outside opponents. That is a general prior, not a record of this engine (`UNKNOWN - verify`).
- **Cannot tell apart:** `ABC-215` from `ABC-208`. R read only the two endpoints, and no R exists at `ba74b71d`.

## 2. Time per move: 1.5 s in D against 3 s in R
- **For:** R gives about 1.9 times the nodes per move. The median is 1.64 M for the baseline and 1.76 M for the close in R, against 0.85 M and 0.90 M in D (`-debug all` logs). If a change's value depends on depth, the two budgets could disagree.
- **Against:** the close gains about the same depth at both budgets: +0.96 ply in R (10.09 against 9.13) and +0.74 in D (9.55 against 8.81). No record shows a gain turning into a loss with more time. Null move usually helps more with more time (prior, `UNKNOWN - verify`).
- **Cannot tell apart:** time from the opponent. Every R game is 3 s against Stockfish and every D game is 1.5 s self-play. No record crosses them: there is no self-play at 3 s and no Stockfish game at 1.5 s.

## 3. The opening set and colours: excluded
- D played openings 1–50 (`-rounds 50`). R played 1–100.
- R2 − R1 on openings 1–50 is **−71.7** (R1 +190.8, R2 +119.1). On openings 51–100 it is **−93.8** (+186.2, +92.5).
- By colour, R2 − R1 is **−84.1** with skytalix as White (+195.5 → +111.4) and **−81.7** as Black (+181.7 → +100.0). D reads +56.1 as White and +49.0 as Black.
- Per opening, the D pair score and the R2 − R1 pair change correlate at r = +0.19 over openings 1–50. The two measures do not disagree because of particular openings.

## 4. Chance, joint across the two readings
- If R and D measure the same quantity, they differ by 135.4. The joint SE is 44.6 from the tools' Y (z = 3.04, two-sided p = 0.002). With pentanomial errors it is 40.8 (z = 3.32, p = 0.001).
- R alone: the chance of reading ≤ −82.9 when the true value is 0 is 1.4 % with the tool's Y and 0.6 % with the opening-paired pentanomial error. When the true value is +25 it is 0.2 %.
- **Opening-paired re-analysis of R (information, not the graded figure): R2 − R1 = −82.9 ± 64.3** (the tool's ±73.8 is unpaired). The per-opening pair scores of R1 and R2 correlate at r = 0.21, which is what narrows the interval.
- Chance cannot explain the sign flip on its own. It can make R's size larger than the true one: R is one unreplicated pair of runs with Y = 73.8.

## 5. Host load, heat and order: disfavoured
- **Stockfish's nodes per second** is the cleanest host-speed gauge: the same binary and settings in both R readings, independent of skytalix's code. Median per move (moves ≥ 400 ms): **R1 1 643 068, R2 1 623 258 (−1.2 %)**. Medians by quarter: R1 1.63–1.65 M, R2 1.59–1.68 M. Neither reading drifts.
- **skytalix's nodes per second in R, against its own speed in D:** the baseline ran at 546 521 in R1 and 568 388 in D (96.2 %), and the close at 586 426 in R2 and 598 745 in D (97.9 %). The close was not slowed more than the baseline was. 0–5 moves per reading fell below 70 % of the median, so there is no sign of a game on a slow core.
- Tctl was 83/87 °C in R1 and 82/84 °C in R2 (median/max). R1 was the hotter one.
- D's foreign-load window gives the same sign: the 40 overlap-free games read +61.4 ± 75.2.
- **Limit:** R has no frequency log, so throttling is not excluded outright. Any slowdown visible in the nps is ≤ 2 % and similar for both builds, which is worth a few Elo at most.
- **Depth is not a host gauge across this change.** The close searches deeper because null move prunes, so the close block's "searched deeper, so not slowed" argument does not apply here. Stockfish's nps is the gauge.

## 6. The artifact and the build: excluded
- D's two `dist/` trees are byte-equal to R's: base `726e5225…1ce4` (R1) and candidate `a4cba481…e2a2` (R2), per each `artifacts.txt`.
- R1's and R2's `dist/` differ in exactly 6 of 22 files, `apply`, `engine`, `evaluate`, `gameend`, `search` and `zobrist`. These are the 6 non-test source files of the diff. Nothing else in the build differs.

## 7. How the shipped changes behave per phase and result type
- **Depth by phase.** R1 → R2: opening 7.96 → 9.25, middlegame 8.97 → 10.06, endgame 10.67 → 11.04. In D, base → candidate: 7.47 → 8.73, 8.47 → 9.49, 10.38 → 10.28.
- **Result types.** R: all decisive games end in mate (R1: 193 mates and 7 repetitions; R2: 191 mates, 7 repetitions and 2 fifty-move draws). D: 47 mates and 53 repetitions.
- **Losses.** Short losses (≤ 60 plies) went 2 → 4, mid-length (61–120) 20 → **35**, long (> 120) 25 → 27.
- **Wins.** Wins fell from 146 to 125. The median winning game went from 70 to 75 plies.
- Stockfish judged skytalix more optimistic in R2 in the opening and middlegame. The mean of skytalix's eval plus Stockfish's next eval was +47.7 → +78.2 cp in the opening and +117.9 → +243.7 cp in the middlegame. The medians moved less (+41 → +59 and +144 → +131), so the shift is in the tail.
- This is the mechanism side of explanation 1. It cannot be split between `ABC-208` and `ABC-215` from these records.
