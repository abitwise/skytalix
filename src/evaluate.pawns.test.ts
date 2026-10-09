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
 */

import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  buildCorpus,
  clonePosition,
  mirrorPosition,
  PERFT_POSITIONS,
} from "./evaluate.mirror-corpus.ts";
import { evaluate, isPassedPawn } from "./evaluate.ts";
import { parseFen } from "./fen.ts";
import { PAWN, type Position, parseSquareName, pieceType } from "./position.ts";

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
    fen: "2k5/3P4/4p3/8/8/8/8/4K3 w - - 0 1",
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

/** `A2`: the same two white pawns, sharing the c-file (c3/c4) or side by side (c3/d3). PST-neutral. */
const DOUBLED = "4k3/2pp4/8/8/2P5/2P5/8/4K3 w - - 0 1";
const SIDE_BY_SIDE = "4k3/2pp4/8/8/8/2PP4/8/4K3 w - - 0 1";

/** `A3`: d4 supported by c3/e3, the same d4 alone, and the same material on a3/g3 (all isolated). */
const SUPPORTED = "4k3/1ppppp2/8/8/3P4/2P1P3/8/4K3 w - - 0 1";
const ALONE = "4k3/1ppppp2/8/8/3P4/8/8/4K3 w - - 0 1";
const SPREAD = "4k3/1ppppp2/8/8/3P4/P5P1/8/4K3 w - - 0 1";

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
