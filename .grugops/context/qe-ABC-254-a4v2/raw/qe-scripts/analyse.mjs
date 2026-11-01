// qe-ABC-254-a4v2 analysis of one a4v2.mjs schedule file (D3-V2). usage: node analyse.mjs <a4v2.jsonl>
// Per board: the counted pairs are the first 5 admitted pairs (the driver stops at 5, so these are all admitted pairs).
// Discarded pairs are counted and reported, and never enter a median, a spread or a ratio.
import { readFileSync } from "node:fs";
const rows = readFileSync(process.argv[2], "utf8").trim().split("\n").filter(Boolean).map(JSON.parse);
const start = rows.find((r) => r.ev === "start") ?? {};
const med = (a) => { const s = [...a].sort((x, y) => x - y); const n = s.length; return n === 0 ? NaN : n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const BARS = { kiwipete: [1.1, 1.0], "position-6": [1.1, 1.0], start: [1.1, 1.0], "position-4": [0.97] };
const boards = [...new Set(rows.filter((r) => r.ev === "pair").map((r) => r.board))];
for (const board of boards) {
  const all = rows.filter((r) => r.ev === "pair" && r.board === board);
  const counted = all.filter((r) => r.admitted).slice(0, 5);
  const voidLoad = rows.some((r) => r.ev === "VOID-LOAD" && r.board === board) || counted.length < 5;
  const line = { key: `${rows[0].tag}|${board}`, board, attempts: all.length, admitted: all.filter((r) => r.admitted).length,
    discarded: all.length - all.filter((r) => r.admitted).length, counted: counted.length, voidLoad,
    orders: counted.map((r) => r.order).join(" "), shared: Boolean(start.shared) || counted.some((r) => r.sharedAfterCap) };
  for (const b of ["B", "H"]) {
    const n = counted.map((r) => r[b].nps); const m = med(n);
    line[b] = { nps: n, median: m, spreadExact: n.length ? ((Math.max(...n) - Math.min(...n)) / m) * 100 : NaN,
      depths: counted.map((r) => r[b].depth), moves: [...new Set(counted.map((r) => `${r[b].move} ${r[b].score}`))],
      maxWallMs: n.length ? Math.max(...counted.map((r) => r[b].wallMs)) : NaN, allPure: counted.every((r) => r[b].pure) };
    line[b].spreadPct = Math.round(line[b].spreadExact * 10) / 10;
  }
  line.ratioExact = line.H.median / line.B.median;
  line.ratio = Math.round(line.ratioExact * 1000) / 1000;
  line.pairRatios = counted.map((r) => r.H.nps / r.B.nps);
  line.pairMedianExact = med(line.pairRatios);
  line.pairMedian = Math.round(line.pairMedianExact * 1000) / 1000;
  line.bars = BARS[board];
  // D3-V2 item 4: the paired-ratio median and the graded ratio must fall on the same side of every bar.
  line.agree = counted.length === 5 && BARS[board].every((bar) => (line.ratioExact >= bar) === (line.pairMedianExact >= bar));
  const cr = counted.flatMap((r) => [r.B, r.H]);
  line.foreignCoresMaxCounted = cr.length ? Math.max(...cr.map((x) => x.foreignCoresExact)) : NaN;
  line.discardedFc = all.filter((r) => !r.admitted).map((r) => r.why.join(","));
  line.tctlAfterMedian = med(cr.map((x) => x.tctlAfter));
  line.tctlAfterMax = cr.length ? Math.max(...cr.map((x) => x.tctlAfter)) : NaN;
  line.load1 = cr.length ? [Math.min(...cr.map((x) => x.load1Before)), Math.max(...cr.map((x) => x.load1After))] : [];
  console.log(JSON.stringify(line));
}
const pairs = rows.filter((r) => r.ev === "pair");
const done = rows.find((r) => r.ev === "done");
console.log(JSON.stringify({ summary: true, tag: rows[0]?.tag, shared: Boolean(start.shared), probe: start.probe, attempts: pairs.length,
  admitted: pairs.filter((r) => r.admitted).length, scheduleS: done?.scheduleS, waitS: done?.waitS,
  stop: rows.some((r) => r.ev === "STOP-identity"), maxWallMs: Math.max(...pairs.flatMap((r) => [r.B.wallMs, r.H.wallMs])) }));
