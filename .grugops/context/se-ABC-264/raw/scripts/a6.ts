import { parseFen, toFen } from "<worktree>/src/fen.ts";
import { legalMoves } from "<worktree>/src/legal.ts";
import { makeMove, unmakeMove } from "<worktree>/src/apply.ts";
import { squareName } from "<worktree>/src/position.ts";
import { virtualClock } from "<worktree>/src/virtual-clock.ts";
import * as E from "<worktree>/src/engine.ts";
const roots = ["8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1","r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"];
const corpus: string[] = [];
for (const f of roots) { corpus.push(f); const p = parseFen(f); let n=0; for (const m of legalMoves(p)) { if (n++>=4) break; const u = makeMove(p,m); corpus.push(toFen(p)); unmakeMove(p,m,u);} }
const lab = (m:any)=>squareName(m.from)+squareName(m.to);
for (const fn of ["chooseMove","chooseMoveWithoutReverseFutility"]) for (const b of [1,2,3,4,5,6,8]) {
  console.log(fn, b, corpus.map(f=>{const c=(E as any)[fn](parseFen(f),{budgetMs:b, now: virtualClock(1)}); return lab(c.move)+"@"+c.depth;}).join(" "));
}
