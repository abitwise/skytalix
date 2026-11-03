# se-ABC-269-cut acceptance: P1–P7 all MET. B0 exact on all 11 counts. P2 found 0 phase mismatches over the perft walk and 40 targeted rows. P3 found 0 `Object.is` differences against the uncut build in 2 200 rows. P4 found 0 mismatches in 1 140 shipped rows and 8 360 door rows against uncut, and in 8 360 rows against `main`. All 4 planted defects went red. No figure was re-pinned. `npm test` passed 2 566 / 2 566, every deep lane is green, and typecheck, lint and build all exit 0. No timing reading was taken

Software Engineer, task `se-ABC-269-cut`, on `561fc028`. Every run was taken under the host lock. Scripts and outputs are in `raw/`.

## P1, B0 exact (`raw/out/b0.out`, `b0.ts` against the cut worktree)
- `chooseMove`: kiwipete d8 **1 296 788**, d9 **2 733 330**; position-6 d8 **404 930**, d9 **926 005**, d10 **1 692 669**.
- `search()` d8: **839 514 / 1 533 901**.
- Doors: `chooseMoveWithoutTaper` **1 306 981 / 391 451**; `searchWithoutTaper` **888 786 / 1 262 046**.
- All 11 equal the decision's figures. The `SEARCH_DEEP=1` B0 rows in `src/evaluate.taper.test.ts` pass unchanged.

## P2, the phase oracle walk (`src/evaluate.taper.test.ts`, new rows)
- **The perft set, depth 2 by default:** every move of the six `PERFT_POSITIONS`, **6 637 checked** (Σ published perft d1 + d2, pinned exactly). Under `SEARCH_DEEP=1` the walk goes to depth 3, **277 949 checked**. The deep lane passed.
- **The checks:** after each `makeMove`, `phaseAfterMove(parent, move) === phaseOf(child)`. After each `unmakeMove`, `phaseOf === parent`. A null move at every interior node leaves the phase unchanged. **0 mismatches.**
- The targeted rows' boards are walked too, because white's en passant first appears at perft depth 3.
- **Non-vacuity:** every required kind was seen at least once:
  - quiet;
  - a capture of P / N / B / R / Q;
  - en passant for white and for black;
  - e1g1, e1c1, e8g8 and e8c8;
  - a promotion to each of N / B / R / Q, and a capture-promotion to each.
- **40 targeted rows,** each with the exact weight it moves, written from `ADR-0064` d1 and not read from the module:
  - promotion to N / B / R / Q for each colour, quiet (+1 / +1 / +2 / +4), taking a rook (w − 2) and taking a knight (w − 1);
  - en passant for each colour (0);
  - the four castlings (0);
  - a rook taking each of P / N / B / R / Q, for each colour (−0 / −1 / −1 / −2 / −4).
- **`phaseOf` against d1's raw phase:**
  - It equals d1's raw phase on G3's 184, the door corpus, the mirror set (and each row's frozen `rawPhase`) and the passer pairs.
  - The start position reads 24.
  - It is unclamped: 4 white queens beside black's whole army read 28.

## P3, the evaluation is unchanged across builds (`raw/out/p34.out`, one process)
- `evaluate`, `evaluateWithoutTaper`, `evaluateWithoutMobility` and `evaluateWithoutPawnCache`, cut against uncut (src `b8b44ff3`), compared with `Object.is`.
- The positions: G3's 184 and their 184 mirrors, all 176 FEN strings in QE's frozen fixture, and the 6 endgames. That is 550 distinct positions and **2 200 rows: 0 mismatches.**
- `evaluateAtPhase(p, phaseOf(p))` against uncut `evaluate`: 0 / 550.
- In the file: `evaluate ≡ evaluateAtPhase(·, phaseOf(·))` over 184 + the frozen sets passes.
- The 90 pre-existing taper rows (B1 (a)–(e)) pass. One of them, the call-site source pin, was re-written as a pin; see the migration note.

## P4, cross-build trees
- **Shipped, cut against uncut:** `search()` d1–3 and `chooseMove` to d1–3 (frozen clock) on the 190, compared as nodes | score | move | depth. **1 140 rows, 0 mismatches.**
- **Every door, cut against uncut** (13 search doors, 7 engine doors): **8 360 rows, 0 mismatches.**
- **The doors against `main` `58fa3eb4`** (`xbuild.ts`, as in `se-ABC-269`): **8 360 rows, 0 mismatches**. The shipped search differs from `main` in 444 / 570, which is expected and shows the test is not vacuous.

## P5, the guard, and 4 planted defects (`raw/out/plants.out`; each applied alone in an isolated copy, then restored)
- **The guard** is source rows:
  - the walk holds no `PHASE_WEIGHT`, `phase`, `KING_EG_DELTA` or `egDelta`;
  - the king Δ is read after the walk, signed;
  - `phaseOf` is called 2× in `search.ts` (the root and the depth-less leaf), 1× in `engine.ts`, and 0× in `quiescence.ts`;
  - `phaseAfterMove` is called 2 / 2 / 1 times;
  - the null child is passed `phase`;
  - no `phase` appears on `position.ts` / `apply.ts` or as module state;
  - every tapered call site passes the carried phase, and the recursions contain no `evaluate(`.
- **The plants:**
  1. `phaseAfterMove` without its promotion term: **red.** The P2 walk and the promotion rows fail (the first 8 red rows are listed in `plants.out`). B0: kiwipete `chooseMove` d8 reads 1 298 993 (expected 1 296 788) and `search()` d8 reads 846 559 (expected 839 514).
  2. `phaseAfterMove` without its capture term: **red.** The P2 walk and the capture and capture-promotion rows fail. B0: 1 306 981 / 888 786. Those are the untapered door's counts, because an inflated phase clamps to 24.
  3. The tapered stand pat reading the self-walking `evaluate(position)`: **red** on the P5 call-site pin (1 failed / 136 passed). The plant is value-identical, so only the guard can see it, and it does.
  4. The post-walk king Δ unsigned for black: **red** on B1 (a): G3's 184 mirror row and the M-p* rows.

## P6, zero re-pins
- **`npm test`:** 66 files, **2 566 / 2 566** passed. That is the uncut 2 519 plus 47 new rows (P2 1 + 1 + 40, P3 1, P5 4). The 90 pre-existing taper rows are unchanged in figure.
- **Deep lanes,** each green with no figure changed:
  - `SEARCH_DEEP=1`: taper 146 / 146, null-move 44, futility 53, search 57, quiescence 116, transposition 40, pvs-lmr 29, ordering 43;
  - `ENGINE_DEEP=1`: engine 82, transposition 26, pawns 44;
  - `PUZZLE_DEEP=1`: 18 / 18.
- **B2:** 0 / 163 and 0 / 189.
- **B3:** zugzwang **7 / 7** at the recorded depths. The `ABC-268` A3 (c) zugzwang node counts equal the uncut build's to the node (84 325, 697 684, 1 044 425, 2 829, 2 981, 3 065, 3 051).
- **B4:** G1 **54 / 58**, baseline 54 / 58. The gating run's unsolved-name rows pass, so the lines are the same.
- **`PUZZLE_DEEP=weakened`** (A3, the control) solves 16 / 58 and its gate row is red, as designed. That shows the re-targeted mock still bites.
- The `ABC-268` A3 / A4 report lines are identical to `se-ABC-269`'s, figure for figure.

## P7
- typecheck 0, lint 0 (136 files), build 0.

## Not done here (by the decision)
- No `G2`, ns-per-node or variant reading. The one reading is QE's, under PREREG `…e36ee7ca`.
