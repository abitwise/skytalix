/**
 * ABC-082 — acceptance for the pawn-structure term (doubled, isolated, passed).
 *
 * Relations, never totals (test note 3): every number in `src/evaluate.ts` is hand-tuned and
 * expected to move. The one exact property is `A1`'s mirror, which no weight can excuse.
 *
 * `A1`'s corpus EXTENDS ABC-076's, it does not fork it: the 184 and the mirror helper come from
 * `src/evaluate.mirror-corpus.ts`, the module `src/evaluate.test.ts` imports too, and `A7` is the
 * row that goes red if either suite stops doing so.
 *
 * NO wall-clock assertion lives here (`A6`'s cost and the `NFR-005` depth read are REPORTED figures
 * with their machine, the standing rule of `src/zobrist.nfr.test.ts`).
 *
 * `ABC-291` (E4b, `ADR-0075`) K1's rows are the last blocks of this file. K1 (b)'s off-door rows are
 * `ABC-271` and `ABC-270` K1 (b) in `src/evaluate.passer.test.ts` and `src/evaluate.queen-on.test.ts`,
 * `evaluateWithoutTaper`'s is `ABC-269` B1 (c), and K1 (f) is `ABC-274` A9 in
 * `src/evaluate.taper.test.ts`. QE's freeze of K1's fixtures came AFTER the build, not before it
 * (`qe-ABC-291-k1` `…2e186a33`), so it stands as a blind check and not as a prior one. `SEAM_ROWS`'
 * first 36 rows are the Engineer's, hand-worked from d1's words, and the rows after them are QE's.
 * `PAWN_SHAPE_POSITIONS` is the probe's offered 16.
 */

import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { makeMove, unmakeMove } from "./apply.ts";
import {
  buildCorpus,
  clonePosition,
  mirrorPosition,
  PERFT_POSITIONS,
} from "./evaluate.mirror-corpus.ts";
import { TAPER_MIRROR_POSITIONS } from "./evaluate.taper-corpus.ts";
import {
  clearPawnCacheForTest,
  evaluate,
  evaluateAtPhase,
  evaluateAtPhaseWithoutPawnShape,
  evaluateWithoutPawnCache,
  isPassedPawn,
  pawnCacheByteLength,
  pawnCacheProbeForTest,
  pawnShapeForTest,
  pawnStructureForTest,
  phaseOf,
  withParametersForTest,
} from "./evaluate.ts";
import * as PARAMS from "./evaluate-params.ts";
import { parseFen, parseFenGrammarOnly, toFen } from "./fen.ts";
import { legalMoves } from "./legal.ts";
import {
  BLACK,
  EMPTY,
  emptyPosition,
  KING,
  PAWN,
  type Position,
  parseSquareName,
  pieceType,
} from "./position.ts";

/**
 * `A5`'s hand-labelled passed / not-passed cases: the pawn on `square` in `fen`. A pawn is passed
 * when no ENEMY PAWN stands ahead of it on its own file or an adjacent one. The cases a naive
 * check gets wrong are named: an enemy pawn on an ADJACENT file ahead (a file-only check calls it
 * passed), an enemy pawn BEHIND on the same file (an "any enemy pawn on the file" check calls it
 * blocked), a pawn beside it on the same rank, a non-pawn blocker, and both board edges.
 */
const PASSED_CASES: ReadonlyArray<{ why: string; fen: string; square: string; passed: boolean }> = [
  {
    why: "no enemy pawn at all",
    fen: "4k3/8/8/3P4/8/8/8/4K3 w - - 0 1",
    square: "d5",
    passed: true,
  },
  {
    why: "enemy pawn ahead, same file",
    fen: "4k3/3p4/8/3P4/8/8/8/4K3 w - - 0 1",
    square: "d5",
    passed: false,
  },
  {
    why: "enemy pawn ahead, ADJACENT file (left)",
    fen: "4k3/8/2p5/3P4/8/8/8/4K3 w - - 0 1",
    square: "d5",
    passed: false,
  },
  {
    why: "enemy pawn ahead, ADJACENT file (right), far",
    fen: "4k3/4p3/8/3P4/8/8/8/4K3 w - - 0 1",
    square: "d5",
    passed: false,
  },
  {
    why: "enemy pawn BEHIND, same file",
    fen: "4k3/8/8/3P4/8/3p4/8/4K3 w - - 0 1",
    square: "d5",
    passed: true,
  },
  {
    why: "enemy pawn behind, adjacent file",
    fen: "4k3/8/8/3P4/2p5/8/8/4K3 w - - 0 1",
    square: "d5",
    passed: true,
  },
  {
    why: "enemy pawn beside it, same rank",
    fen: "4k3/8/8/2pP4/8/8/8/4K3 w - - 0 1",
    square: "d5",
    passed: true,
  },
  {
    why: "enemy pawn ahead, two files away",
    fen: "4k3/8/1p6/3P4/8/8/8/4K3 w - - 0 1",
    square: "d5",
    passed: true,
  },
  {
    why: "enemy PIECE ahead, same file — only pawns stop a passer",
    fen: "3rk3/3n4/8/3P4/8/8/8/4K3 w - - 0 1",
    square: "d5",
    passed: true,
  },
  {
    why: "a-file edge, enemy pawn ahead on b",
    fen: "4k3/8/1p6/P7/8/8/8/4K3 w - - 0 1",
    square: "a5",
    passed: false,
  },
  {
    why: "a-file edge, enemy pawn on h only",
    fen: "4k3/7p/8/P7/8/8/8/4K3 w - - 0 1",
    square: "a5",
    passed: true,
  },
  {
    why: "h-file edge, enemy pawn ahead on g",
    fen: "4k3/6p1/8/7P/8/8/8/4K3 w - - 0 1",
    square: "h5",
    passed: false,
  },
  {
    why: "h-file edge, enemy pawn on a only",
    fen: "4k3/p7/8/7P/8/8/8/4K3 w - - 0 1",
    square: "h5",
    passed: true,
  },
  {
    why: "second rank, enemy pawn five ranks ahead on an adjacent file",
    fen: "4k3/2p5/8/8/8/8/3P4/4K3 w - - 0 1",
    square: "d2",
    passed: false,
  },
  {
    why: "seventh rank, enemy pawn behind on an adjacent file",
    fen: "7k/3P4/4p3/8/8/8/8/4K3 w - - 0 1",
    square: "d7",
    passed: true,
  },
  {
    why: "the rear of two doubled pawns, no enemy pawn",
    fen: "4k3/8/3P4/3P4/8/8/8/4K3 w - - 0 1",
    square: "d5",
    passed: true,
  },
  {
    why: "start position e-pawn",
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    square: "e2",
    passed: false,
  },
  {
    why: "BLACK: no enemy pawn at all",
    fen: "4k3/8/8/8/3p4/8/8/4K3 b - - 0 1",
    square: "d4",
    passed: true,
  },
  {
    why: "BLACK: enemy pawn ahead (lower rank), adjacent file",
    fen: "4k3/8/8/8/3p4/2P5/8/4K3 b - - 0 1",
    square: "d4",
    passed: false,
  },
  {
    why: "BLACK: enemy pawn ahead, adjacent file, far",
    fen: "4k3/8/8/8/3p4/8/4P3/4K3 b - - 0 1",
    square: "d4",
    passed: false,
  },
  {
    why: "BLACK: enemy pawn ahead, same file",
    fen: "4k3/8/8/8/3p4/8/3P4/4K3 b - - 0 1",
    square: "d4",
    passed: false,
  },
  {
    why: "BLACK: enemy pawn BEHIND (higher rank), same file",
    fen: "4k3/8/3P4/8/3p4/8/8/4K3 b - - 0 1",
    square: "d4",
    passed: true,
  },
  {
    why: "BLACK: enemy pawn behind, adjacent file",
    fen: "4k3/8/8/2P5/3p4/8/8/4K3 b - - 0 1",
    square: "d4",
    passed: true,
  },
  {
    why: "BLACK: h-file edge, enemy pawn ahead on g",
    fen: "4k3/8/8/8/7p/8/6P1/4K3 b - - 0 1",
    square: "h4",
    passed: false,
  },
  {
    why: "BLACK: a-file edge, enemy pawn on h only",
    fen: "4k3/8/8/8/p7/8/7P/4K3 b - - 0 1",
    square: "a4",
    passed: true,
  },
];

