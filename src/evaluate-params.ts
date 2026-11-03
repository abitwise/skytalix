/**
 * The evaluation's parameter table (`ABC-269`, `ADR-0064` decision 4): every term as a middlegame
 * and an endgame half. DATA ONLY: no logic and no imports. `src/evaluate.ts` imports it and derives
 * its flat lookup arrays from it once, at load. This file is the seam the tuner (E2, `ABC-239`)
 * rewrites, so its diff can be data only.
 *
 * At E1 only two terms have halves that differ, each by a stated rule (`ADR-0064` decision 3):
 * the king's square table (endgame half `40 − 15 m`) and the passed pawns (endgame half `2 ×` the
 * middlegame bonus). Every other endgame half equals its middlegame half, written out so E2 can
 * move it; E1 hand-writes no endgame value without a rule. `src/evaluate.ts` reads the middlegame
 * half of every term whose halves are equal (decision 6: only the terms whose halves differ enter
 * the blend), and `src/evaluate.taper.test.ts` holds every such pair equal.
 *
 * Every value is this project's own, each made by the rule written above it (`ADR-0048`). The rule
 * stays in the comment until E2 replaces the value; E2's method ADR then owns this file's
 * provenance line.
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
 * Centipawn value per piece type, indexed by `pieceType`. The king is 0: both sides always have
 * exactly one, so any value cancels, and a finite one would only invite a search to "win" it.
 *
 * Rule: the classical scale of the chess primers, P 1, N 3, B 3, R 5, Q 9 pawns, times 100, plus
 * 25 on each minor piece, so that one minor outweighs three pawns. Bishop and knight are equal:
 * the bishop's wider reach is paid by mobility (ABC-083). Endgame half: equal (no rule yet).
 */
export const MATERIAL: MgEg<readonly number[]> = {
  mg: [0, 100, 325, 325, 500, 900, 0],
  eg: [0, 100, 325, 325, 500, 900, 0],
};

// Rule: `2 × e × (R − 2)`, and 0 on ranks 1 and 8. A pawn gains as it advances, more on the
// central files. Shelter is left to king safety (ABC-083).
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const PAWN_MG: readonly number[] = [
      0,  0,  0,  0,  0,  0,  0,  0,
      0, 10, 20, 30, 30, 20, 10,  0,
      0,  8, 16, 24, 24, 16,  8,  0,
      0,  6, 12, 18, 18, 12,  6,  0,
      0,  4,  8, 12, 12,  8,  4,  0,
      0,  2,  4,  6,  6,  4,  2,  0,
      0,  0,  0,  0,  0,  0,  0,  0,
      0,  0,  0,  0,  0,  0,  0,  0,
];

// Endgame half: equal to the middlegame half (no rule yet; E2's to move).
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const PAWN_EG: readonly number[] = [
      0,  0,  0,  0,  0,  0,  0,  0,
      0, 10, 20, 30, 30, 20, 10,  0,
      0,  8, 16, 24, 24, 16,  8,  0,
      0,  6, 12, 18, 18, 12,  6,  0,
      0,  4,  8, 12, 12,  8,  4,  0,
      0,  2,  4,  6,  6,  4,  2,  0,
      0,  0,  0,  0,  0,  0,  0,  0,
      0,  0,  0,  0,  0,  0,  0,  0,
];

// Rule: `10 × n − 50`, where n is the number of knight moves from the square on an empty board
// (2 … 8). A knight is worth its reach.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const KNIGHT_MG: readonly number[] = [
    -30,-20,-10,-10,-10,-10,-20,-30,
    -20,-10, 10, 10, 10, 10,-10,-20,
    -10, 10, 30, 30, 30, 30, 10,-10,
    -10, 10, 30, 30, 30, 30, 10,-10,
    -10, 10, 30, 30, 30, 30, 10,-10,
    -10, 10, 30, 30, 30, 30, 10,-10,
    -20,-10, 10, 10, 10, 10,-10,-20,
    -30,-20,-10,-10,-10,-10,-20,-30,
];

// Endgame half: equal to the middlegame half (no rule yet; E2's to move).
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const KNIGHT_EG: readonly number[] = [
    -30,-20,-10,-10,-10,-10,-20,-30,
    -20,-10, 10, 10, 10, 10,-10,-20,
    -10, 10, 30, 30, 30, 30, 10,-10,
    -10, 10, 30, 30, 30, 30, 10,-10,
    -10, 10, 30, 30, 30, 30, 10,-10,
    -10, 10, 30, 30, 30, 30, 10,-10,
    -20,-10, 10, 10, 10, 10,-10,-20,
    -30,-20,-10,-10,-10,-10,-20,-30,
];

