/**
 * The evaluation's parameter table (`ABC-269`, `ADR-0064` decision 4): every term as a middlegame
 * and an endgame half. DATA ONLY: no logic and no imports. `src/evaluate.ts` imports it and derives
 * its packed lookup arrays from it once, at load.
 *
 * TUNED by `tools/tune` (`ADR-0067`, `ABC-239`). Written by `tools/tune/tune.ts emit`; do not edit
 * by hand. Re-run `extract`, `fit` and `emit` on the base table to reproduce it byte for byte.
 * - tool: tools/tune at commit e763119c60044f3d0e06fc56791c641e15bf215b; values sha256 f5d8e79c0b8f901b1cd14640cd3a8b15f33a821f0a7a2d69496e27f6fbad7aa9
 * - base table: src/evaluate-params.ts sha256 e74ff3e932271506926734c8eafc83d9d246645b116669930cba9146c320f7a9 (E1's rule-made values; ABC-270's queen-on pairs and ABC-271's E4a terms at 0)
 * - data manifest sha256 027082638eff3f5169d5fc241f3794e641fce8a24f63af01e5f8ded79c4d67cd (37 files; own PGNs
 *   repository-relative, the Lichess export by URL, bytes and sha256)
 * - Lichess: https://database.lichess.org/standard/lichess_db_standard_rated_2017-03.pgn.zst, 2169142067 bytes, sha256 b319297e9270285635d615cbcd19a9b0d44747be3ff91d5b3eac41175b794320;
 *   licence "Lichess database export, CC0 (database.lichess.org)"; training only; comments never read
 * - own games: players skytalix / base / skytalix-a / skytalix-b / sky-a / sky-b; own.games.drop.duplicate 617, own.games.drop.player 1571, own.games.drop.result 0, own.games.kept 3780, own.games.read 5968
 * - own positions: own.pos.drop.book 7197, own.pos.drop.check 32209, own.pos.drop.mate 17075, own.pos.drop.noisy 93450, own.pos.kept 284459, own.pos.seen 434390; 1522 validation keys seen in training removed
 * - openings 106 (validation 23); quiet rule: quiesce(full window) with { evasions: true, quietPromotions: true, taper: true }, no seePruning (src/search.ts RULES_TAPERED at main 441c547e; ADR-0069 d6)
 * - Lichess game filters: li.g1.event 0, li.g2.timecontrol 3175054, li.g3.elo 7769697, li.g4.termination 112849, li.g5.result 0, li.g6.bot 0, li.g7.reachReplay 289145, li.g7.replay 0, li.g8.duplicate 278, li.games.kept 288867, li.games.read 11346745; games read 11346745, kept 288867
 * - Lichess position rules: li.p1.ply 4613170, li.p2.sample 14420734, li.p3.check 148675, li.p4.noisy 581702, li.p6.keys 1274381, li.p6.occurrences 1320452, li.p7.leakage 28, li.p8.cap 274353, li.pos.seen 21084733; rule 2 fnv1a32("ABC-239/lichess/v1\n" + key) mod 8 = 0; cap 1000000
 * - rows: own training 172019 (inner validation 49783), own validation 46688, Lichess 1000000
 * - split: fnv1a32("ABC-239/split/v1\n" + start FEN) mod 5 = 0 validation; inner fnv1a32("ABC-239/inner/v1\n" + start FEN) mod 4 = 0
 * - K_own 0.6184400348680674; K_lichess 0.8259669342505758; own weight 0.5; configuration C-F; λ 1e-8
 * - outer validation cross-entropy base 0.586076 → fit 0.578550 (0.9872 ×);
 *   training 0.583943 → 0.575918
 * - frozen (d6): material, PHASE_WEIGHT, PHASE_MG / PHASE_EG, MOBILITY_CAP; the three queen-on
 *   eg halves held at 0 (d6's dated line, `ADR-0068` d8); E4a's mg halves and
 *   PASSED_UNSTOPPABLE held at 0 (d6's dated line, `ADR-0070` d1 and d7)
 * - F3 bounds (`ADR-0067` ruling (b)), 26, each Σ coef · evaluate ≤ right side:
 *   - src/evaluate.test.ts, "scores startpos-minus-a-black-knight between +250 and +400 for white [score >= 250]": right side -250, margin 2, μ 0;
 *     a: MATERIAL[knight].mg -0.958333, MATERIAL[knight].eg -0.041667, PST.knight[b1].mg -0.958333, PST.knight[b1].eg -0.041667, MOBILITY_WEIGHT.mg -0.958333, MOBILITY_WEIGHT.eg -0.041667
 *   - src/evaluate.test.ts, "scores startpos-minus-a-black-knight between +250 and +400 for white [score <= 400]": right side 400, margin 2, μ 0;
 *     a: MATERIAL[knight].mg 0.958333, MATERIAL[knight].eg 0.041667, PST.knight[b1].mg 0.958333, PST.knight[b1].eg 0.041667, MOBILITY_WEIGHT.mg 0.958333, MOBILITY_WEIGHT.eg 0.041667
 *   - src/evaluate.test.ts, "prefers a white knight on e4 to the same knight on b1": right side 0 strict, margin 6.5, μ 0;
 *     a: PST.knight[b1].mg 0.041667, PST.knight[b1].eg 0.958333, MOBILITY_WEIGHT.mg -0.208333, MOBILITY_WEIGHT.eg -4.791667, PST.knight[e4].mg -0.041667, PST.knight[e4].eg -0.958333
 *   - src/evaluate.king-mobility.test.ts, "g2 removed from f2/g2/h2 scores strictly lower for white (the criterion as written)": right side 0 strict, margin 4, μ 0;
 *     a: MATERIAL[pawn].eg -1, PST.pawn[g2].eg -1, ISOLATED.eg -2, KING_SHELTER_MISSING.eg -1, KING_FILE_HALF_OPEN.eg -1, MOBILITY_WEIGHT.eg 1
 *   - src/evaluate.king-mobility.test.ts, "at EQUAL material too, at phase 24: the g-pawn on g6 instead of g2 scores strictly lower (ABC-270 re-find)": right side 0 strict, margin 3.5, μ 8.52e-7;
 *     a: PST.pawn[g6].mg 1, PST.pawn[g2].mg -1, KING_SHELTER_MISSING.mg -1, KING_SHELTER_MISSING_QUEEN.mg -1, MOBILITY_WEIGHT.mg 1
 *   - src/evaluate.king-mobility.test.ts, "the phase-24 twin bites: with the shelter term zeroed, g6 no longer scores lower (red without the term)": right side 0, margin 1.5, μ 0;
 *     a: MOBILITY_WEIGHT.mg -1, PST.pawn[g6].mg -1, PST.pawn[g2].mg 1
 *   - src/evaluate.king-mobility.test.ts, "no f-pawn (black f7 remains) scores strictly lower than f2 for white (the criterion as written)": right side 0 strict, margin 3, μ 0;
 *     a: MATERIAL[pawn].eg -1, PST.pawn[f2].eg -1, KING_SHELTER_MISSING.eg -1, KING_FILE_HALF_OPEN.eg -1, MOBILITY_WEIGHT.eg 1
 *   - src/evaluate.king-mobility.test.ts, "at EQUAL material, shelter equal, at phase 24: the f-pawn on e5 (f half-open) scores lower than on f5 (ABC-270 re-find)": right side 0 strict, margin 5, μ 0;
 *     a: PST.pawn[e5].mg 1, ISOLATED.mg -1, KING_FILE_HALF_OPEN.mg -1, KING_FILE_HALF_OPEN_QUEEN.mg -1, MOBILITY_WEIGHT.mg 3, PST.pawn[f5].mg -1
 *   - src/evaluate.king-mobility.test.ts, "the phase-24 twin bites: with the half-open term zeroed, e5 no longer scores lower (red without the term)": right side 0, margin 3, μ 0;
 *     a: PST.pawn[f5].mg 1, MOBILITY_WEIGHT.mg -3, PST.pawn[e5].mg -1, ISOLATED.mg 1
 *   - src/evaluate.king-mobility.test.ts, "white, with substantially more moves at equal material, scores strictly higher": right side 0 strict, margin 10.5, μ 0;
 *     a: PST.rook[d4].mg -0.166667, PST.rook[d4].eg -0.833333, PST.rook[h1].mg 0.166667, PST.rook[h1].eg 0.833333, MOBILITY_WEIGHT.mg -2.5, MOBILITY_WEIGHT.eg -12.5
 *   - src/evaluate.king-mobility.test.ts, "never exceeds ±100 cp — on the four-queen rig and over the whole corpus, both colours to move [mobilityTerm(rig) > 0]": right side 0 strict, margin 39, μ 0;
 *     a: MOBILITY_WEIGHT.mg -48, MOBILITY_WEIGHT.eg -24
 *   - src/evaluate.pawns.test.ts, "c3/c4 scores strictly lower than c3/d3 for white, and the gap is <= 50 [gap > 0]": right side 0 strict, margin 3.5, μ 0;
 *     a: PST.pawn[c4].eg 1, DOUBLED.eg -1, ISOLATED.eg -2, PST.pawn[d3].eg -1
 *   - src/evaluate.pawns.test.ts, "c3/c4 scores strictly lower than c3/d3 for white, and the gap is <= 50 [gap <= 50]": right side 50, margin 2.5, μ 8.8e-7;
 *     a: PST.pawn[d3].eg 1, PST.pawn[c4].eg -1, DOUBLED.eg 1, ISOLATED.eg 2
 *   - src/evaluate.pawns.test.ts, "d4 with c3/e3 removed scores strictly lower for white (the criterion as written)": right side 0 strict, margin 12.5, μ 0;
 *     a: MATERIAL[pawn].eg -2, PASSED[1].eg -2, ISOLATED.eg -1, KING_SHELTER_MISSING.eg -1, KING_FILE_HALF_OPEN.eg -1, PASSED_KING_ENEMY[1].eg -4, PASSED_KING_OWN[1].eg 10, PASSED_FREE[1].eg -2, PST.pawn[c3].eg -1, PST.pawn[e3].eg -1
 *   - src/evaluate.pawns.test.ts, "at EQUAL material too: c3/e3 moved to a3/g3, isolating all three, scores strictly lower": right side 0 strict, margin 5.5, μ 0;
 *     a: PST.pawn[a3].eg 1, PST.pawn[g3].eg 1, ISOLATED.eg -3, KING_SHELTER_MISSING.eg -1, KING_FILE_HALF_OPEN.eg -1, PST.pawn[c3].eg -1, PST.pawn[e3].eg -1
 *   - src/evaluate.pawns.test.ts, "d4 with its only neighbour on the LEFT (c3) scores higher than d4 with a3, both isolated": right side 0 strict, margin 3, μ 0;
 *     a: PST.pawn[a3].eg 1, ISOLATED.eg -2, PASSED_UNSTOPPABLE.eg 1, PST.pawn[c3].eg -1
 *   - src/evaluate.pawns.test.ts, "d4 with its only neighbour on the RIGHT (e3) scores higher than d4 with b4, both isolated": right side 0 strict, margin 14, μ 2.56e-7;
 *     a: PST.pawn[b4].eg 1, PASSED[3].eg 1, ISOLATED.eg -2, PASSED_KING_ENEMY[3].eg 5, PASSED_KING_OWN[3].eg -5, PASSED_FREE[3].eg 1, PASSED_UNSTOPPABLE.eg 1, PST.pawn[e3].eg -1, PASSED[2].eg -1, PASSED_KING_ENEMY[2].eg -3, PASSED_KING_OWN[2].eg 5, PASSED_FREE[2].eg -1
 *   - src/evaluate.pawns.test.ts, "a7 scores strictly higher than a5": right side 0 strict, margin 13, μ 0;
 *     a: PST.pawn[a5].eg 1, PASSED[4].eg 1, PASSED_KING_ENEMY[4].eg 4, PASSED_KING_OWN[4].eg -5, PASSED_FREE[4].eg 1, PST.pawn[a7].eg -1, PASSED[6].eg -1, PASSED_KING_ENEMY[6].eg -4, PASSED_KING_OWN[6].eg 5, PASSED_FREE[6].eg -1
 *   - src/evaluate.pawns.test.ts, "both score higher than the same a5 pawn stopped by a black pawn on b6, at equal material [a5 > stopped]": right side 0 strict, margin 12.5, μ 0;
 *     a: PST.pawn[b3].eg -1, PST.pawn[h2].eg 1, PASSED[1].eg 1, PASSED[4].eg -1, PASSED_KING_ENEMY[1].eg 3, PASSED_KING_ENEMY[4].eg -4, PASSED_KING_OWN[1].eg -5, PASSED_KING_OWN[4].eg 5, PASSED_FREE[1].eg 1, PASSED_FREE[4].eg -1, PASSED_UNSTOPPABLE.eg -1
 *   - src/evaluate.pawns.test.ts, "both score higher than the same a5 pawn stopped by a black pawn on b6, at equal material [a7 > stopped]": right side 0 strict, margin 13.5, μ 0;
 *     a: PST.pawn[a5].eg 1, PST.pawn[b3].eg -1, PST.pawn[a7].eg -1, PST.pawn[h2].eg 1, PASSED[1].eg 1, PASSED[6].eg -1, PASSED_KING_ENEMY[1].eg 3, PASSED_KING_ENEMY[6].eg -4, PASSED_KING_OWN[1].eg -5, PASSED_KING_OWN[6].eg 5, PASSED_FREE[1].eg 1, PASSED_FREE[6].eg -1, PASSED_UNSTOPPABLE.eg -1
 *   - src/evaluate.taper.test.ts, "ABC-269 B1 (d) — the king walks: centre beats corner by >= 20 cp on QE's six graded endings [D1]": right side -20, margin 4.5, μ 0;
 *     a: PST.king[d4].eg -1, KING_SHELTER_MISSING.eg 1, KING_FILE_OPEN.eg 1, MOBILITY_WEIGHT.eg -5, PST.king[a1].eg 1
 *   - src/evaluate.taper.test.ts, "ABC-269 B1 (d) — the king walks: centre beats corner by >= 20 cp on QE's six graded endings [D2]": right side -20, margin 7, μ 0;
 *     a: PST.king[e5].eg -1, KING_SHELTER_MISSING.eg 2, KING_FILE_OPEN.eg 3, MOBILITY_WEIGHT.eg -6, PST.king[h1].eg 1, KING_FILE_HALF_OPEN.eg -1
 *   - src/evaluate.taper.test.ts, "ABC-269 B1 (d) — the king walks: centre beats corner by >= 20 cp on QE's six graded endings [D3]": right side -20, margin 5.5, μ 0;
 *     a: PST.king[e5].eg -1, KING_SHELTER_MISSING.eg 1, KING_FILE_HALF_OPEN.eg 1, PASSED_KING_ENEMY[3].eg 2, MOBILITY_WEIGHT.eg -5, PST.king[h1].eg 1
 *   - src/evaluate.taper.test.ts, "ABC-269 B1 (d) — the king walks: centre beats corner by >= 20 cp on QE's six graded endings [D4]": right side -20, margin 6.5, μ 0;
 *     a: PST.king[d4].eg -1, KING_SHELTER_MISSING.eg 2, KING_FILE_OPEN.eg 2, PASSED_KING_OWN[1].eg -1, MOBILITY_WEIGHT.eg -6, PST.king[a1].eg 1
 *   - src/evaluate.taper.test.ts, "ABC-269 B1 (d) — the king walks: centre beats corner by >= 20 cp on QE's six graded endings [D5]": right side -20, margin 5, μ 0;
 *     a: PST.king[e4].eg -1, KING_SHELTER_MISSING.eg 1, KING_FILE_OPEN.eg 2, MOBILITY_WEIGHT.eg -5, PST.king[h8].eg 1
 *   - src/evaluate.taper.test.ts, "ABC-269 B1 (d) — the king walks: centre beats corner by >= 20 cp on QE's six graded endings [D6]": right side -20, margin 10, μ 0;
 *     a: PST.king[d5].eg -1, KING_SHELTER_MISSING.eg 1, KING_FILE_OPEN.eg 3, PASSED_KING_ENEMY[1].eg -2, PASSED_KING_ENEMY[2].eg -1, PASSED_KING_OWN[3].eg 5, PASSED_FREE[3].eg -1, PASSED_UNSTOPPABLE.eg -2, MOBILITY_WEIGHT.eg -5, PST.king[a8].eg 1
 *
 * Tables are written from WHITE's point of view and read RANK-8-FIRST (a8 top-left); black reads
 * the same table with the rank flipped. In the rules, `R` is the rank counted from the piece's own
 * side (1 … 8), `e` is the file's steps from the edge (a/h 0, b/g 1, c/f 2, d/e 3), and `ring` is
 * the square's steps from the board's edge, `min(e, R − 1, 8 − R)` (0 … 3).
 */

