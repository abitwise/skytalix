# qe-ABC-271-freeze PREREG: ABC-271's K1 (a) passer positions, K1 (c) seam fixtures and K0 counts, frozen before any build. 12 new passer positions for the mirror; 44 seam fixtures (5 U twin pairs + 5 U singles, 9 king-distance pairs, 5 free-path pairs + 1 control), each with FEN, phase, side to move and the four E4a feature values per side derived by hand from ADR-0070's definitions; K0's seven counts as ADR-0070 d5 lists them. se-ABC-271 implements against these rows and QE grades them; nobody changes them

QE/E2E, task `qe-ABC-271-freeze`, on `grugops/qe-ABC-271-freeze` from `main` `b274711c`, `src/` tree `4fb3da04` (read with `git rev-parse HEAD:src`). No ABC-271 code exists. Nothing under `src/` or `tools/` was touched, and no test fixture file was written (the `qe-ABC-270-freeze` precedent wrote none).

**Sources:** the ticket's K1 (a) / (c) and test note 1; `ADR-0070` d1, d2, d4, d5; the Orchestrator's rulings `…730399e5` (no new door; U held at 0) and `…6ccd8243` item 1 (the floors ≥ 8 / ≥ 6 / ≥ 4, one pair past the cap and one own-king pair, are the bars).

