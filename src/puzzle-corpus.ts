/**
 * ABC-084's TACTICAL PUZZLE CORPUS — TEST-ONLY DATA, and the home of ABC-079's shared
 * do-not-hang rows (one corpus, extended, not forked).
 *
 * `HANGING_CORPUS` is ABC-079's 24 rows, moved here byte-identical from `src/quiescence.test.ts`,
 * which imports them back: ABC-079 `A1` reads EXACTLY these 24, because its levels scale with
 * the corpus size (`floor(n/20)`) and under `ADR-0028` decision 5 a level moves only by ruling.
 * A row of it whose label depends on an evaluator margin is a fixture, re-found, never re-levelled
 * (`ADR-0028` decision 2).
 *
 * `PUZZLES` is the suite `src/puzzle-suite.test.ts` runs (ABC-084): the mates, the win-material
 * rows and then those 24, each row tagged with its source. Appending a row changes the solved
 * count, and the baseline (`src/puzzle-suite.baseline.json`) moves only in its own commit with a
 * stated reason (ABC-084 `A7`) — adding puzzles to raise the number is out of scope.
 *
 * HOW THE ANSWERS WERE SOURCED (ABC-084 `A6`) — never from this engine's own output:
 * - mate-in-2: hand-built on named mating patterns; the accepted moves are EXACTLY the first
 *   moves an exhaustive mate search over `legalMoves` finds, with no mate in 1. That search is
 *   re-run in the default lane (`src/puzzle-suite.test.ts` `A6`); it imports no search code and
 *   no evaluation.
 * - win-material: hand-built on a named motif (fork, pin, skewer, discovered attack); the
 *   accepted moves are the ones a material-only (P1 N3 B3 R5 Q9) exhaustive 4-ply search plus a
 *   capture search ranks strictly best — again over `legalMoves`, with no `src/search.ts` and no
 *   `src/evaluate.ts`. Probe and readings: `.grugops/context/ticket-to-pr-ABC-084/`.
 * - do-not-hang: ABC-079's rows, each a capture of a defended piece by a more valuable one,
 *   labelled by hand.
 *
 * Not named `*.test.ts`, so vitest does not collect it; under `src/`, so `tsc` and Biome check
 * it. No production module imports it.
 */

/** A puzzle: a position, its class, the move(s) that solve it — or the one that loses — and its source. */
export type Puzzle =
  | {
      readonly name: string;
      readonly fen: string;
      readonly kind: "mate-in-2" | "win-material";
      /** Solved when the chosen move is one of these. */
      readonly accept: readonly string[];
      readonly source: string;
    }
  | {
      readonly name: string;
      readonly fen: string;
      readonly kind: "do-not-hang";
      /** Solved when the chosen move is NOT this one. */
      readonly losing: string;
      readonly source: string;
    };

/**
 * Twenty-four positions where the side to move can capture a DEFENDED piece with a more
 * valuable one — the losing capture named on each row. Twelve with white to move, twelve their
 * colour-mirrored twins with black to move (ranks flipped, colours swapped, by hand: the
 * `mirrorPosition` helper of `src/evaluate.test.ts` is deliberately not exported).
 *
 * Every row was checked by hand for the trap that bit two earlier drafts: the side to move must
 * NOT be in check, or the losing capture is not even on the menu and the row proves nothing.
 */
