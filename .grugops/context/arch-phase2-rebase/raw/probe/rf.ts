// SCRATCH (arch-phase2-rebase): reach of reverse futility at a node budget. chooseMove (head) vs
// chooseMoveWithoutReverseFutility (door) on ABC-121's 190 (same corpus as probe.ts), frozen clock, maxNodes.
// Usage (from a scratch copy of 4d1c0616's root): node rf.ts <maxNodes>
import { makeMove, unmakeMove } from "./src/apply.ts";
import { chooseMove, chooseMoveWithoutReverseFutility } from "./src/engine.ts";
import { parseFen, toFen } from "./src/fen.ts";
import { gameStatus } from "./src/gameend.ts";
import { legalMoves } from "./src/legal.ts";
import { squareName } from "./src/position.ts";
const ROOTS = [
  ["startpos", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],
  ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"],
  ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"],
];
const mv = (m: { from: number; to: number } | null) => (m ? squareName(m.from) + squareName(m.to) : "-");
const rows: string[] = [];
for (const [, fen] of ROOTS) {
  rows.push(fen as string);
  const p = parseFen(fen as string);
  for (const m of legalMoves(p)) {
    const u = makeMove(p, m);
    if (gameStatus(p).result === "in-progress") rows.push(toFen(p));
    unmakeMove(p, m, u);
  }
}
const maxNodes = Number(process.argv[2] ?? 47000);
const d: number[] = [], h: number[] = []; let moveDiff = 0;
for (const fen of rows) {
  const a = chooseMoveWithoutReverseFutility(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxNodes } as any) as any;
  const b = chooseMove(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxNodes } as any) as any;
  d.push(a.depth); h.push(b.depth); if (mv(a.move) !== mv(b.move)) moveDiff++;
}
const sum = (x: number[]) => x.reduce((s, y) => s + y, 0);
console.log(JSON.stringify({ maxNodes, rows: rows.length, doorSum: sum(d), headSum: sum(h), doorMean: +(sum(d) / rows.length).toFixed(3), headMean: +(sum(h) / rows.length).toFixed(3), gain: +((sum(h) - sum(d)) / rows.length).toFixed(4), deeper: h.filter((x, i) => x > d[i]!).length, shallower: h.filter((x, i) => x < d[i]!).length, moveDiff }));