/**
 * `A2`: the same two white pawns, sharing the c-file (c3/c4) or side by side (c3/d3). PST-neutral.
 * Re-found at ABC-083 (`ADR-0028` decision 2; the level is unchanged): the kings stood on e1/e8,
 * beside the d-file, so ABC-083's king safety added 25 cp to the gap (35 -> 60). On h1/h8 they
 * see neither pawn file, and the gap reads 35 on both builds — the pawn terms alone.
 */
const DOUBLED = "7k/2pp4/8/8/2P5/2P5/8/7K w - - 0 1";
const SIDE_BY_SIDE = "7k/2pp4/8/8/8/2PP4/8/7K w - - 0 1";

/** `A3`: d4 supported by c3/e3, the same d4 alone, and the same material on a3/g3 (all isolated). */
const SUPPORTED = "4k3/1ppppp2/8/8/3P4/2P1P3/8/4K3 w - - 0 1";
const ALONE = "4k3/1ppppp2/8/8/3P4/8/8/4K3 w - - 0 1";
const SPREAD = "4k3/1ppppp2/8/8/3P4/P5P1/8/4K3 w - - 0 1";

/**
 * ABC-083 `A8` (QE's ABC-082 gap G-QE-1): d4's ONLY friendly neighbour stands on ONE adjacent file
 * — c3 (left) or e3 (right) — against the same d4 with a non-adjacent partner, so both pawns are
 * isolated. The kings stand in the corners and see no pawn file, so only the pawn terms differ.
 */
const NEIGHBOUR_LEFT = "7k/8/8/8/3P4/2P5/8/7K w - - 0 1";
const APART_A3 = "7k/8/8/8/3P4/P7/8/7K w - - 0 1";
const NEIGHBOUR_RIGHT = "7k/8/8/8/3P4/4P3/8/7K w - - 0 1";
const APART_B4 = "7k/8/8/8/1P1P4/8/8/7K w - - 0 1";

/** `A4`: a white a-pawn, passed on a5 / a7 (black's pawn is on h7), and stopped on a5 by b6. */
const PASSED_A5 = "4k3/7p/8/P7/8/8/8/4K3 w - - 0 1";
const PASSED_A7 = "4k3/P6p/8/8/8/8/8/4K3 w - - 0 1";
const STOPPED_A5 = "4k3/8/1p6/P7/8/8/8/4K3 w - - 0 1";

/** More structures for `A1`'s mirror: tripled, islands, passers for both sides, en-passant set. */
const MORE_STRUCTURES: readonly string[] = [
  "4k3/8/8/3P4/3P4/3P4/8/4K3 w - - 0 1",
  "4k3/pp3ppp/8/8/8/8/P1P1P1P1/4K3 b - - 0 1",
  "6k1/5ppp/8/1P6/8/8/p4PPP/6K1 w - - 0 1",
  "r3k2r/pp3ppp/2n5/3pP3/8/2N5/PP3PPP/R3K2R w KQkq d6 0 1",
  "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 b - - 0 1",
];

const PAWN_FENS: readonly string[] = [
  ...new Set([
    ...PASSED_CASES.map(({ fen }) => fen),
    DOUBLED,
    SIDE_BY_SIDE,
    SUPPORTED,
    ALONE,
    SPREAD,
    PASSED_A5,
    PASSED_A7,
    STOPPED_A5,
    NEIGHBOUR_LEFT,
    APART_A3,
    NEIGHBOUR_RIGHT,
    APART_B4,
    ...MORE_STRUCTURES,
  ]),
];

/** `A7`'s key: the same four fields ABC-076's distinctness row keys on. */
const keyOf = (position: Position): string =>
  `${Array.from(position.board).join(",")}|${position.blackToMove}|${position.castling}|${position.epSquare}`;

/** This ticket's mirror corpus: ABC-076's 184, then the pawn structures above. */
function pawnCorpus(): { name: string; position: Position }[] {
  return [...buildCorpus(), ...PAWN_FENS.map((fen) => ({ name: fen, position: parseFen(fen) }))];
}

const score = (fen: string): number => evaluate(parseFen(fen));

describe("A1 — a position and its colour mirror score exactly equal, over ABC-076's 184 plus the pawn structures", () => {
  const corpus = pawnCorpus();

  it("adds at least 15 new pawn-structure positions", () => {
    expect(corpus.length - 184).toBeGreaterThanOrEqual(15);
  });

  it("scores every mirrored pair exactly equal", () => {
    for (const { name, position } of corpus) {
      expect(evaluate(mirrorPosition(position)), name).toBe(evaluate(position));
    }
  });
});

describe("A2 — doubled pawns score lower, by no more than 50 centipawns", () => {
  it("c3/c4 scores strictly lower than c3/d3 for white, and the gap is <= 50", () => {
    const gap = score(SIDE_BY_SIDE) - score(DOUBLED);
    expect(gap).toBeGreaterThan(0);
    expect(gap).toBeLessThanOrEqual(50);
  });
});

describe("A3 — an isolated pawn scores lower", () => {
  it("d4 with c3/e3 removed scores strictly lower for white (the criterion as written)", () => {
    expect(score(ALONE)).toBeLessThan(score(SUPPORTED));
  });

  it("at EQUAL material too: c3/e3 moved to a3/g3, isolating all three, scores strictly lower", () => {
    // The row above is won by material alone. This one is not: the piece-square tables favour
    // a3/g3 over c3/e3 by 10, so only the isolated term can make it lower (red without the term).
    expect(score(SPREAD)).toBeLessThan(score(SUPPORTED));
  });
});

describe("ABC-083 A8 — the isolation check reads BOTH adjacent files", () => {
  // A strict ordering alone may not separate a one-file mutant (ABC-083 test note 5): these pairs
  // are chosen so that it does. The apart pair is favoured by 15 (a3, the tables) and by 10 (b4,
  // its passed-pawn rank), so only the isolated term's two 10s put the neighbour pair above it.
  // A check that reads one file isolates one pawn of each neighbour pair, and the order falls
  // to <= 0 (measured: -5 and 0 under QE's E8 and E9).
  it("d4 with its only neighbour on the LEFT (c3) scores higher than d4 with a3, both isolated", () => {
    expect(score(NEIGHBOUR_LEFT)).toBeGreaterThan(score(APART_A3));
  });

  it("d4 with its only neighbour on the RIGHT (e3) scores higher than d4 with b4, both isolated", () => {
    expect(score(NEIGHBOUR_RIGHT)).toBeGreaterThan(score(APART_B4));
  });
});

