// qe-ABC-230 G6 session (node port of qe-epic008-close g6.sh; EPIC-008 G6 rule): 5 rounds, each a kiwipete pair then
// a position-6 pair; base first in odd rounds, head first in even. One fresh plain-node process per search (timed.mjs).
// usage: node g6.mjs <scratch qe-230 dir>
import { execFileSync } from "node:child_process";
import { appendFileSync } from "node:fs";
import { loadavg } from "node:os";
import { join } from "node:path";

const S = process.argv[2];
const B = join(S, "trees/base");
const H = join(S, "trees/head");
const ts = () => new Date().toISOString().replace(/\.\d+Z$/, "Z");
const rows = [];
for (let round = 1; round <= 5; round++) {
  for (const pos of ["kiwipete", "position-6"]) {
    for (const t of round % 2 ? [B, H] : [H, B]) {
      appendFileSync(join(S, "gates/g6-runs.log"), `${ts()} round=${round} pos=${pos} tree=${t.endsWith("base") ? "base" : "head"} load1=${loadavg()[0].toFixed(2)}\n`);
      const line = execFileSync(process.execPath, [join(S, "scripts/timed.mjs"), t, "g6", pos], { encoding: "utf8" }).trim();
      const o = { round, ...JSON.parse(line) };
      rows.push(o);
      appendFileSync(join(S, "gates/g6.jsonl"), `${JSON.stringify(o)}\n`);
    }
  }
}
const med = (a) => {
  const s = [...a].sort((x, y) => x - y);
  return s[(s.length - 1) / 2];
};
for (const pos of ["kiwipete", "position-6"]) {
  const d = (tree) => rows.filter((r) => r.pos === pos && r.tree === tree).map((r) => r.depth);
  const b = d("base");
  const h = d("head");
  console.log(`${pos}: base ${b.join(",")} median ${med(b)} | head ${h.join(",")} median ${med(h)} | min ${Math.min(...b, ...h)} | ${med(h) >= med(b) && Math.min(...h) >= 6 ? "MET" : "NOT MET"}${Math.min(...h) < 7 ? " (WARN: a head run below 7)" : ""}`);
}
