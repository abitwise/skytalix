// qe-ABC-221 SE-221-a (plain node, arithmetic only; written from the ticket's and ADR-0052 D2/D4's words, not from the
// SE's alloc-check.mjs). The clock after each move, each search costing budget + 31 ms (AR-NFR004-A), no movestogo sent
// (so m = 20 on every move), budget = min(59 500, C). Shape W (A6 as worded): 80 moves, no added time. Shape P (alloc.txt
// "40/15, no movestogo sent, 80 moves"): +900 000 ms after move 40.
const C = (t, i, m) => Math.max(1, Math.min((t - 1000 - m * 100) / m + i, t - 1100));
const budget = (t) => Math.min(59_500, C(t, 0, 20));
function play(add) {
  let t = 900_000;
  const left = [];
  for (let p = 1; p <= 80; p++) {
    t -= budget(t) + 31;
    left.push(t);
    t += add[p] ?? 0;
  }
  return left;
}
const W = play({}), P = play({ 40: 900_000 });
const minAt = (a) => { const m = Math.min(...a); return `${m.toFixed(3)} ms after move ${a.indexOf(m) + 1}`; };
console.log(`W (as worded, no added time): after move 80 ${W[79].toFixed(3)} ms; closest ${minAt(W)}; every move >= 1 000: ${W.every((x) => x >= 1000)}; >= 117 000 after every move: ${W.every((x) => x >= 117_000)}`);
console.log(`P (+900 000 after move 40): closest ${minAt(P)}; after move 80 ${P[79].toFixed(3)} ms; every move >= 1 000: ${P.every((x) => x >= 1000)}; >= 117 000 after every move: ${P.every((x) => x >= 117_000)}`);
console.log(`rounded: W after move 80 = ${Math.round(W[79])}; P closest = ${Math.round(Math.min(...P))}`);
