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
 * ABC-127's rows (after those 40, each with `tags`) are SELECTED by the engine and ANSWERED by the
 * rules. Seeded random placements were kept when QE's planted weakenings (ABC-084's 17) play a
 * different move from the shipped engine, or when the shipped engine needs 4× the readings; the
 * tags record which (`PuzzleTag`). Their accepted moves are never the engine's output:
 * - mate-in-3: EXACTLY the first moves an exhaustive search over the legal moves finds to mate
 *   in 3, with no mate in 2 or fewer;
 * - win-material: EXACTLY the moves the material-only search above ranks best, with a gain of
 *   >= 2 and every other move >= 2 behind.
 * Both are re-proven in `PUZZLE_DEEP=1` (ABC-127 `A2`), the six win-material rows above included,
 * and were derived first by an oracle with its own move generator. The generator, the seeds and
 * the measurements: `.grugops/context/ticket-to-pr-ABC-127/`.
 *
 * Not named `*.test.ts`, so vitest does not collect it; under `src/`, so `tsc` and Biome check
 * it. No production module imports it.
 */

/**
 * Why an ABC-127 row is in the suite (`A1`). `quiet-key`: every accepted move is neither a capture,
 * a check nor a promotion — checked in the default lane. The other three are ENGINE MEASUREMENTS
 * recorded with ABC-127's `A3` table, never answers: `depth≥5` — the shipped engine solves the row
 * at the recorded config and, with the depth capped at 4 (QE's `W5`), does not; `quiescence` —
 * likewise with quiescence off (`W1`); `headroom` — the shipped engine does NOT solve it at the
 * recorded config and does at 4× the readings, so a stronger engine can show it.
 */
export type PuzzleTag = "quiet-key" | "depth≥5" | "quiescence" | "headroom";

/** A puzzle: a position, its class, the move(s) that solve it — or the one that loses — and its source. */
export type Puzzle =
  | {
      readonly name: string;
      readonly fen: string;
      readonly kind: "mate-in-2" | "mate-in-3" | "win-material";
      /** Solved when the chosen move is one of these. */
      readonly accept: readonly string[];
      readonly source: string;
      /** ABC-127's rows only: why the row is here (`PuzzleTag`). */
      readonly tags?: readonly PuzzleTag[];
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
  // Re-found at ABC-126: the old FEN (4k3/8/1p6/b7/8/8/8/R3K3 w) started in check, Ba5+ on e1. King
  // to f1, off the diagonal; 8 non-king moves. Depth-3 margin 185 cp. Level unchanged.
  { name: "R takes a bishop a pawn defends", fen: "4k3/8/1p6/b7/8/8/8/R4K2 w - - 0 1", losing: "a1a5" },
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
  // Re-found at ABC-126: the old FEN (r3k3/8/8/8/B7/1P6/8/4K3 b) started in check, Ba4+ on e8. King
  // to f8, off the diagonal; 8 non-king moves. Depth-3 margin 185 cp. Level unchanged.
  { name: "mirror: r takes a bishop a pawn defends", fen: "r4k2/8/8/8/B7/1P6/8/4K3 b - - 0 1", losing: "a8a4" },
  { name: "mirror: r takes a pawn a bishop defends", fen: "1r2k3/1P6/B7/8/8/8/6P1/4K3 b - - 0 1", losing: "b8b7" },
  { name: "mirror: q takes a pawn a knight defends", fen: "q3k3/1P6/8/2N5/8/8/8/4K3 b - - 0 1", losing: "a8b7" },
  { name: "mirror: b takes a pawn a rook defends", fen: "1b2k3/8/8/4P3/8/8/8/4R1K1 b - - 0 1", losing: "b8e5" },
];

const MATE = "ABC-084, hand-built; keys = exhaustive mate-in-2 search, no mate in 1";
const WIN = "ABC-084, hand-built; keys = material-only 4-ply search, gain";
const HANG = "ABC-079 HANGING_CORPUS (quiescence A1), hand-labelled";
const MATE3 =
  "ABC-127, seeded random placement; keys = exhaustive mate-in-3 search, no mate in <= 2";
