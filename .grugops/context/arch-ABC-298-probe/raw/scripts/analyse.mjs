// SCRATCH PROBE (arch-ABC-298-probe; ADR-0077 d9 step 3). Reads batch P's outputs.
// 1. Identity first. Per board: both exits 0; count's nodes, depth, score and move equal main's;
//    both positions restored (pure); X[0] = X[1] = 0; no count at remaining 0 or at index 63;
//    sum of G at most the node count. Any failure prints DEFECT, prints no G, H, C or s, and exits 3.
// 2. Only then: G, H, C and s = C / G per board, and the sealed rule:
//    STOP if s < 0.048 on at least two of the three boards, else GO. s is compared unrounded.
// Usage: node analyse.mjs <out dir>
import { readFileSync } from "node:fs";
import { join } from "node:path";

const dir = process.argv[2];
if (dir === undefined) throw new Error("usage: node analyse.mjs <out dir>");
const BOARDS = ["kiwipete", "position-6", "start"];
const exits = readFileSync(join(dir, "exits.txt"), "utf8");
const read = (c, b) => {
  const lines = readFileSync(join(dir, `P-${c}-${b}.out`), "utf8").trim().split("\n");
  return JSON.parse(lines[lines.length - 1]);
};
const sum = (a, from = 0, to = a.length) => a.slice(from, to).reduce((x, y) => x + y, 0);

const faults = [];
const rows = {};
for (const b of BOARDS) {
  for (const c of ["main", "count"]) {
    if (!exits.includes(`P-${c}-${b} exit 0\n`)) faults.push(`${b}: ${c} did not exit 0`);
  }
  let m;
  let k;
  try {
    m = read("main", b);
    k = read("count", b);
  } catch (e) {
    faults.push(`${b}: output unreadable (${e.message})`);
    continue;
  }
  for (const f of ["depth", "nodes", "score", "move"]) {
    if (m[f] !== k[f]) faults.push(`${b}: ${f} main ${m[f]} count ${k[f]}`);
  }
  if (m.pure !== true || k.pure !== true) faults.push(`${b}: position not restored`);
  if (m.G !== undefined) faults.push(`${b}: main copy carries counters`);
  if (k.G === undefined) {
    faults.push(`${b}: count copy has no counters`);
    continue;
  }
  if (k.X[0] !== 0 || k.X[1] !== 0) faults.push(`${b}: X ${k.X.join(",")}`);
  for (const a of ["G", "H", "C"]) {
    if (k[a][0] !== 0 || k[a][63] !== 0) faults.push(`${b}: ${a} counted at remaining 0 or 63+`);
  }
  if (sum(k.G) > k.nodes) faults.push(`${b}: sum G above nodes`);
  rows[b] = { main: m, count: k };
}

console.log("IDENTITY (count copy against main's unpatched copy):");
for (const b of BOARDS) {
  const r = rows[b];
  if (r === undefined) continue;
  const m = r.main;
  console.log(`  ${b}: depth ${m.depth}, nodes ${m.nodes}, score ${m.score}, move ${m.move}; count copy ${r.count.nodes === m.nodes && r.count.score === m.score && r.count.move === m.move && r.count.depth === m.depth ? "EQUAL" : "DIFFERS"}; pure ${m.pure}/${r.count.pure}`);
}
if (faults.length > 0) {
  console.log("DEFECT: no G, H, C or s is read.");
  for (const f of faults) console.log(`  ${f}`);
  process.exit(3);
}
console.log("  identity holds on every board; X = 0,0 on every board");

console.log("COUNTS (gate: remaining 1 or 2):");
let stops = 0;
for (const b of BOARDS) {
  const k = rows[b].count;
  const G = sum(k.G);
  const H = k.H[1] + k.H[2];
  const C = k.C[1] + k.C[2];
  const s = C / G;
  if (s < 0.048) stops++;
  console.log(`  ${b}: G ${G}, H ${H}, C ${C}, s = C/G = ${s.toFixed(6)} (${s < 0.048 ? "below" : "at or above"} 0.048); nodes ${k.nodes}`);
  console.log(`    INFO by remaining r = 1..9 (G_r / H_r / C_r):`);
  for (let r = 1; r <= 9; r++) console.log(`      r=${r}: ${k.G[r]} / ${k.H[r]} / ${k.C[r]}`);
  const rest = sum(k.G, 10, 64) + sum(k.H, 10, 64) + sum(k.C, 10, 64);
  console.log(`    INFO above r=9: ${rest}; H all depths ${sum(k.H)}, C all depths ${sum(k.C)}`);
}
console.log(`RULE: s < 0.048 on ${stops} of 3 boards -> ${stops >= 2 ? "STOP" : "GO"}`);
