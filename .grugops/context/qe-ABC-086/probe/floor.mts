// QE probe (qe-ABC-086, focus 3): is the default slice's depth >= 2 floor a guard or a tautology?
// At budget 2, step 1 the clock reads: 0 at entry (deadline 2), 1 at the loop check before
// iteration 2, then either 2 at the first node check (iteration 2 aborted, depth 1) or 2 at the
// next loop check (iteration 2 complete, loop stops: depth 2). So depth is 1 or 2, NEVER 3, and
// depth 2 <=> iteration 2 costs <= 1023 nodes. This probe measures each position's iteration-2
// node cost (nodes at budget 2 minus nodes at budget 1, which stops after depth 1) and the margin
// to 1023, and the depth histogram at budgets 2, 3 and 4 on the same clock.
import { chooseMove, NODES_PER_CLOCK_CHECK } from "../../../../src/engine.ts";
import { parseFen } from "../../../../src/fen.ts";
import { virtualClock } from "../../../../src/virtual-clock.ts";
import { thirty } from "./corpus.mts";

const SLICE = ["startpos", "position-3", "position-5"];
const run = (fen: string, budgetMs: number) =>
  chooseMove(parseFen(fen), { budgetMs, now: virtualClock(1) }) as { depth: number; nodes: number };
const rows = thirty().map(({ name, fen }) => {
  const d1 = run(fen, 1);
  const b2 = run(fen, 2);
  const iter2 = b2.depth === 2 ? b2.nodes - d1.nodes : null;
  return {
    name,
    slice: SLICE.includes(name.split("/")[0] as string),
    depthAt1: d1.depth,
    depthAt2: b2.depth,
    depthAt3: run(fen, 3).depth,
    depthAt4: run(fen, 4).depth,
    depth1Nodes: d1.nodes,
    iter2Nodes: iter2,
    marginTo1023: iter2 === null ? null : NODES_PER_CLOCK_CHECK - 1 - iter2,
  };
});
for (const r of rows) console.log(JSON.stringify(r));
const slice = rows.filter((r) => r.slice);
const hist = (k: "depthAt2" | "depthAt3" | "depthAt4", rs = rows) =>
  JSON.stringify(rs.reduce<Record<number, number>>((h, r) => ({ ...h, [r[k]]: (h[r[k]] ?? 0) + 1 }), {}));
const margins = slice.map((r) => r.marginTo1023 as number).sort((a, b) => a - b);
console.log(`SLICE(15): depth@2 ${hist("depthAt2", slice)}  depth@3 ${hist("depthAt3", slice)}  depth@4 ${hist("depthAt4", slice)}`);
console.log(`SLICE(15): iteration-2 margin to 1023 nodes: min ${margins[0]} median ${margins[7]} max ${margins[14]}  sorted ${margins.join(" ")}`);
console.log(`ALL(30):   depth@2 ${hist("depthAt2")}  depth@3 ${hist("depthAt3")}  depth@4 ${hist("depthAt4")}`);
console.log(`ANY depth@2 > 2: ${rows.some((r) => r.depthAt2 > 2)}`);
