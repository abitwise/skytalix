// Security/NFR ABC-087 probe 1 (out of tree): table lookups by non-ordinal keys, degenerate
// level fields, and the blunder path's unabortable floor on the REAL clock.
import os from "node:os";
import { LEVELS, createLevel } from "<sec-scratch>/tree/src/levels.ts";
import { chooseMove } from "<sec-scratch>/tree/src/engine.ts";
import { makeMove, unmakeMove } from "<sec-scratch>/tree/src/apply.ts";
import { legalMoves } from "<sec-scratch>/tree/src/legal.ts";
import { parseFen, toFen } from "<sec-scratch>/tree/src/fen.ts";
import { buildCorpus } from "<sec-scratch>/tree/src/evaluate.mirror-corpus.ts";
import { PUZZLES } from "<sec-scratch>/tree/src/puzzle-corpus.ts";

console.log("load1 start", os.loadavg()[0].toFixed(2));
const L = LEVELS as unknown as Record<string, unknown>;
for (const k of ["3", "0", "6", "constructor", "__proto__", "toString", "hasOwnProperty"]) {
  const v = L[k];
  console.log("LEVELS[" + JSON.stringify(k) + "] ->", typeof v, v && typeof v === "object" ? JSON.stringify(v) : String(v).slice(0, 30), "own:", Object.hasOwn(LEVELS, k));
}
const start = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
for (const [name, lvl] of [
  ["constructor-as-level", L["constructor"]],
  ["NaN rate", { budgetMs: 100, blunderRate: Number.NaN }],
  ["undefined fields", {}],
  ["rate 1", { budgetMs: 100, blunderRate: 1 }],
  ["rate -1", { budgetMs: 100, blunderRate: -1 }],
] as const) {
  const t0 = performance.now();
  const c = createLevel(lvl as never, { seed: 1 })(parseFen(start));
  console.log(name.padEnd(22), "kind", c?.kind, "depth", c?.depth, "wall", (performance.now() - t0).toFixed(1), "ms");
}

// Floor: every root move's child searched at budget 0 (depth 1, unabortable), real clock.
const fens = [...buildCorpus().map((e) => toFen(e.position)), ...PUZZLES.map((p) => p.fen)];
let worstSum = { ms: 0, n: 0, fen: "" };
let worstOne = 0;
const sums: number[] = [];
for (const fen of fens) {
  const pos = parseFen(fen);
  let sum = 0;
  const moves = legalMoves(pos);
  for (const m of moves) {
    const u = makeMove(pos, m);
    const t0 = performance.now();
    chooseMove(pos, { budgetMs: 0 });
    const dt = performance.now() - t0;
    unmakeMove(pos, m, u);
    sum += dt;
    worstOne = Math.max(worstOne, dt);
  }
  sums.push(sum);
  if (sum > worstSum.ms) worstSum = { ms: sum, n: moves.length, fen };
}
sums.sort((a, b) => a - b);
console.log("floor: positions", fens.length, "median sum", sums[Math.floor(sums.length / 2)].toFixed(1), "ms; max sum", worstSum.ms.toFixed(1), "ms over", worstSum.n, "children;", worstSum.fen, "; max single child", worstOne.toFixed(1), "ms");

// The same floor through the level module: an always-blunder level at a 1 ms budget, real clock.
const tiny = { budgetMs: 1, blunderRate: 0.999999 };
let worstLevel = { ms: 0, fen: "" };
for (const fen of fens) {
  const c = createLevel(tiny, { seed: 3 })(parseFen(fen));
  if (c && c.elapsedMs > worstLevel.ms) worstLevel = { ms: c.elapsedMs, fen };
}
console.log("always-blunder at 1 ms, real clock: max elapsedMs", worstLevel.ms, "on", worstLevel.fen);
console.log("load1 end", os.loadavg()[0].toFixed(2));
