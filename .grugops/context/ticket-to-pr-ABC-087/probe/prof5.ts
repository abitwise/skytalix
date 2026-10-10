import { createLevel } from "<worktree>/src/levels.ts";
import { parseFen, toFen } from "<worktree>/src/fen.ts";
import { legalMoves } from "<worktree>/src/legal.ts";
import { makeMove, unmakeMove } from "<worktree>/src/apply.ts";
import { virtualClock } from "<worktree>/src/virtual-clock.ts";
const always={budgetMs:100,blunderRate:0.999999};
// warm
for(let i=0;i<50;i++) createLevel(always,{seed:1,now:virtualClock(100)})(parseFen("8/1p3k2/8/8/8/8/1P3K2/3R4 w - - 0 1"));
for (const r of process.argv.slice(2)){const p=parseFen(r);const fens=[r];for(const m of legalMoves(p)){const u=makeMove(p,m);if(legalMoves(p).length)fens.push(toFen(p));unmakeMove(p,m,u);}
 const t=performance.now(); let nc=0; for(const f of fens){ if(createLevel(always,{seed:1,now:virtualClock(100)})(parseFen(f))!.kind==="no-candidate") nc++;}
 console.log(r.padEnd(44), String(fens.length).padStart(3), "pos  q=", (nc/fens.length).toFixed(2), " ", ((performance.now()-t)/fens.length).toFixed(2),"ms/blunder");}
