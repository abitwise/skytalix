// BA/PM recut-abc010 probe: for each candidate FEN, (1) ADR-0033's six rules via the Architect's
// prototype semanticFault (design-abc010/probe/fen-corpus.mjs), (2) the shipped engine's choice in
// ADR-0027 deterministic mode at the baseline's config (budget 25, step 1, fresh clock per move).
// Usage: node engine-and-rules.mts <worktree>   (reads src/ only; writes nothing)
const W = process.argv[2];
const { parseFen } = await import(`${W}/src/fen.ts`);
const { chooseMove } = await import(`${W}/src/engine.ts`);
const { virtualClock } = await import(`${W}/src/virtual-clock.ts`);
const { squareName } = await import(`${W}/src/position.ts`);
const { semanticFault } = await import("./rules.mjs");
const ROWS = JSON.parse(process.env.ROWS);
for (const [fen, accept] of ROWS) {
  const p = parseFen(fen);
  const fault = semanticFault ? semanticFault(fen.split(" "), p) : "n/a";
  const c = chooseMove(parseFen(fen), { budgetMs: 25, now: virtualClock(1) });
  const mv = c ? `${squareName(c.move.from)}${squareName(c.move.to)}` : "null";
  console.log(`${fen}\n  adr0033=${fault ?? "accepted"} chosen=${mv} d${c?.depth} n${c?.nodes} solved=${accept.includes(mv)}`);
}
