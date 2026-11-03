# arch-ABC-270 results: the E3a probe under PREREG `…117475f9`. I1 and I2 are exact. QX (endgame halves 0 + queen scale × 3) and X (halves 0) pass mirror, the 9 endings (min 110 cp), zugzwang 7 / 7 and `G1` 54 / 58, but fail the d5-against-d5 mate floor (2 / 190, 1 / 190, KQK mates found one ply deeper), so choice rule 3 holds. QX plays Ng4 for game 1's 13.d4. D5 puts the shelter weight into the queen-on term

- **I1:** BASE = unpatched `main` on all 9 count rows (nodes, score, move), equal to `ADR-0064` B0's recorded counts.
- **Counts, QX / BASE** (`chooseMove`): kiwipete d8 1.0936, d9 1.1423; position-6 d8 0.9145, d9 1.1447, d10 1.0401;
  `search()` d8 1.0831 / 0.8348. Root moves are unchanged everywhere. X: 0.97–1.00 (`search()` position-6 1.0641). Q:
  0.90–1.11. S = 1.1447 (a report).
- **Eligibility QX | X:**
  - mirror 0 / 214 | 0 / 214;
  - 9 endings ≥ 20 cp: 9 / 9 (S1–S3 118 / 118 / 118, D1–D6 110–114) | the same;
  - mate floor d4 → d5: 0 / 163 | 0 / 163;
  - **mate floor d5 → d5: 2 / 190 | 1 / 190;**
  - zugzwang 7 / 7 | 7 / 7; `G1` 54 / 58, none newly missed | the same;
  - queen pairs 364 / 364.
- **The lost mates** (addendum `…3f24d8a0`): `8/6k1/8/6K1/8/8/8/6Q1 w - - 2 2` (X and QX) and `8/7k/8/7K/8/8/8/6Q1 w - - 2 2`
  (QX). BASE mates at d5 (29995). The forms read about +1 050 at d5 and mate at d6 and d7. These are not probe
  artifacts: the table is cleared per call, and X is data only.
- **Game 1** (d7 / d8): move 4, BASE d3, QX e3 / g3; move 8, both Be2; move 10, BASE exd6 / Be2, QX Be2; **move 13,
  BASE d4 (−88), QX Ng4 (−132 / −144)**; move 17, BASE Nd3, QX Kc1. White's static exposure at move 13: 25 → 75 cp
  (mg).
- **Drift d5**, QX against BASE: 42.25 % within 25 cp, max 132 (position-5/d7c8), 12 root moves differ, 0 mate flips.
  Reach 5.868 against 5.879.
- **Futility drift: void.** The futility doors turn `taper` off since `ABC-269`. BASE reproduces the E1 taper drift
  (98.40 %, 494 → 555).
- **Batch E:** 28 reds in the QX copy only, in 7 files:
  - quiescence 11, engine 5, taper 4, futility 3, transposition 3, king-mobility 1 (`ABC-083` A2 (b): g6 +12 over g2
    at phase 0), ordering 1;
  - the BASE copy has 8 environment reds (files that need repository data outside `src/`). The first attempt was
    refused at load (`tools/grugops` not archived); no test ran.
- **D5:**
  - I2 exact: D4r = D4, CE ratio 0.9960083928, the same parameters.
  - D5: shelter (0, 0), **shelter with the queen (29, 0)**, half-open (0, 0), half-open with the queen (2, 140,
    implausible), open (13, 21), open with the queen (0, 0); king tables about 3.5 × / 2.8 ×.
  - Inner CE 0.99932 × D4r.
- **Host time:** A 73 s, B 78 s, C 148 s, E 0.7 s (refused) + 15 s, D5 13 s, lock waits included: about 5.5 min.
