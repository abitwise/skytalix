// qe-ABC-221 POST-PREREG, informative: A2-A5 and A7 figures by arithmetic from D2/D4 (no code imported), to set beside
// the rows' pinned numbers. Each search costs budget + 31; a book move 0.
const C = (t, i, m) => Math.max(1, Math.min((t - 1000 - m * 100) / m + i, t - 1100));
const B = (t, m) => Math.min(59_500, C(t, 0, m));
function play(n, { book = 0, add = {} } = {}) {
  let t = 900_000; const rows = [];
  for (let p = 1; p <= n; p++) { const m = 40 - ((p - 1) % 40); const b = p <= book ? undefined : B(t, m); const sent = t; t -= b === undefined ? 0 : b + 31; rows.push({ b, sent, left: t }); t += add[p] ?? 0; }
  return rows;
}
const a2 = play(40), a3 = play(40, { book: 6 }), a4 = play(120, { add: { 40: 900_000, 80: 900_000 } });
const use = (r) => r.reduce((s, x) => s + (x.b === undefined ? 0 : x.b + 31), 0) / 900_000;
console.log(`A2: first ${a2[0].b}, min left ${Math.min(...a2.map((x) => x.left)).toFixed(3)}, last ${a2[39].left.toFixed(3)}, used ${use(a2).toFixed(5)}`);
console.log(`A3: move 7 ${a3[6].b.toFixed(3)}, min left ${Math.min(...a3.map((x) => x.left)).toFixed(3)}, used ${use(a3).toFixed(5)}`);
for (const k of [0, 1, 2]) { const s = a4.slice(k * 40, k * 40 + 40); console.log(`A4 period ${k + 1}: min left ${Math.min(...s.map((x) => x.left)).toFixed(3)}, used ${use(s).toFixed(5)}`); }
console.log(`A5: wtime 3000 mtg 1 -> ${B(3000, 1)}, left ${3000 - B(3000, 1) - 31}; wtime 800 -> ${B(800, 20)}`);
console.log(`A7: C(3 600 000, 0, 40) = ${C(3_600_000, 0, 40)} -> ${B(3_600_000, 40)}; movetime 90000 -> ${Math.min(90_000, 59_500)}; 5000 -> ${Math.min(5_000, 59_500)}`);
console.log(`A12: ${[2000, 0, 2000, 0].map((i) => Math.min(59_500, C(10_000, i, 10))).join(" / ")} (own increment 2000, 0, 2000, 0)`);
console.log(`AR-UCI-BUSY: 59 500 + 31 + 100 = ${59_500 + 31 + 100} < 60 000`);
