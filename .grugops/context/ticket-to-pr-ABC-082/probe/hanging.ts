// ABC-082 diagnosis of ABC-079 A1 deep (row 21): search(p, 3) on HANGING_CORPUS, which rows choose the losing capture.
// Usage: node hanging.ts <tree-root>
import { readFileSync } from "node:fs";
const root = process.argv[2];
const S = await import(`${root}/src/search.ts`);
const F = await import(`${root}/src/fen.ts`);
const P = await import(`${root}/src/position.ts`);
const E = await import(`${root}/src/evaluate.ts`);
const A = await import(`${root}/src/apply.ts`);
const L = await import(`${root}/src/legal.ts`);
const src = readFileSync(`${root}/src/quiescence.test.ts`, "utf8");
const body = src.slice(src.indexOf("const HANGING_CORPUS"), src.indexOf("];", src.indexOf("const HANGING_CORPUS")) + 2);
const corpus = new Function(`${body.replace(/^const HANGING_CORPUS[^=]*=/, "return")}`)();
const lbl = (m) => (m ? P.squareName(m.from) + P.squareName(m.to) : "null");
let losing = 0;
for (const { name, fen, losing: bad } of corpus) {
  const r = S.search(F.parseFen(fen), 3);
  const mv = lbl(r.move);
  if (mv === bad) {
    losing++;
    // score each root move at depth 2 after making it (negated), to show what the losing capture is worth
    const p = F.parseFen(fen);
    const scores = L.legalMoves(p).map((m) => { const u = A.makeMove(p, m); const s = -S.search(p, 2).score; A.unmakeMove(p, m, u); return [lbl(m), s]; }).sort((a, b) => b[1] - a[1]).slice(0, 4);
    console.log(JSON.stringify({ name, fen, chosen: mv, score: r.score, staticEval: E.evaluate(F.parseFen(fen)), top4AtD3: scores }));
  }
}
console.log(JSON.stringify({ root: root.split("/").slice(-1)[0], losing, of: corpus.length }));
