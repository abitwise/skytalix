// PROBE (ruling-abc086-seed): what HARD_CEILING_MS means under a virtual clock.
// Q2: with ticking(step), how many nodes does a capped budget buy, and how many clock readings?
// node .grugops/context/ruling-abc086-seed/probe/ceiling.ts
import { chooseMove, type Clock, HARD_CEILING_MS } from "../../../../src/engine.ts";
import { parseFen } from "../../../../src/fen.ts";
const counting = (step: number): { clock: Clock; reads: () => number } => {
  let t = 0;
  let n = 0;
  return {
    clock: () => {
      n++;
      const r = t;
      t += step;
      return r;
    },
    reads: () => n,
  };
};
const KIWI = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1";
for (const [label, budgetMs, step] of [
  ["ticking(1) budget 5000 (= ceiling)", 5000, 1],
  ["ticking(1) budget 1e9 (clamped)", 1e9, 1],
  ["ticking(4) budget 3000", 3000, 4],
] as const) {
  const c = counting(step);
  const t0 = performance.now();
  const r = chooseMove(parseFen(KIWI), { budgetMs, now: c.clock });
  console.log(JSON.stringify({ label, ceiling: HARD_CEILING_MS, depth: r?.depth, nodes: r?.nodes, reads: c.reads(), nodesPerRead: Math.round((r?.nodes ?? 0) / c.reads()), wallMs: Math.round(performance.now() - t0) }));
}
// Real clock, for scale: what 3 000 real ms buys on this machine (load-dependent; NOT a pin).
{
  const t0 = performance.now();
  const r = chooseMove(parseFen(KIWI), { budgetMs: 3000 });
  console.log(JSON.stringify({ label: "Date.now budget 3000 (real, load-dependent)", depth: r?.depth, nodes: r?.nodes, wallMs: Math.round(performance.now() - t0) }));
}
