/**
 * The evaluation's parameter table (`ABC-269`, `ADR-0064` decision 4): every term as a middlegame
 * and an endgame half. DATA ONLY: no logic and no imports. `src/evaluate.ts` imports it and derives
 * its packed lookup arrays from it once, at load.
 *
 * TUNED by `tools/tune` (`ADR-0067`, `ABC-239`). Written by `tools/tune/tune.ts emit`; do not edit
 * by hand. Re-run `extract`, `fit` and `emit` on the base table to reproduce it byte for byte.
 * - tool: tools/tune at commit 8c03b71334eed45796bbc0f8f918d7e6813fee2d; values sha256 0a0284ca6ff656536b924dfdbfd8ce2a430da6223200163df8eda17efcd7f38a
 * - base table: src/evaluate-params.ts sha256 e2db4f4b368c5e887faea4ac812a65ca5f4578c4c102dfe4e5e683804c2f3f55 (E1's rule-made values; ABC-270's queen-on pairs at 0)
 * - data manifest sha256 c9d777ef56d395f453e50066cbc8ac3ef058d9f90039e1d6920c81738eb15934 (36 files; own PGNs
 *   repository-relative, the Lichess export by URL, bytes and sha256)
 * - Lichess: https://database.lichess.org/standard/lichess_db_standard_rated_2017-03.pgn.zst, 2169142067 bytes, sha256 b319297e9270285635d615cbcd19a9b0d44747be3ff91d5b3eac41175b794320;
 *   licence "Lichess database export, CC0 (database.lichess.org)"; training only; comments never read
 * - own games: players skytalix / base / skytalix-a / skytalix-b / sky-a / sky-b; own.games.drop.duplicate 617, own.games.drop.player 1561, own.games.drop.result 0, own.games.kept 3680, own.games.read 5858
 * - own positions: own.pos.drop.book 7009, own.pos.drop.check 31182, own.pos.drop.mate 16476, own.pos.drop.noisy 90855, own.pos.kept 277227, own.pos.seen 422749; 1518 validation keys seen in training removed
 * - openings 106 (validation 23); quiet rule: quiesce(full window) with { evasions: true, quietPromotions: true, taper: true }, no seePruning (src/search.ts RULES_TAPERED at main 441c547e; ADR-0069 d6)
 * - Lichess game filters: li.g1.event 0, li.g2.timecontrol 3175054, li.g3.elo 7769697, li.g4.termination 112849, li.g5.result 0, li.g6.bot 0, li.g7.reachReplay 289145, li.g7.replay 0, li.g8.duplicate 278, li.games.kept 288867, li.games.read 11346745; games read 11346745, kept 288867
 * - Lichess position rules: li.p1.ply 4613170, li.p2.sample 14420734, li.p3.check 148675, li.p4.noisy 581702, li.p6.keys 1274381, li.p6.occurrences 1320452, li.p7.leakage 26, li.p8.cap 274355, li.pos.seen 21084733; rule 2 fnv1a32("ABC-239/lichess/v1\n" + key) mod 8 = 0; cap 1000000
 * - rows: own training 167014 (inner validation 48280), own validation 45158, Lichess 1000000
 * - split: fnv1a32("ABC-239/split/v1\n" + start FEN) mod 5 = 0 validation; inner fnv1a32("ABC-239/inner/v1\n" + start FEN) mod 4 = 0
 * - K_own 0.6025377779813463; K_lichess 0.8259717826759976; own weight 0.5; configuration C-F; λ 1e-8
 * - outer validation cross-entropy base 0.590390 → fit 0.584768 (0.9905 ×);
 *   training 0.587977 → 0.582341
 * - frozen (d6): material, PHASE_WEIGHT, PHASE_MG / PHASE_EG, MOBILITY_CAP; the three queen-on
 *   eg halves held at 0 (d6's dated line, `ADR-0068` d8)
 * - F3 bounds (`ADR-0067` ruling (b)), 1, each Σ coef · evaluate ≤ right side:
 *   - src/evaluate.king-mobility.test.ts, "at EQUAL material too, at phase 24: the g-pawn on g6 instead of g2 scores strictly lower (ABC-270 re-find)": right side 0 strict, margin 3.5, μ 9.58e-7;
 *     a: PST.pawn[g6].mg 1, PST.pawn[g2].mg -1, KING_SHELTER_MISSING.mg -1, KING_SHELTER_MISSING_QUEEN.mg -1, MOBILITY_WEIGHT.mg 1
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
    9, 14, 25, 12, 12, 25, 14,  9,
   18,-20, 54, 32, 32, 54,-20, 18,
   -6, -2,  2, 11, 11,  2, -2, -6,
  -32,-21,-18, -2, -2,-18,-21,-32,
  -38,-26,-22,-13,-13,-22,-26,-38,
  -40,-27,-26,-32,-32,-26,-27,-40,
    0,  0,  0,  0,  0,  0,  0,  0,
];

// pawn square table, endgame half: fitted (`ADR-0067`). start (prior): `2 × e × (R − 2)`, and 0 on ranks 1 and 8, both halves.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const PAWN_EG: readonly number[] = [
    0,  0,  0,  0,  0,  0,  0,  0,
   14, 50, 15,-19,-19, 15, 50, 14,
   33, 24, 31,-29,-29, 31, 24, 33,
   44, 12, 27,  2,  2, 27, 12, 44,
   21, 14, 22, -4, -4, 22, 14, 21,
   11,  4, 13, 26, 26, 13,  4, 11,
   30, 19, 24, 10, 10, 24, 19, 30,
    0,  0,  0,  0,  0,  0,  0,  0,
];

// knight square table, middlegame half: fitted (`ADR-0067`). start (prior): `10 × n − 50`, n the knight moves from the square on an empty board, both halves.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const KNIGHT_MG: readonly number[] = [
  -60,-15,-13,-11,-11,-13,-15,-60,
  -25,-16, 22, 28, 28, 22,-16,-25,
    3, 15, 42, 46, 46, 42, 15,  3,
   15, 21, 41, 21, 21, 41, 21, 15,
  -12, 11,  6,  3,  3,  6, 11,-12,
  -31,-23,-17,  4,  4,-17,-23,-31,
  -42,-48,-13,-20,-20,-13,-48,-42,
  -40,-51,-40,-39,-39,-40,-51,-40,
];

// knight square table, endgame half: fitted (`ADR-0067`). start (prior): `10 × n − 50`, n the knight moves from the square on an empty board, both halves.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const KNIGHT_EG: readonly number[] = [
  -38,-12, -8, -4, -4, -8,-12,-38,
  -23, -6,  8,  4,  4,  8, -6,-23,
   -7, 11, 15,  2,  2, 15, 11, -7,
  -12, 11, 14, 18, 18, 14, 11,-12,
  -28, 14,  8, 15, 15,  8, 14,-28,
  -21, -7, -9, 19, 19, -9, -7,-21,
   -6, -5, 12, -3, -3, 12, -5, -6,
  -32,-21,-17,-13,-13,-17,-21,-32,
];

// bishop square table, middlegame half: fitted (`ADR-0067`). start (prior): `5 × (n − 9)`, n the squares on the square's diagonals on an empty board, both halves.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const BISHOP_MG: readonly number[] = [
   -8, -6,-13,-10,-10,-13, -6, -8,
   -1, -6, 22,  3,  3, 22, -6, -1,
   24, 24, 22, 38, 38, 22, 24, 24,
    0,  6, 31, 56, 56, 31,  6,  0,
    5,  7, 12, 38, 38, 12,  7,  5,
   17, 12, 12,  9,  9, 12, 12, 17,
    5, 18, 16,  2,  2, 16, 18,  5,
  -21, 11, -1,-16,-16, -1, 11,-21,
];

// bishop square table, endgame half: fitted (`ADR-0067`). start (prior): `5 × (n − 9)`, n the squares on the square's diagonals on an empty board, both halves.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const BISHOP_EG: readonly number[] = [
    8,  8, -8, -8, -8, -8,  8,  8,
   -8,  0,-24, 14, 14,-24,  0, -8,
    8, -7,  2,  1,  1,  2, -7,  8,
   -2, -6,  1,  2,  2,  1, -6, -2,
  -11,  2, -9,-24,-24, -9,  2,-11,
   -4,-12,  4, 10, 10,  4,-12, -4,
  -19,-12,-18, -7, -7,-18,-12,-19,
   -6, -4,-16,-14,-14,-16, -4, -6,
];

// rook square table, middlegame half: fitted (`ADR-0067`). start (prior): 20 on the seventh rank, else 0, both halves.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const ROOK_MG: readonly number[] = [
   16, -1,  5, 12, 12,  5, -1, 16,
   30, 22, 58, 57, 57, 58, 22, 30,
    7, 20, 28, 15, 15, 28, 20,  7,
  -28,  3,  0,  6,  6,  0,  3,-28,
  -43, -5,-27,-22,-22,-27, -5,-43,
  -30,-15,-21,-15,-15,-21,-15,-30,
  -49,-20,-15,-11,-11,-15,-20,-49,
  -37,-28,-17, -8, -8,-17,-28,-37,
];

// rook square table, endgame half: fitted (`ADR-0067`). start (prior): 20 on the seventh rank, else 0, both halves.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const ROOK_EG: readonly number[] = [
   34, 18, 14, 16, 16, 14, 18, 34,
   21, 15, 13, 10, 10, 13, 15, 21,
   34, 16, 15,  8,  8, 15, 16, 34,
   15,  1,  5, 15, 15,  5,  1, 15,
   -8, -9, -4,  5,  5, -4, -9, -8,
   -2, -9,  6, -6, -6,  6, -9, -2,
  -15,-11,-10,-18,-18,-10,-11,-15,
   11, -3,  5, -7, -7,  5, -3, 11,
];

// queen square table, middlegame half: fitted (`ADR-0067`). start (prior): `5 × ring − 5`, both halves.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const QUEEN_MG: readonly number[] = [
  -14,  9,  4,  5,  5,  4,  9,-14,
   15,  3, 17,  8,  8, 17,  3, 15,
   29, 36, 19, 16, 16, 19, 36, 29,
   47,  4, 11, -8, -8, 11,  4, 47,
   -8,  3,-11, -4, -4,-11,  3, -8,
   -5,-19,-10,-24,-24,-10,-19, -5,
  -12, -9, -7, -2, -2, -7, -9,-12,
   -1,-10,-14,  2,  2,-14,-10, -1,
];

// queen square table, endgame half: fitted (`ADR-0067`). start (prior): `5 × ring − 5`, both halves.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const QUEEN_EG: readonly number[] = [
  -11,-22, -8,  7,  7, -8,-22,-11,
  -12, -2, -1, 16, 16, -1, -2,-12,
   -7,  9, -1,  2,  2, -1,  9, -7,
   -9,  2,  3, 15, 15,  3,  2, -9,
   -7,-20,  4,-14,-14,  4,-20, -7,
   -7,-10, 10, 15, 15, 10,-10, -7,
  -17,-19,-24,-24,-24,-24,-19,-17,
  -13,-20,-26,-30,-30,-26,-20,-13,
];

// king square table, middlegame half: fitted (`ADR-0067`). start (prior): mg `max(−50, −10 × d − 10 × (R − 1))`, d the file distance to the b- or g-file; eg `40 − 15 × m`, m the Manhattan distance to the centre.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const KING_MG: readonly number[] = [
  -48,-44,-47,-49,-49,-47,-44,-48,
  -49,-41,-44,-48,-48,-44,-41,-49,
  -52,-42,-49,-48,-48,-49,-42,-52,
  -55,-42,-47,-51,-51,-47,-42,-55,
  -49,-45,-45,-55,-55,-45,-45,-49,
  -51,-33,-57,-66,-66,-57,-33,-51,
    6, -1,-23,-93,-93,-23, -1,  6,
   21, 34, 14, 11, 11, 14, 34, 21,
];

// king square table, endgame half: fitted (`ADR-0067`). start (prior): mg `max(−50, −10 × d − 10 × (R − 1))`, d the file distance to the b- or g-file; eg `40 − 15 × m`, m the Manhattan distance to the centre.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const KING_EG: readonly number[] = [
   -47, -13,  -2,   6,   6,  -2, -13, -47,
   -25,  27,  29,  31,  31,  29,  27, -25,
   -18,  44,  43,  46,  46,  43,  44, -18,
    -7,  17,  45,  58,  58,  45,  17,  -7,
   -11,   5,  34,  51,  51,  34,   5, -11,
   -41, -26,   0,  21,  21,   0, -26, -41,
   -66, -44, -34,   0,   0, -34, -44, -66,
  -115, -71, -56, -39, -39, -56, -71,-115,
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
  mg: [0, 0, 0, 0, 16, 55, 98, 0],
  eg: [0, 28, 52, 71, 92, 159, 219, 0],
};

/**
 * ABC-082's other two pawn terms. DOUBLED: per pawn beyond the first on a file. ISOLATED: per pawn
 * with no friendly pawn on either adjacent file. Fitted penalties, each ≥ 0. start (prior): 15, 10.
 */