// biome-ignore format: one position per row keeps the corpus readable as a table
export const HANGING_CORPUS: ReadonlyArray<{ name: string; fen: string; losing: string }> = [
  { name: "Q takes a pawn a rook defends", fen: "4k3/4r3/8/4p3/8/8/8/Q3K3 w - - 0 1", losing: "a1e5" },
  { name: "R takes a pawn the king defends", fen: "k7/p7/8/8/8/8/8/R3K3 w - - 0 1", losing: "a1a7" },
  { name: "B takes a pawn a pawn defends", fen: "4k3/8/8/3p4/4p3/8/8/1B2K3 w - - 0 1", losing: "b1e4" },
  { name: "N takes a pawn a pawn defends", fen: "4k3/8/8/4p3/3p4/8/2N5/4K3 w - - 0 1", losing: "c2d4" },
  { name: "Q takes a knight a rook defends", fen: "1r2k3/8/8/8/8/8/1n6/Q3K3 w - - 0 1", losing: "a1b2" },
  { name: "R takes a knight a pawn defends", fen: "4k3/8/8/8/2p5/3n4/8/3R1K2 w - - 0 1", losing: "d1d3" },
  { name: "Q takes a rook the king defends", fen: "k7/r7/8/8/8/8/8/Q3K3 w - - 0 1", losing: "a1a7" },
  { name: "Q takes a bishop a knight defends", fen: "4k3/8/8/8/8/3n4/1b6/Q4K2 w - - 0 1", losing: "a1b2" },
  { name: "R takes a bishop a pawn defends", fen: "4k3/8/1p6/b7/8/8/8/R3K3 w - - 0 1", losing: "a1a5" },
  // Re-found at ABC-082 (ruling …f0115510, ADR-0028 decision 2): +g7 / mirror +g2, so the recapture
  // is not a K+B v K dead draw a pawn-aware search prefers. Margin 370 / 280 cp. Level unchanged.
  { name: "R takes a pawn a bishop defends", fen: "4k3/6p1/8/8/8/b7/1p6/1R2K3 w - - 0 1", losing: "b1b2" },
  { name: "Q takes a pawn a knight defends", fen: "4k3/8/8/8/2n5/8/1p6/Q3K3 w - - 0 1", losing: "a1b2" },
  { name: "B takes a pawn a rook defends", fen: "4r1k1/8/8/8/4p3/8/8/1B2K3 w - - 0 1", losing: "b1e4" },
  { name: "mirror: q takes a pawn a rook defends", fen: "q3k3/8/8/8/4P3/8/4R3/4K3 b - - 0 1", losing: "a8e4" },
  { name: "mirror: r takes a pawn the king defends", fen: "r3k3/8/8/8/8/8/P7/K7 b - - 0 1", losing: "a8a2" },
  { name: "mirror: b takes a pawn a pawn defends", fen: "1b2k3/8/8/4P3/3P4/8/8/4K3 b - - 0 1", losing: "b8e5" },
  { name: "mirror: n takes a pawn a pawn defends", fen: "4k3/2n5/8/3P4/4P3/8/8/4K3 b - - 0 1", losing: "c7d5" },
  { name: "mirror: q takes a knight a rook defends", fen: "q3k3/1N6/8/8/8/8/8/1R2K3 b - - 0 1", losing: "a8b7" },
  { name: "mirror: r takes a knight a pawn defends", fen: "3r1k2/8/3N4/2P5/8/8/8/4K3 b - - 0 1", losing: "d8d6" },
  { name: "mirror: q takes a rook the king defends", fen: "q3k3/8/8/8/8/8/R7/K7 b - - 0 1", losing: "a8a2" },
  { name: "mirror: q takes a bishop a knight defends", fen: "q4k2/1B6/3N4/8/8/8/8/4K3 b - - 0 1", losing: "a8b7" },
  { name: "mirror: r takes a bishop a pawn defends", fen: "r3k3/8/8/8/B7/1P6/8/4K3 b - - 0 1", losing: "a8a4" },
  { name: "mirror: r takes a pawn a bishop defends", fen: "1r2k3/1P6/B7/8/8/8/6P1/4K3 b - - 0 1", losing: "b8b7" },
  { name: "mirror: q takes a pawn a knight defends", fen: "q3k3/1P6/8/2N5/8/8/8/4K3 b - - 0 1", losing: "a8b7" },
  { name: "mirror: b takes a pawn a rook defends", fen: "1b2k3/8/8/4P3/8/8/8/4R1K1 b - - 0 1", losing: "b8e5" },
];

const MATE = "ABC-084, hand-built; keys = exhaustive mate-in-2 search, no mate in 1";
const WIN = "ABC-084, hand-built; keys = material-only 4-ply search, gain";
const HANG = "ABC-079 HANGING_CORPUS (quiescence A1), hand-labelled";

