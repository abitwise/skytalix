// qe-ABC-254-a4 (A4-RR: + spreadExact, the unrounded spread the grader reads). qe-ABC-254 A4/G6/G5 analysis of a4 jsonl (the graded run per (round, board, build) is the LAST attempt logged).
import { readFileSync } from "node:fs";
const rows = readFileSync(process.argv[2], "utf8").trim().split("\n").map(JSON.parse);
const runs = new Map();
for (const r of rows.filter((x) => x.ev === "run")) runs.set(`${r.tag}|${r.board}|${r.build}|${r.round}`, r);
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s[(s.length - 1) >> 1] === undefined ? NaN : s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2; };
const by = {};
for (const r of runs.values()) ((by[`${r.tag}|${r.board}`] ??= { B: [], H: [] })[r.build]).push(r);
for (const [k, v] of Object.entries(by)) {
  const line = {};
  for (const b of ["B", "H"]) {
    const n = v[b].sort((x, y) => x.round - y.round).map((r) => r.nps); const m = med(n);
    line[b] = { nps: n, median: m, spreadPct: Math.round(((Math.max(...n) - Math.min(...n)) / m) * 1000) / 10, spreadExact: ((Math.max(...n) - Math.min(...n)) / m) * 100, depths: v[b].map((r) => r.depth),
      medDepth: med(v[b].map((r) => r.depth)), moves: [...new Set(v[b].map((r) => `${r.move} ${r.score}`))], maxWallMs: Math.max(...v[b].map((r) => r.wallMs)),
      maxElapsed: Math.max(...v[b].map((r) => r.elapsedMs)), allPure: v[b].every((r) => r.pure) };
  }
  const all = [...v.B, ...v.H];
  console.log(JSON.stringify({ key: k, ratio: Math.round((line.H.median / line.B.median) * 1000) / 1000, ...line,
    allClear: all.every((r) => r.clearPair), foreignCoresMax: Math.max(...all.map((r) => r.foreignCores)),
    load1: [Math.min(...all.map((r) => r.load1Before)), Math.max(...all.map((r) => r.load1After))],
    tctlAfterMedian: med(all.map((r) => r.tctlAfter)), tctlAfterMax: Math.max(...all.map((r) => r.tctlAfter)) }));
}
const all = [...runs.values()];
console.log(JSON.stringify({ runs: all.length, tctlAfterMedianAll: med(all.map((r) => r.tctlAfter)), maxWallMs: Math.max(...all.map((r) => r.wallMs)) }));