/** A term's two halves: `mg` at phase 24 (every piece on), `eg` at phase 0 (kings and pawns). */
export interface MgEg<T> {
  readonly mg: T;
  readonly eg: T;
}

/**
 * The phase weight per piece type, indexed by `pieceType` (EMPTY 0, PAWN 1 … KING 6): N 1, B 1,
 * R 2, Q 4, pawns and kings 0. Summed over both sides it is 24 at the start, clamped to 24.
 */
export const PHASE_WEIGHT: readonly number[] = [0, 0, 1, 1, 2, 4, 0];

/**
 * The blend's two ends (`ADR-0064` decision 1, form L): at phase ≥ `PHASE_MG` the score is the
 * middlegame half, at phase ≤ `PHASE_EG` the endgame half, linear between.
 */
export const PHASE_MG = 24;
export const PHASE_EG = 0;

/**
 * Centipawn value per piece type, indexed by `pieceType`. The king is 0. Frozen at the first pull
 * (`ADR-0067` d6): the classical scale, P 1, N 3, B 3, R 5, Q 9 pawns, times 100, plus 25 on each
 * minor piece.
 */
export const MATERIAL: MgEg<readonly number[]> = {
  mg: [0, 100, 325, 325, 500, 900, 0],
  eg: [0, 100, 325, 325, 500, 900, 0],
};

