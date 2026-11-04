// arch-ABC-282 arithmetic A (PREREG …5dbc040d): uci-clock-mode's C (ADR-0052 D2, D4) over three 40-move periods,
// each move spending f × its budget plus δ = 31 ms; book moves cost δ only. No engine is run.
const RESERVE = 1000, OVERHEAD = 100, CAP = 59500, DELTA = 31;
const C = (t, inc, m) => Math.max(1, Math.min((t - RESERVE - m * OVERHEAD) / m + inc, t - RESERVE - OVERHEAD));
function run(periodMs, f, book) {
  let t = periodMs, minLeft = Infinity, out = [];
  for (let p = 0; p < 3; p++) {
    const startT = t;
    for (let i = 0; i < 40; i++) {
      const move = p * 40 + i, m = 40 - i;
      const spend = move < book ? DELTA : f * Math.min(CAP, C(t, 0, m)) + DELTA;
      t -= spend;
      minLeft = Math.min(minLeft, t);
    }
    out.push({ period: p + 1, used: +(((startT - t) / periodMs) * 100).toFixed(2), leftAtEnd: Math.round(t) });
    t += periodMs;
  }
  return { periodMs, f: +f.toFixed(4), book, minLeftMs: Math.round(minLeft), periods: out };
}
for (const periodMs of [900000, 8000]) for (const f of [1 / 2.3, 0.64, 1.0]) for (const book of [0, 6]) console.log(JSON.stringify(run(periodMs, f, book)));
