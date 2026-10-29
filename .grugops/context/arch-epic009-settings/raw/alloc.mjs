// Arithmetic only: the proposed allocation rules on a simulated clock. No engine, no game.
const T = 22_000, ST_CEIL = 22_500, CM_CAP = 59_500, K = 1_000, O = 100, M_DEFAULT = 20, OVH = 50;

// The safe share C: the proposed rule shared by both modes.
function safeShare(t, inc, m) {
  const mm = m ?? M_DEFAULT;
  const share = (t - K - mm * O) / mm + inc;
  const hardStop = t - K - O;
  return Math.max(1, Math.min(share, hardStop));
}
// Today's D4.1 G (levels).
function g41(t, inc, m) {
  return Math.max(1, Math.min(t / (m ?? M_DEFAULT) + inc / 2, t - OVH));
}
const rules = {
  "level7 (D4.1)": (t, inc, m) => Math.min(g41(t, inc, m), 30_000),
  "simple-tournament": (t, inc, m) => Math.min(T, safeShare(t, inc, m)),
  "uci-clock-mode": (t, inc, m) => Math.min(CM_CAP, safeShare(t, inc, m)),
};

// Play `moves` moves; per-period base `base`, moves per period `per` (0 = sudden death, no movestogo sent).
function play(rule, { base, per, moves, inc = 0, delta = 31, book = 0, sendMtg = true }) {
  let t = base, left = per, closest = Infinity, spentPeriod = 0, minUse = Infinity, maxBudget = 0;
  const uses = [];
  for (let k = 1; k <= moves; k++) {
    const isBook = k <= book;
    const b = isBook ? 0 : rule(t, inc, per && sendMtg ? left : undefined);
    const cost = isBook ? 0 : b + delta;
    maxBudget = Math.max(maxBudget, b);
    t = t - cost + inc;
    spentPeriod += cost;
    closest = Math.min(closest, t);
    if (per) {
      left--;
      if (left === 0) {
        uses.push(spentPeriod / base);
        minUse = Math.min(minUse, spentPeriod / base);
        spentPeriod = 0;
        left = per;
        t += base;
      }
    }
  }
  return { closest: Math.round(closest), minUsePct: uses.length ? +(minUse * 100).toFixed(1) : null, maxBudget: Math.round(maxBudget) };
}

const cases = [
  ["40/15, 1 period, delta 31", { base: 900_000, per: 40, moves: 40 }],
  ["40/15, 1 period, 6 book moves", { base: 900_000, per: 40, moves: 40, book: 6 }],
  ["40/15, 3 periods (120 moves)", { base: 900_000, per: 40, moves: 120 }],
  ["40/15, no movestogo sent, 80 moves", { base: 900_000, per: 40, moves: 80, sendMtg: false }],
  ["scaled tc=40/60, 3 periods", { base: 60_000, per: 40, moves: 120 }],
  ["sudden death 15 min, 80 moves", { base: 900_000, per: 0, moves: 80 }],
  ["40/15, delta 500 (real-clock stress)", { base: 900_000, per: 40, moves: 40, delta: 500 }],
  ["scaled tc=40/60, delta 500", { base: 60_000, per: 40, moves: 40, delta: 500 }],
  ["60 min / 40, 1 period", { base: 3_600_000, per: 40, moves: 40 }],
];
for (const [name, c] of cases) {
  console.log(`\n## ${name}`);
  for (const [r, fn] of Object.entries(rules)) console.log(`  ${r.padEnd(20)} ${JSON.stringify(play(fn, c))}`);
}
// Largest per-move overhead delta that still keeps closest >= 500 ms at 40/15 (simple-tournament) and 40/1.
for (const [name, c] of [["40/15", { base: 900_000, per: 40, moves: 40 }], ["tc=40/60", { base: 60_000, per: 40, moves: 40 }]]) {
  for (const [r, fn] of Object.entries(rules)) {
    let d = 0;
    while (d < 5_000 && play(fn, { ...c, delta: d + 1 }).closest >= 500) d++;
    console.log(`max delta keeping closest>=500 at ${name}, ${r}: ${d} ms`);
  }
}
console.log("\nhard stop: wtime 3000 movestogo 1 ->", safeShare(3000, 0, 1), "; wtime 800 ->", safeShare(800, 0, 1));
console.log("cap: wtime 3600000 movestogo 40 ->", Math.min(CM_CAP, safeShare(3_600_000, 0, 40)));
console.log("T margin under 22.5 s ceiling:", ST_CEIL - T, "ms");
