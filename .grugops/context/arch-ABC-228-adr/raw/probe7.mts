// Usage: node probe7.mts <scratch-root>. ADR-0050 decision 9's seven zugzwang rows (chooseMove, frozen clock, own depth),
// door vs full evasions vs full evasions + quiet queen promotions. Deep-lane rows; CPU guard 200 s.
const R = process.argv[2];
const fen = await import(`${R}/probe/src/fen.ts`); const eng = await import(`${R}/probe/src/engine.ts`); const q = await import(`${R}/probe/src/quiescence.ts`);
const PR = q.PROBE; const set = (o: any) => Object.assign(PR, { evasions: false, promotions: "none", promoLast: false, checkCap: 99, minQply: 0, mateOnlyBeyond: false, cap: 8 }, o);
const t0 = process.cpuUsage(); const cpu = () => { const t = process.cpuUsage(t0); return (t.user + t.system) / 1e6; };
const sq = (x: number) => "abcdefgh"[x & 7] + String((x >> 4) + 1);
const rows: [string, string, string, number][] = [["kpk-b6c6", "2k5/8/1K6/2P5/8/8/8/8 w - - 0 1", "b6c6", 8], ["kpk-c6d6", "3k4/8/2K5/3P4/8/8/8/8 w - - 0 1", "c6d6", 8], ["kpk-d6e6", "4k3/8/3K4/4P3/8/8/8/8 w - - 0 1", "d6e6", 8], ["kpk-e6f6", "5k2/8/4K3/5P2/8/8/8/8 w - - 0 1", "e6f6", 8], ["zugzwang.001", "8/8/p1p5/1p5p/1P5p/8/PPP2K1p/4R1rk w - - 0 1", "e1f1", 9], ["zugzwang.004", "8/6B1/p5p1/Pp4kp/1P5r/5P1Q/4q1PK/8 w - - 0 32", "h3h4", 11], ["zugzwang.005", "8/8/1p1r1k2/p1pPN1p1/P3KnP1/1P6/8/3R4 b - - 0 1", "f4d5", 12]];
for (const [n, f, want, d] of rows) {
  const out: string[] = [];
  for (const [lab, k] of [["door", {}], ["ev", { evasions: true }], ["ev+qQ", { evasions: true, promotions: "queen" }]] as const) {
    if (cpu() > 200) { out.push(`${lab} skipped (CPU guard)`); continue; }
    set(k); const c = eng.chooseMove(fen.parseFen(f), { budgetMs: 3000, now: () => 0, maxDepth: d }); const m = sq(c.move.from) + sq(c.move.to);
    out.push(`${lab} ${m}${m === want ? " ok" : " MISS"} ${c.score} (${c.nodes} nodes)`);
  }
  console.log(`${n} @${d}: ${out.join(" | ")}`);
}
console.log(`total cpu ${cpu().toFixed(1)} s`);
