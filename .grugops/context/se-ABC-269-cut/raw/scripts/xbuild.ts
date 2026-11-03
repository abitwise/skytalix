// se-ABC-269 G4 / F2 cross-build: every door of the build against its pre-ticket self on main (src 58fa3eb4),
// node for node; the new doors against main's shipped search()/chooseMove. Corpus: G3's 184 + 6 endgames.
const [W, B] = process.argv.slice(2);
const hs = await import(`${W}/src/search.ts`), bs = await import(`${B}/src/search.ts`);
const he = await import(`${W}/src/engine.ts`), be = await import(`${B}/src/engine.ts`);
const { parseFen } = await import(`${W}/src/fen.ts`);
const { buildCorpus } = await import(`${W}/src/evaluate.mirror-corpus.ts`);
const { toFen } = await import(`${W}/src/fen.ts`);
const { squareName } = await import(`${W}/src/position.ts`);
const lab = (m: any) => (m ? squareName(m.from) + squareName(m.to) + (m.promotion || "") : "-");
const END = ["k7/8/1K6/8/8/8/8/1Q6 w - - 0 1","k7/8/1K6/8/8/8/8/1R6 w - - 0 1","7k/8/6K1/8/8/8/8/6Q1 w - - 0 1","8/8/8/4k3/8/8/4P3/4K3 w - - 0 1","8/8/8/8/8/k7/8/KR6 w - - 0 1","8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"];
const fens = [...buildCorpus().map((c: any) => toFen(c.position)), ...END];
const SEARCH_PAIRS: [string, string][] = Object.keys(bs).filter((k) => /^search(Without\w+)?$/.test(k)).map((k) => [k, k]);
SEARCH_PAIRS.push(["searchWithoutTaper", "search"]);
const ENGINE_PAIRS: [string, string][] = Object.keys(be).filter((k) => /^chooseMove(Without\w+)?$/.test(k)).map((k) => [k, k]);
ENGINE_PAIRS.push(["chooseMoveWithoutTaper", "chooseMove"]);
let rows = 0, diff = 0, differs = 0; const bad: string[] = [];
const sig = (r: any) => `${r.nodes}|${r.score}|${lab(r.move)}`;
for (const [h, b] of SEARCH_PAIRS) {
  if (h === "search") continue; // the shipped search() changes by design (B0 reads it)
  const depths = /Pruning/.test(h) ? [1, 2] : [1, 2, 3];
  const t0 = Date.now();
  for (const fen of fens) for (const d of depths) {
    rows++; const x = sig(hs[h](parseFen(fen), d)), y = sig(bs[b](parseFen(fen), d));
    if (x !== y) { diff++; if (bad.length < 10) bad.push(`${h} vs main ${b} d${d} ${fen}: ${x} / ${y}`); }
  }
}
const fd = (d: number) => ({ budgetMs: 1e9, now: () => 0, maxDepth: d });
for (const [h, b] of ENGINE_PAIRS) {
  if (h === "chooseMove") continue;
  for (const fen of fens) {
    rows++; const x = sig(he[h](parseFen(fen), fd(3))), y = sig(be[b](parseFen(fen), fd(3)));
    if (x !== y) { diff++; if (bad.length < 10) bad.push(`${h} vs main ${b} d3 ${fen}: ${x} / ${y}`); }
  }
}
// non-vacuity: how often the shipped head differs from main's shipped at the same reading
for (const fen of fens) for (const d of [1, 2, 3]) if (sig(hs.search(parseFen(fen), d)) !== sig(bs.search(parseFen(fen), d))) differs++;
console.log(JSON.stringify({ positions: fens.length, searchPairs: SEARCH_PAIRS.length - 1, enginePairs: ENGINE_PAIRS.length - 1, rows, mismatches: diff, bad, shippedSearchDiffersFromMain: `${differs} / ${fens.length * 3}` }));
