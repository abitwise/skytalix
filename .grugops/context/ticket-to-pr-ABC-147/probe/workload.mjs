// ABC-147 A2: the two representative production calls, imported identically by the plain-node side
// (a2-node.mjs) and the vitest side (a2.probe.test.mjs). Each is the call its test file makes:
//   E = src/engine.test.ts "A3 (identity)": chooseMoveWithoutReductions on kq-corner, kr-corner,
//       kqk-h8, kp-vs-k at budgets 3 and 5 on tickingClock(1), each checked by
//       searchWithoutReductions at the completed depth (the file's heaviest default-lane test).
//   S = src/search.test.ts "A1 position-4 at depth 2": searchWithoutReductions and
//       searchWithoutPruning on position-4 at depth 2 (that file's heaviest default-lane test).
// The digest is the node counts, scores, depths and moves: equal digest = equal work.
import { createHash } from "node:crypto";
import { chooseMoveWithoutReductions } from "../../../../src/engine.ts";
import { parseFen } from "../../../../src/fen.ts";
import { searchWithoutPruning, searchWithoutReductions } from "../../../../src/search.ts";

const tickingClock = (step) => {
  let t = 0;
  return () => {
    const r = t;
    t += step;
    return r;
  };
};
const ENDGAMES = [
  "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1",
  "k7/8/1K6/8/8/8/8/1R6 w - - 0 1",
  "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1",
  "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1",
];
const P4 = "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1";

const WORK = {
  E() {
    const out = [];
    for (const fen of ENDGAMES)
      for (const budgetMs of [3, 5]) {
        const c = chooseMoveWithoutReductions(parseFen(fen), { budgetMs, now: tickingClock(1) });
        const r = searchWithoutReductions(parseFen(fen), c.depth);
        out.push([c.nodes, c.depth, c.score, JSON.stringify(c.move), r.nodes, r.score, JSON.stringify(r.move)]);
      }
    return out;
  },
  S() {
    const a = searchWithoutReductions(parseFen(P4), 2);
    const b = searchWithoutPruning(parseFen(P4), 2);
    return [a.nodes, a.score, JSON.stringify(a.move), b.nodes, b.score, JSON.stringify(b.move)];
  },
};

export function measure(which, k = 5) {
  const fn = WORK[which];
  if (!fn) throw new Error(`unknown workload ${which}`);
  const t0 = performance.now();
  const first = fn();
  const coldMs = performance.now() - t0;
  const digest = createHash("sha256").update(JSON.stringify(first)).digest("hex").slice(0, 16);
  const ms = [];
  for (let i = 0; i < k; i++) {
    const s = performance.now();
    const res = fn();
    ms.push(performance.now() - s);
    const d = createHash("sha256").update(JSON.stringify(res)).digest("hex").slice(0, 16);
    if (d !== digest) throw new Error(`non-deterministic workload ${which}: ${d} != ${digest}`);
  }
  const s = [...ms].sort((x, y) => x - y);
  return { which, digest, coldMs: +coldMs.toFixed(2), ms: ms.map((x) => +x.toFixed(2)), medianMs: +s[s.length >> 1].toFixed(2), first };
}