describe("A4 — a passed pawn scores higher, and higher the further it has advanced", () => {
  it("a7 scores strictly higher than a5", () => {
    expect(score(PASSED_A7)).toBeGreaterThan(score(PASSED_A5));
  });

  it("both score higher than the same a5 pawn stopped by a black pawn on b6, at equal material", () => {
    // The piece-square tables favour WHITE in the stopped case by 10 (black b6 -5, black h7 +5),
    // so only the passed term can put a5 above it (red without the term).
    expect(score(PASSED_A5)).toBeGreaterThan(score(STOPPED_A5));
    expect(score(PASSED_A7)).toBeGreaterThan(score(STOPPED_A5));
  });
});

describe("A5 — passed pawns are identified correctly, 20/20 and more", () => {
  it(`carries at least 20 hand-labelled cases (${PASSED_CASES.length}), both colours, both answers`, () => {
    expect(PASSED_CASES.length).toBeGreaterThanOrEqual(20);
    expect(PASSED_CASES.filter(({ passed }) => passed).length).toBeGreaterThanOrEqual(5);
    expect(PASSED_CASES.filter(({ passed }) => !passed).length).toBeGreaterThanOrEqual(5);
    expect(PASSED_CASES.filter(({ why }) => why.startsWith("BLACK")).length).toBeGreaterThanOrEqual(
      5,
    );
  });

  it.each(PASSED_CASES)("$why: $square is passed = $passed", ({ fen, square, passed }) => {
    const position = parseFen(fen);
    const at = parseSquareName(square);
    expect(pieceType(position.board[at] as number), `${square} must hold a pawn`).toBe(PAWN);
    expect(isPassedPawn(position.board, at)).toBe(passed);
  });
});

describe("A6 — purity: evaluation leaves the position byte-identical", () => {
  it("over the six perft roots and every pawn structure, twice, with the same score", () => {
    const fens = [...PERFT_POSITIONS.map(({ fen }) => fen), ...PAWN_FENS];
    for (const fen of fens) {
      const position = parseFen(fen);
      const before = clonePosition(position);
      const first = evaluate(position);
      expect(evaluate(position), fen).toBe(first);
      expect(position, fen).toEqual(before);
    }
  });
});

