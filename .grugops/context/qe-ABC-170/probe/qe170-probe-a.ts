// QE ABC-170 probe A: absent limits == base engine node for node, and == huge limits, on a wider corpus.
import * as tip from "./engine.ts";
import * as base from "./qe170-engine-base.ts";
import { makeMove } from "./apply.ts";
import { parseFen, toFen } from "./fen.ts";
import { gameStatus } from "./gameend.ts";
import { legalMoves } from "./legal.ts";

const ROOTS = [
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
];
const ENDGAMES = [
  "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1",
  "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1", "8/8/8/8/8/k7/8/KR6 w - - 0 1", "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1",
];
let seed = 170170;
const rnd = (n: number) => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed % n; };
const walks: string[] = [];
for (let i = 0; walks.length < 60; i++) {
  const p = parseFen(ROOTS[i % ROOTS.length]);
  const plies = 4 + rnd(50);
  let ok = true;
  for (let k = 0; k < plies; k++) {
    const ms = legalMoves(p);
    if (ms.length === 0) { ok = false; break; }
    makeMove(p, ms[rnd(ms.length)]);
  }
  if (!ok || gameStatus(p).result !== "in-progress") continue;
  walks.push(toFen(p));
}
const corpus = [...ROOTS, ...ENDGAMES, ...walks];
const tick = (step: number) => { let t = 0; return () => { const r = t; t += step; return r; }; };
const doors = [
  ["chooseMove", tip.chooseMove, base.chooseMove],
  ["WithoutReductions", tip.chooseMoveWithoutReductions, base.chooseMoveWithoutReductions],
  ["WithoutPvsOrReductions", tip.chooseMoveWithoutPvsOrReductions, base.chooseMoveWithoutPvsOrReductions],
] as const;
const key = (c: any) => c === null ? "null" : JSON.stringify({ m: [c.move.from, c.move.to, c.move.promotion ?? null], s: c.score, d: c.depth, n: c.nodes, e: c.elapsedMs });
let runs = 0, mism = 0, fenBad = 0, aborts = 0; const depths: number[] = [];
const budgets = [1, 2, 5, 13, 40, 90];
for (const fen of corpus) for (const budgetMs of budgets) for (const [name, t, b] of doors) {
  const variants: Record<string, any> = {};
  variants.base = b(parseFen(fen), { budgetMs, now: tick(1) });
  const pos = parseFen(fen);
  variants.absent = t(pos, { budgetMs, now: tick(1) });
  if (toFen(pos) !== fen) fenBad++;
  variants.undef = t(parseFen(fen), { budgetMs, now: tick(1), maxDepth: undefined, maxNodes: undefined });
  variants.huge = t(parseFen(fen), { budgetMs, now: tick(1), maxDepth: 1000, maxNodes: Number.MAX_SAFE_INTEGER });
  variants.inf = t(parseFen(fen), { budgetMs, now: tick(1), maxDepth: Infinity, maxNodes: Infinity });
  const ref = key(variants.base);
  for (const [v, c] of Object.entries(variants)) {
    runs++;
    if (key(c) !== ref) { mism++; console.log("MISMATCH", name, budgetMs, v, fen, key(c), "vs base", ref); }
  }
  if (variants.base) depths.push(variants.base.depth);
}
// also a 3-step clock and a 0.5 step, to move abort points
for (const fen of corpus) for (const step of [3, 0.5]) {
  const a = key(base.chooseMove(parseFen(fen), { budgetMs: 20, now: tick(step) }));
  const b2 = key(tip.chooseMove(parseFen(fen), { budgetMs: 20, now: tick(step) }));
  const c = key(tip.chooseMove(parseFen(fen), { budgetMs: 20, now: tick(step), maxDepth: 999, maxNodes: 1e15 }));
  runs += 2; if (a !== b2) { mism++; console.log("MISMATCH step", step, fen); } if (a !== c) { mism++; console.log("MISMATCH huge step", step, fen); }
}
console.log(JSON.stringify({ positions: corpus.length, walks: walks.length, budgets, doors: doors.length, comparisons: runs, mismatches: mism, fenNotRestored: fenBad, depthRange: [Math.min(...depths), Math.max(...depths)] }));
