/**
 * ABC-006 perft harness — the runnable side of the perft verification (`npm run perft`).
 *
 * Prints the six standard positions' node counts, a `perftDivide` breakdown, and a nodes/sec
 * measurement that feeds NFR-001 and the EPIC-004 engine work. It is a CLI, not a test: the
 * exact-count acceptance lives in perft.test.ts; this is the human-facing tool and the throughput
 * probe. Correctness is not asserted here — a wrong count would show as a mismatch line.
 *
 * On the nodes/sec figure, read the ABC-008 spike note first: classic perft counts free leaf
 * nodes (a leaf at depth 0 returns 1 without generating), so the rate below is INFLATED relative
 * to an engine's real per-node throughput. It is reported because NFR-001 names a perft-style
 * target, but the search-shaped number from the spike is the one that maps onto engine strength.
 */

import { parseFen } from "./fen.ts";
import { perft, perftDivide } from "./perft.ts";

interface Position {
  readonly name: string;
  readonly fen: string;
  /** Depth to run in this harness — chosen to finish in well under a second per position. */
  readonly depth: number;
}

const POSITIONS: readonly Position[] = [
  { name: "startpos", fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", depth: 4 },
  {
    name: "kiwipete",
    fen: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
    depth: 4,
  },
  { name: "position-3", fen: "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1", depth: 5 },
  {
    name: "position-4",
    fen: "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
    depth: 4,
  },
  {
    name: "position-5",
    fen: "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
    depth: 4,
  },
  {
    name: "position-6",
    fen: "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
    depth: 4,
  },
];

const NFR_001_TARGET = 1_000_000;

const rate = (nodes: number, seconds: number): string =>
  `${Math.round(nodes / seconds).toLocaleString("en-US")}/sec`;

function main(): void {
  console.log("ABC-006 perft harness — move-generation correctness + throughput");
  console.log("================================================================");
  console.log(`node       ${process.version}`);
  console.log(`platform   ${process.platform}/${process.arch}`);
  console.log("");

  // Warm the JIT so the reported rate reflects steady state, not the cold interpreter.
  perft(parseFen(POSITIONS[0]?.fen ?? ""), 3);

  let totalNodes = 0;
  let totalSeconds = 0;

  console.log("Node counts (leaf nodes of the legal move tree):");
  for (const { name, fen, depth } of POSITIONS) {
    const started = process.hrtime.bigint();
    const nodes = perft(parseFen(fen), depth);
    const seconds = Number(process.hrtime.bigint() - started) / 1e9;
    totalNodes += nodes;
    totalSeconds += seconds;
    console.log(
      `  ${name.padEnd(12)} perft(${depth}) = ${nodes.toLocaleString("en-US").padStart(12)}` +
        `   ${seconds.toFixed(3)} s   ${rate(nodes, seconds)}`,
    );
  }

  console.log("");
  console.log("perftDivide — kiwipete depth 3 (per first move; the counts sum to 97,862):");
  const divide = perftDivide(
    parseFen("r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"),
    3,
  );
  for (const entry of divide) {
    console.log(`  ${entry.move}: ${entry.nodes.toLocaleString("en-US")}`);
  }
  const divideSum = divide.reduce((sum, entry) => sum + entry.nodes, 0);
  console.log(`  ---- ${divide.length} moves, sum ${divideSum.toLocaleString("en-US")}`);

  console.log("");
  const overallRate = totalNodes / totalSeconds;
  console.log(
    `Throughput   ${totalNodes.toLocaleString("en-US")} nodes in ${totalSeconds.toFixed(3)} s` +
      `  =>  ${rate(totalNodes, totalSeconds)}`,
  );
  console.log(
    `NFR-001      >= ${NFR_001_TARGET.toLocaleString("en-US")} nodes/sec  ` +
      `${overallRate >= NFR_001_TARGET ? "AT OR ABOVE target" : "BELOW target — raise against RISK-002"}`,
  );
  console.log("");
  console.log(
    "Caveat (see the ABC-008 spike): this is CLASSIC perft — a leaf at depth 0 returns 1",
  );
  console.log("without generating, so most counted nodes did no work and the rate is INFLATED");
  console.log(
    "relative to real engine throughput. The spike's search-shaped metric is the one that",
  );
  console.log("maps onto engine strength; NFR-005 is read against that, not against this figure.");
}

main();
