// se-ABC-282 A1 (a)/(b) fixture scan (ADR-0071 D9). Usage: node scan-a1.mjs <head-root> <hMin> <hMax>
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const [root, hMin, hMax] = process.argv.slice(2);
const imp = (f) => import(pathToFileURL(join(root, "src", f)).href);
const { chooseMove } = await imp("engine.ts");
const { parseFen } = await imp("fen.ts");
const { virtualClock } = await imp("virtual-clock.ts");
const fens = {
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  startpos: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
};
for (const [name, fen] of Object.entries(fens)) {
  for (let H = Number(hMin); H <= Number(hMax); H++) {
    const soft = H / 2.3;
    const head = chooseMove(parseFen(fen), { budgetMs: H, now: virtualClock(1), softMs: soft });
    const base = chooseMove(parseFen(fen), { budgetMs: H, now: virtualClock(1) });
    const nAt = chooseMove(parseFen(fen), { budgetMs: 60000, now: () => 0, maxDepth: head.depth }).nodes;
    const toPrev = chooseMove(parseFen(fen), { budgetMs: 60000, now: virtualClock(1), maxDepth: head.depth - 1 });
    const toHere = chooseMove(parseFen(fen), { budgetMs: 60000, now: virtualClock(1), maxDepth: head.depth });
    console.log(name, "H", H, "soft", soft.toFixed(2), "head d", head.depth, "n", head.nodes, "N(d)", nAt, "stopped-at-boundary", head.nodes === nAt, "base d", base.depth, "n", base.nodes, "elapsed to d-1", toPrev.elapsedMs, "to d", toHere.elapsedMs);
  }
}
