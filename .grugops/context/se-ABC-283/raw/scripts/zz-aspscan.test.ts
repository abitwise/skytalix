// SCRATCH, never committed: copied into src/ for one run, then deleted.
import { it, vi } from "vitest";
import { makeMove, unmakeMove } from "./apply.ts";
import { chooseMove, chooseMoveWithoutAspiration } from "./engine.ts";
import { parseFen, toFen } from "./fen.ts";
import { gameStatus } from "./gameend.ts";
import { legalMoves } from "./legal.ts";
import { squareName } from "./position.ts";
import { MATE_CORPUS } from "./search.mate-corpus.ts";
import { MATE_SCORE } from "./search.ts";

const log = vi.hoisted(() => ({ stores: [] as { depth: number; bound: number; score: number }[] }));
vi.mock("./transposition.ts", async (importOriginal) => {
  const real = await importOriginal<typeof import("./transposition.ts")>();
  return {
    ...real,
    storeEntry: (...args: Parameters<typeof real.storeEntry>) => {
      if (args[4] === 0) log.stores.push({ depth: args[1], bound: args[2], score: args[3] });
      real.storeEntry(...args);
    },
  };
});
const ROOTS = [
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
];
const mv = (m: { from: number; to: number }) => squareName(m.from) + squareName(m.to);
it("scan", () => {
  const rows: string[] = [];
  for (const fen of ROOTS) {
    rows.push(fen);
    const p = parseFen(fen);
    for (const m of legalMoves(p)) { const u = makeMove(p, m); if (gameStatus(p).result === "in-progress") rows.push(toFen(p)); unmakeMove(p, m, u); }
  }
  const D = Number(process.env.D ?? 6);
  for (const [tag, list] of [["c190", rows], ["mate", MATE_CORPUS]] as const) {
    for (const fen of list) {
      log.stores = [];
      const t0 = performance.now();
      const h = chooseMove(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth: D })!;
      const ms = performance.now() - t0;
      const highs = log.stores.filter((s) => s.bound === 2).map((s) => `d${s.depth}:${s.score}`);
      const d = chooseMoveWithoutAspiration(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth: D })!;
      const mate = Math.abs(h.score) > MATE_SCORE - 1000;
      if (highs.length > 0 || h.nodes !== d.nodes)
        console.log(JSON.stringify({ tag, fen, D, ms: +ms.toFixed(1), highs, head: [mv(h.move), h.score, h.nodes], door: [mv(d.move), d.score, d.nodes], mate }));
    }
  }
}, 600_000);
