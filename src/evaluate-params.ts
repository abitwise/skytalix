/**
 * The evaluation's parameter table (`ABC-269`, `ADR-0064` decision 4): every term as a middlegame
 * and an endgame half. DATA ONLY: no logic and no imports. `src/evaluate.ts` imports it and derives
 * its packed lookup arrays from it once, at load.
 *
 * TUNED by `tools/tune` (`ADR-0067`, `ABC-239`). Written by `tools/tune/tune.ts emit`; do not edit
 * by hand. Re-run `extract`, `fit` and `emit` on the base table to reproduce it byte for byte.
 * - tool: tools/tune at commit 9eeb03145da137f810ceebdb9297e676ca3f9406; values sha256 59c90fa300b297791cc97a7fc94cef5c5b38db7f20382877b921b8596f64b3c9
 * - base table: src/evaluate-params.ts sha256 cdc7de8327a7793c9e0de6dedf95871cc63d57ea8764d2c661e34f31e4a711da (E1's rule-made values)
 * - data manifest sha256 40b62825bdbbc599ee8aa8a6f7c6c566103e7df895a384a92130e4ac79204c6d (19 files; own PGNs
 *   repository-relative, the Lichess export by URL, bytes and sha256)
 * - Lichess: https://database.lichess.org/standard/lichess_db_standard_rated_2017-03.pgn.zst, 2169142067 bytes, sha256 b319297e9270285635d615cbcd19a9b0d44747be3ff91d5b3eac41175b794320;
 *   licence "Lichess database export, CC0 (database.lichess.org)"; training only; comments never read
 * - own games: players skytalix / base; own.games.drop.duplicate 608, own.games.drop.player 1609, own.games.drop.result 0, own.games.kept 3531, own.games.read 5748
 * - own positions: own.pos.drop.book 6695, own.pos.drop.check 29463, own.pos.drop.mate 15756, own.pos.drop.noisy 86884, own.pos.kept 264026, own.pos.seen 402824; 1462 validation keys seen in training removed
 * - openings 100 (validation 19); quiet rule: quiesce(full window) with { evasions: true, quietPromotions: true, taper: true } (src/search.ts RULES_TAPERED at main 441c547e)
 * - Lichess game filters: li.g1.event 0, li.g2.timecontrol 3175054, li.g3.elo 7769697, li.g4.termination 112849, li.g5.result 0, li.g6.bot 0, li.g7.reachReplay 289145, li.g7.replay 0, li.g8.duplicate 278, li.games.kept 288867, li.games.read 11346745; games read 11346745, kept 288867
 * - Lichess position rules: li.p1.ply 4613170, li.p2.sample 14420734, li.p3.check 148675, li.p4.noisy 581702, li.p6.keys 1274381, li.p6.occurrences 1320452, li.p7.leakage 19, li.p8.cap 274362, li.pos.seen 21084733; rule 2 fnv1a32("ABC-239/lichess/v1\n" + key) mod 8 = 0; cap 1000000
 * - rows: own training 159044 (inner validation 46464), own validation 41742, Lichess 1000000
 * - split: fnv1a32("ABC-239/split/v1\n" + start FEN) mod 5 = 0 validation; inner fnv1a32("ABC-239/inner/v1\n" + start FEN) mod 4 = 0
 * - K_own 0.593951816371731; K_lichess 0.825960786139895; own weight 0.5; configuration C-F; λ 1e-8
 * - outer validation cross-entropy base 0.591514 → fit 0.585921 (0.9905 ×);
 *   training 0.589834 → 0.584595
 * - frozen (d6): material, PHASE_WEIGHT, PHASE_MG / PHASE_EG, MOBILITY_CAP
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
   10, 15, 22, 13, 13, 22, 15, 10,
   18, 29, 58, 35, 35, 58, 29, 18,
   -6, -3,  3, 13, 13,  3, -3, -6,
  -34,-24,-17, -2, -2,-17,-24,-34,
  -37,-29,-22,-13,-13,-22,-29,-37,
  -40,-31,-24,-31,-31,-24,-31,-40,
    0,  0,  0,  0,  0,  0,  0,  0,
];

// pawn square table, endgame half: fitted (`ADR-0067`). start (prior): `2 × e × (R − 2)`, and 0 on ranks 1 and 8, both halves.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const PAWN_EG: readonly number[] = [
    0,  0,  0,  0,  0,  0,  0,  0,
   16, 48, 15,-19,-19, 15, 48, 16,
   31, 18, 29,-30,-30, 29, 18, 31,
   39, 11, 25,  1,  1, 25, 11, 39,
   21, 13, 17, -2, -2, 17, 13, 21,
    9,  3,  8, 24, 24,  8,  3,  9,
   28, 19, 18,  8,  8, 18, 19, 28,
    0,  0,  0,  0,  0,  0,  0,  0,
];

// knight square table, middlegame half: fitted (`ADR-0067`). start (prior): `10 × n − 50`, n the knight moves from the square on an empty board, both halves.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const KNIGHT_MG: readonly number[] = [
  -59,-15,-13,-11,-11,-13,-15,-59,
  -24,-14, 20, 21, 21, 20,-14,-24,
    2, 14, 42, 43, 43, 42, 14,  2,
   19, 18, 39, 19, 19, 39, 18, 19,
  -13, 11,  3,  1,  1,  3, 11,-13,
  -32,-25,-19,  3,  3,-19,-25,-32,
  -43,-48,-16,-22,-22,-16,-48,-43,
  -40,-52,-40,-37,-37,-40,-52,-40,
];

// knight square table, endgame half: fitted (`ADR-0067`). start (prior): `10 × n − 50`, n the knight moves from the square on an empty board, both halves.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const KNIGHT_EG: readonly number[] = [
  -35,-13, -7, -2, -2, -7,-13,-35,
  -20, -2, 10, -2, -2, 10, -2,-20,
   -2, 10, 14,  0,  0, 14, 10, -2,
   -5, 15, 16, 19, 19, 16, 15, -5,
  -24, 12,  9, 17, 17,  9, 12,-24,
  -19, -3, -7, 21, 21, -7, -3,-19,
   -5, -4, 12, -3, -3, 12, -4, -5,
  -32,-22,-15, -7, -7,-15,-22,-32,
];

// bishop square table, middlegame half: fitted (`ADR-0067`). start (prior): `5 × (n − 9)`, n the squares on the square's diagonals on an empty board, both halves.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const BISHOP_MG: readonly number[] = [
   -8, -5,-13,-10,-10,-13, -5, -8,
    1, -5, 22,  4,  4, 22, -5,  1,
   26, 25, 21, 40, 40, 21, 25, 26,
    0,  6, 34, 54, 54, 34,  6,  0,
    4,  8, 11, 38, 38, 11,  8,  4,
   17, 11, 12,  8,  8, 12, 11, 17,
    4, 16, 14,  3,  3, 14, 16,  4,
  -23, 12, -1,-15,-15, -1, 12,-23,
];

// bishop square table, endgame half: fitted (`ADR-0067`). start (prior): `5 × (n − 9)`, n the squares on the square's diagonals on an empty board, both halves.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const BISHOP_EG: readonly number[] = [
    9, 10, -9, -7, -7, -9, 10,  9,
   -7, -2,-23, 14, 14,-23, -2, -7,
    7, -7,  0,  1,  1,  0, -7,  7,
   -3, -7, -1,  0,  0, -1, -7, -3,
   -7, -2,-12,-27,-27,-12, -2, -7,
   -1,-14,  3,  7,  7,  3,-14, -1,
  -23,-12,-22, -9, -9,-22,-12,-23,
   -7, -9,-14,-20,-20,-14, -9, -7,
];

// rook square table, middlegame half: fitted (`ADR-0067`). start (prior): 20 on the seventh rank, else 0, both halves.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const ROOK_MG: readonly number[] = [
   16, -1,  4, 11, 11,  4, -1, 16,
   30, 20, 55, 54, 54, 55, 20, 30,
    6, 19, 27, 16, 16, 27, 19,  6,
  -27,  2, -2,  8,  8, -2,  2,-27,
  -40, -8,-30,-24,-24,-30, -8,-40,
  -32,-18,-25,-17,-17,-25,-18,-32,
  -49,-19,-17,-14,-14,-17,-19,-49,
  -39,-28,-18, -9, -9,-18,-28,-39,
];

// rook square table, endgame half: fitted (`ADR-0067`). start (prior): 20 on the seventh rank, else 0, both halves.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const ROOK_EG: readonly number[] = [
   32, 17, 11, 12, 12, 11, 17, 32,
   21, 17, 11,  5,  5, 11, 17, 21,
   29, 13, 12,  1,  1, 12, 13, 29,
   10, -3,  4, 12, 12,  4, -3, 10,
  -10,-14, -5, -2, -2, -5,-14,-10,
  -10,-12,  2,-12,-12,  2,-12,-10,
  -15,-13,-11,-22,-22,-11,-13,-15,
    5, -7, -1,-11,-11, -1, -7,  5,
];

// queen square table, middlegame half: fitted (`ADR-0067`). start (prior): `5 × ring − 5`, both halves.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const QUEEN_MG: readonly number[] = [
  -14,  8,  3,  6,  6,  3,  8,-14,
   18,  7, 18,  5,  5, 18,  7, 18,
   32, 41, 21, 17, 17, 21, 41, 32,
   50,  4, 14, -7, -7, 14,  4, 50,
   -6,  5,-10, -4, -4,-10,  5, -6,
   -4,-18,-11,-24,-24,-11,-18, -4,
   -8, -7, -5,  0,  0, -5, -7, -8,
   -4,-10,-13,  3,  3,-13,-10, -4,
];

// queen square table, endgame half: fitted (`ADR-0067`). start (prior): `5 × ring − 5`, both halves.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const QUEEN_EG: readonly number[] = [
  -10,-20, -9, 10, 10, -9,-20,-10,
   -9, -1,  0, 18, 18,  0, -1, -9,
   -6, 14,  1,  7,  7,  1, 14, -6,
   -5,  5,  5, 18, 18,  5,  5, -5,
   -4,-18,  2,-11,-11,  2,-18, -4,
   -7, -9, 14, 20, 20, 14, -9, -7,
  -14,-17,-23,-20,-20,-23,-17,-14,
  -14,-18,-27,-27,-27,-27,-18,-14,
];

// king square table, middlegame half: fitted (`ADR-0067`). start (prior): mg `max(−50, −10 × d − 10 × (R − 1))`, d the file distance to the b- or g-file; eg `40 − 15 × m`, m the Manhattan distance to the centre.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const KING_MG: readonly number[] = [
  -49,-44,-47,-49,-49,-47,-44,-49,
  -49,-41,-44,-48,-48,-44,-41,-49,
  -52,-42,-49,-48,-48,-49,-42,-52,
  -55,-42,-48,-50,-50,-48,-42,-55,
  -50,-45,-44,-53,-53,-44,-45,-50,
  -52,-34,-50,-53,-53,-50,-34,-52,
    4, -4,-25,-93,-93,-25, -4,  4,
   21, 32,  8,  4,  4,  8, 32, 21,
];

// king square table, endgame half: fitted (`ADR-0067`). start (prior): mg `max(−50, −10 × d − 10 × (R − 1))`, d the file distance to the b- or g-file; eg `40 − 15 × m`, m the Manhattan distance to the centre.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const KING_EG: readonly number[] = [
   -47, -12,  -3,   6,   6,  -3, -12, -47,
   -24,  28,  30,  30,  30,  30,  28, -24,
   -18,  41,  43,  45,  45,  43,  41, -18,
    -7,  19,  43,  59,  59,  43,  19,  -7,
   -11,   5,  34,  51,  51,  34,   5, -11,
   -39, -28,   3,  22,  22,   3, -28, -39,
   -72, -45, -35,   4,   4, -35, -45, -72,
  -123, -75, -51, -33, -33, -51, -75,-123,
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
  mg: [0, 0, 0, 0, 16, 49, 98, 0],
  eg: [0, 30, 52, 70, 93, 156, 219, 0],
};

/**
 * ABC-082's other two pawn terms. DOUBLED: per pawn beyond the first on a file. ISOLATED: per pawn
 * with no friendly pawn on either adjacent file. Fitted penalties, each ≥ 0. start (prior): 15, 10.
 */
