import { join } from "node:path"; import { writeFileSync } from "node:fs";
const [clone, out] = process.argv.slice(2);
const { parseFen, toFen } = await import(join(clone, "src/fen.ts"));
const { legalMoves, isInCheck } = await import(join(clone, "src/legal.ts"));
const named = [
  ["start", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"],
  ["endgame-cpw3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],
  ["in-check", "rnbqk1nr/pppp1ppp/8/4P3/1b6/8/PPP1PPPP/RNBQKBNR w KQkq - 1 3"],
];
const r = named.map(([name, fen]) => { const p = parseFen(fen); return { name, fen: toFen(p), check: isInCheck(p), legal: legalMoves(p).length }; });
console.log(r); writeFileSync(out, JSON.stringify(r, null, 1));