// biome-ignore format: one position per row keeps the corpus readable as a table
export const PUZZLES: readonly Puzzle[] = [
  { name: "K+R: king steps up, rook mates", fen: "7k/8/5K2/8/8/8/8/R7 w - - 0 1", kind: "mate-in-2", accept: ["f6f7", "f6g6"], source: `${MATE}; ABC-077 search.test.ts A3's MATE_IN_2` },
  { name: "smothered: Qg8+ Rxg8 Nf7#", fen: "5r1k/6pp/7N/3Q4/8/8/8/6K1 w - - 0 1", kind: "mate-in-2", accept: ["d5g8"], source: MATE },
  { name: "back rank: Re8+ Rxe8 Rxe8#", fen: "2r3k1/5ppp/8/8/8/8/4R3/4R1K1 w - - 0 1", kind: "mate-in-2", accept: ["e2e8"], source: MATE },
  { name: "two-rook ladder", fen: "7k/8/8/8/8/8/R7/1R4K1 w - - 0 1", kind: "mate-in-2", accept: ["b1b7", "a2a7"], source: MATE },
  { name: "K+Q against the cornered king", fen: "k7/8/2K5/8/8/8/8/7Q w - - 0 1", kind: "mate-in-2", accept: ["h1h7", "h1b1", "c6c7", "c6b6"], source: MATE },
  { name: "Anastasia: Qxh7+ Kxh7 Rh3#", fen: "r6k/4N1pp/8/7Q/8/3R4/8/6K1 w - - 0 1", kind: "mate-in-2", accept: ["h5h7", "e7g6"], source: MATE },
  { name: "mirror: back rank, Re1+ Rxe1 Rxe1#", fen: "4r1k1/4r3/8/8/8/8/5PPP/2R3K1 b - - 0 1", kind: "mate-in-2", accept: ["e7e1"], source: MATE },
  { name: "mirror: smothered, Qg1+ Rxg1 Nf2#", fen: "6k1/8/8/8/3q4/7n/6PP/5R1K b - - 0 1", kind: "mate-in-2", accept: ["d4g1"], source: MATE },
  { name: "mirror: K+R, king steps up", fen: "r7/8/8/8/8/5k2/8/7K b - - 0 1", kind: "mate-in-2", accept: ["f3g3", "f3f2"], source: MATE },
  { name: "mirror: two-rook ladder", fen: "1r4k1/r7/8/8/8/8/8/7K b - - 0 1", kind: "mate-in-2", accept: ["a7a2", "b8b2"], source: MATE },
  { name: "knight fork: Ne7+ wins the queen", fen: "6k1/5ppp/2q5/3N4/8/8/5PPP/6K1 w - - 0 1", kind: "win-material", accept: ["d5e7"], source: `${WIN} +9` },
  { name: "pawn fork: e5 hits knight and rook", fen: "6k1/6pp/3n1r2/8/3PP3/2P5/6PP/6K1 w - - 0 1", kind: "win-material", accept: ["e4e5"], source: `${WIN} +2` },
  { name: "pin: Re1 pins the queen to the king", fen: "4k2p/8/8/4q3/8/1P6/P2K4/R7 w - - 0 1", kind: "win-material", accept: ["a1e1"], source: `${WIN} +4` },
  { name: "skewer: Ra6+ and Rxh6", fen: "8/7p/3k3q/8/8/8/6PP/R5K1 w - - 0 1", kind: "win-material", accept: ["a1a6"], source: `${WIN} +10` },
  { name: "discovered check: the bishop moves, Rxd8", fen: "3q4/6k1/8/8/3B4/8/6PP/3R2K1 w - - 0 1", kind: "win-material", accept: ["d4e5", "d4c3", "d4b2", "d4a1"], source: `${WIN} +6` },
  { name: "queen fork: Qd5+ and Qxa8", fen: "r5k1/6pp/8/8/8/8/6PP/3Q2K1 w - - 0 1", kind: "win-material", accept: ["d1d5"], source: `${WIN} +5` },
  ...HANGING_CORPUS.map((row) => ({ ...row, kind: "do-not-hang" as const, source: HANG })),
];