export const DOUBLED: MgEg<number> = { mg: 0, eg: 9 };
export const ISOLATED: MgEg<number> = { mg: 16, eg: 20 };

/**
 * ABC-083's king safety, per file of the king's own file and the files either side of it. SHELTER:
 * no own pawn one or two ranks ahead of the king on that file. FILE_HALF_OPEN: no own pawn on the
 * file, an enemy pawn on it. FILE_OPEN: no pawn of either colour on the file. Fitted penalties, each
 * ≥ 0. start (prior): 15, 10, 20.
 */
export const KING_SHELTER_MISSING: MgEg<number> = { mg: 0, eg: 0 };
export const KING_FILE_HALF_OPEN: MgEg<number> = { mg: 0, eg: 0 };
export const KING_FILE_OPEN: MgEg<number> = { mg: 39, eg: 14 };

/**
 * E3a's queen-on king safety (`ABC-270`, `ADR-0068`): while the ENEMY has at least one queen, each
 * pair is added, per file, to the matching king-file term above (shelter, half-open, open). The
 * pairs are additive, not a factor, so the tuner fits each one as a feature: the king's exposure
 * count × the enemy-queen flag (`ADR-0067` decision 4). Fitted: mg ≥ 0; eg held at 0 at the first
 * pull (`ADR-0067` d6's dated line). start (prior): 0.
 */
export const KING_SHELTER_MISSING_QUEEN: MgEg<number> = { mg: 14, eg: 0 };
export const KING_FILE_HALF_OPEN_QUEEN: MgEg<number> = { mg: 29, eg: 0 };
export const KING_FILE_OPEN_QUEEN: MgEg<number> = { mg: 0, eg: 0 };

/**
 * ABC-083's mobility: centipawns per square a non-pawn piece reaches, the total clamped to
 * ±`MOBILITY_CAP` (frozen), so mobility can never outvote a minor piece. Fitted weight, ≥ 0. start
 * (prior): 4.
 */
export const MOBILITY_WEIGHT: MgEg<number> = { mg: 4, eg: 8 };
export const MOBILITY_CAP: MgEg<number> = { mg: 100, eg: 100 };