describe("A7 — one corpus and one mirror helper, shared, and no production module imports it", () => {
  it("this suite's corpus is a STRICT superset of ABC-076's 184", () => {
    const ours = new Set(pawnCorpus().map(({ position }) => keyOf(position)));
    const theirs = buildCorpus().map(({ position }) => keyOf(position));
    expect(theirs).toHaveLength(184);
    expect(theirs.filter((key) => !ours.has(key))).toEqual([]);
    expect(ours.size).toBeGreaterThan(184);
  });

  it("src/evaluate.test.ts and this suite both import the corpus and the mirror helper from it", () => {
    const shared =
      /import\s*\{[^}]*\bbuildCorpus\b[^}]*\bmirrorPosition\b[^}]*\}\s*from\s*"\.\/evaluate\.mirror-corpus\.ts";/;
    const directory = new URL(".", import.meta.url).pathname;
    for (const suite of ["evaluate.test.ts", "evaluate.pawns.test.ts"]) {
      const source = readFileSync(`${directory}${suite}`, "utf8");
      expect(source, suite).toMatch(shared);
      // Not retyped beside the import: neither suite defines its own copy.
      expect(source, suite).not.toMatch(
        /function\s+(?:mirrorPosition|buildCorpus|clonePosition)\b/,
      );
    }
  });

  it("no non-test module under src/ imports src/evaluate.mirror-corpus.ts", () => {
    const directory = new URL(".", import.meta.url).pathname;
    const importers = readdirSync(directory)
      .filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts"))
      .filter((file) =>
        readFileSync(`${directory}${file}`, "utf8").includes("evaluate.mirror-corpus"),
      );
    // The module's own docblock names itself; a self-mention is not an import.
    expect(importers.filter((file) => file !== "evaluate.mirror-corpus.ts")).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// ABC-235 cut 5 — the pawn-structure memo changes the cost, never the score. The reference is
// `evaluateWithoutPawnCache`, which computes `pawnStructure` afresh and neither reads nor writes
// the memo. Compared `Object.is` (so a `-0` would count), cache-cold and then cache-warm, on
// ABC-206 A2's walk (depth 1 in the lane, depth 3 under `ENGINE_DEEP=1`) and on `G3`'s mirror
// corpus with each mirror. Then a forced collision: two placements on one slot.
// ---------------------------------------------------------------------------

const CUT5_ROOTS: readonly string[] = [
  ...PERFT_POSITIONS.map(({ fen }) => fen),
  "4Q2k/6pp/8/8/8/8/8/6K1 b - - 100 80",
  "7k/5K2/5N2/8/8/8/8/8 b - - 0 1",
  "k7/8/1K6/8/8/8/8/2Q5 b - - 0 1",
  "4k3/8/8/8/8/8/8/4K3 w - - 0 1",
  "r3k3/8/8/8/8/8/8/4K2R w - - 150 120",
  "r3k3/8/8/8/8/8/8/4K2R w - - 100 120",
];

/** Every position of the walk (root included, depth `depth`), each as its own FEN. */
function cut5Walk(depth: number): string[] {
  const out: string[] = [];
  const walk = (position: Position, left: number): void => {
    out.push(toFen(position));
    if (left === 0) return;
    for (const move of legalMoves(position)) {
      const undo = makeMove(position, move);
      walk(position, left - 1);
      unmakeMove(position, move, undo);
    }
  };
  for (const fen of CUT5_ROOTS) walk(parseFenGrammarOnly(fen), depth);
  return out;
}

/** One pass: memoised `evaluate` against the reference, position unchanged. Returns the hits. */
function cut5Pass(positions: readonly Position[], where: string): number {
  let hits = 0;
  const faults: string[] = [];
  for (const [index, position] of positions.entries()) {
    const before = toFen(position);
    const hit = pawnCacheProbeForTest(position).hit;
    const got = evaluate(position);
    const want = evaluateWithoutPawnCache(position);
    if (!Object.is(got, want)) faults.push(`${where} #${index} ${before}: ${got} vs ${want}`);
    if (toFen(position) !== before) faults.push(`${where} #${index} ${before}: position changed`);
    if (hit) hits++;
  }
  expect(faults.slice(0, 5), where).toEqual([]);
  return hits;
}

describe("ABC-235 cut 5 — the pawn memo returns what a fresh pawnStructure returns", () => {
  const walkRow = (depth: number) => () => {
    const positions = cut5Walk(depth).map((fen) => parseFenGrammarOnly(fen));
    expect(positions.length).toBeGreaterThan(depth === 1 ? 200 : 200_000); // the denominator
    clearPawnCacheForTest();
    cut5Pass(positions, "cold");
    // Warm: every placement was stored on the cold pass, so most now hit; all still equal.
    const hits = cut5Pass(positions, "warm");
    expect(hits).toBeGreaterThan(positions.length / 2);
  };

  it("cold then warm, on every position of the walk, depth 1", walkRow(1));

  it("cold then warm, on G3's mirror corpus and every mirror", () => {
    const corpus = buildCorpus().map(({ position }) => position);
    const positions = corpus.flatMap((position) => [
      clonePosition(position),
      mirrorPosition(position),
    ]);
    expect(positions.length).toBeGreaterThan(300);
    clearPawnCacheForTest();
    cut5Pass(positions, "mirror cold");
    expect(cut5Pass(positions, "mirror warm")).toBeGreaterThan(positions.length / 2);
  });

  it("a forced collision: two placements on one slot each return their own value", () => {
    // Deterministic placements: both kings home, pawns from a fixed sequence on ranks 2-7.
    let seed = 12345;
    const next = (bound: number): number => {
      seed = (Math.imul(seed, 1103515245) + 12345) & 0x7fffffff;
      return seed % bound;
    };
    const placement = (): Position => {
      const position = emptyPosition();
      position.board[parseSquareName("e1")] = KING;
      position.board[parseSquareName("e8")] = KING | BLACK;
      const pawns = 2 + next(10);
      for (let i = 0; i < pawns; i++) {
        const square = (1 + next(6)) * 16 + next(8);
        if (position.board[square] === EMPTY) {
          position.board[square] = next(2) === 0 ? PAWN : PAWN | BLACK;
        }
      }
      return position;
    };
    const bySlot = new Map<number, Position>();
    let pair: [Position, Position] | null = null;
    for (let i = 0; i < 100_000 && pair === null; i++) {
      const position = placement();
      const { slot } = pawnCacheProbeForTest(position);
      const other = bySlot.get(slot);
      const differs =
        other !== undefined &&
        evaluateWithoutPawnCache(other) !== evaluateWithoutPawnCache(position);
      if (differs) pair = [other as Position, position];
      else if (other === undefined) bySlot.set(slot, position);
    }
    expect(pair).not.toBeNull();
    const [a, b] = pair as [Position, Position];
    expect(pawnCacheProbeForTest(a).slot).toBe(pawnCacheProbeForTest(b).slot);

    clearPawnCacheForTest();
    for (let round = 0; round < 3; round++) {
      for (const position of [a, b]) {
        // The other placement now holds the slot: a slot match alone must not be a hit.
        expect(pawnCacheProbeForTest(position).hit).toBe(false);
        expect(Object.is(evaluate(position), evaluateWithoutPawnCache(position))).toBe(true);
        expect(pawnCacheProbeForTest(position).hit).toBe(true);
        expect(Object.is(evaluate(position), evaluateWithoutPawnCache(position))).toBe(true);
      }
    }
  });

  // Re-pinned at `ABC-269` (`ADR-0064` decision 5): a third part, the passed endgame sum. 384 -> 448 KiB.
  // Re-pinned at `ABC-271` (`ADR-0070` decision 2, K2): the two passer words. 448 -> 576 KiB.
  it("is a fixed 576 KiB: 2^14 slots of two 8-byte masks, three 4-byte parts and two 4-byte passer words", () => {
    expect(pawnCacheByteLength()).toBe(2 ** 14 * (8 + 8 + 4 + 4 + 4 + 4 + 4));
    expect(pawnCacheByteLength()).toBe(576 * 1024);
  });

  if (process.env.ENGINE_DEEP === "1") {
    it(
      "cold then warm, on every position of the walk, depth 3 [deep, ENGINE_DEEP=1]",
      walkRow(3),
      600_000,
    );
  }
});

// ---------------------------------------------------------------------------
// ABC-291 (E4b, `ADR-0075`): connected, phalanx and backward pawns. K1's rows; no search here.
// ---------------------------------------------------------------------------

/** K1 (a)'s new positions: the probe's `PAWN_SET`, offered to QE (`ADR-0075` § The probe's reading). */
const PAWN_SHAPE_POSITIONS: readonly string[] = [
  "4k3/8/8/8/3P4/2P5/1P6/4K3 w - - 0 1",
  "4k3/1p6/2p5/3p4/8/8/8/4K3 b - - 0 1",
  "4k3/8/8/3PP3/8/8/8/4K3 w - - 0 1",
  "4k3/8/8/8/P7/1P6/8/4K3 w - - 0 1",
  "4k3/8/8/7p/6p1/8/8/4K3 b - - 0 1",
  "4k3/8/8/4p3/2P5/3P4/8/4K3 w - - 0 1",
  "4k3/8/3p4/2p5/4P3/8/8/4K3 b - - 0 1",
  "4k3/8/8/4p3/8/3P4/8/4K3 w - - 0 1",
  "4k3/8/8/4p3/8/2PP4/8/4K3 w - - 0 1",
  "4k3/8/8/8/2P5/3P4/8/4K3 w - - 0 1",
  "4k3/8/8/8/2PPp3/8/3P4/4K3 w - - 0 1",
  "4k3/8/8/8/2Pp4/3P4/8/4K3 w - - 0 1",
  "4k3/8/8/6p1/6P1/7P/8/4K3 w - - 0 1",
  "4k3/8/p7/1p6/1P6/8/8/4K3 b - - 0 1",
  "r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1R w KQkq - 0 1",
  "r1bq1rk1/pp2bppp/2n1pn2/3p4/2PP4/2N2N2/PP2BPPP/R1BQ1RK1 b - - 0 1",
];

type ShapeSums = readonly [connected: number, phalanx: number, backward: number];

/**
 * K1 (c), by arithmetic from d1's words and d2's table: each side's connected, phalanx and backward
 * sums. R is the pawn's own rank index, so a white pawn on rank 4 is R 3 and a black one on rank 5
 * is R 3. Connected reads 2, 5, 10, 17, 28 at R 2 to 6; phalanx 1, 2, 5, 8, 14.
 */
const SEAM_ROWS: ReadonlyArray<
  readonly [id: string, fen: string, white: ShapeSums, black: ShapeSums]
> = [
  // Connected.
  ["connected, white: c3 R2, d4 R3", "4k3/8/8/8/3P4/2P5/1P6/4K3 w - - 0 1", [7, 0, 0], [0, 0, 0]],
  ["connected, black: c6 R2, d5 R3", "4k3/1p6/2p5/3p4/8/8/8/4K3 b - - 0 1", [0, 0, 0], [7, 0, 0]],
  [
    "connected once with two defenders: d5 R4",
    "4k3/8/8/3P4/2P1P3/8/8/4K3 w - - 0 1",
    [10, 0, 0],
    [0, 0, 0],
  ],
  ["connected at R6: d7, on a passer", "6k1/3P4/2P5/8/8/8/8/4K3 w - - 0 1", [28, 0, 0], [0, 0, 0]],
  ["connected, white a-file: a4 by b3", "4k3/8/8/8/P7/1P6/8/4K3 w - - 0 1", [5, 0, 0], [0, 0, 0]],
  ["connected, white h-file: h4 by g3", "4k3/8/8/8/7P/6P1/8/4K3 w - - 0 1", [5, 0, 0], [0, 0, 0]],
  ["connected, black a-file: a5 by b6", "4k3/8/1p6/p7/8/8/8/4K3 b - - 0 1", [0, 0, 0], [5, 0, 0]],
  ["connected, black h-file: h5 by g6", "4k3/8/6p1/7p/8/8/8/4K3 b - - 0 1", [0, 0, 0], [5, 0, 0]],
  // Phalanx.
  ["phalanx, white: d5 e5, each R4", "4k3/8/8/3PP3/8/8/8/4K3 w - - 0 1", [0, 10, 0], [0, 0, 0]],
  ["phalanx, black: d5 e5, each R3", "4k3/8/8/3pp3/8/8/8/4K3 b - - 0 1", [0, 0, 0], [0, 4, 0]],
  ["phalanx once per pawn: c5 d5 e5", "4k3/8/8/2PPP3/8/8/8/4K3 w - - 0 1", [0, 15, 0], [0, 0, 0]],
  ["phalanx at R6: c7 d7", "8/2PP2k1/8/8/8/8/8/4K3 w - - 0 1", [0, 28, 0], [0, 0, 0]],
  [
    "phalanx does not fire at R1: the start position",
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    [0, 0, 0],
    [0, 0, 0],
  ],
  ["phalanx, white a-file: a5 b5", "4k3/8/8/PP6/8/8/8/4K3 w - - 0 1", [0, 10, 0], [0, 0, 0]],
  ["phalanx, white h-file: g5 h5", "4k3/8/8/6PP/8/8/8/4K3 w - - 0 1", [0, 10, 0], [0, 0, 0]],
  ["phalanx, black a-file: a4 b4", "4k3/8/8/8/pp6/8/8/4K3 b - - 0 1", [0, 0, 0], [0, 10, 0]],
  ["phalanx, black h-file: g4 h4", "4k3/8/8/8/6pp/8/8/4K3 b - - 0 1", [0, 0, 0], [0, 10, 0]],
  [
    "connected and phalanx add on one pawn: d5",
    "4k3/8/8/2PP4/2P5/8/8/4K3 w - - 0 1",
    [10, 10, 0],
    [0, 0, 0],
  ],
  // Backward: clause (c) by each of its three squares, and both colours.
  [
    "backward, white: stop attacked from the right (e5)",
    "4k3/8/8/4p3/2P5/3P4/8/4K3 w - - 0 1",
    [5, 0, 10],
    [0, 0, 0],
  ],
  [
    "backward, white: stop attacked from the left (c5)",
    "4k3/8/8/2p5/4P3/3P4/8/4K3 w - - 0 1",
    [5, 0, 10],
    [0, 0, 0],
  ],
  [
    "backward, white: an enemy pawn on the stop square",
    "4k3/8/8/8/2Pp4/3P4/8/4K3 w - - 0 1",
    [5, 0, 10],
    [0, 0, 0],
  ],
  [
    "backward, black: stop attacked (e4)",
    "4k3/8/3p4/2p5/4P3/8/8/4K3 b - - 0 1",
    [0, 0, 0],
    [5, 0, 10],
  ],
  [
    "backward, black: an enemy pawn on the stop square",
    "4k3/8/3p4/2pP4/8/8/8/4K3 b - - 0 1",
    [0, 0, 0],
    [5, 0, 10],
  ],
  ["backward, white a-file: a3", "4k3/8/8/1p6/1P6/P7/8/4K3 w - - 0 1", [5, 0, 10], [0, 0, 0]],
  ["backward, white h-file: h3", "4k3/8/8/6p1/6P1/7P/8/4K3 w - - 0 1", [5, 0, 10], [0, 0, 0]],
  ["backward, black a-file: a6", "4k3/8/p7/1p6/1P6/8/8/4K3 b - - 0 1", [0, 0, 0], [5, 0, 10]],
  ["backward, black h-file: h6", "4k3/8/7p/6p1/6P1/8/8/4K3 b - - 0 1", [0, 0, 0], [5, 0, 10]],
  [
    "backward at R4: d5, stop attacked from the far rank (e7)",
    "4k3/4p3/2P5/3P4/8/8/8/4K3 w - - 0 1",
    [17, 0, 10],
    [0, 0, 0],
  ],
  // Each clause failing alone.
  [
    "clause (a) fails alone: d3 has no neighbour, so it is isolated",
    "4k3/8/8/4p3/8/3P4/8/4K3 w - - 0 1",
    [0, 0, 0],
    [0, 0, 0],
  ],
  [
    "clause (b) fails alone: a neighbour on rank R (c3)",
    "4k3/8/8/4p3/8/2PP4/8/4K3 w - - 0 1",
    [0, 2, 0],
    [0, 0, 0],
  ],
  [
    "clause (b) fails alone: a neighbour behind (c2)",
    "4k3/8/8/4p3/8/3P4/2P5/4K3 w - - 0 1",
    [2, 0, 0],
    [0, 0, 0],
  ],
  [
    "clause (b) fails on one side: c4 has passed d3, e2 has not",
    "4k3/8/8/4p3/2P5/3P4/4P3/4K3 w - - 0 1",
    [7, 0, 0],
    [0, 0, 0],
  ],
  [
    "clause (b) reads the rearmost neighbour: c3 behind c4",
    "4k3/8/8/4p3/2P5/2PP4/8/4K3 w - - 0 1",
    [5, 2, 0],
    [0, 0, 0],
  ],
  [
    "clause (c) fails alone: no enemy pawn",
    "4k3/8/8/8/2P5/3P4/8/4K3 w - - 0 1",
    [5, 0, 0],
    [0, 0, 0],
  ],
  [
    "clause (c) fails: e4 attacks d3, not its stop square",
    "4k3/8/8/8/2P1p3/3P4/8/4K3 w - - 0 1",
    [5, 0, 0],
    [0, 0, 0],
  ],
  // d1's exclusions.
  [
    "a backward rear pawn of a doubled pair pays backward: d2; the seam holds no DOUBLED part",
    "4k3/8/8/8/2PPp3/8/3P4/4K3 w - - 0 1",
    [0, 4, 10],
    [0, 0, 0],
  ],
  // QE's rows (`qe-ABC-291-k1` `…b850a2ad`): ids, words and values as `raw/k1-rows.mjs` has them.
  // K1 (c)'s letter: the double step and en passant are not read.
  [
    "N13: exclusion: double step not read, target attacked",
    "4k3/8/8/2p5/4P3/8/3P4/4K3 w - - 0 1",
    [0, 0, 0],
    [0, 0, 0],
  ],
  [
    "N14: exclusion: double step not read, target holds an enemy",
    "4k3/8/8/8/3pP3/8/3P4/4K3 w - - 0 1",
    [0, 0, 0],
    [0, 0, 0],
  ],
  [
    "N16: exclusion: en passant not read, field set",
    "4k3/8/4P3/8/2pP4/8/8/4K3 b - d3 0 1",
    [0, 0, 0],
    [0, 0, 0],
  ],
  ["N17: N16 with the field clear", "4k3/8/4P3/8/2pP4/8/8/4K3 b - - 0 1", [0, 0, 0], [0, 0, 0]],
  // Clause (b): a neighbour two or more ranks behind.
  [
    "L4: (b) alone: neighbour two behind, neither connected nor phalanx",
    "4k3/8/8/3p4/3P4/8/4P3/4K3 w - - 0 1",
    [0, 0, 0],
    [0, 0, 0],
  ],
  // Clause (c): the arms' reach, friends on the stop, pawns only.
  [
    "D2: both of a doubled pair: the stop attacked though a friend stands on it",
    "4k3/8/8/2p1P3/4p3/3P4/3P4/4K3 w - - 0 1",
    [0, 0, 20],
    [0, 0, 0],
  ],
  [
    "D3: friend on the stop, stop attacked",
    "4k3/8/4P3/2p5/3P4/3P4/8/4K3 w - - 0 1",
    [0, 0, 10],
    [0, 0, 0],
  ],
  ["N2: (c) alone: enemy on (f, R+2)", "4k3/8/8/3pP3/8/3P4/8/4K3 w - - 0 1", [0, 0, 0], [0, 0, 0]],
  [
    "N5: (c) alone: enemy on (f-1, R+3)",
    "4k3/8/2p5/4P3/8/3P4/8/4K3 w - - 0 1",
    [0, 0, 0],
    [0, 0, 0],
  ],
  [
    "N6: (c) alone: enemy on (f+1, R+3)",
    "4k3/8/4p3/2P5/8/3P4/8/4K3 w - - 0 1",
    [0, 0, 0],
    [0, 0, 0],
  ],
  [
    "N11: (c) alone: an enemy knight on the stop, pawns only",
    "4k3/8/8/4P3/3n4/3P4/8/4K3 w - - 0 1",
    [0, 0, 0],
    [0, 0, 0],
  ],
  [
    "N12: (c) alone: an enemy bishop on the attacker's square, pawns only",
    "4k3/8/8/2b1P3/8/3P4/8/4K3 w - - 0 1",
    [0, 0, 0],
    [0, 0, 0],
  ],
  // The a- and h-files are not neighbours.
  ["W1: wrap: h3 +9 lands on a5", "4k3/8/8/P7/8/7P/8/4K3 w - - 0 1", [0, 0, 0], [0, 0, 0]],
  ["W2: wrap: a3 +7 lands on h3", "4k3/8/8/8/8/P6P/8/4K3 w - - 0 1", [0, 0, 0], [0, 0, 0]],
  ["W3: wrap: h4 +1 lands on a5", "4k3/8/8/P7/7P/8/8/4K3 w - - 0 1", [0, 0, 0], [0, 0, 0]],
  ["W4: wrap: a4 -1 lands on h3", "4k3/8/8/8/P7/7P/8/4K3 w - - 0 1", [0, 0, 0], [0, 0, 0]],
  [
    "W5: wrap on (a): an h-file pawn is no neighbour of an a-file pawn",
    "4k3/8/8/p6P/P7/8/8/4K3 w - - 0 1",
    [0, 0, 0],
    [0, 0, 0],
  ],
  [
    "W6: wrap on (c): h4 does not attack a4",
    "4k3/8/1P6/8/7p/P7/8/4K3 w - - 0 1",
    [0, 0, 0],
    [0, 0, 0],
  ],
  [
    "W7: wrap on (c): a6 does not attack h4",
    "4k3/8/p5P1/8/8/7P/8/4K3 w - - 0 1",
    [0, 0, 0],
    [0, 0, 0],
  ],
  // The table at phalanx R5; backward by the edge stop arm, at R3 and at R5.
  ["P4: phalanx R5", "4k3/8/3PP3/8/8/8/8/4K3 w - - 0 1", [0, 16, 0], [0, 0, 0]],
  ["B9: backward, a-file, stop arm", "4k3/8/8/8/1P6/p7/P7/4K3 w - - 0 1", [0, 0, 10], [0, 0, 0]],
  ["B11: backward, h-file, stop arm", "4k3/8/8/8/6P1/7p/7P/4K3 w - - 0 1", [0, 0, 10], [0, 0, 0]],
  [
    "A5: (a) alone: enemy pawns are no neighbour; black's e5 is backward to d3",
    "4k3/8/8/4p3/3p4/3P4/8/4K3 w - - 0 1",
    [0, 0, 0],
    [10, 0, 10],
  ],
  [
    "B7: backward at R5 by stop; it still defends e7",
    "4k3/3pP3/3P4/8/8/8/8/4K3 w - - 0 1",
    [28, 0, 10],
    [0, 0, 0],
  ],
];

/** The same position with its files flipped, a to h. No castling right survives the flip. */
const fileFlip = (fen: string): string => {
  const [board = "", side = "", , ep = "-", ...clocks] = fen.split(" ");
  const ranks = board.split("/").map((rank) => [...rank].reverse().join(""));
  const flipped =
    ep === "-" ? ep : `${"hgfedcba"["abcdefgh".indexOf(ep.charAt(0))]}${ep.charAt(1)}`;
  return [ranks.join("/"), side, "-", flipped, ...clocks].join(" ");
};

/** Sums the seam's parts for one half, in `SEAM_ROWS`' order. */
const sums = (
  parts: ReturnType<typeof pawnShapeForTest>["white"],
  half: "mg" | "eg",
): ShapeSums => [parts.connected[half], parts.phalanx[half], parts.backward[half]];

/** The seam's white minus black, one half: the two bonuses less the penalty, per side. */
const seamNet = (position: Position, half: "mg" | "eg"): number => {
  const { white, black } = pawnShapeForTest(position);
  const side = (parts: typeof white): number =>
    parts.connected[half] + parts.phalanx[half] - parts.backward[half];
  return side(white) - side(black);
};

const offAtOwnPhase = (position: Position): number =>
  evaluateAtPhaseWithoutPawnShape(position, phaseOf(position));

const shapeCorpus = (): Position[] => [
  ...buildCorpus().map(({ position }) => position),
  ...TAPER_MIRROR_POSITIONS.map(({ fen }) => parseFen(fen)),
  ...PAWN_SHAPE_POSITIONS.map((fen) => parseFen(fen)),
];

describe("ABC-291 K1 (a) — the mirror, Object.is, 0 mismatches", () => {
  it("G3, TAPER_MIRROR_POSITIONS and 16 pawn-shape positions", () => {
    expect(PAWN_SHAPE_POSITIONS).toHaveLength(16);
    const positions = shapeCorpus();
    expect(positions).toHaveLength(184 + TAPER_MIRROR_POSITIONS.length + 16);
    const differ = positions.filter((p) => !Object.is(evaluate(p), evaluate(mirrorPosition(p))));
    expect(differ.map((p) => toFen(p))).toEqual([]);
  });
});

describe("ABC-291 K1 (c) — the seam by arithmetic, per side (ADR-0075 d1 and d2)", () => {
  for (const [id, fen, white, black] of SEAM_ROWS) {
    it(id, () => {
      const position = parseFen(fen);
      const seam = pawnShapeForTest(position);
      expect([sums(seam.white, "mg"), sums(seam.black, "mg")]).toEqual([white, black]);
      expect([sums(seam.white, "eg"), sums(seam.black, "eg")]).toEqual([white, black]);
      // The colour mirror swaps the two sides, part for part.
      const mirrored = pawnShapeForTest(mirrorPosition(position));
      expect([sums(mirrored.white, "mg"), sums(mirrored.black, "mg")]).toEqual([black, white]);
      // The file flip keeps both sides' sums: QE's four images, and the other wing of each row.
      const flipped = parseFen(fileFlip(fen));
      const wing = pawnShapeForTest(flipped);
      expect([sums(wing.white, "mg"), sums(wing.black, "mg")]).toEqual([white, black]);
      const both = pawnShapeForTest(mirrorPosition(flipped));
      expect([sums(both.white, "eg"), sums(both.black, "eg")]).toEqual([black, white]);
    });
  }
});

const UNEQUAL_HALVES = {
  ...PARAMS,
  PAWN_CONNECTED: { mg: [0, 0, 3, 6, 11, 19, 30, 0], eg: [0, 0, 7, 13, 23, 37, 61, 0] },
  PAWN_PHALANX: { mg: [0, 0, 2, 3, 6, 9, 15, 0], eg: [0, 0, 5, 9, 17, 29, 47, 0] },
  PAWN_BACKWARD: { mg: 7, eg: 19 },
};

describe("ABC-291 K1 (d) — the hot path against the seam (QE-271-h)", () => {
  it("evaluate minus the off door is the seam's white minus black, signed for the side to move, exactly", () => {
    const positions = [...shapeCorpus(), ...SEAM_ROWS.map(([, fen]) => parseFen(fen))];
    const misses = positions.filter((position) => {
      const net = seamNet(position, "mg");
      expect(seamNet(position, "eg")).toBe(net);
      return evaluate(position) - offAtOwnPhase(position) !== (position.blackToMove ? -net : net);
    });
    expect(misses.map((p) => toFen(p))).toEqual([]);
    expect(positions.filter((p) => evaluate(p) !== offAtOwnPhase(p)).length).toBeGreaterThan(100);
  });

  /**
   * `ADR-0070` d4's own-phase form: each position at its own phase, so the part's two halves enter
   * the blend. mg and Δ are the off door's at the same table, read at phases 24 and 0, and the
   * seam's two halves move them. The off door holds no shape part, so it fixes the rest.
   */
  it("at unequal test halves the part enters the blend, each position at its own phase", () => {
    const whitePov = (position: Position, score: number): number =>
      position.blackToMove ? 0 - score : score;
    const misses = withParametersForTest(UNEQUAL_HALVES, () =>
      [...shapeCorpus(), ...SEAM_ROWS.map(([, fen]) => parseFen(fen))].filter((position) => {
        const off = (phase: number): number =>
          whitePov(position, evaluateAtPhaseWithoutPawnShape(position, phase));
        const netMg = seamNet(position, "mg");
        const netEg = seamNet(position, "eg");
        const phase = phaseOf(position);
        const mg = off(24);
        const delta = off(0) - mg;
        const blend = ((delta + netEg - netMg) * (24 - Math.min(phase, 24))) / 24;
        const want = mg + netMg + Math.trunc(blend);
        return whitePov(position, evaluateAtPhase(position, phase)) !== want;
      }),
    );
    expect(misses.map((p) => toFen(p))).toEqual([]);
  });

  it("the unequal halves really differ on the seam: the chain reads 3 + 6 and 7 + 13", () => {
    withParametersForTest(UNEQUAL_HALVES, () => {
      const { white } = pawnShapeForTest(parseFen("4k3/8/8/8/3P4/2P5/1P6/4K3 w - - 0 1"));
      expect(white.connected).toEqual({ mg: 9, eg: 20 });
    });
  });
});

describe("ABC-291 K1 (e) — each export is d2's rule, rebuilt from the anchors at ADR-0075's date", () => {
  const PASSED_AT_ADR = {
    mg: [0, 5, 10, 20, 35, 60, 100, 0],
    eg: [0, 10, 20, 40, 70, 120, 200, 0],
  };
  const ISOLATED_AT_ADR = { mg: 10, eg: 10 };
  for (const half of ["mg", "eg"] as const) {
    it(`${half}: backward is isolated; connected and phalanx follow the passer, anchored at R 4`, () => {
      const passed = PASSED_AT_ADR[half];
      const isolated = ISOLATED_AT_ADR[half];
      const rule = (value: (rank: number) => number): number[] =>
        passed.map((_, rank) => (rank >= 2 && rank <= 6 ? value(rank) : 0));
      const connected = rule((rank) =>
        Math.floor(((passed[rank] as number) * isolated) / (passed[4] as number)),
      );
      expect(PARAMS.PAWN_BACKWARD[half]).toBe(isolated);
      expect(PARAMS.PAWN_CONNECTED[half]).toEqual(connected);
      expect(PARAMS.PAWN_PHALANX[half]).toEqual(
        rule((rank) => Math.floor((connected[rank] as number) / 2)),
      );
    });
  }

  it("d2's table, by value: the rule above cannot drift with it", () => {
    expect(PARAMS.PAWN_CONNECTED.mg).toEqual([0, 0, 2, 5, 10, 17, 28, 0]);
    expect(PARAMS.PAWN_CONNECTED.eg).toEqual(PARAMS.PAWN_CONNECTED.mg);
    expect(PARAMS.PAWN_PHALANX.mg).toEqual([0, 0, 1, 2, 5, 8, 14, 0]);
    expect(PARAMS.PAWN_PHALANX.eg).toEqual(PARAMS.PAWN_PHALANX.mg);
    expect(PARAMS.PAWN_BACKWARD).toEqual({ mg: 10, eg: 10 });
  });
});

describe("ABC-291 K1 (g) — the memo: a hit returns what a fresh pawnStructure returns, shape part included", () => {
  it("cold miss then hit, each equal to the fresh call, and the shape part is what the seam nets", () => {
    clearPawnCacheForTest();
    for (const position of shapeCorpus()) {
      const fresh = pawnStructureForTest(position, false);
      expect(pawnStructureForTest(position, true), toFen(position)).toEqual(fresh);
      expect(pawnCacheProbeForTest(position).hit, toFen(position)).toBe(true);
      expect(pawnStructureForTest(position, true), toFen(position)).toEqual(fresh);
      const packed = seamNet(position, "eg") * 65536 + seamNet(position, "mg");
      expect(fresh.shape, toFen(position)).toBe(packed);
    }
    clearPawnCacheForTest();
  });

  it("a forced collision: two placements on one slot, with different shape parts, each return their own", () => {
    let seed = 291;
    const next = (bound: number): number => {
      seed = (Math.imul(seed, 1103515245) + 12345) & 0x7fffffff;
      return (seed >>> 8) % bound;
    };
    const placement = (): Position => {
      const position = emptyPosition();
      position.board[parseSquareName("e1")] = KING;
      position.board[parseSquareName("e8")] = KING | BLACK;
      for (let i = 0; i < 10; i++) {
        const square = (1 + next(6)) * 16 + next(8);
        if (position.board[square] === EMPTY) {
          position.board[square] = next(2) === 0 ? PAWN : PAWN | BLACK;
        }
      }
      return position;
    };
    const bySlot = new Map<number, Position>();
    let pair: [Position, Position] | null = null;
    for (let i = 0; i < 100_000 && pair === null; i++) {
      const position = placement();
      const { slot } = pawnCacheProbeForTest(position);
      const other = bySlot.get(slot);
      if (other === undefined) bySlot.set(slot, position);
      else if (
        pawnStructureForTest(other, false).shape !== pawnStructureForTest(position, false).shape
      ) {
        pair = [other, position];
      }
    }
    expect(pair).not.toBeNull();
    const [a, b] = pair as [Position, Position];
    clearPawnCacheForTest();
    for (let round = 0; round < 3; round++) {
      for (const position of [a, b]) {
        expect(pawnCacheProbeForTest(position).hit).toBe(false);
        expect(pawnStructureForTest(position, true)).toEqual(pawnStructureForTest(position, false));
        expect(pawnCacheProbeForTest(position).hit).toBe(true);
        expect(pawnStructureForTest(position, true)).toEqual(pawnStructureForTest(position, false));
      }
    }
    clearPawnCacheForTest();
  });

  it("on then off, and off then on, of one slot: each entry reads its own value", () => {
    for (const position of shapeCorpus()) {
      clearPawnCacheForTest();
      const offFirst = offAtOwnPhase(position);
      const onSecond = evaluate(position);
      clearPawnCacheForTest();
      const onFirst = evaluate(position);
      const offSecond = offAtOwnPhase(position);
      expect(Object.is(offFirst, offSecond), toFen(position)).toBe(true);
      expect(Object.is(onFirst, onSecond), toFen(position)).toBe(true);
    }
    clearPawnCacheForTest();
  });
});

describe("ABC-291 — the source rows (ADR-0075 d3 and d4; K1 (h))", () => {
  const read = (name: string): string =>
    readFileSync(new URL(name, import.meta.url), "utf8").replace(/\s+/g, " ");
  const SEARCH = read("./search.ts");
  const ENGINE = read("./engine.ts");
  const QUIESCENCE = read("./quiescence.ts");
  const EVALUATE = read("./evaluate.ts");
  const doors = (source: string): [string, string][] =>
    source
      .split(/(?=export function )/)
      .map((block): [string, string] => [/^export function (\w+)/.exec(block)?.[1] ?? "", block])
      .filter(([name]) => /^(search|chooseMove)(Without\w+)?$/.test(name));

  for (const [file, source, shipped, door, total] of [
    ["./search.ts", SEARCH, "search", "searchWithoutPawnShape", 22],
    ["./engine.ts", ENGINE, "chooseMove", "chooseMoveWithoutPawnShape", 17],
  ] as const) {
    it(`${file}: every entry passes one pawnShape literal, true on ${shipped} only; ${door} is ${shipped} with it off`, () => {
      const found = doors(source);
      expect(found).toHaveLength(total);
      for (const [name, block] of found) {
        expect(block.match(/pawnShape: \w+,/g), name).toEqual([
          `pawnShape: ${name === shipped ? "true" : "false"},`,
        ]);
      }
      const record = (name: string): string =>
        (found.find(([entry]) => entry === name)?.[1] ?? "")
          .replace(/^[^{]*\{/, "")
          .replace(/pawnShape: \w+,/, "")
          .replace(/ \/\*\*.*$/, "");
      expect(record(door).length).toBeGreaterThan(100);
      expect(record(door)).toBe(record(shipped));
    });
  }

  it("the evaluate entries: evaluateWithoutTaper never adds the part; the mobility and memo doors keep it", () => {
    expect(EVALUATE).toContain("whiteMinusBlack(position, true, true, false, false, 0)");
    expect(EVALUATE).toContain(
      "whiteMinusBlack(position, false, true, true, true, phaseOf(position))",
    );
    expect(EVALUATE).toContain(
      "whiteMinusBlack(position, true, false, true, true, phaseOf(position))",
    );
  });

  it("the memo: 2^14 slots, doubled and isolated in one word (d5's cut), one shape word, added by the caller", () => {
    expect(EVALUATE).not.toMatch(/pawnCacheDoubled\b|pawnCacheIsolated\b/);
    expect(EVALUATE).toContain(
      "const pawnCacheDoubledIsolated = new Int32Array(PAWN_CACHE_SLOTS);",
    );
    expect(EVALUATE).toContain("const pawnCacheShape = new Int32Array(PAWN_CACHE_SLOTS);");
    expect(EVALUATE).toContain("return doubled + isolated + passed;");
    expect(EVALUATE).toContain(
      "const packed = score + structure + kingSafety + (pawnShape ? shapePart : 0);",
    );
  });

  const tree = (directory: string): string[] => {
    const root = new URL("../", import.meta.url).pathname;
    return (readdirSync(`${root}${directory}`, { recursive: true }) as string[])
      .map((name) => `${directory}${name}`)
      .filter((name) => name.endsWith(".ts") && !name.endsWith(".test.ts"));
  };
  const callers = (name: string): string[] => {
    const root = new URL("../", import.meta.url).pathname;
    return [...tree("src/"), ...tree("tools/")]
      .filter((file) => file !== "src/evaluate.ts")
      .filter((file) => readFileSync(`${root}${file}`, "utf8").includes(name));
  };

  it("K1 (h): pawnShapeForTest is called from test files only", () => {
    expect(tree("src/").length).toBeGreaterThan(20);
    expect(callers("pawnShapeForTest")).toEqual([]);
    expect(EVALUATE.split("pawnShapeForTest(").length - 1).toBe(1);
  });

  /**
   * `ABC-291`, 2026-11-06 (`…2d2c2bad` § 2): this row reads `ADR-0075` K1 (h)'s dated line, which
   * says how K1 (h) reads for this export beside d4.
   */
  it("evaluateAtPhaseWithoutPawnShape: outside test files, only the three off branches d4 puts it on", () => {
    expect(callers("evaluateAtPhaseWithoutPawnShape")).toEqual([
      "src/quiescence.ts",
      "src/search.ts",
    ]);
    const calls = (source: string): number =>
      source.split("evaluateAtPhaseWithoutPawnShape(position, phase)").length - 1;
    expect(calls(SEARCH)).toBe(2);
    expect(calls(QUIESCENCE)).toBe(1);
    expect(calls(ENGINE)).toBe(0);
    expect(SEARCH).toContain(
      "const staticScore = taper ? pawnShape ? evaluateAtPhase(position, phase) : evaluateAtPhaseWithoutPawnShape(position, phase)",
    );
  });

  /**
   * `ABC-291`, 2026-11-06 (`…2d2c2bad` § 5 item 3): the read `ADR-0075` K1 (h)'s dated line adds,
   * d4's "on in `search()` and `chooseMove` only". Each carrier is named by the top-level
   * declaration whose body holds it. Source only, no search.
   */
  it("d4: pawnShape: true stands in each RULES_PAWN_SHAPE and in search()'s and chooseMove's own bodies, under tools/ in QUIET_RULES and its name, and nowhere else", () => {
    const root = new URL("../", import.meta.url).pathname;
    const files = ["src/", "tools/"].flatMap((directory) =>
      (readdirSync(`${root}${directory}`, { recursive: true }) as string[])
        .map((name) => `${directory}${name}`)
        .filter((name) => /\.(ts|js)$/.test(name) && !/\.test\.ts$/.test(name)),
    );
    const owner = (source: string, at: number): string => {
      const before = source.slice(0, at);
      const opened = [...before.matchAll(/^(?:export )?(?:const|function) (\w+)/gm)].at(-1);
      if (opened === undefined || before.lastIndexOf("\n}") > opened.index) return "no declaration";
      return opened[1] ?? "no declaration";
    };
    const carriers = files.flatMap((file) => {
      const source = readFileSync(`${root}${file}`, "utf8");
      return [...source.matchAll(/pawnShape:\s*true/g)].map(
        (found) => `${file} ${owner(source, found.index)}`,
      );
    });
    expect(carriers.sort()).toEqual([
      "src/engine.ts RULES_PAWN_SHAPE",
      "src/engine.ts chooseMove",
      "src/search.ts RULES_PAWN_SHAPE",
      "src/search.ts search",
      "tools/tune/tune.ts QUIET_RULES",
      "tools/tune/tune.ts QUIET_RULES_NAME",
    ]);
  });
});
