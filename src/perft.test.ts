import { describe, expect, it } from "vitest";
import {
  createUndoStack,
  makeMove,
  makeMovePacked,
  unmakeMove,
  unmakeMovePacked,
} from "./apply.ts";
import { parseFen } from "./fen.ts";
import { legalMoves, legalMovesPacked } from "./legal.ts";
import { perft, perftDivide } from "./perft.ts";
import type { Position } from "./position.ts";
import { zobristKey, zobristKeyAfterMove, zobristKeyAfterMovePacked } from "./zobrist.ts";

/**
 * The six standard perft positions and their published leaf-node counts, transcribed from the
 * Chess Programming Wiki "Perft Results" page and every value re-verified against this
 * generator before being encoded (a wrong expected number sends a debugger hunting a bug that
 * does not exist). `counts[i]` is the exact count at depth `i + 1`; `fast` is the deepest depth
 * run in the DEFAULT suite. Depths beyond `fast` are the acceptance table's deeper rows and run
 * only under `PERFT_DEEP=1`, keeping the default `npm test` fast while the opt-in lane proves
 * the full published table (Kiwipete d4, startpos d5, and the rest).
 */
const PERFT_SUITE: ReadonlyArray<{
  name: string;
  fen: string;
  counts: readonly number[];
  fast: number;
}> = [
  {
    name: "startpos",
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    counts: [20, 400, 8902, 197281, 4865609],
    fast: 4,
  },
  {
    name: "kiwipete",
    fen: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
    counts: [48, 2039, 97862, 4085603],
    fast: 3,
  },
  {
    name: "position-3",
    fen: "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
    counts: [14, 191, 2812, 43238, 674624, 11030083],
    fast: 4,
  },
  {
    name: "position-4",
    fen: "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
    counts: [6, 264, 9467, 422333, 15833292],
    fast: 3,
  },
  {
    name: "position-5",
    fen: "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
    counts: [44, 1486, 62379, 2103487],
    fast: 3,
  },
  {
    name: "position-6",
    fen: "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
    counts: [46, 2079, 89890, 3894594],
    fast: 3,
  },
];

const KIWIPETE = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1";
const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/**
 * `PERFT_DEEP=1` registers the deeper acceptance rows. When it is unset the deep cases are not
 * defined at all — they are absent from the run, never marked skipped, so they do not touch the
 * gate's test-integrity skip count.
 */
const RUN_DEEP = process.env.PERFT_DEEP === "1";

// ---------------------------------------------------------------------------
// Acceptance — exact node counts. A near-miss is a failure; there is no tolerance.
// ---------------------------------------------------------------------------

describe("ABC-006 acceptance — exact perft counts", () => {
  for (const { name, fen, counts, fast } of PERFT_SUITE) {
    for (let depth = 1; depth <= counts.length; depth++) {
      const expected = counts[depth - 1] as number;
      const deep = depth > fast;
      if (deep && !RUN_DEEP) continue; // absent in the default run, not skipped

      // The deep lane is the slow lane by design (a full-depth position runs into millions of
      // nodes and tens of seconds under the runner), so it gets a generous timeout; the fast
      // default lane keeps vitest's standard 5s.
      it(
        `${name} perft(${depth}) = ${expected}${deep ? " [deep, PERFT_DEEP=1]" : ""}`,
        () => {
          expect(perft(parseFen(fen), depth)).toBe(expected);
        },
        deep ? 120_000 : undefined,
      );
    }
  }
});

// ---------------------------------------------------------------------------
// perftDivide — the per-first-move breakdown used to bisect a wrong total.
// ---------------------------------------------------------------------------

describe("ABC-006 — perftDivide", () => {
  it("splits Kiwipete depth 3 into one entry per legal first move that sums to the total", () => {
    const entries = perftDivide(parseFen(KIWIPETE), 3);

    // Kiwipete has 48 legal first moves (its own perft depth 1), and the subtree sizes sum to depth-3.
    expect(entries).toHaveLength(48);
    const total = entries.reduce((sum, entry) => sum + entry.nodes, 0);
    expect(total).toBe(97862);
  });

  it("labels each move in long algebraic coordinate notation", () => {
    const labels = perftDivide(parseFen(START_FEN), 1).map((entry) => entry.move);

    expect(labels).toHaveLength(20);
    expect(labels.every((label) => /^[a-h][1-8][a-h][1-8][qrbn]?$/.test(label))).toBe(true);
    expect(labels).toContain("e2e4");
    expect(labels).toContain("g1f3");
  });

  it("emits promotion labels carrying the promoted piece letter", () => {
    // A pawn on e7 with e8 empty divides into four labelled promotions at depth 1.
    const labels = perftDivide(parseFen("7k/4P3/8/8/8/8/8/4K3 w - - 0 1"), 1)
      .map((entry) => entry.move)
      .filter((label) => label.startsWith("e7e8"));

    expect(labels.sort()).toEqual(["e7e8b", "e7e8n", "e7e8q", "e7e8r"]);
  });
});