const WIN3 = "ABC-127, seeded random placement; keys = material-only 4-ply search, gain";

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
  // Re-authored at ABC-126 (via ABC-010's re-cut, ADR-0033): the old FEN (4k2p/…) had a black pawn
  // on h8. Pawn to h7; the material oracle's keys [a1e1] and gain +4 are unchanged.
  { name: "pin: Re1 pins the queen to the king", fen: "4k3/7p/8/4q3/8/1P6/P2K4/R7 w - - 0 1", kind: "win-material", accept: ["a1e1"], source: `${WIN} +4` },
  { name: "skewer: Ra6+ and Rxh6", fen: "8/7p/3k3q/8/8/8/6PP/R5K1 w - - 0 1", kind: "win-material", accept: ["a1a6"], source: `${WIN} +10` },
  // Re-authored at ABC-126 (via ABC-010's re-cut, ADR-0033): the old FEN (3q4/6k1/…) had black in
  // check from Bd4 with white to move. King to f8; Bc5+ / Bg7+ unmask Rd1. Oracle gain +4 (was +6).
  { name: "discovered check: the bishop moves, Rxd8", fen: "3q1k2/8/8/8/3B4/8/6PP/3R2K1 w - - 0 1", kind: "win-material", accept: ["d4g7", "d4c5"], source: `${WIN} +4` },
  { name: "queen fork: Qd5+ and Qxa8", fen: "r5k1/6pp/8/8/8/8/6PP/3Q2K1 w - - 0 1", kind: "win-material", accept: ["d1d5"], source: `${WIN} +5` },
  ...HANGING_CORPUS.map((row) => ({ ...row, kind: "do-not-hang" as const, source: HANG })),
  { name: "mate in 3, seed 1: black Q+R against N", fen: "8/7K/8/8/1k6/8/8/q1r2N2 b - - 0 1", kind: "mate-in-3", accept: ["a1a6", "a1f6", "c1c6"], tags: ["quiet-key", "depth≥5"], source: `${MATE3}, seed 1` },
  { name: "mate in 3, seed 69: black 2R+B against 2P", fen: "2r5/K7/8/8/P7/4P1b1/8/k4r2 b - - 0 1", kind: "mate-in-3", accept: ["f1b1", "f1f6"], tags: ["quiet-key", "depth≥5"], source: `${MATE3}, seed 69` },
  // ABC-131, ADR-0034 (b) at 0.8x: seeds 1008, 1075, 1424 and 1982 dropped, each lost at <= 12 % fewer readings.
  { name: "mate in 3, seed 1632: white Q+R+N against N+2P", fen: "8/2R1QpK1/5p2/8/8/8/7n/1N4k1 w - - 0 1", kind: "mate-in-3", accept: ["e7e2"], tags: ["quiet-key", "quiescence"], source: `${MATE3}, seed 1632` },
  { name: "mate in 3, seed 1163: black 2R+B against N", fen: "8/1r6/2r5/3b4/8/1k5K/6N1/8 b - - 0 1", kind: "mate-in-3", accept: ["b7g7", "c6g6"], tags: ["quiet-key", "depth≥5", "quiescence"], source: `${MATE3}, seed 1163` },
  { name: "mate in 3, seed 24: black Q+N against P", fen: "4K3/8/5k2/8/2P5/1q6/8/6n1 b - - 0 1", kind: "mate-in-3", accept: ["b3b7"], tags: ["quiet-key", "headroom"], source: `${MATE3}, seed 24` },
  { name: "mate in 3, seed 234: white Q+R against P", fen: "3R4/3K4/2Q5/7p/8/8/8/3k4 w - - 0 1", kind: "mate-in-3", accept: ["c6g2"], tags: ["quiet-key", "headroom"], source: `${MATE3}, seed 234` },
  { name: "mate in 3, seed 288: white Q+B against a bare king", fen: "8/8/8/8/2B4k/4K3/Q7/8 w - - 0 1", kind: "mate-in-3", accept: ["e3f4"], tags: ["quiet-key", "headroom"], source: `${MATE3}, seed 288` },
  { name: "mate in 3, seed 580: white Q+B against a bare king", fen: "8/4K3/8/8/7k/2B5/8/5Q2 w - - 0 1", kind: "mate-in-3", accept: ["e7f6"], tags: ["quiet-key", "headroom"], source: `${MATE3}, seed 580` },
  { name: "win material, seed 7: black Q+P against R+N", fen: "1K6/8/7R/3q4/k7/2p3N1/8/8 b - - 0 1", kind: "win-material", accept: ["d5g8"], tags: ["quiescence"], source: `${WIN3} +5, seed 7` },
  { name: "win material, seed 111: black Q+R+B+P against 2R+B+P", fen: "8/R7/7K/R3q1P1/1p2k3/1B6/r4b2/8 b - - 0 1", kind: "win-material", accept: ["a2a5"], tags: ["quiescence"], source: `${WIN3} +5, seed 111` },
  { name: "win material, seed 1700: black R+B+N+2P against 2B+2N+P", fen: "8/7B/6r1/1P2b1p1/1k6/3p2N1/2nK4/N5B1 b - - 0 1", kind: "win-material", accept: ["g6g7", "g6h6"], tags: ["quiet-key", "quiescence"], source: `${WIN3} +2, seed 1700` },
  { name: "win material, seed 1706: white Q+R+2P against Q+R+2P", fen: "8/7r/2k5/p4K2/2P5/1q6/P1Q2p2/R7 w - - 0 1", kind: "win-material", accept: ["c2e4"], tags: ["quiescence"], source: `${WIN3} +8, seed 1706` },
  { name: "win material, seed 1811: white 2R+N+2P against 2B+N+2P", fen: "6n1/1k5b/5bP1/3K1p2/2NR4/3p4/4P3/5R2 w - - 0 1", kind: "win-material", accept: ["c4d6"], tags: ["quiescence"], source: `${WIN3} +3, seed 1811` },
  { name: "win material, seed 5180: black R+N+P against Q+B+N", fen: "8/1p5N/6kr/3K4/1B5n/8/8/3Q4 b - - 0 1", kind: "win-material", accept: ["h6h7"], tags: ["depth≥5", "quiescence"], source: `${WIN3} +3, seed 5180` },
  { name: "win material, seed 5464: black B+P against B+N", fen: "8/8/3B1K1N/8/k7/2p5/8/4b3 b - - 0 1", kind: "win-material", accept: ["e1d2"], tags: ["quiet-key", "depth≥5", "quiescence"], source: `${WIN3} +3, seed 5464` },
  { name: "win material, seed 5061: white B+N+4P against Q+R+2B+N+P", fen: "8/nk1p3q/4b3/5P2/1P2P3/3r4/6NP/b4KB1 w - - 0 1", kind: "win-material", accept: ["f5e6", "g1a7"], tags: ["quiescence"], source: `${WIN3} +2, seed 5061` },
  { name: "win material, seed 5527: black R+2B+2N+P against R+2N+3P", fen: "k2r1N1b/4n3/2R1N2K/7b/3P4/1p4PP/4n3/8 b - - 0 1", kind: "win-material", accept: ["e7c6"], tags: ["depth≥5", "quiescence"], source: `${WIN3} +3, seed 5527` },
  { name: "win material, seed 279: black Q+3P against R+2N+P", fen: "8/7N/3p2pp/8/1N2R3/3P1K2/8/q2k4 b - - 0 1", kind: "win-material", accept: ["a1g7"], tags: ["quiet-key"], source: `${WIN3} +2, seed 279` },
];