// Rule: `5 × (n − 9)`, where n is the number of squares on the square's diagonals on an empty
// board (7 … 13); this equals `10 × ring − 10`. A bishop is worth its reach.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const BISHOP_MG: readonly number[] = [
    -10,-10,-10,-10,-10,-10,-10,-10,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0, 10, 10, 10, 10,  0,-10,
    -10,  0, 10, 20, 20, 10,  0,-10,
    -10,  0, 10, 20, 20, 10,  0,-10,
    -10,  0, 10, 10, 10, 10,  0,-10,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,-10,-10,-10,-10,-10,-10,-10,
];

// Endgame half: equal to the middlegame half (no rule yet; E2's to move).
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const BISHOP_EG: readonly number[] = [
    -10,-10,-10,-10,-10,-10,-10,-10,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0, 10, 10, 10, 10,  0,-10,
    -10,  0, 10, 20, 20, 10,  0,-10,
    -10,  0, 10, 20, 20, 10,  0,-10,
    -10,  0, 10, 10, 10, 10,  0,-10,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,-10,-10,-10,-10,-10,-10,-10,
];

// Rule: 20 on the seventh rank (`R = 7`), else 0. Open files are left to mobility, which counts
// a rook's reach along them.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const ROOK_MG: readonly number[] = [
      0,  0,  0,  0,  0,  0,  0,  0,
     20, 20, 20, 20, 20, 20, 20, 20,
      0,  0,  0,  0,  0,  0,  0,  0,
      0,  0,  0,  0,  0,  0,  0,  0,
      0,  0,  0,  0,  0,  0,  0,  0,
      0,  0,  0,  0,  0,  0,  0,  0,
      0,  0,  0,  0,  0,  0,  0,  0,
      0,  0,  0,  0,  0,  0,  0,  0,
];

// Endgame half: equal to the middlegame half (no rule yet; E2's to move).
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const ROOK_EG: readonly number[] = [
      0,  0,  0,  0,  0,  0,  0,  0,
     20, 20, 20, 20, 20, 20, 20, 20,
      0,  0,  0,  0,  0,  0,  0,  0,
      0,  0,  0,  0,  0,  0,  0,  0,
      0,  0,  0,  0,  0,  0,  0,  0,
      0,  0,  0,  0,  0,  0,  0,  0,
      0,  0,  0,  0,  0,  0,  0,  0,
      0,  0,  0,  0,  0,  0,  0,  0,
];

// Rule: `5 × ring − 5`. A small pull to the centre.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const QUEEN_MG: readonly number[] = [
     -5, -5, -5, -5, -5, -5, -5, -5,
     -5,  0,  0,  0,  0,  0,  0, -5,
     -5,  0,  5,  5,  5,  5,  0, -5,
     -5,  0,  5, 10, 10,  5,  0, -5,
     -5,  0,  5, 10, 10,  5,  0, -5,
     -5,  0,  5,  5,  5,  5,  0, -5,
     -5,  0,  0,  0,  0,  0,  0, -5,
     -5, -5, -5, -5, -5, -5, -5, -5,
];

// Endgame half: equal to the middlegame half (no rule yet; E2's to move).
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const QUEEN_EG: readonly number[] = [
     -5, -5, -5, -5, -5, -5, -5, -5,
     -5,  0,  0,  0,  0,  0,  0, -5,
     -5,  0,  5,  5,  5,  5,  0, -5,
     -5,  0,  5, 10, 10,  5,  0, -5,
     -5,  0,  5, 10, 10,  5,  0, -5,
     -5,  0,  5,  5,  5,  5,  0, -5,
     -5,  0,  0,  0,  0,  0,  0, -5,
     -5, -5, -5, -5, -5, -5, -5, -5,
];

