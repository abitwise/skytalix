import { parse, rootScores, materialBest } from "./oracle.mjs";
for (const fen of ["6k1/5ppp/2q5/3N4/8/8/5PPP/6K1 w - - 0 1","6k1/6pp/3n1r2/8/3PP3/2P5/6PP/6K1 w - - 0 1","4k2p/8/8/4q3/8/1P6/P2K4/R7 w - - 0 1","8/7p/3k3q/8/8/8/6PP/R5K1 w - - 0 1","3q4/6k1/8/8/3B4/8/6PP/3R2K1 w - - 0 1","r5k1/6pp/8/8/8/8/6PP/3Q2K1 w - - 0 1"]) {
  const p = parse(fen); let t=performance.now(); const a = rootScores(p); const t1=performance.now()-t; t=performance.now(); const b = materialBest(p); const t2=performance.now()-t;
  const top = [...new Set(a.filter(s=>s.gain===a[0].gain).map(s=>s.move))].sort(); const next=a.find(s=>s.gain<a[0].gain);
  console.log(a[0].gain===b.gain && JSON.stringify(top)===JSON.stringify(b.setLabels) && ((next? a[0].gain-next.gain>=2:true)===b.gapOk) ? "SAME":"DIFF", a[0].gain, top, b.setLabels, b.gapOk, t1.toFixed(0), t2.toFixed(0));
}
