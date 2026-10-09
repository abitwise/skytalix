// Probe (fold-abc084-gate-b): ABC-084 A2 read against ABC-079's shared do-not-hang corpus in
// ADR-0027 deterministic mode. Reads the corpus FROM src/quiescence.test.ts (no copy), runs the
// shipped chooseMove with a FRESH virtualClock per move. Usage: node a2-deterministic.mts <budgetMs> <step>
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { chooseMove } from "../../../../src/engine.ts";
import { parseFen } from "../../../../src/fen.ts";
import { squareName } from "../../../../src/position.ts";
import { virtualClock } from "../../../../src/virtual-clock.ts";

const budgetMs = Number(process.argv[2]);
const step = Number(process.argv[3]);
const src = readFileSync(fileURLToPath(new URL("../../../../src/quiescence.test.ts", import.meta.url)), "utf8");
const block = src.slice(src.indexOf("const HANGING_CORPUS"), src.indexOf("interface HangingArm"));
const rows = [...block.matchAll(/\{ name: "([^"]+)", fen: "([^"]+)", losing: "([a-h1-8]{4})" \}/g)].map(
  (m) => ({ name: m[1], fen: m[2], losing: m[3], kind: "hang" as const }),
);
// ABC-077 A3's brute-force-verified mate in 2 (src/search.test.ts:453): accepted f6f7 / f6g6.
const mates = [{ name: "MATE_IN_2 (search.test.ts A3)", fen: "7k/8/5K2/8/8/8/8/R7 w - - 0 1", accept: ["f6f7", "f6g6"] }];

let losing = 0;
let totalNodes = 0;
const t0 = performance.now();
const out: string[] = [];
for (const r of rows) {
  const s = performance.now();
  const c = chooseMove(parseFen(r.fen), { budgetMs, now: virtualClock(step) });
  const ms = performance.now() - s;
  const mv = c ? `${squareName(c.move.from)}${squareName(c.move.to)}` : "null";
  if (mv === r.losing) losing++;
  totalNodes += c?.nodes ?? 0;
  out.push(`${r.name}\t${mv}\t${mv === r.losing ? "LOSING" : "ok"}\td${c?.depth}\tn${c?.nodes}\t${ms.toFixed(0)}ms`);
}
let mateOk = 0;
for (const m of mates) {
  const s = performance.now();
  const c = chooseMove(parseFen(m.fen), { budgetMs, now: virtualClock(step) });
  const ms = performance.now() - s;
  const mv = c ? `${squareName(c.move.from)}${squareName(c.move.to)}` : "null";
  if (m.accept.includes(mv)) mateOk++;
  totalNodes += c?.nodes ?? 0;
  out.push(`${m.name}\t${mv}\t${m.accept.includes(mv) ? "MATE-OK" : "MISS"}\td${c?.depth}\tn${c?.nodes}\t${ms.toFixed(0)}ms\tscore=${c?.score}`);
}
const wall = performance.now() - t0;
console.log(out.join("\n"));
console.log(
  `SUMMARY budget=${budgetMs} step=${step} readings/move=${budgetMs / step} rows=${rows.length} losing=${losing}/${rows.length} ` +
    `mate=${mateOk}/${mates.length} nodes=${totalNodes} nodes/move=${Math.round(totalNodes / (rows.length + mates.length))} ` +
    `wall=${(wall / 1000).toFixed(2)}s wall/move=${(wall / (rows.length + mates.length)).toFixed(0)}ms`,
);