// pawn square table, middlegame half: fitted (`ADR-0067`). start (prior): `2 × e × (R − 2)`, and 0 on ranks 1 and 8, both halves.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const PAWN_MG: readonly number[] = [
    0,  0,  0,  0,  0,  0,  0,  0,
    9, 10, 21, 20, 20, 21, 10,  9,
   20,-19, 52, 36, 36, 52,-19, 20,
   -5,  0,  3, 12, 12,  3,  0, -5,
  -32,-19,-18, -1, -1,-18,-19,-32,
  -38,-25,-22,-13,-13,-22,-25,-38,
  -40,-26,-27,-34,-34,-27,-26,-40,
    0,  0,  0,  0,  0,  0,  0,  0,
];

// pawn square table, endgame half: fitted (`ADR-0067`). start (prior): `2 × e × (R − 2)`, and 0 on ranks 1 and 8, both halves.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const PAWN_EG: readonly number[] = [
    0,  0,  0,  0,  0,  0,  0,  0,
  -14, 37, 20, 17, 17, 20, 37,-14,
   11, 12, 34, -3, -3, 34, 12, 11,
   30,  2, 20,  3,  3, 20,  2, 30,
   13,  2, 19, -5, -5, 19,  2, 13,
    1, -6,  7, 21, 21,  7, -6,  1,
   20, 11, 23, 13, 13, 23, 11, 20,
    0,  0,  0,  0,  0,  0,  0,  0,
];

