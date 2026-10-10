import { createLevel, LEVELS } from "<worktree>/src/levels.ts";
import { parseFen, toFen } from "<worktree>/src/fen.ts";
import { legalMoves } from "<worktree>/src/legal.ts";
import { makeMove, unmakeMove } from "<worktree>/src/apply.ts";
import { virtualClock } from "<worktree>/src/virtual-clock.ts";
const always={budgetMs:100,blunderRate:0.999999};
function kids(f:string){const p=parseFen(f);const o:string[]=[];for(const m of legalMoves(p)){const u=makeMove(p,m);if(legalMoves(p).length)o.push(toFen(p));unmakeMove(p,m,u);}return o;}
const roots=JSON.parse(process.argv[2]);
const fens:string[]=[];for(const r of roots){fens.push(r);for(const c of kids(r)){fens.push(c);}}
const t0=performance.now(); let nc=0; for(const f of fens) if(createLevel(always,{seed:1,now:virtualClock(100)})(parseFen(f))!.kind==="no-candidate") nc++;
const t1=performance.now(); const c=createLevel(LEVELS[1],{seed:87,now:virtualClock(100)}); const k:any={blunder:0,"no-candidate":0,engine:0}; for(const f of fens)k[c(parseFen(f))!.kind]++;
console.log(fens.length,"pos q=",(nc/fens.length).toFixed(3),"always-blunder total",(t1-t0).toFixed(0),"ms; level1 run",(performance.now()-t1).toFixed(0),"ms",JSON.stringify(k),(k.blunder/(fens.length-k["no-candidate"])*100).toFixed(1)+"%");
