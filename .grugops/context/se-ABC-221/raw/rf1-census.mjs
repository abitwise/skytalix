// RF-1 census: clock reads and nodes for the clamp-scaled rows, at a given src tree.
const src = process.argv[2];
const { chooseMove, HARD_CEILING_MS } = await import(`${src}/engine.ts`);
const { createLevel } = await import(`${src}/levels.ts`);
const { parseFen } = await import(`${src}/fen.ts`);
const counting = (step) => { let t = 0, n = 0; const c = () => { n++; const v = t; t += step; return v; }; c.reads = () => n; return c; };
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const out = { clamp: HARD_CEILING_MS };
for (const [name, budget] of [["2H", 2 * HARD_CEILING_MS], ["H", HARD_CEILING_MS], ["Inf", Infinity]]) {
  const c = counting(HARD_CEILING_MS / 2);
  const r = chooseMove(parseFen(START), { budgetMs: budget, now: c });
  out[`engine RF-1 ${name}`] = { reads: c.reads(), nodes: r.nodes, depth: r.depth, elapsed: r.elapsedMs };
}
{
  const step = HARD_CEILING_MS / 20; const c = counting(step);
  const r = createLevel({ budgetMs: 2 * HARD_CEILING_MS, blunderRate: 1 }, { seed: 1, now: c })(parseFen("6k1/8/8/8/8/8/1R6/6K1 b - - 0 1"));
  out["levels R1 (QE-087-c)"] = { reads: c.reads(), kind: r.kind, elapsedOverStep: r.elapsedMs / step };
}
console.log(JSON.stringify(out));