// knight square table, middlegame half: fitted (`ADR-0067`). start (prior): `10 × n − 50`, n the knight moves from the square on an empty board, both halves.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const KNIGHT_MG: readonly number[] = [
  -61,-15,-14,-10,-10,-14,-15,-61,
  -25,-16, 24, 30, 30, 24,-16,-25,
    2, 14, 42, 46, 46, 42, 14,  2,
   16, 19, 41, 21, 21, 41, 19, 16,
  -12, 12,  3,  2,  2,  3, 12,-12,
  -34,-25,-18,  5,  5,-18,-25,-34,
  -42,-49,-15,-21,-21,-15,-49,-42,
  -40,-52,-41,-39,-39,-41,-52,-40,
];

// knight square table, endgame half: fitted (`ADR-0067`). start (prior): `10 × n − 50`, n the knight moves from the square on an empty board, both halves.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const KNIGHT_EG: readonly number[] = [
  -38,-13,-10, -3, -3,-10,-13,-38,
  -23, -6,  7,  1,  1,  7, -6,-23,
   -7, 11, 12,  3,  3, 12, 11, -7,
  -11, 15, 12, 18, 18, 12, 15,-11,
  -31, 13,  7, 13, 13,  7, 13,-31,
  -18, -6,-10, 16, 16,-10, -6,-18,
   -7, -6, 16, -3, -3, 16, -6, -7,
  -36,-21,-18,-14,-14,-18,-21,-36,
];

