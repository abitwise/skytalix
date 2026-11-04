// arch-ABC-282, a REPORT ADDED AFTER the PREREG'd rows (not pre-registered; it grades nothing): uci-clock-mode's C over
// three 40-move periods, each move spending f × budget + 31 ms with f drawn (seeded LCG) from P3's 125 head used
// fractions (capped at 1). Also constant f at P3's p10 (0.49). Usage: node alloc-w1-mc.mjs <used.json>
import { readFileSync } from "node:fs";
const used = JSON.parse(readFileSync(process.argv[2], "utf8"));
const RESERVE = 1000, OVERHEAD = 100, CAP = 59500, DELTA = 31;
const C = (t, m) => Math.max(1, Math.min((t - RESERVE - m * OVERHEAD) / m, t - RESERVE - OVERHEAD));
let seed = 20261104;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
function game(periodMs, book, draw) {
  let t = periodMs, minLeft = Infinity; const use = [];
  for (let p = 0; p < 3; p++) {
    const s = t;
    for (let i = 0; i < 40; i++) { const mv = p * 40 + i; t -= mv < book ? DELTA : draw() * Math.min(CAP, C(t, 40 - i)) + DELTA; minLeft = Math.min(minLeft, t); }
    use.push(((s - t) / periodMs) * 100); t += periodMs;
  }
  return { use, minLeft };
}
const q = (a, p) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor((s.length - 1) * p)]; };
for (const periodMs of [900000, 8000]) for (const book of [0, 6]) {
  const p1 = [], all = [], ml = [];
  for (let k = 0; k < 10000; k++) { const g = game(periodMs, book, () => used[Math.floor(rnd() * used.length)]); p1.push(g.use[0]); all.push(...g.use); ml.push(g.minLeft); }
  const c49 = game(periodMs, book, () => 0.49);
  console.log(JSON.stringify({ periodMs, book, trials: 10000, period1Use: { min: +Math.min(...p1).toFixed(2), p01: +q(p1, 0.01).toFixed(2), median: +q(p1, 0.5).toFixed(2) }, anyPeriodMinUse: +Math.min(...all).toFixed(2), minClockLeftMs: Math.round(Math.min(...ml)), constF049: { use: c49.use.map((u) => +u.toFixed(2)), minLeft: Math.round(c49.minLeft) } }));
}
