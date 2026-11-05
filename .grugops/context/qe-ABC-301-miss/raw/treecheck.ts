// qe-ABC-301-miss: the row's own tree, not the data set. Every position to ply 4 from zugzwang.001's root, in walk order
// (warm memo), on the tree at <root>: the engine against the tracer at the file's values, the carried phase, the memo off, the mirror.
// usage: node treecheck.ts <tree> <plies>
const [root, plies] = process.argv.slice(2) as [string, string];
const E = await import(`${root}/src/evaluate.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`);
const { legalMoves } = await import(`${root}/src/legal.ts`);
const { makeMove, unmakeMove } = await import(`${root}/src/apply.ts`);
const { mirrorPosition } = await import(`${root}/src/evaluate.mirror-corpus.ts`);
const T = await import(`${root}/tools/tune/tracer.ts`);
const FEN = "8/8/p1p5/1p5p/1P5p/8/PPP2K1p/4R1rk w - - 0 1";
const r = { positions: 0, gateMiss: 0, worstGate: 0, phaseMiss: 0, memoMiss: 0, mirrorMiss: 0, passerNonZero: 0 };
const check = (p: any, carried: number) => {
  r.positions++;
  const ev = E.evaluate(p);
  if (!Object.is(ev, E.evaluateAtPhase(p, carried))) r.phaseMiss++;
  if (!Object.is(ev, E.evaluateWithoutPawnCache(p))) r.memoMiss++;
  if (!Object.is(ev, E.evaluate(mirrorPosition(p)))) r.mirrorMiss++;
  const g = T.gateMiss(T.trace(p), p.blackToMove ? 0 - ev : ev, T.SHIPPED);
  if (g.miss) r.gateMiss++;
  if (g.d > r.worstGate) r.worstGate = g.d;
  const t = E.passerTermsForTest(p);
  if (t.white.kd !== 0 || t.white.free !== 0 || t.black.kd !== 0 || t.black.free !== 0) r.passerNonZero++;
};
const walk = (p: any, d: number, phase: number) => {
  check(p, phase);
  if (d === 0) return;
  for (const m of legalMoves(p)) {
    const next = E.phaseAfterMove(phase, m);
    const u = makeMove(p, m);
    walk(p, d - 1, next);
    unmakeMove(p, m, u);
  }
};
const p = parseFen(FEN);
walk(p, Number(plies), E.phaseOf(p));
console.log(JSON.stringify(r));
