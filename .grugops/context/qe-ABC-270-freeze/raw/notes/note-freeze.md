# qe-ABC-270-freeze PREREG: ABC-270's K1 (c) queen pairs, frozen before any build. 7 pairs plus 1 control that differ only by the enemy queen(s), with each king's expected base and queen-on counts derived by hand from the stated rule, plus K0's node-identity numbers as ADR-0068 d6 lists them. se-ABC-270 implements against these rows and QE grades them; nobody changes them

QE/E2E, task `qe-ABC-270-freeze`, on `grugops/qe-ABC-270-freeze` from `main` `00e99db8`, `src/` tree `4cb84035` (read with `git rev-parse HEAD:src`; it is ADR-0068's probe tree and K0's base). No ABC-270 code exists. Nothing under `src/` or `tools/` was touched.

**Sources:** the ticket's K1 (c) and test note 1; `ADR-0068` d1–d3 and d6; the base rule as `src/evaluate-params.ts`'s docblock states it (`ABC-083`'s rule; `ADR-0064` d10: 15 per missing shelter pawn, 10 per half-open file, 20 per open file, over three files).

## The rule the counts come from (stated, not read from code)
- Per file of the king's own file and the files either side of it **that exist** (an a- or h-file king has 2 files).
- `s` (shelter missing): no own pawn one or two ranks ahead of the king on that file.
- `h` (half-open): no own pawn on the file, and an enemy pawn on it. `o` (open): no pawn of either colour on it.
- `q`: the **enemy** has at least one queen. It is a flag, not a count.
- The queen-on features (`ADR-0068` d1–d2): `KING_SHELTER_MISSING_QUEEN` = s × q, `KING_FILE_HALF_OPEN_QUEEN` = h × q, `KING_FILE_OPEN_QUEEN` = o × q, per king.
- Base exposure in cp = 15 s + 10 h + 20 o. The halves are equal, so mg = eg.

## The rows (A = enemy queen on, B = removed; the "subject" is the king whose enemy queen goes)
Counts are `sQ/hQ/oQ`, the three queen-on feature counts, per king. Base `s/h/o` is in brackets.

| id | subject | removed | A (FEN) | B (FEN) | A white | A black | B white | B black |
|---|---|---|---|---|---|---|---|---|
| QP1 | white | d8 | `3q2k1/ppp2p1p/6p1/8/8/7P/PPP2P2/3Q2K1 w - - 0 1` | `6k1/ppp2p1p/6p1/8/8/7P/PPP2P2/3Q2K1 w - - 0 1` | 1/1/0 (1/1/0) | 0/0/0 (0/0/0) | **0/0/0** (1/1/0) | 0/0/0 (0/0/0) |
| QP2 | white | d8 | `3qk3/ppp1pppp/8/8/8/8/PPP1PPPP/3QK3 w - - 0 1` | `4k3/ppp1pppp/8/8/8/8/PPP1PPPP/3QK3 w - - 0 1` | 1/0/1 (1/0/1) | 1/0/1 (1/0/1) | **0/0/0** (1/0/1) | 1/0/1 (1/0/1) |
| QP3 | black | d1 | `3q2k1/ppp2p2/7p/8/8/6P1/PPP2P1P/3Q2K1 b - - 0 1` | `3q2k1/ppp2p2/7p/8/8/6P1/PPP2P1P/6K1 b - - 0 1` | 0/0/0 (0/0/0) | 1/1/0 (1/1/0) | 0/0/0 (0/0/0) | **0/0/0** (1/1/0) |
| QP4 | black | e2 | `6k1/pp1q1p2/4p3/2p3p1/7P/4P3/PP2QPP1/2K5 w - - 0 1` | `6k1/pp1q1p2/4p3/2p3p1/7P/4P3/PP3PP1/2K5 w - - 0 1` | 2/1/1 (2/1/1) | 2/1/0 (2/1/0) | 2/1/1 (2/1/1) | **0/0/0** (2/1/0) |
| QP5 | white | d7 | `6k1/pp1q1p2/4p3/2p3p1/7P/4P3/PP2QPP1/2K5 w - - 0 1` | `6k1/pp3p2/4p3/2p3p1/7P/4P3/PP2QPP1/2K5 w - - 0 1` | 2/1/1 (2/1/1) | 2/1/0 (2/1/0) | **0/0/0** (2/1/1) | 2/1/0 (2/1/0) |
| QP6 | white | e7 | `2k5/ppp1q3/3p4/4p3/4P3/2P5/PP1Q2P1/7K w - - 0 1` | `2k5/ppp5/3p4/4p3/4P3/2P5/PP1Q2P1/7K w - - 0 1` | 1/0/1 (1/0/1) | 0/0/0 (0/0/0) | **0/0/0** (1/0/1) | 0/0/0 (0/0/0) |
| QP7 | white | c8, d8 | `1kqq4/p1p5/1p6/8/7P/8/5PK1/8 w - - 0 1` | `1k6/p1p5/1p6/8/7P/8/5PK1/8 w - - 0 1` | 2/0/1 (2/0/1) | 0/0/0 (0/0/0) | **0/0/0** (2/0/1) | 0/0/0 (0/0/0) |
| QC8 (control) | white | c8 | `1kqq4/p1p5/1p6/8/7P/8/5PK1/8 w - - 0 1` | `1k1q4/p1p5/1p6/8/7P/8/5PK1/8 w - - 0 1` | 2/0/1 (2/0/1) | 0/0/0 (0/0/0) | 2/0/1 (2/0/1) | 0/0/0 (0/0/0) |

**What each row is for:**
- **Removed queen, counts drop to 0:** the subject in every QP row. Bold above.
- **Mirrored pair:** QP3 is `mirrorPosition(QP1)` for A and B, checked. The counts swap colour.
- **Both queens:** QP4 and QP5 share one A, with both queens on. QP4 removes the white queen and QP5 the black. Each time only the other king's counts go to 0, so the two rows catch swapped flags. QP2 also keeps the non-subject king's counts on (1/0/1 in A and B).
- **Shelter missing, half-open and open** (test note 1): `s` in all seven; `h` in QP1, QP3, QP4, QP5; `o` in QP2, QP4, QP5, QP6, QP7.
- **Traps:**
  - QP4's g5: an own pawn three ranks ahead. The shelter is missing, but there is no file term.
  - QP6: an h-file king, 2 files. The f-file is bare, so a window shifted inward reads 2/0/2.
  - QP7: the king is on g2. The f2 pawn stands beside it, so `s` counts but no file term does. h4 shelters from two ranks ahead. There are two enemy queens in A and none in B: a queen-count form reads 5 ×, not 3 ×.
  - QC8 (control, not one of the ≥ 6): two queens against one. Nothing may move.
- **Every FEN** is canonical and legal on `main`. Neither side is in check. A and B differ only on the `removed` squares, and those hold the subject's enemy queens.

## How K1 (c) is graded on these rows
- **With the three queen-on pairs at 2 × their base pairs through `withParametersForTest`** ({30, 30} / {20, 20} / {40, 40}):
  - the subject king's exposure in A is **exactly 3 ×** its exposure in B, in each half;
  - the other king's exposure is **equal** in A and B;
  - on QC8, both kings are equal in A and B.
- **Expected exposure in cp (each half), subject in A against B:**

| row | QP1 | QP2 | QP3 | QP4 | QP5 | QP6 | QP7 | QC8 |
|---|---|---|---|---|---|---|---|---|
| subject | 75 vs 25 | 105 vs 35 | 75 vs 25 | 120 vs 40 | 180 vs 60 | 105 vs 35 | 150 vs 50 | 150 vs 150 |

- **The same reading through `evaluate`.** This is the change in white-POV `evaluate` and `evaluateWithoutTaper` when the pairs go from 0 to 2 × base. It equals 2 × (black q × black base − white q × white base), and it is exact: every exposure half and every seam pair has mg = eg, so only mg moves.

| | QP1 | QP2 | QP3 | QP4 | QP5 | QP6 | QP7 | QC8 |
|---|---|---|---|---|---|---|---|---|
| A | −50 | 0 | +50 | −40 | −40 | −70 | −100 | −100 |
| B | 0 | +70 | 0 | −120 | +80 | 0 | 0 | −100 |

- **With the pairs at 0**, K1 (b) holds on the ticket's own corpora. These rows add no bar there.

## K0, as `ADR-0068` d6 lists it (copied, not re-read)
- `chooseMove`, frozen clock: kiwipete d8 / d9 **1 296 788 / 2 733 330**; position-6 d8 / d9 / d10 **404 930 / 926 005 / 1 692 669**.
- `search()` d8: kiwipete / position-6 **839 514 / 1 533 901**.
- Every older door reads its pre-ticket counts.
- These hold on `src/` tree `4cb84035`, which is still `main`'s tree at this freeze. If `main`'s `src/` moves before the build (for example, `ABC-279` merges first), the Engineer re-reads K0 on the new base and puts both sets in the PR (ticket K0).

## Checks run on `main` (`raw/scripts/verify.mjs`, exit 0, `raw/verify.out`)
- The hand counts equal a re-implementation of the **stated** rule (written from the docblock, not from `kingExposure`) on all 16 row positions (13 unique; QP4 / QP5 share A, and so do QP7 / QC8), for both kings.
- **Main's evaluate agrees on every row.** For each of the three base pairs zeroed through `withParametersForTest`, the white-POV change in `evaluate` and in `evaluateWithoutTaper` equals value × (black count − white count). It also agrees with all three zeroed. Main exposes no per-king seam, so this is the per-king check's strongest corroboration.
- `main`'s `evaluate` is mirror-exact (`Object.is`) on all of them.
- **The checker bites.** A hand edit of QP6 to 2/0/2 (the shifted-window answer) read 8 FAILs.
- Every run went under `flock <host-test.lock>`. `npm test` was not run, because nothing under `src/` changed.

## What this PREREG binds
- **`raw/pairs.json`** at sha256 `68769ea9712097ff1a366b6ad952a71376579fba94d6625c032062dd5e19c681`, written by `raw/scripts/gen-pairs.mjs` (sha256 `a3b133e3…c8677`) and checked by `raw/scripts/verify.mjs` (sha256 `3f604407…531ac`). The table above is the same data.
- **A changed row needs a new dated QE note and a re-freeze. It is never an edit.** The Engineer may copy the rows into a test fixture. A copy that differs from `pairs.json` is a defect.
- **No bar is added or loosened.** K1 (c)'s bar is `ADR-0068` d6's. This note fixes only the rows it reads.
