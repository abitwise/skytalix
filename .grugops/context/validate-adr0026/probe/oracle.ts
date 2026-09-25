/**
 * VALIDATE-ADR0026 probe driver. `node oracle.ts <depth> <variant|correct> [mates]`
 *
 * Applies ADR-0026 decision 9 / Ruling 2's bounded oracle to one LMR variant at one fixed depth:
 *   0 mate-status flips (presence or sign), >= 95% of non-mate positions within 25 cp, none > 75 cp,
 * comparing PVS+LMR(variant) with PVS alone (`searchWithoutReductions`' shape) on the ruling's
 * 190-position corpus. With `mates`, also reads the five pinned mate rows under the variant
 * (fixed and deepened), which Ruling 2 names as the rest of the mate floor.
 * With a fourth argument `deepen`, both sides run in the ENGINE shape (warm table and killers,
 * iterations 1..depth) instead of one fixed-depth call — the drift oracle applied to `chooseMove`.
 * The corpus is the one in `../../ruling-abc121-lmr-oracle/probe/run.ts`, copied verbatim.
 */
import { makeMove, unmakeMove } from "../../../../src/apply.ts";
import { parseFen, toFen } from "../../../../src/fen.ts";
import { gameStatus } from "../../../../src/gameend.ts";
import { legalMoves } from "../../../../src/legal.ts";
import type { Move } from "../../../../src/moves.ts";
import { squareName } from "../../../../src/position.ts";
import { MATE_SCORE } from "../../../../src/search.ts";
import { BASE, type Cfg, deepen, fixed } from "./lmr.ts";

const ROOTS: Array<[string, string]> = [
  ["startpos", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],
  ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"],
  ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"],
];
const ENDGAMES: Array<[string, string]> = [
  ["kq-corner", "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1"],
  ["kr-corner", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1"],
  ["kqk-h8", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1"],
  ["kp-vs-k", "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1"],
  ["krk-a-file", "8/8/8/8/8/k7/8/KR6 w - - 0 1"],
  ["pawn-race", "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"],
];
/** search.test.ts A3's four rows and transposition.test.ts's depth-10 rook ending. */
const MATES: Array<[string, string, number, number]> = [
  ["mate-in-2", "7k/8/5K2/8/8/8/8/R7 w - - 0 1", 4, MATE_SCORE - 3],
  ["mate-in-1", "7k/8/6K1/8/8/8/8/R7 w - - 0 1", 4, MATE_SCORE - 1],
  ["mate-in-2", "7k/8/5K2/8/8/8/8/R7 w - - 0 1", 5, MATE_SCORE - 3],
  ["mate-in-2", "7k/8/5K2/8/8/8/8/R7 w - - 0 1", 7, MATE_SCORE - 3],
  ["rook-ending-b", "k7/8/8/K7/8/8/8/1R6 b - - 1 1", 10, -(MATE_SCORE - 8)],
];
const lbl = (m: Move | null): string => (m ? `${squareName(m.from)}${squareName(m.to)}` : "-");
function broad(): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  for (const [name, fen] of ROOTS) {
    out.push([name, fen]);
    const p = parseFen(fen);
    for (const m of legalMoves(p)) {
      const u = makeMove(p, m);
      if (gameStatus(p).result === "in-progress") out.push([`${name}/${lbl(m)}`, toFen(p)]);
      unmakeMove(p, m, u);
    }
  }
  return [...out, ...ENDGAMES];
}
const isMate = (s: number): boolean => Math.abs(s) > MATE_SCORE - 1000;
const out = (o: unknown): void => console.log(JSON.stringify(o));

const [dArg, variant, withMates, shapeArg] = process.argv.slice(2);
const shape = shapeArg === "deepen" ? "deepen" : "fixed";
const run = (fen: string, depth: number, c: Cfg) =>
  shape === "deepen" ? deepen(parseFen(fen), c, depth) : fixed(parseFen(fen), depth, c);
const d = Number(dArg);
const PVS: Cfg = { ...BASE, pvs: true };
const ON: Cfg = { ...BASE, pvs: true, lmr: true, ...(variant === "correct" ? {} : { bug: variant as Cfg["bug"] }) };
const t0 = performance.now();
const corpus = broad();
const deltas: number[] = [];
let flips = 0;
let moveDiff = 0;
let nOn = 0;
let nBase = 0;
let reductions = 0;
const worst: Array<[number, string, number, number]> = [];
for (const [name, fen] of corpus) {
  const b = run(fen, d, PVS);
  const l = run(fen, d, ON);
  nOn += l.nodes;
  nBase += b.nodes;
  reductions += l.stats.reductions;
  if (isMate(b.score) !== isMate(l.score) || (isMate(b.score) && Math.sign(b.score) !== Math.sign(l.score))) {
    flips++;
    out({ mateFlip: name, base: b.score, lmr: l.score });
  }
  // A mate DISTANCE change (mate in both, same sign, different ply) is not a flip under the ADR; count it.
  if (isMate(b.score) && isMate(l.score) && b.score !== l.score) out({ mateDistance: name, base: b.score, lmr: l.score });
  if (!isMate(b.score) && !isMate(l.score)) {
    const dlt = Math.abs(l.score - b.score);
    deltas.push(dlt);
    worst.push([dlt, name, b.score, l.score]);
  }
  if (lbl(b.move) !== lbl(l.move)) moveDiff++;
}
deltas.sort((x, y) => x - y);
const within = (cp: number): number => +(deltas.filter((x) => x <= cp).length / deltas.length).toFixed(4);
const pct = (q: number): number => deltas[Math.min(deltas.length - 1, Math.floor(q * deltas.length))] as number;
worst.sort((x, y) => y[0] - x[0]);
const max = deltas[deltas.length - 1] as number;
const w25 = within(25);
const reds: string[] = [];
if (flips > 0) reds.push("mate-flip");
if (w25 < 0.95) reds.push("within25<95%");
if (max > 75) reds.push("max>75");
let mateRows: unknown[] | undefined;
if (withMates === "mates") {
  mateRows = [];
  for (const [name, fen, md, want] of MATES) {
    const f = fixed(parseFen(fen), md, ON).score;
    const dp = deepen(parseFen(fen), ON, md).score;
    if (f !== want || dp !== want) reds.push(`mate-row:${name}@d${md}`);
    mateRows.push({ name, d: md, want, fixed: f, deepen: dp });
  }
}
out({
  summary: "oracle",
  variant,
  shape,
  depth: d,
  positions: corpus.length,
  compared: deltas.length,
  mateFlips: flips,
  identical: within(0),
  within25: w25,
  within50: within(50),
  p95: pct(0.95),
  p99: pct(0.99),
  max,
  moveDiffers: moveDiff,
  worst5: worst.slice(0, 5),
  nodesOnOverPvs: +(nOn / nBase).toFixed(4),
  reductions,
  mateRows,
  oracle: reds.length === 0 ? "GREEN" : "RED",
  reds,
  ms: Math.round(performance.now() - t0),
});
