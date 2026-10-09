// ABC-082 re-pin probe: reads every P/F row's value from the tree at argv[2] (a directory holding src/).
// Usage: node rows.ts <tree-root>
const root = process.argv[2];
const S = await import(`${root}/src/search.ts`);
const E = await import(`${root}/src/engine.ts`);
const F = await import(`${root}/src/fen.ts`);
const P = await import(`${root}/src/position.ts`);
const parse = F.parseFen;
const lbl = (m: { from: number; to: number } | null) => (m ? P.squareName(m.from) + P.squareName(m.to) : "null");
const FEN: Record<string, string> = {
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-3": "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};
const ticks = (step = 1) => { let t = 0; return () => { const r = t; t += step; return r; }; };
const out: Record<string, unknown> = {};

// 1 ABC-080 A4 position-6 d2
out.r1 = [S.searchWithoutOrdering, S.searchWithoutKillers, S.searchWithoutPvsOrReductions].map((f) => f(parse(FEN["position-6"]), 2).nodes);
// 2 promotion-capture d3
out.r2 = S.searchWithoutPvsOrReductions(parse("n3k3/1P6/8/3q4/8/8/8/3RK3 w - - 0 1"), 3).nodes;
// 3 G1 position-3, 3 ticks
{ let t = 0; const c = E.chooseMoveWithoutPvsOrReductions(parse(FEN["position-3"]), { budgetMs: 3, now: () => t++ }); out.r3 = [c.depth, c.nodes]; }
// 4 ABC-081 A1 position-3 d4
{ const on = S.searchWithoutPvsOrReductions(parse(FEN["position-3"]), 4); const off = S.searchWithoutTable(parse(FEN["position-3"]), 4); out.r4 = [on.nodes, off.nodes, on.score, off.score]; }
// 5 ABC-081 A5 repetition
{
  const R = "7k/5Q2/6pp/qr6/8/8/6PP/7K w - - 0 1";
  const s4 = S.search(parse(R), 4);
  out.r5 = { d4: [s4.score, lbl(s4.move)], pre121nodes: S.searchWithoutPvsOrReductions(parse(R), 4).nodes, d3: S.search(parse(R), 3).score };
  // row 13: chooseMove 6 ticks
  let t = 0; const c = E.chooseMove(parse(R), { budgetMs: 6, now: () => t++ });
  out.r13 = { sixTicks: [c.depth, c.score, lbl(c.move)] };
  let t2 = 0; const d = E.chooseMove(parse("7k/8/6pp/qr6/8/Q7/6PP/7K w - - 0 1"), { budgetMs: 10, now: () => t2++ });
  (out.r13 as Record<string, unknown>).deep10 = [d.depth, d.score, lbl(d.move)];
}
// 6 ABC-079 A4 bare leaf position-6
{ const a = S.searchWithoutQuiescence(parse(FEN["position-6"]), 2); out.r6 = { d2: [a.nodes, lbl(a.move)] };
  if (process.env.DEEP) { const b = S.searchWithoutQuiescence(parse(FEN["position-6"]), 3); (out.r6 as Record<string, unknown>).d3 = [b.nodes, lbl(b.move)]; } }
// 8 ABC-121 A4
{ const A4 = "8/2p5/3p4/KP5r/5p1k/8/4P1P1/1R6 b - - 1 1"; const s = S.search(parse(A4), 4); const r = S.searchWithoutReductions(parse(A4), 4); out.r8 = { search: [s.score, lbl(s.move)], withoutReductions: [r.score, lbl(r.move)] };
  const B = "8/2p5/3p3r/KP6/5p1k/8/4P1P1/1R6 w - - 2 2"; const sb = S.search(parse(B), 4);
  (out.r8 as Record<string, unknown>).searchFenSearch = [sb.score, lbl(sb.move)]; }
// 9 ABC-078 A3
{
  const A3 = "rnbqkbnr/ppp1pppp/8/3p4/6P1/8/PPPPPP1P/RNBQKBNR w KQkq d6 0 2";
  const per = [1, 2, 3].map((d) => { const x = S.searchWithoutReductions(parse(A3), d); return [d, x.nodes, lbl(x.move), x.score]; });
  const c = E.chooseMove(parse(A3), { budgetMs: 3, now: ticks(1) });
  const window = [2, 3, 4, 5, 6, 7, 8].map((b) => { const x = E.chooseMove(parse(A3), { budgetMs: b, now: ticks(1) }); return [b, x.depth, x.nodes, lbl(x.move)]; });
  out.r9 = { perDepth: per, budget3: [c.depth, c.nodes, lbl(c.move), c.score], window };
}
// 10 TIE_FEN d1
{ const T = "r4rk1/1pp1qBpp/p1np1n2/2b1p1B1/4P1b1/P1NP1N2/1PP1QPPP/R4RK1 b - - 0 10"; const o = S.search(parse(T), 1); const u = S.searchWithoutOrdering(parse(T), 1);
  let t = 0; const c = E.chooseMove(parse(T), { budgetMs: 1, now: () => t++ });
  out.r10 = { ordered: [lbl(o.move), o.score], unordered: [lbl(u.move), u.score], engine: [c.depth, lbl(c.move)] }; }
// 11 kiwipete 50 ms budget, 10 ms step
{ const c = E.chooseMove(parse(FEN.kiwipete), { budgetMs: 50, now: ticks(10) }); out.r11 = { nodes: c.nodes, depth: c.depth, bound: 10 * E.NODES_PER_CLOCK_CHECK, under: 10 * E.NODES_PER_CLOCK_CHECK - c.nodes }; }
// 12 kp-vs-k depths at 5/10/40 ticks
out.r12 = [5, 10, 40].map((b) => E.chooseMove(parse("8/8/8/4k3/8/8/4P3/4K3 w - - 0 1"), { budgetMs: b, now: ticks(1) }).depth);
// 7 oracle pins (the door the test reads, and search()) — DEEP only
if (process.env.DEEP) {
  out.r7 = {};
  for (const n of ["kiwipete", "position-6"]) { const a = S.searchWithoutPvsOrReductions(parse(FEN[n]), 3); const b = S.search(parse(FEN[n]), 3); (out.r7 as Record<string, unknown>)[n] = { pre121: [a.score, lbl(a.move), a.nodes], search: [b.score, lbl(b.move), b.nodes] }; }
}
console.log(JSON.stringify(out, null, 1));
