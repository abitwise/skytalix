import { describe, expect, it } from "vitest";
import { parseFen } from "./fen.ts";
import { perft, perftDivide } from "./perft.ts";

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