// bishop square table, middlegame half: fitted (`ADR-0067`). start (prior): `5 × (n − 9)`, n the squares on the square's diagonals on an empty board, both halves.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const BISHOP_MG: readonly number[] = [
   -7, -6,-11, -9, -9,-11, -6, -7,
    2, -9, 22,  3,  3, 22, -9,  2,
   22, 24, 21, 36, 36, 21, 24, 22,
   -3,  6, 32, 57, 57, 32,  6, -3,
    5, 10, 13, 38, 38, 13, 10,  5,
   18, 12, 12,  8,  8, 12, 12, 18,
    6, 18, 16,  3,  3, 16, 18,  6,
  -20, 11, -1,-15,-15, -1, 11,-20,
];

// bishop square table, endgame half: fitted (`ADR-0067`). start (prior): `5 × (n − 9)`, n the squares on the square's diagonals on an empty board, both halves.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const BISHOP_EG: readonly number[] = [
   10,  8, -5, -5, -5, -5,  8, 10,
   -6,  0,-24, 15, 15,-24,  0, -6,
    7, -8,  2,  3,  3,  2, -8,  7,
    0, -6,  4,  2,  2,  4, -6,  0,
  -12,  0,-12,-21,-21,-12,  0,-12,
   -3,-12, -1,  7,  7, -1,-12, -3,
  -16,-14,-18, -9, -9,-18,-14,-16,
   -9, -4,-18,-16,-16,-18, -4, -9,
];