// Rule: `max(−50, −10 × d − 10 × (R − 1))`, where d is the file distance to the nearer of the b-
// and g-files. The castled squares b1 and g1 are home (0); each file toward the centre and each
// rank up costs 10. The king hides.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const KING_MG: readonly number[] = [
    -50,-50,-50,-50,-50,-50,-50,-50,
    -50,-50,-50,-50,-50,-50,-50,-50,
    -50,-50,-50,-50,-50,-50,-50,-50,
    -50,-40,-50,-50,-50,-50,-40,-50,
    -40,-30,-40,-50,-50,-40,-30,-40,
    -30,-20,-30,-40,-40,-30,-20,-30,
    -20,-10,-20,-30,-30,-20,-10,-20,
    -10,  0,-10,-20,-20,-10,  0,-10,
];

// Rule (`ADR-0064` decision 3, the `ADR-0031` addendum's): `40 − 15 × m`, where m is the Manhattan
// distance to the nearest of d4, e4, d5 and e5: +40 in the centre to −50 in a corner. The king walks.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const KING_EG: readonly number[] = [
    -50,-35,-20, -5, -5,-20,-35,-50,
    -35,-20, -5, 10, 10, -5,-20,-35,
    -20, -5, 10, 25, 25, 10, -5,-20,
     -5, 10, 25, 40, 40, 25, 10, -5,
     -5, 10, 25, 40, 40, 25, 10, -5,
    -20, -5, 10, 25, 25, 10, -5,-20,
    -35,-20, -5, 10, 10, -5,-20,-35,
    -50,-35,-20, -5, -5,-20,-35,-50,
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
 * 6 = one step from promotion; 0 and 7 are never read).
 *
 * Middlegame half: hand-tuned and kept modest on the early ranks, where a large bonus would eat
 * `QE-G3`'s queen-for-a-pawn margin (both black pawns there are passed). Endgame half
 * (`ADR-0064` decision 3): `2 ×` the middlegame bonus.
 */
export const PASSED: MgEg<readonly number[]> = {
  mg: [0, 5, 10, 20, 35, 60, 100, 0],
  eg: [0, 10, 20, 40, 70, 120, 200, 0],
};

/**
 * ABC-082's other two pawn terms. DOUBLED: per pawn beyond the first on a file. ISOLATED: per pawn
 * with no friendly pawn on either adjacent file. Together they stay inside `A2`'s 50 cp cap for
 * two pawns doubled on one file (15 + 2 × 10 = 35). Endgame halves: equal (no rule yet).
 */
export const DOUBLED: MgEg<number> = { mg: 15, eg: 15 };
export const ISOLATED: MgEg<number> = { mg: 10, eg: 10 };

/**
 * ABC-083's king safety, per file of the king's own file and the files either side of it. SHELTER:
 * no own pawn one or two ranks ahead of the king on that file. FILE_HALF_OPEN: no own pawn on the
 * file, an enemy pawn on it. FILE_OPEN: no pawn of either colour on the file. Endgame halves:
 * equal (king safety by phase is E3's, `ADR-0064` decision 10).
 */
export const KING_SHELTER_MISSING: MgEg<number> = { mg: 15, eg: 15 };
export const KING_FILE_HALF_OPEN: MgEg<number> = { mg: 10, eg: 10 };
export const KING_FILE_OPEN: MgEg<number> = { mg: 20, eg: 20 };

/**
 * E3a's queen-on king safety (`ABC-270`, `ADR-0068`): while the ENEMY has at least one queen, each
 * pair is added, per file, to the matching king-file term above (shelter, half-open, open). The
 * pairs are additive, not a factor, so the tuner fits each one as a feature: the king's exposure
 * count × the enemy-queen flag (`ADR-0067` decision 4).
 *
 * Rule: start (prior): 0. The `ADR-0031` A1 rule, 2 × the base pair (× 3 in all), was probed and
 * not shipped (`ADR-0068`). At 0 the evaluation is the one before `ABC-270`, bit for bit.
 */
export const KING_SHELTER_MISSING_QUEEN: MgEg<number> = { mg: 0, eg: 0 };
export const KING_FILE_HALF_OPEN_QUEEN: MgEg<number> = { mg: 0, eg: 0 };
export const KING_FILE_OPEN_QUEEN: MgEg<number> = { mg: 0, eg: 0 };

/**
 * ABC-083's mobility: centipawns per square a non-pawn piece reaches, the total clamped to
 * ±`MOBILITY_CAP`, so mobility can never outvote a minor piece. Endgame halves: equal (no rule yet).
 */
export const MOBILITY_WEIGHT: MgEg<number> = { mg: 4, eg: 4 };
export const MOBILITY_CAP: MgEg<number> = { mg: 100, eg: 100 };