export const DOUBLED: MgEg<number> = { mg: 4, eg: 7 };
export const ISOLATED: MgEg<number> = { mg: 17, eg: 18 };

/**
 * ABC-083's king safety, per file of the king's own file and the files either side of it. SHELTER:
 * no own pawn one or two ranks ahead of the king on that file. FILE_HALF_OPEN: no own pawn on the
 * file, an enemy pawn on it. FILE_OPEN: no pawn of either colour on the file. Fitted penalties, each
 * ≥ 0. start (prior): 15, 10, 20.
 */
export const KING_SHELTER_MISSING: MgEg<number> = { mg: 10, eg: 0 };
export const KING_FILE_HALF_OPEN: MgEg<number> = { mg: 22, eg: 0 };
export const KING_FILE_OPEN: MgEg<number> = { mg: 40, eg: 15 };

/**
 * ABC-083's mobility: centipawns per square a non-pawn piece reaches, the total clamped to
 * ±`MOBILITY_CAP` (frozen), so mobility can never outvote a minor piece. Fitted weight, ≥ 0. start
 * (prior): 4.
 */
export const MOBILITY_WEIGHT: MgEg<number> = { mg: 4, eg: 9 };
export const MOBILITY_CAP: MgEg<number> = { mg: 100, eg: 100 };