// rook square table, middlegame half: fitted (`ADR-0067`). start (prior): 20 on the seventh rank, else 0, both halves.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const ROOK_MG: readonly number[] = [
   16,  0,  5, 12, 12,  5,  0, 16,
   28, 25, 59, 55, 55, 59, 25, 28,
    8, 20, 28, 16, 16, 28, 20,  8,
  -27, -4,  0,  4,  4,  0, -4,-27,
  -41, -5,-27,-23,-23,-27, -5,-41,
  -30,-14,-21,-17,-17,-21,-14,-30,
  -51,-18,-16,-11,-11,-16,-18,-51,
  -38,-28,-18, -9, -9,-18,-28,-38,
];

// rook square table, endgame half: fitted (`ADR-0067`). start (prior): 20 on the seventh rank, else 0, both halves.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const ROOK_EG: readonly number[] = [
   42, 23, 17, 21, 21, 17, 23, 42,
   29, 17, 13, 14, 14, 13, 17, 29,
   39, 17, 19, 10, 10, 19, 17, 39,
   18,  1,  5, 16, 16,  5,  1, 18,
   -4, -8, -3,  4,  4, -3, -8, -4,
   -2, -9,  7, -4, -4,  7, -9, -2,
  -12,-11, -8,-18,-18, -8,-11,-12,
   12, -6,  4, -6, -6,  4, -6, 12,
];

// queen square table, middlegame half: fitted (`ADR-0067`). start (prior): `5 × ring − 5`, both halves.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const QUEEN_MG: readonly number[] = [
  -14, 10,  4,  6,  6,  4, 10,-14,
   14,  3, 16,  8,  8, 16,  3, 14,
   30, 36, 22, 18, 18, 22, 36, 30,
   48,  5, 10, -8, -8, 10,  5, 48,
   -7,  3,-11, -2, -2,-11,  3, -7,
   -3,-20, -9,-23,-23, -9,-20, -3,
  -10, -9, -7, -2, -2, -7, -9,-10,
   -2, -9,-13,  2,  2,-13, -9, -2,
];

