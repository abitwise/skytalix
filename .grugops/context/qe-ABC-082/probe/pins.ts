// QE probe (qe-ABC-082): A8 exact pins, re-measured by QE's own script on any tree.
// Written from the test rows' call shapes, not from the Engineer's rows.ts.
// Usage: node pins.ts <tree>        prints one JSON line per pin
import { pathToFileURL } from "node:url";

const tree = process.argv[2];
const load = (f: string) => import(pathToFileURL(`${tree}/src/${f}`).href);
const S = await load("search.ts");
const E = await load("engine.ts");
const { parseFen } = await load("fen.ts");
const { squareName, EMPTY } = await load("position.ts");

const label = (m: { from: number; to: number; promotion: number } | null) =>
  m === null ? null : `${squareName(m.from)}${squareName(m.to)}${m.promotion === EMPTY ? "" : m.promotion}`;
const FEN = {
  "position-3": "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
  promo: "n3k3/1P6/8/3q4/8/8/8/3RK3 w - - 0 1",
  repeats: "7k/5Q2/6pp/qr6/8/8/6PP/7K w - - 0 1",
  a4search: "8/2p5/3p3r/KP6/5p1k/8/4P1P1/1R6 w - - 2 2",
  a4: "8/2p5/3p4/KP5r/5p1k/8/4P1P1/1R6 b - - 1 1",
  kpk: "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1",
};
const out = (row: string, v: unknown) => console.log(JSON.stringify({ row, ...(v as object) }));

// row 1: search.ordering A4, position-6 depth 2 (none / MVV-LVA / full)
out("r1", {
  none: S.searchWithoutOrdering(parseFen(FEN["position-6"]), 2).nodes,
  mvvLva: S.searchWithoutKillers(parseFen(FEN["position-6"]), 2).nodes,
  full: S.searchWithoutPvsOrReductions(parseFen(FEN["position-6"]), 2).nodes,
});
// row 2: G4 promotion-capture depth 3
out("r2", { nodes: S.searchWithoutPvsOrReductions(parseFen(FEN.promo), 3).nodes });
// row 3: G1 position-3, 3 injected ticks, pre-121 engine
{
  let t = 0;
  const c = E.chooseMoveWithoutPvsOrReductions(parseFen(FEN["position-3"]), { budgetMs: 3, now: () => t++ });
  out("r3", { depth: c.depth, nodes: c.nodes });
}
// row 4: transposition A1, position-3 depth 4, table on / off
{
  const on = S.searchWithoutPvsOrReductions(parseFen(FEN["position-3"]), 4);
  const off = S.searchWithoutTable(parseFen(FEN["position-3"]), 4);
  out("r4", { on: on.nodes, off: off.nodes, scoreOn: on.score, scoreOff: off.score });
}
// row 5: transposition A5, perpetual
{
  const r = S.search(parseFen(FEN.repeats), 4);
  out("r5", {
    score: r.score,
    move: label(r.move),
    nodesPre121: S.searchWithoutPvsOrReductions(parseFen(FEN.repeats), 4).nodes,
    d3: S.search(parseFen(FEN.repeats), 3).score,
  });
}
// row 6: quiescence A4 bare-leaf door, position-6 d2 (and d3 when DEEP=1)
{
  const r = S.searchWithoutQuiescence(parseFen(FEN["position-6"]), 2);
  const v: Record<string, unknown> = { d2nodes: r.nodes, d2move: label(r.move) };
  if (process.env.DEEP === "1") {
    const d = S.searchWithoutQuiescence(parseFen(FEN["position-6"]), 3);
    v.d3nodes = d.nodes;
    v.d3move = label(d.move);
  }
  out("r6", v);
}
// row 8: pvs-lmr A4 search() row (b) and chooseMove row
{
  const s = S.search(parseFen(FEN.a4search), 4);
  const ref = S.searchWithoutReductions(parseFen(FEN.a4search), 4);
  const sOld = S.search(parseFen(FEN.a4), 4);
  out("r8", {
    searchRowB: [s.score, label(s.move)],
    reference: [ref.score, label(ref.move)],
    oldFixtureOnSearch: [sOld.score, label(sOld.move)],
  });
}
// row 12: engine A4 kp-vs-k, ticking clock step 1, budgets 5 / 10 (and 40)
{
  const at = (b: number) => {
    let t = 0;
    return E.chooseMove(parseFen(FEN.kpk), { budgetMs: b, now: () => { const r = t; t += 1; return r; } }).depth;
  };
  out("r12", { b5: at(5), b10: at(10), b40: at(40) });
}
