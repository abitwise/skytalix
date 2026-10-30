// Usage: node probe4.mts <scratch-root>. The cheaper forms: mate-only in check (hasLegalMove, no evasion search), and a check-evasion ply cap with mate-only beyond it.
// Frozen clock, maxDepth; nodes only.
const R = process.argv[2];
const fen = await import(`${R}/probe/src/fen.ts`); const eng = await import(`${R}/probe/src/engine.ts`); const s = await import(`${R}/probe/src/search.ts`); const q = await import(`${R}/probe/src/quiescence.ts`);
const PR = q.PROBE;
const set = (o: any) => { Object.assign(PR, { evasions: false, promotions: "none", promoLast: false, checkCap: 99, minQply: 0, mateOnlyBeyond: false }, o); PR.evasionNodes = 0; PR.mated = 0; };
const V: [string, any][] = [["base", {}], ["mate-only (no evasions; in check + no legal move = mate)", { mateOnlyBeyond: true }], ["ev qply<2, then mate-only", { evasions: true, checkCap: 2, mateOnlyBeyond: true }], ["ev qply<3, then mate-only", { evasions: true, checkCap: 3, mateOnlyBeyond: true }], ["ev all qply (full)", { evasions: true }]];
const t0 = process.cpuUsage();
for (const [name, f, d] of [["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", 8], ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10", 10]] as const) {
  let b6 = 0, bd = 0;
  for (const [lab, k] of V) {
    set(k); const r = s.search(fen.parseFen(f), 6); const e6 = PR.evasionNodes; if (lab === "base") b6 = r.nodes;
    set(k); const c = eng.chooseMove(fen.parseFen(f), { budgetMs: 3000, now: () => 0, maxDepth: d }); if (lab === "base") bd = c.nodes;
    console.log(`${name} ${lab}: search d6 ${r.nodes} (${(r.nodes / b6).toFixed(3)}x, evasion nodes ${e6}) | chooseMove to ${d} ${c.nodes} (${(c.nodes / bd).toFixed(3)}x) ${c.move.from}-${c.move.to} ${c.score}`);
  }
}
const t = process.cpuUsage(t0); console.log(`total cpu ${((t.user + t.system) / 1e6).toFixed(1)} s`);
