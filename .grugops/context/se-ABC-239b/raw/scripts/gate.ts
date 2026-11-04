// se-ABC-239b scratch: ADR-0067 d5's dated line 2 — the identity gate once more, on the emitted file now in
// src/evaluate-params.ts (SHIPPED = its values), over every row key of an extract's rows.jsonl.
// usage: node --max-old-space-size=3000 <this> <repo> <rows.jsonl>
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
const [R, rowsPath] = process.argv.slice(2);
const { evaluate } = await import(`${R}/src/evaluate.ts`);
const { parseFen } = await import(`${R}/src/fen.ts`);
const { gateMiss, SHIPPED, trace } = await import(`${R}/tools/tune/tracer.ts`);
let n = 0, miss = 0, worst = 0, w24 = 0, qOn = 0;
const rl = createInterface({ input: createReadStream(rowsPath), crlfDelay: Infinity });
for await (const line of rl) {
  if (line === "") continue;
  const { k } = JSON.parse(line) as { k: string };
  const p = parseFen(`${k} 0 1`);
  const ev = evaluate(p);
  const t = trace(p);
  const g = gateMiss(t, p.blackToMove ? 0 - ev : ev, SHIPPED);
  n++;
  if (t.w === 24) w24++;
  if (t.f.some((x: number, i: number) => i % 2 === 0 && x >= 400)) qOn++;
  if (g.d > worst) worst = g.d;
  if (g.miss) { miss++; if (miss <= 5) console.log("MISS", k, g.d); }
}
console.log(JSON.stringify({ checked: n, misses: miss, worst, phase24: w24, withQueenOnCount: qOn,
  queenOnMg: [SHIPPED.mg[400], SHIPPED.mg[401], SHIPPED.mg[402]] }));
