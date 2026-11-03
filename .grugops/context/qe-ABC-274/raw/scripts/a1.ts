// qe-ABC-274 A1, independent re-check, ONE process: B0's 11 readings on H and on B side by side, then the cross-build
// (ABC-269 G4 shape) on G3's 184 + the 6 endgames: shipped search() and every search door at d1-3 (Pruning doors d1-2),
// shipped chooseMove and every engine door to d3, frozen clock; nodes|score|move. Door lists from BOTH trees' exports.
const [S] = process.argv.slice(2);
const H = `${S}/H`, B = `${S}/B`;
const hs = await import(`${H}/src/search.ts`), bs = await import(`${B}/src/search.ts`);
const he = await import(`${H}/src/engine.ts`), be = await import(`${B}/src/engine.ts`);
const { parseFen, toFen } = await import(`${H}/src/fen.ts`);
const { buildCorpus } = await import(`${H}/src/evaluate.mirror-corpus.ts`);
const { squareName } = await import(`${H}/src/position.ts`);
const KIWI = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1";
const POS6 = "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10";
const lab = (m: any) => (m ? squareName(m.from) + squareName(m.to) + (m.promotion || "") : "-");
const fd = (d: number) => ({ budgetMs: 1e9, now: () => 0, maxDepth: d });
const t0 = Date.now();
// B0
const b0: any[] = [];
const rd = (tag: string, f: () => any) => { const r = f(); return `${r.nodes}|${r.depth ?? "-"}|${r.score}|${lab(r.move)}`; };
const rows0: [string, (e: any, s: any) => any][] = [];
for (const [n, fen, ds] of [["kiwipete", KIWI, [8, 9]], ["position-6", POS6, [8, 9, 10]]] as const)
  for (const d of ds) rows0.push([`chooseMove ${n} d${d}`, (e) => e.chooseMove(parseFen(fen), fd(d))]);
for (const [n, fen] of [["kiwipete", KIWI], ["position-6", POS6]]) {
  rows0.push([`chooseMoveWithoutTaper ${n} d8`, (e) => e.chooseMoveWithoutTaper(parseFen(fen), fd(8))]);
  rows0.push([`search ${n} d8`, (_e, s) => s.search(parseFen(fen), 8)]);
  rows0.push([`searchWithoutTaper ${n} d8`, (_e, s) => s.searchWithoutTaper(parseFen(fen), 8)]);
}
let b0miss = 0;
for (const [name, f] of rows0) { const h = rd("H", () => f(he, hs)), b = rd("B", () => f(be, bs)); if (h !== b) b0miss++; b0.push({ name, H: h, B: b, equal: h === b }); console.log(JSON.stringify(b0.at(-1))); }
console.log(JSON.stringify({ b0rows: b0.length, b0mismatches: b0miss, secs: (Date.now() - t0) / 1000 }));
// cross-build
const END = ["k7/8/1K6/8/8/8/8/1Q6 w - - 0 1", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1", "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1", "8/8/8/8/8/k7/8/KR6 w - - 0 1", "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"];
const fens = [...buildCorpus().map((c: any) => toFen(c.position)), ...END];
const sNames = (m: any) => Object.keys(m).filter((k) => /^search(Without\w+)?$/.test(k) && typeof m[k] === "function").sort();
const eNames = (m: any) => Object.keys(m).filter((k) => /^chooseMove(Without\w+)?$/.test(k) && typeof m[k] === "function").sort();
const sameLists = JSON.stringify(sNames(hs)) === JSON.stringify(sNames(bs)) && JSON.stringify(eNames(he)) === JSON.stringify(eNames(be));
let rows = 0, miss = 0, doorRows = 0; const bad: string[] = [];
const sig = (r: any) => `${r.nodes}|${r.score}|${lab(r.move)}`;
for (const k of sNames(bs)) for (const fen of fens) for (const d of (/Pruning/.test(k) ? [1, 2] : [1, 2, 3])) {
  rows++; if (k !== "search") doorRows++; const x = sig(hs[k](parseFen(fen), d)), y = sig(bs[k](parseFen(fen), d));
  if (x !== y) { miss++; if (bad.length < 10) bad.push(`${k} d${d} ${fen}: ${x} / ${y}`); }
}
for (const k of eNames(be)) for (const fen of fens) {
  rows++; if (k !== "chooseMove") doorRows++; const x = sig(he[k](parseFen(fen), fd(3))), y = sig(be[k](parseFen(fen), fd(3)));
  if (x !== y) { miss++; if (bad.length < 10) bad.push(`${k} d3 ${fen}: ${x} / ${y}`); }
}
console.log(JSON.stringify({ positions: fens.length, sameDoorLists: sameLists, search: sNames(bs), engine: eNames(be), rows, doorRows, mismatches: miss, bad, secs: (Date.now() - t0) / 1000 }));
