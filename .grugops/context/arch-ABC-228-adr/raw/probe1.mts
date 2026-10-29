// Usage: node probe1.mts <scratch-root>. Single process, fixed depth only, no clock reads in the search.
const R = process.argv[2];
const B = { fen: await import(`${R}/base/src/fen.ts`), search: await import(`${R}/base/src/search.ts`), q: await import(`${R}/base/src/quiescence.ts`) };
const P = { fen: await import(`${R}/probe/src/fen.ts`), search: await import(`${R}/probe/src/search.ts`), q: await import(`${R}/probe/src/quiescence.ts`), ev: await import(`${R}/probe/src/evaluate.ts`), legal: await import(`${R}/probe/src/legal.ts`) };
const PR = P.q.PROBE;
const set = (o: any) => { Object.assign(PR, { evasions: false, promotions: "none", promoLast: false, checkCap: 99 }, o); PR.mated = 0; PR.evasionNodes = 0; PR.promoMoves = 0; };
const INF = 1e9;
const KIWI = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1";
const P6 = "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10";
const t0 = process.cpuUsage();
// 1. door identity: probe with every knob off equals base, node for node
const ids = [KIWI, P6, "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"];
set({});
let idOk = 0;
for (const f of ids) for (const d of [3, 4]) { const a = B.search.search(B.fen.parseFen(f), d); const b = P.search.search(P.fen.parseFen(f), d); if (a.nodes === b.nodes && a.score === b.score) idOk++; else console.log("ID MISMATCH", f, d, a, b); }
console.log(`door identity (knobs off vs base, depth 3 and 4, 5 roots): ${idOk}/10 node- and score-equal`);
// 2. SA rows
const rows: [string, string][] = [["Q1 capture-mate", "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4"], ["Q2 in check, quiet evasion only", "4k3/8/8/8/8/8/4R3/4K3 b - - 0 1"], ["Q3 quiet promotion", "8/P6k/8/8/8/8/8/K7 w - - 0 1"]];
for (const [n, f] of rows) {
  const out: string[] = [];
  for (const [lab, k] of [["base", {}], ["ev", { evasions: true }], ["ev+qQ", { evasions: true, promotions: "queen" }]] as const) { set(k); const p = P.fen.parseFen(f); out.push(`${lab}=${P.q.quiesce(p, -INF, INF, 0, () => {}, 0)}`); }
  console.log(`${n}: static=${P.ev.evaluate(P.fen.parseFen(f))} ${out.join(" ")}`);
}
// 3. growth at fixed depth 6
const variants: [string, any][] = [["base (all off)", {}], ["evasions, cap 8", { evasions: true }], ["evasions, check cap qply<2", { evasions: true, checkCap: 2 }], ["evasions, check cap qply<4", { evasions: true, checkCap: 4 }], ["quiet Q promos only", { promotions: "queen" }], ["quiet Q promos only, after captures", { promotions: "queen", promoLast: true }], ["quiet all promos only", { promotions: "all" }], ["evasions + quiet Q promos", { evasions: true, promotions: "queen" }]];
for (const [name, fen] of [["kiwipete", KIWI], ["position-6", P6]] as const) {
  let baseNodes = 0;
  for (const [lab, k] of variants) {
    set(k); const c0 = process.cpuUsage(); const r = P.search.search(P.fen.parseFen(fen), 6); const c = process.cpuUsage(c0);
    if (lab.startsWith("base")) baseNodes = r.nodes;
    console.log(`${name} d6 ${lab}: nodes ${r.nodes} (${(r.nodes / baseNodes).toFixed(3)}x) score ${r.score} move ${r.move ? r.move.from + "-" + r.move.to : null} evasionNodes ${PR.evasionNodes} qMates ${PR.mated} promoMoves ${PR.promoMoves} cpu ${((c.user + c.system) / 1e6).toFixed(2)} s`);
  }
}
const t = process.cpuUsage(t0); console.log(`total cpu ${((t.user + t.system) / 1e6).toFixed(1)} s`);
