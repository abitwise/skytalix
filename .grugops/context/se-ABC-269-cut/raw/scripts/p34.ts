// se-ABC-269-cut P3 + P4: the cut build (W) against the uncut build (U, src b8b44ff3), one process.
// P3: evaluate Object.is over G3's 184 (+ mirrors), every FEN in QE's frozen fixture, and the 6 endgames.
// P4: search() d1-3 and chooseMove to d3 (frozen clock), nodes|score|move, on the 190; plus every door.
const [W, U] = process.argv.slice(2);
const we = await import(`${W}/src/evaluate.ts`), ue = await import(`${U}/src/evaluate.ts`);
const ws = await import(`${W}/src/search.ts`), us = await import(`${U}/src/search.ts`);
const wg = await import(`${W}/src/engine.ts`), ug = await import(`${U}/src/engine.ts`);
const { parseFen, toFen } = await import(`${W}/src/fen.ts`);
const { buildCorpus, mirrorPosition } = await import(`${W}/src/evaluate.mirror-corpus.ts`);
const corpus = await import(`${W}/src/evaluate.taper-corpus.ts`);
const { squareName } = await import(`${W}/src/position.ts`);
const END = ["k7/8/1K6/8/8/8/8/1Q6 w - - 0 1","k7/8/1K6/8/8/8/8/1R6 w - - 0 1","7k/8/6K1/8/8/8/8/6Q1 w - - 0 1","8/8/8/4k3/8/8/4P3/4K3 w - - 0 1","8/8/8/8/8/k7/8/KR6 w - - 0 1","8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"];
// every FEN string anywhere in the frozen fixture
const fixtureFens = new Set<string>();
const visit = (v: any) => { if (typeof v === "string") { if (/^[1-8pnbrqkPNBRQK/]+ [wb] /.test(v)) fixtureFens.add(v); } else if (v && typeof v === "object") for (const x of Object.values(v)) visit(x); };
visit(corpus);
const g3 = buildCorpus().map((c: any) => toFen(c.position));
const g3m = buildCorpus().map((c: any) => toFen(mirrorPosition(c.position)));
const evalFens = [...new Set([...g3, ...g3m, ...fixtureFens, ...END])];
const EVALS = ["evaluate", "evaluateWithoutTaper", "evaluateWithoutMobility", "evaluateWithoutPawnCache"];
let p3rows = 0, p3bad: string[] = [];
for (const name of EVALS) for (const fen of evalFens) {
  p3rows++; const a = we[name](parseFen(fen)), b = ue[name](parseFen(fen));
  if (!Object.is(a, b)) p3bad.push(`${name} ${fen}: ${a} / ${b}`);
}
// also: evaluateAtPhase(p, phaseOf(p)) against the uncut evaluate
let p3atPhase = 0;
for (const fen of evalFens) { const p = parseFen(fen); if (!Object.is(we.evaluateAtPhase(p, we.phaseOf(p)), ue.evaluate(parseFen(fen)))) p3atPhase++; }
console.log(JSON.stringify({ rec: "P3", fixtureFens: fixtureFens.size, positions: evalFens.length, functions: EVALS.length, rows: p3rows, mismatches: p3bad.length, atPhaseMismatches: p3atPhase, bad: p3bad.slice(0, 10) }));

const lab = (m: any) => (m ? squareName(m.from) + squareName(m.to) + (m.promotion || "") : "-");
const sig = (r: any) => `${r.nodes}|${r.score}|${lab(r.move)}|${r.depth ?? ""}`;
const fens = [...g3, ...END];
const fd = (d: number) => ({ budgetMs: 1e9, now: () => 0, maxDepth: d });
let rows = 0; const bad: string[] = [];
for (const fen of fens) for (const d of [1, 2, 3]) {
  rows++; const x = sig(ws.search(parseFen(fen), d)), y = sig(us.search(parseFen(fen), d)); if (x !== y) bad.push(`search d${d} ${fen}: ${x} / ${y}`);
}
for (const fen of fens) for (const d of [1, 2, 3]) {
  rows++; const x = sig(wg.chooseMove(parseFen(fen), fd(d))), y = sig(ug.chooseMove(parseFen(fen), fd(d))); if (x !== y) bad.push(`chooseMove d${d} ${fen}: ${x} / ${y}`);
}
console.log(JSON.stringify({ rec: "P4-shipped", positions: fens.length, rows, mismatches: bad.length, bad: bad.slice(0, 10) }));
// every door, cut vs uncut
let drows = 0; const dbad: string[] = [];
const sdoors = Object.keys(us).filter((k) => /^searchWithout\w+$/.test(k));
const edoors = Object.keys(ug).filter((k) => /^chooseMoveWithout\w+$/.test(k));
for (const k of sdoors) { const depths = /Pruning/.test(k) ? [1, 2] : [1, 2, 3]; for (const fen of fens) for (const d of depths) { drows++; const x = sig(ws[k](parseFen(fen), d)), y = sig(us[k](parseFen(fen), d)); if (x !== y) dbad.push(`${k} d${d} ${fen}`); } }
for (const k of edoors) for (const fen of fens) { drows++; const x = sig(wg[k](parseFen(fen), fd(3))), y = sig(ug[k](parseFen(fen), fd(3))); if (x !== y) dbad.push(`${k} d3 ${fen}`); }
console.log(JSON.stringify({ rec: "P4-doors-vs-uncut", searchDoors: sdoors.length, engineDoors: edoors.length, rows: drows, mismatches: dbad.length, bad: dbad.slice(0, 10) }));