## The rule the values come from (ADR-0070 d1 / d2, stated, not read from code)
- R = the passer's own rank index: white R = rank − 1, black R = 8 − rank (1 = start rank, 6 = one step from promotion). Q = its queening square. d = Chebyshev distance.
- A passer is `main`'s: no enemy pawn ahead on its own or an adjacent file. **Only the frontmost passer of each file is read.**
- **King distance:** kd += `PASSED_KING_ENEMY[R]` × min(d(enemy king, Q), 5) − `PASSED_KING_OWN[R]` × min(d(own king, Q), 5).
- **Free path:** free += `PASSED_FREE[R]` when every square ahead, up to and including Q, is empty. Any piece blocks, a king included. Attacks are not read.
- **Unstoppable:** at phase 0 only, U once per side when some passer of that side has a free path and moves < d(defending king, Q) − (1 if the defender is to move). moves = 5 on R 1, else 7 − R. This d is **not** capped (`QE-271-b`).
- **The per-side feature values** (what the tuner's arrays multiply), by R: `PASSED_KING_ENEMY` Σ min(dE, 5); `PASSED_KING_OWN` Σ min(dO, 5) (the term subtracts it); `PASSED_FREE` the count of free passers; `PASSED_UNSTOPPABLE` 0 / 1. They are in `fixtures.json` per row and side.
- **The seam values** (K1 (c)) are at the probed values `ADR-0070` d1 names: KE 0, 1, 2, 4, 7, 12, 20; KO 0, 0, 1, 2, 3, 6, 10; F 0, 5, 10, 20, 35, 60, 100; U 400.

## K1 (c): the fixtures (per side, eg cp at the probed values: kd / free / un)
Passer notation: square (R, dE raw, dO raw, free). Every row has one passer side unless shown; the other side reads 0 / 0 / 0.

**U, the rule of the square (phase 0; the "in" twin moves the defending king one step inside):**

| id | FEN | passer | kd / free / un |
|---|---|---|---|
| U1-out / U1-in | `8/5k2/8/8/P7/8/8/7K w - - 0 1` / `8/4k3/8/8/P7/8/8/7K w - - 0 1` | W a4 (3, 5→4, 7, 1); attacker to move | 10 / 20 / **400** → 6 / 20 / **0** |
| U2-out / U2-in | `8/8/8/8/8/8/2P5/K5k1 b - - 0 1` / `8/8/8/8/8/8/2P3k1/K7 b - - 0 1` | W c2 (1, 7→6, 7, 1); start rank, moves 5, defender to move | 5 / 5 / **400** → 5 / 5 / **0** |
| U3-out / U3-in | `7k/8/8/8/5p2/8/1K6/8 b - - 0 1` / `7k/8/8/8/5p2/8/2K5/8 b - - 0 1` | B f4 (4, 4→3, 7, 1); attacker to move | 13 / 35 / **400** → 6 / 35 / **0** |
| U4-out / U4-in | `k7/8/8/8/3K4/7p/8/8 w - - 0 1` / `k7/8/8/8/4K3/7p/8/8 w - - 0 1` | B h3 (5, 4→3, 7, 1); defender to move | 18 / 60 / **400** → 6 / 60 / **0** |
| U5-out / U5-in | `8/4k1P1/8/8/8/8/8/K7 w - - 0 1` / `8/5kP1/8/8/8/8/8/K7 w - - 0 1` | W g7 (6, 2→1, 7, 1); moves 1 | −10 / 100 / **400** → −30 / 100 / **0** |
| U6-stm | `8/5k2/8/8/P7/8/8/7K b - - 0 1` | U1-out with the defender to move | 10 / 20 / **0** |
| U7-both | `7k/8/P7/8/8/7p/8/K7 w - - 0 1` | W a6 (5, 7, 7, 1); B h3 (5, 7, 7, 1) | W 30 / 60 / **400**; B 30 / 60 / **400** |
| U8-two | `8/8/P6P/8/8/3k4/8/4K3 w - - 0 1` | W a6, h6 (5, 5, 7, 1) each | 60 / 120 / **400** (once) |
| U9-ownking | `8/8/3K4/8/3P4/8/8/7k w - - 0 1` | W d4 (3, 7, 2, 0); own king on d6 | 16 / 0 / **0** |
| U10-phase1 | `8/5k2/8/8/P7/8/7N/7K w - - 0 1` | U1-out + a knight, phase 1 | 10 / 20 / **0** |

**KD, king distance (pairs differ by one king step; free and un do not move):**

| pair | FEN A / B | phase | passer, step | kd A → B (moves by) |
|---|---|---|---|---|
| KD1 | `r7/8/8/4P3/7k/8/2K5/R7 w - - 0 1` / `r7/8/8/4P2k/8/8/2K5/R7 w - - 0 1` | 4 | W e5 R4; enemy h4→h5, dE 4→3 | 13 → 6 (KE[4] = 7) |
| KD2 | `8/7k/8/8/2P1K3/8/8/n7 w - - 0 1` / `8/7k/8/4K3/2P5/8/8/n7 w - - 0 1` | 1 | W c4 R3; **own** e4→e5, dO 4→3 | 12 → 14 (KO[3] = 2) |
| KD3 | `r7/8/8/8/8/1P4k1/8/2K5 w - - 0 1` / `r7/8/8/8/8/1P5k/8/2K5 w - - 0 1` | 2 | W b3 R2; enemy g3→h3, dE 5→6 | 5 → 5 (**0, past the cap**) |
| KD4 | `r7/8/8/8/5k2/1P6/8/2K5 w - - 0 1` / `r7/8/8/8/6k1/1P6/8/2K5 w - - 0 1` | 2 | W b3 R2; enemy f4→g4, dE 4→5 | 3 → 5 (KE[2] = 2, the last step inside) |
| KD5 | `r7/8/4k3/8/4p3/1K6/8/7R b - - 0 1` / `r7/4k3/8/8/4p3/1K6/8/7R b - - 0 1` | 4 | B e4 R4; **own** e6→e7, dO 5→6 | 6 → 6 (**0, past the cap**) |
| KD6 | `7N/8/8/8/3k4/2p5/7K/8 b - - 0 1` / `7N/8/8/8/8/2pk4/7K/8 b - - 0 1` | 1 | B c3 R5; **own** d4→d3, dO 3→2 | 42 → 48 (KO[5] = 6) |
| KD7 | `r7/2k5/8/7K/4p3/8/8/R7 b - - 0 1` / `r7/2k5/8/8/4p2K/8/8/R7 b - - 0 1` | 4 | `mirrorPosition(KD1)`: B e4 R4, dE 4→3 | 13 → 6 |
| KD8 | `7r/8/7k/3P4/8/3P4/8/RK6 w - - 0 1` / `7r/8/6k1/3P4/8/3P4/8/RK6 w - - 0 1` | 4 | W d5 (front of d3 / d5) R4; dE 4→3 | 13 → 6 (rear read too: 16 → 7) |
| KD9 | `8/7N/8/1P2k3/6p1/8/K7/8 w - - 0 1` / `8/7N/8/1P6/4k1p1/8/K7/8 w - - 0 1` | 1 | W b5 and B g4, both R4; black king e5→e4 | W 6 → 13 (+KE[4]); B 23 → 26 (+KO[4]) |

**FP, free path (A = B + one piece on a square ahead; kd and un do not move; phase > 0 so un is 0):**

| pair | FEN A / B | passer | blocker | free A / B |
|---|---|---|---|---|
| FP1 | `7r/8/3n3k/3P4/8/8/8/R5K1 w - - 0 1` / `7r/8/7k/3P4/8/8/8/R5K1 w - - 0 1` | W d5 R4, kd 13 | enemy knight d6 (stop square) | 0 / 35 |
| FP2 | `6n1/1B6/5k2/8/1P6/8/4K3/8 w - - 0 1` / `6n1/8/5k2/8/1P6/8/4K3/8 w - - 0 1` | W b4 R3, kd 6 | **own** bishop b7 | 0 / 20 |
| FP3 | `n7/8/8/7k/8/1K3p2/8/5R2 b - - 0 1` / `n7/8/8/7k/8/1K3p2/8/8 b - - 0 1` | B f3 R5, kd 24 | rook on **Q itself** (f1) | 0 / 60 |
| FP4 | `8/r7/8/4k3/8/7N/P7/2K5 w - - 0 1` / `8/8/8/4k3/8/7N/P7/2K5 w - - 0 1` | W a2 R1, kd 4 | rook a7, the **far end** of the path | 0 / 5 |
| FP5 | `r7/2k5/8/2P5/8/8/8/6KR w - - 0 1` / `r7/1k6/8/2P5/8/8/8/6KR w - - 0 1` | W c5 R4, kd −8 both (d 1 both) | the **enemy king** c7 vs b7 | 0 / 35 |
| FP6-ctl | `7r/8/2n4k/3P4/8/8/8/R5K1 w - - 0 1` | W d5 R4, kd 13 | a knight on c6, ahead on the adjacent file | 35 (free) |

**Floors met:** U 5 twin pairs ≥ 4 (both colours; attacker and defender to move; the start rank's double step) plus U10 above phase 0 reading 0; KD 9 pairs ≥ 6 (enemy king KD1, 3, 4, 7, 8, 9; own king KD2, 5, 6, 9; past the cap KD3 enemy and KD5 own); FP 4 piece pairs ≥ 4 (FP1–FP4) plus the king pair FP5 and the control FP6.

**Traps:** U2 (start rank: 7 − R reads 0; a capped d reads 0), U6 (side to move ignored reads 400), U7 (U netted reads 0 per side), U8 (U per passer reads 800), U9 (own king on the path), U5 (negative kd), KD3 / KD5 (cap at 6), KD4 (cap at 4), KD8 (rear passer read), KD9 (colours swapped), FP3 (walk stops before Q), FP4 (stop square only), FP5 (a king not counted as a blocker), FP6 (adjacent file read as the path).

## How K1 (c) is graded on these rows
- Inside `withParametersForTest` at the probed values, `passerTermsForTest` returns, **per row and per side, exactly the frozen `seam` `{ kd, free, un }`** in `fixtures.json`. Each pair's A − B per side is then exact by subtraction: kd by `PASSED_KING_ENEMY[R]` / `PASSED_KING_OWN[R]` per capped step and 0 past the cap, free only where the path is empty, U only on the "out" halves at phase 0.
- With the values 0 every part is 0, and K1 (b) holds on the ticket's corpora. These rows add no bar there.

## K1 (a): 12 new passer positions for the mirror (`Object.is`, at the shipped values)
In `fixtures.json` `k1a`, each with FEN, phase and side to move: `A01`–`A12`, phases 0 (six), 1, 2 (two), 4, 5, 24. Both colours' passers; white and black to move; connected, doubled, rim-file, protected, blocked, seventh-rank and start-rank passers; one en-passant square (`A11`); U for black with the defender to move (`A12`); phase 24 (`A08`). None is in `G3`'s 184, `TAPER_MIRROR_POSITIONS` or `TAPER_DOOR_CORPUS` (checked). No feature values are frozen for them: they are K1 (a)'s and K1 (b)'s rows only.

## K0, as `ADR-0070` d5 lists it (copied, not re-read)
- `chooseMove`, frozen clock: kiwipete d8 / d9 **766 275 / 1 725 150**; position-6 d8 / d9 / d10 **87 475 / 253 724 / 533 916**.
- `search()` d8: kiwipete / position-6 **605 117 / 406 787**.
- Every existing door reads its pre-ticket counts.
- These are the probe's I1 on `src/` tree `8adb0a18`. `main`'s `src/` tree at this freeze is `4fb3da04`, and `git diff 8adb0a18 4fb3da04` lists only `engine.test.ts`, `levels.test.ts` and `search.null-move.test.ts` (checked), so they stand. If `main`'s non-test `src/` moves before the build, the Engineer re-reads K0 on the new base and puts both sets in the PR (ticket K0).

## Checks run on `main` (`raw/scripts/verify.mjs`, `raw/verify.out`)
Exit 0, 0 failures (44 K1 (c) fixtures, 19 pairs, 12 K1 (a) positions).
- **The hand values equal a re-implementation of `ADR-0070` d1 / d2 written from the ADR text**, not from engine code, on every fixture and side: the passer list (square, R, both raw distances, free), U, and the seam `{ kd, free, un }`. Each side's frozen features · the probed values = its frozen seam.
- **`main` agrees where it can speak:**
  - every FEN is canonical and parses;
  - neither side is in check;
  - `phaseOf` equals the hand phase;
  - `main`'s `isPassedPawn` passes every listed passer;
  - `main`'s `evaluate` is mirror-exact (`Object.is`) on all 44 fixtures and all 12 K1 (a) positions.
- **The rule is colour-symmetric** on every row: on `mirrorPosition`, the white and black parts swap.
- **The pair structure holds:**
  - every U and KD pair (and FP5) is one king step with the side to move unchanged;
  - every FP piece pair adds one non-king, non-pawn piece on a square ahead of the passer;
  - a KD pair moves neither free nor un, and an FP pair moves neither kd nor un;
  - KD7 = `mirrorPosition(KD1)`.
- **The floors are checked by the script.** K1 (a)'s positions are not in `G3`, `TAPER_MIRROR_POSITIONS` or `TAPER_DOOR_CORPUS`, and each has a passer by `main`'s test.
- **The checker bites.** A copy with three planted errors (U2-out's U read 0, the start-rank / capped-d form; KD3-B read as a cap at 6; FP3-A's walk stopping before Q) read 8 FAILs, exit 1.
- Every run went under `flock <scratch>/host-test.lock`. `npm test` was not run, because nothing under `src/` changed. No search was run.

## What this PREREG binds
- **`raw/fixtures.json`** at sha256 `bf3c205bf4106209e3151717d93542180d90d344cecfdfbb6f2a30c9d5db887a`, written by `raw/scripts/gen-fixtures.mjs` (sha256 `0671a64e…410f1`) from the hand table and checked by `raw/scripts/verify.mjs` (sha256 `995fe973…71a000`). The tables above are the same data.
- **A changed row needs a new dated QE note and a re-freeze. It is never an edit.** The Engineer may copy the rows into a test fixture. A copy that differs from `fixtures.json` is a defect.
- **No bar is added or loosened.** K1's bars are `ADR-0070` d5's and the floors are the ticket's (`…6ccd8243` item 1). This note fixes only the rows they read.