// queen square table, endgame half: fitted (`ADR-0067`). start (prior): `5 × ring − 5`, both halves.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const QUEEN_EG: readonly number[] = [
   -8,-21, -6,  9,  9, -6,-21, -8,
  -10, -2,  0, 18, 18,  0, -2,-10,
   -6, 10,  0,  4,  4,  0, 10, -6,
   -8,  4,  3, 14, 14,  3,  4, -8,
   -6,-21,  6,-13,-13,  6,-21, -6,
   -8, -8, 13, 17, 17, 13, -8, -8,
  -17,-19,-22,-23,-23,-22,-19,-17,
  -13,-19,-27,-28,-28,-27,-19,-13,
];

// king square table, middlegame half: fitted (`ADR-0067`). start (prior): mg `max(−50, −10 × d − 10 × (R − 1))`, d the file distance to the b- or g-file; eg `40 − 15 × m`, m the Manhattan distance to the centre.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const KING_MG: readonly number[] = [
  -49,-46,-48,-50,-50,-48,-46,-49,
  -51,-43,-47,-50,-50,-47,-43,-51,
  -51,-42,-49,-48,-48,-49,-42,-51,
  -54,-42,-48,-53,-53,-48,-42,-54,
  -47,-43,-46,-57,-57,-46,-43,-47,
  -46,-33,-58,-69,-69,-58,-33,-46,
    6,  0,-22,-91,-91,-22,  0,  6,
   21, 34, 17, 13, 13, 17, 34, 21,
];

// king square table, endgame half: fitted (`ADR-0067`). start (prior): mg `max(−50, −10 × d − 10 × (R − 1))`, d the file distance to the b- or g-file; eg `40 − 15 × m`, m the Manhattan distance to the centre.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const KING_EG: readonly number[] = [
   -51, -24, -10,   2,   2, -10, -24, -51,
   -34,   7,  15,  22,  22,  15,   7, -34,
   -15,  42,  44,  49,  49,  44,  42, -15,
     4,  27,  54,  62,  62,  54,  27,   4,
     0,  15,  42,  53,  53,  42,  15,   0,
   -30, -15,   4,  19,  19,   4, -15, -30,
   -59, -42, -37,  -9,  -9, -37, -42, -59,
  -113, -68, -62, -53, -53, -62, -68,-113,
];

/** The six piece-square tables, by piece. */
export const PST = {
  pawn: { mg: PAWN_MG, eg: PAWN_EG },
  knight: { mg: KNIGHT_MG, eg: KNIGHT_EG },
  bishop: { mg: BISHOP_MG, eg: BISHOP_EG },
  rook: { mg: ROOK_MG, eg: ROOK_EG },
  queen: { mg: QUEEN_MG, eg: QUEEN_EG },
  king: { mg: KING_MG, eg: KING_EG },
} as const satisfies Record<string, MgEg<readonly number[]>>;

/**
 * Passed pawns (ABC-082), by rank counted from the pawn's OWN side (index 1 = its starting rank,
 * 6 = one step from promotion; 0 and 7 are never read). Fitted, each ≥ 0 (`ADR-0067` d6). start
 * (prior): mg 5 10 20 35 60 100, eg `2 ×` the middlegame bonus.
 */
export const PASSED: MgEg<readonly number[]> = {
  mg: [0, 0, 0, 0, 18, 60, 158, 0],
  eg: [0, 0, 35, 34, 96, 137, 155, 0],
};

/**
 * E4a (`ABC-271`, `ADR-0070`): passed pawns read the kings and the path. Endgame terms, indexed like
 * `PASSED` by the passer's OWN rank R (1 = its starting rank, 6 = one step from promotion; 0 and 7
 * are never read). Only the frontmost passer of each file is read. Q is its queening square, d the
 * Chebyshev distance (king steps). Every middlegame half is 0, at the build and at every pull: the
 * evaluation skips these terms at phase 24, which is exact only while those halves are 0.
 *
 * KING_ENEMY / KING_OWN: eg += `KING_ENEMY[R]` × min(d(enemy king, Q), 5) − `KING_OWN[R]` ×
 * min(d(own king, Q), 5). Rule: start (prior): 0. The rule (below) was probed and not shipped
 * (`ADR-0070`): `PASSED.eg[R] / 10` and `floor(PASSED.eg[R] / 20)`.
 */
