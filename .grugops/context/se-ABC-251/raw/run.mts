// se-ABC-251 profile: one fresh-process chooseMove at 4 000 ms on one board. Usage: node run.mts <srcDir> <board> <outJson>
import { writeFileSync } from "node:fs";
import { loadavg } from "node:os";
const [srcDir, board, out] = process.argv.slice(2);
const { chooseMove } = await import(`${srcDir}/engine.ts`);
const { parseFen } = await import(`${srcDir}/fen.ts`);
const BOARDS: Record<string, string> = {
  start: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};
const pos = parseFen(BOARDS[board]);
const load1 = loadavg()[0];
const t0 = process.hrtime.bigint();
const c = chooseMove(pos, { budgetMs: 4000 });
const t1 = process.hrtime.bigint();
const r = { board, load1, depth: c.depth, nodes: c.nodes, elapsedMs: c.elapsedMs, nps: Math.round(c.nodes / c.elapsedMs * 1000), t0us: Number(t0 / 1000n), t1us: Number(t1 / 1000n) };
writeFileSync(out, JSON.stringify(r));
console.log(JSON.stringify(r));
