// se-ABC-250 informal probe, one fresh process per run.
// usage: node probe.mjs <treeDir> <label> perft|search <board>
import { loadavg } from "node:os";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
const [tree, label, kind, board] = process.argv.slice(2);
const tctl = () => {
  for (const h of readdirSync("/sys/class/hwmon")) {
    const p = join("/sys/class/hwmon", h);
    try { if (readFileSync(join(p, "name"), "utf8").trim() === "k10temp") return Number(readFileSync(join(p, "temp1_input"), "utf8")) / 1000; } catch {}
  }
  return null;
};
const BOARDS = {
  start: ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", 4],
  kiwipete: ["r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", 4],
  "position-3": ["8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1", 5],
  "position-4": ["r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1", 4],
  "position-5": ["rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8", 4],
  "position-6": ["r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10", 4],
};
const [fen, depth] = BOARDS[board];
const { parseFen, toFen } = await import(`${tree}/src/fen.ts`);
const l0 = loadavg()[0]; const t0 = tctl();
let out;
if (kind === "perft") {
  const { perft } = await import(`${tree}/src/perft.ts`);
  perft(parseFen(BOARDS.start[0]), 3); // warm, as perft-bench does
  const p = parseFen(fen);
  const s = process.hrtime.bigint();
  const nodes = perft(p, depth);
  const sec = Number(process.hrtime.bigint() - s) / 1e9;
  if (toFen(p) !== fen) throw new Error("position changed");
  out = { nodes, sec: +sec.toFixed(4), nps: Math.round(nodes / sec) };
} else {
  const { chooseMove } = await import(`${tree}/src/engine.ts`);
  const p = parseFen(fen);
  const c = chooseMove(p, { budgetMs: 4000 });
  if (toFen(p) !== fen) throw new Error("position changed");
  out = { depth: c.depth, nodes: c.nodes, elapsedMs: c.elapsedMs, move: c.move ? `${c.move.from}-${c.move.to}` : null, score: c.score, nps: Math.round((c.nodes / c.elapsedMs) * 1000) };
}
console.log(JSON.stringify({ tree: label, kind, board, load1: l0, tctlBefore: t0, tctlAfter: tctl(), ...out }));
