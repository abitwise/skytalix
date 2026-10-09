// BA/PM probe, rescore-abc086. Read-only against src/ at f952983; not a test, not shipped.
// Q1: is chooseMove already exactly reproducible under an injected virtual clock (A1's shape)?
// Q2: how often does the root carry >= 2 equal-best moves (A3's precondition)?
// Run from the repo root: node .grugops/context/rescore-abc086/probe/determinism.ts [budgetTicks] [runs]
import { makeMove, unmakeMove } from "../../../../src/apply.ts";
import { chooseMove, type Clock } from "../../../../src/engine.ts";
import { parseFen, toFen } from "../../../../src/fen.ts";
import { legalMoves } from "../../../../src/legal.ts";
import { squareName } from "../../../../src/position.ts";
import { searchWithoutReductions } from "../../../../src/search.ts";

const ROOTS = [
  ["startpos", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],
  ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"],
  ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"],
] as const;

const lbl = (m: { from: number; to: number }) => `${squareName(m.from)}${squareName(m.to)}`;
const ticking = (step: number): Clock => {
  let t = 0;
  return () => {
    const r = t;
    t += step;
    return r;
  };
};

const corpus: { name: string; fen: string }[] = [];
for (const [name, fen] of ROOTS) {
  corpus.push({ name, fen });
  const p = parseFen(fen);
  for (const m of legalMoves(p).slice(0, 4)) {
    const u = makeMove(p, m);
    corpus.push({ name: `${name}/${lbl(m)}`, fen: toFen(p) });
    unmakeMove(p, m, u);
  }
}

const budgetTicks = Number(process.argv[2] ?? 32);
const RUNS = Number(process.argv[3] ?? 10);
const started = process.cpuUsage();
let identical = 0;
const lines: string[] = [];
for (const { name, fen } of corpus) {
  const runs = Array.from({ length: RUNS }, () => {
    const c = chooseMove(parseFen(fen), { budgetMs: budgetTicks, now: ticking(1) });
    return c === null ? "null" : `${lbl(c.move)} s=${c.score} d=${c.depth} n=${c.nodes}`;
  });
  const same = runs.every((r) => r === runs[0]);
  if (same) identical++;
  lines.push(`${same ? "SAME" : "DIFF"} ${name} ${runs[0]}`);
}
const cpu = process.cpuUsage(started);
console.log(lines.join("\n"));
console.log(`A1-shape: ${identical * RUNS}/${corpus.length * RUNS} identical (${corpus.length} positions x ${RUNS}, budget ${budgetTicks} ticks, ticking(1))`);
console.log(`cpu-ms: ${((cpu.user + cpu.system) / 1000).toFixed(0)}`);

// Q2: exact per-root-move scores at depth 3 via the child's own search, PVS on, LMR off.
const DEPTH = 3;
let tied = 0;
for (const { name, fen } of corpus) {
  const p = parseFen(fen);
  const scored = legalMoves(p).map((m) => {
    const u = makeMove(p, m);
    const s = 0 - searchWithoutReductions(p, DEPTH - 1).score;
    unmakeMove(p, m, u);
    return { m: lbl(m), s };
  });
  const top = Math.max(...scored.map((x) => x.s));
  const best = scored.filter((x) => x.s === top).map((x) => x.m);
  if (best.length >= 2) tied++;
  console.error(`ties d${DEPTH} ${name}: ${best.length} at ${top} [${best.join(" ")}]`);
}
console.error(`Q2: ${tied}/${corpus.length} positions have >= 2 equal-best root moves at depth ${DEPTH}`);