export const PASSED_KING_ENEMY: MgEg<readonly number[]> = {
  mg: [0, 0, 0, 0, 0, 0, 0, 0],
  eg: [0, 5, 10, 16, 28, 47, 63, 0],
};
export const PASSED_KING_OWN: MgEg<readonly number[]> = {
  mg: [0, 0, 0, 0, 0, 0, 0, 0],
  eg: [0, 0, 3, 6, 24, 33, 52, 0],
};

/**
 * E4a's free path: eg += `PASSED_FREE[R]` when every square ahead of the passer, up to and including
 * Q, is empty. A piece of either colour blocks, a king included; attacked squares are not read.
 * Rule: start (prior): 0. The rule (below) was probed and not shipped (`ADR-0070`): `PASSED.eg[R] / 2`.
 */
export const PASSED_FREE: MgEg<readonly number[]> = {
  mg: [0, 0, 0, 0, 0, 0, 0, 0],
  eg: [0, 45, 17, 29, 46, 49, 113, 0],
};

/**
 * E4a's unstoppable passer, the rule of the square: at phase 0 only, a passer with a free path whose
 * moves < d(defending king, Q) − (1 if the defender is to move), where moves = 5 from the start rank
 * (the double step), else 7 − R; d is not capped. Added once per side, however many such passers.
 * Rule: start (prior): 0. The rule (below) was probed and not shipped (`ADR-0070`): `Q − (P +
 * PASSED.eg[6] + PASSED_FREE.eg[6] + 5 × PASSED_KING_ENEMY.eg[6])` = 400. Held at 0 through the
 * second pull (`ADR-0070` decision 7): a later attempt with its own PREREG gives it a value.
 */
export const PASSED_UNSTOPPABLE: MgEg<number> = { mg: 0, eg: 0 };

/**
 * ABC-082's other two pawn terms. DOUBLED: per pawn beyond the first on a file. ISOLATED: per pawn
 * with no friendly pawn on either adjacent file. Fitted penalties, each ≥ 0. start (prior): 15, 10.
 */
export const DOUBLED: MgEg<number> = { mg: 0, eg: 0 };
export const ISOLATED: MgEg<number> = { mg: 15, eg: 23 };

/**
 * ABC-083's king safety, per file of the king's own file and the files either side of it. SHELTER:
 * no own pawn one or two ranks ahead of the king on that file. FILE_HALF_OPEN: no own pawn on the
 * file, an enemy pawn on it. FILE_OPEN: no pawn of either colour on the file. Fitted penalties, each
 * ≥ 0. start (prior): 15, 10, 20.
 */
export const KING_SHELTER_MISSING: MgEg<number> = { mg: 0, eg: 0 };
export const KING_FILE_HALF_OPEN: MgEg<number> = { mg: 0, eg: 14 };
export const KING_FILE_OPEN: MgEg<number> = { mg: 41, eg: 14 };

/**
 * E3a's queen-on king safety (`ABC-270`, `ADR-0068`): while the ENEMY has at least one queen, each
 * pair is added, per file, to the matching king-file term above (shelter, half-open, open). The
 * pairs are additive, not a factor, so the tuner fits each one as a feature: the king's exposure
 * count × the enemy-queen flag (`ADR-0067` decision 4). Fitted: mg ≥ 0; eg held at 0 at the first
 * pull (`ADR-0067` d6's dated line). start (prior): 0.
 */
export const KING_SHELTER_MISSING_QUEEN: MgEg<number> = { mg: 15, eg: 0 };
export const KING_FILE_HALF_OPEN_QUEEN: MgEg<number> = { mg: 30, eg: 0 };
export const KING_FILE_OPEN_QUEEN: MgEg<number> = { mg: 0, eg: 0 };

/**
 * ABC-083's mobility: centipawns per square a non-pawn piece reaches, the total clamped to
 * ±`MOBILITY_CAP` (frozen), so mobility can never outvote a minor piece. Fitted weight, ≥ 0. start
 * (prior): 4.
 */
export const MOBILITY_WEIGHT: MgEg<number> = { mg: 4, eg: 9 };
export const MOBILITY_CAP: MgEg<number> = { mg: 100, eg: 100 };
