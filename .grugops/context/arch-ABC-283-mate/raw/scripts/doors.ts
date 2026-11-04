// arch-ABC-283-mate step 1: identity of the probe copy, then door-by-door on the three rows (history kept on).
// usage: node doors.ts <probeRoot> <headRoot>
const [root, headRoot] = process.argv.slice(2);
const S = await import(`${root}/src/search.ts`);
const E = await import(`${root}/src/engine.ts`);
const HS = await import(`${headRoot}/src/search.ts`);
const HE = await import(`${headRoot}/src/engine.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`);
const mv = (m: any) => (m ? S.mvName(m) : "-");
const clk = (d: number) => ({ budgetMs: 1e9, now: () => 0, maxDepth: d });
const SROW = "6k1/R7/5K2/8/8/8/8/8 w - - 2 2";
const CROWS = ["8/7k/5K2/8/8/8/8/5R2 w - - 2 2", "8/k7/2K5/8/8/8/8/1R6 w - - 2 2"];
const KIWI = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1";
// identity
for (const fen of [SROW, ...CROWS, KIWI]) {
  const a = S.search(parseFen(fen), 6), b = HS.search(parseFen(fen), 6);
  const c = E.chooseMove(parseFen(fen), clk(6)), d = HE.chooseMove(parseFen(fen), clk(6));
  console.log(JSON.stringify({ identity: fen, search: [a.nodes, b.nodes, a.score === b.score], choose: [c.nodes, d.nodes, c.score === d.score] }));
}
const sDoors: [string, any][] = [["shipped", {}], ["history off", { history: false }], ["LMR off", { reductions: false }], ["futility off", { futility: false }], ["PVS off", { pvs: false }], ["table off", { table: false }], ["killers off (mvv-lva)", { ordering: "mvv-lva" }], ["SEE ordering off", { seeOrdering: false }], ["LMR+futility off", { reductions: false, futility: false }]];
for (const [name, o] of sDoors) { const r = S.searchWith(parseFen(SROW), 5, o); console.log(JSON.stringify({ row: "search d5 " + SROW, door: name, move: mv(r.move), score: r.score, nodes: r.nodes })); }
const cDoors: [string, any][] = [["shipped", {}], ["history off", { history: false }], ["LMR off", { reductions: false }], ["futility off", { futility: false }], ["PVS off", { pvs: false }], ["aspiration off", { aspiration: false }], ["SEE ordering off", { seeOrdering: false }], ["LMR+futility off", { reductions: false, futility: false }]];
for (const fen of CROWS) for (const [name, o] of cDoors) { const r = E.chooseMoveWith(parseFen(fen), clk(5), o); console.log(JSON.stringify({ row: "chooseMove d5 " + fen, door: name, move: mv(r.move), score: r.score, nodes: r.nodes })); }
