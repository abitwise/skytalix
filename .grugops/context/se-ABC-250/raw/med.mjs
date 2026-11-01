import { readFileSync } from "node:fs";
const rows = readFileSync(process.argv[2], "utf8").trim().split("\n").map(JSON.parse).filter((r) => r.tree);
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s[(s.length - 1) >> 1] ; };
const boards = [...new Set(rows.map((r) => r.board))];
for (const b of boards) {
  const g = (t) => rows.filter((r) => r.board === b && r.tree === t);
  const B = g("B"), H = g("H");
  const mb = med(B.map((r) => r.nps)), mh = med(H.map((r) => r.nps));
  const spread = (a) => { const v = a.map((r) => r.nps); return ((Math.max(...v) - Math.min(...v)) / med(v) * 100).toFixed(1); };
  const extra = B[0].depth !== undefined ? ` depth B ${B.map((r) => r.depth)} H ${H.map((r) => r.depth)} | moves equal ${B.every((r,i)=>r.move===B[0].move) && H.every(r=>r.move===B[0].move)} ` : ` nodes ${B[0].nodes}/${H[0].nodes}`;
  console.log(`${b}: base ${mb} (spread ${spread(B)}%) | head ${mh} (spread ${spread(H)}%) | ratio ${(mh / mb).toFixed(3)} |${extra}| load1 ${Math.min(...[...B,...H].map(r=>r.load1))}-${Math.max(...[...B,...H].map(r=>r.load1))} | tctl max ${Math.max(...[...B,...H].map(r=>r.tctlAfter))}`);
}
