// qe-ABC-250 G5 / G6 from the A5 search runs (chooseMove at 4 000 ms = LEVELS[5] on both builds, real clock, fresh process).
// usage: node g56.mjs <a5.jsonl> [a5-rerun.jsonl]
// G6 (EPIC-008 row, read over ALL runs as the row says, admitted or discarded): kiwipete and position-6; head's median
//   completed depth >= base's on both boards, and no run below depth 6 (FAIL floor); runs below 7 are WARN. Counted-only
//   medians are reported as INFO.
// G5 (instrument part): every A5 run's chooseMove wall <= 5 000 ms (the levels 1-5 ceiling); the max is reported against
//   4 000 ms (level 5), as EPIC-008 M3 reported it against 3 s. The ENGINE_DEEP engine lane is G5's other instrument.
import { existsSync, readFileSync } from "node:fs";
const rows = process.argv.slice(2).filter((f) => existsSync(f)).flatMap((f) => readFileSync(f, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse));
const pairs = rows.filter((r) => r.ev === "pair" && r.kind === "search");
const med = (a) => { const s = [...a].sort((x, y) => x - y); const n = s.length; return n === 0 ? NaN : n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const g6 = {};
for (const board of ["kiwipete", "position-6"]) {
  const ps = pairs.filter((r) => r.board === board); const cs = ps.filter((r) => r.admitted).slice(0, 5);
  const d = (set, b) => set.map((r) => r[b].depth);
  g6[board] = { runs: ps.length * 2, B: d(ps, "B"), H: d(ps, "H"), medB: med(d(ps, "B")), medH: med(d(ps, "H")),
    countedMedB: med(d(cs, "B")), countedMedH: med(d(cs, "H")), min: Math.min(...d(ps, "B"), ...d(ps, "H")),
    warnRuns: [...d(ps, "B"), ...d(ps, "H")].filter((x) => x < 7).length };
  g6[board].geBase = g6[board].medH >= g6[board].medB;
}
const g6Met = Object.values(g6).every((x) => x.geBase && x.min >= 6 && x.runs > 0);
const walls = pairs.flatMap((r) => [r.B.wallMs, r.H.wallMs]);
const g5 = { runs: walls.length, maxWallMs: Math.max(...walls), over4000: walls.filter((w) => w > 4000).length, over5000: walls.filter((w) => w > 5000).length };
g5.met = g5.runs > 0 && g5.over5000 === 0;
console.log(JSON.stringify({ g6Met, g6, g5 }, null, 1));
