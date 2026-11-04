// se-ABC-239b scratch: the two step-6 reds, read for the STOP. usage: node <this> <repo> <scratch/se239b>
import { readFileSync } from "node:fs";
const [R, D] = process.argv.slice(2);
const { parseFen } = await import(`${R}/src/fen.ts`);
const { evaluate } = await import(`${R}/src/evaluate.ts`);
const { chooseMove } = await import(`${R}/src/engine.ts`);
const { squareName } = await import(`${R}/src/position.ts`);
const { evaluateAt, trace } = await import(`${R}/tools/tune/tracer.ts`);
const T = await import(`${R}/tools/tune/tune.ts`);
const tab = (j: any) => ({ mg: Float64Array.from(j.mg), eg: Float64Array.from(j.eg), wmg: j.wmg, weg: j.weg, cap: j.cap });
const base = tab(JSON.parse(readFileSync(`${D}/refit1/extract.json`, "utf8")).base);
const box = tab(JSON.parse(readFileSync(`${D}/box/fit.json`, "utf8")).table);
const cand = tab(JSON.parse(readFileSync(`${D}/refit1/fit.json`, "utf8")).table);
const DOUBLED = "7k/2pp4/8/8/2P5/2P5/8/7K w - - 0 1";
const SIDE = "7k/2pp4/8/8/8/2PP4/8/7K w - - 0 1";
for (const [name, th] of [["base", base], ["box-only", box], ["candidate", cand]] as const) {
  const g = evaluateAt(trace(parseFen(SIDE)), th) - evaluateAt(trace(parseFen(DOUBLED)), th);
  console.log(`pawns A2 gap (c3/d3 - c3/c4) on ${name}: ${g}  (bar: > 0 and <= 50)`);
}
console.log("pawns A2 gap via evaluate on the file in place:", evaluate(parseFen(SIDE)) - evaluate(parseFen(DOUBLED)));
const bd = T.boundData([{ file: "x", row: "x", terms: [{ fen: DOUBLED, coef: 1 }, { fen: SIDE, coef: -1 }], rhs: 0, strict: false }]);
console.log("pawns A2 as a row, a = trace(c3/c4) - trace(c3/d3):", T.termsOf(bd, 0).join(", "), "phase w", bd.d.w[0], bd.d.w[1]);
const Z = "8/8/p1p5/1p5p/1P5p/8/PPP2K1p/4R1rk w - - 0 1";
for (let depth = 9; depth <= 12; depth++) {
  const c = chooseMove(parseFen(Z), { budgetMs: 1_000, now: () => 0, maxDepth: depth });
  console.log(`zugzwang.001 candidate depth ${depth}: ${squareName(c.move.from)}${squareName(c.move.to)} score ${c.score} (depth read ${c.depth})`);
}
