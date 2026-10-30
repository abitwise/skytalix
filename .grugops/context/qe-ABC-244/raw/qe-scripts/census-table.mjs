// usage: node census-table.mjs <outDir> -> per-row nodes and searches, base vs head, the 8 unit rows marked.
import { readFileSync } from "node:fs";
import { join } from "node:path";
const [dir] = process.argv.slice(2);
const load = (l) => new Map(readFileSync(join(dir, `census-${l}.tsv`), "utf8").trim().split("\n").map((x) => { const [n, v, s] = x.split("\t"); return [n, { v: +v, s: +s }]; }));
const [b, h] = [load("base"), load("head")];
const U1 = ["A1: with keyHistory injected", "the injected keyHistory is read once", "A3: a game started from a FEN", "A2: bestmove is byte-equal to the CLI"];
const U2 = ["A4: with repetitionKeyHistory injected", "A4: with a legal ep capture", "A7: the move the search scores 0", "A5: the CLI level seam's injected list"];
console.log(`same row names: ${[...b.keys()].sort().join("\n") === [...h.keys()].sort().join("\n")} (${b.size} rows)`);
let sum = 0, sumB = 0, sumH = 0, bad = 0;
for (const [n, x] of b) {
  const y = h.get(n);
  const unit = U1.some((t) => n.includes(t)) ? "U1" : U2.some((t) => n.includes(t)) ? "U2" : "--";
  const rel = y.v < x.v ? "fewer" : y.v === x.v ? "same" : "MORE";
  if (unit === "U1" && rel !== "fewer") bad++;
  if (unit !== "U1" && rel !== "same") bad++;
  sum += y.v - x.v; sumB += x.v; sumH += y.v;
  console.log(`${unit}\t${x.v}\t${y.v}\t${y.v - x.v}\t${rel}\tsearches ${x.s}/${y.s}\t${n}`);
}
console.log(`sum base ${sumB} head ${sumH} delta ${sum}; rows breaking the A7 rule (U1 must be fewer, others same): ${bad}`);