// ---------------------------------------------------------------------------
// Unit — the base case.
// ---------------------------------------------------------------------------

describe("perft base case", () => {
  it("counts one node at depth 0 (the position itself)", () => {
    expect(perft(parseFen(START_FEN), 0)).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// ABC-250 A1 — perft and key identity on the packed path (ADR-0055 O1-b part 1, D3 validity rows 1
// and 2). `perft` itself now runs packed, so every count row above reads the packed path. Here the
// XOR of every leaf's Zobrist key, carried down by the packed key delta, must equal the XOR the
// OBJECT path carries down (`legalMoves`, `makeMove`, `zobristKeyAfterMove`), and both leaf counts
// must equal the published count. The lane reads depth 2 and also checks each packed delta against
// a fresh `zobristKey`; `PERFT_DEEP=1` reads `src/perft-bench.ts`'s depths.
// ---------------------------------------------------------------------------

/** `src/perft-bench.ts`'s depth per position. */
const BENCH_DEPTH: Readonly<Record<string, number>> = {
  startpos: 4,
  kiwipete: 4,
  "position-3": 5,
  "position-4": 4,
  "position-5": 4,
  "position-6": 4,
};

interface LeafXor {
  leaves: number;
  xor: bigint;
  freshMismatches: number;
}

function objectLeafXor(position: Position, depth: number): LeafXor {
  const tally: LeafXor = { leaves: 0, xor: 0n, freshMismatches: 0 };
  const walk = (key: bigint, left: number): void => {
    if (left === 0) {
      tally.leaves++;
      tally.xor ^= key;
      return;
    }
    for (const move of legalMoves(position)) {
      const undo = makeMove(position, move);
      walk(zobristKeyAfterMove(key, position, move, undo), left - 1);
      unmakeMove(position, move, undo);
    }
  };
  walk(zobristKey(position), depth);
  return tally;
}

const xorMoves = new Int32Array(128 * 256);
const xorUndo = createUndoStack(128);

function packedLeafXor(position: Position, depth: number, checkFresh: boolean): LeafXor {
  const tally: LeafXor = { leaves: 0, xor: 0n, freshMismatches: 0 };
  const walk = (key: bigint, left: number, ply: number, start: number): void => {
    if (left === 0) {
      tally.leaves++;
      tally.xor ^= key;
      return;
    }
    const end = legalMovesPacked(position, xorMoves, start);
    for (let i = start; i < end; i++) {
      const move = xorMoves[i] as number;
      makeMovePacked(position, move, xorUndo, ply);
      const after = zobristKeyAfterMovePacked(key, position, move, xorUndo, ply);
      if (checkFresh && after !== zobristKey(position)) tally.freshMismatches++;
      walk(after, left - 1, ply + 1, end);
      unmakeMovePacked(position, move, xorUndo, ply);
    }
  };
  walk(zobristKey(position), depth, 0, 0);
  return tally;
}

describe("ABC-250 A1 — leaf-key XOR on the packed path equals the object path", () => {
  for (const { name, fen, counts } of PERFT_SUITE) {
    it(`${name} depth 2: counts, leaf-key XOR, every packed key delta equals a fresh key`, () => {
      const packed = packedLeafXor(parseFen(fen), 2, true);
      const object = objectLeafXor(parseFen(fen), 2);
      expect(packed.freshMismatches).toBe(0);
      expect(packed.leaves).toBe(counts[1]);
      expect(object.leaves).toBe(counts[1]);
      expect(packed.xor).toBe(object.xor);
    });

    if (RUN_DEEP) {
      const depth = BENCH_DEPTH[name] as number;
      it(`${name} depth ${depth} (perft-bench): counts and leaf-key XOR [deep, PERFT_DEEP=1]`, () => {
        const packed = packedLeafXor(parseFen(fen), depth, false);
        const object = objectLeafXor(parseFen(fen), depth);
        expect(packed.leaves).toBe(counts[depth - 1]);
        expect(object.leaves).toBe(counts[depth - 1]);
        expect(packed.xor).toBe(object.xor);
      }, 600_000);
    }
  }

  it("refuses a depth beyond its fixed stack instead of overrunning it", () => {
    expect(() => perft(parseFen(START_FEN), 129)).toThrow(RangeError);
    expect(() => perftDivide(parseFen(START_FEN), 129)).toThrow(RangeError);
  });
});
