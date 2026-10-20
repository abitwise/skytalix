import { readFileSync } from "node:fs";
import { unitOf } from "./units.mjs";
const rd = (l) => Object.fromEntries(readFileSync(`census-${l}.tsv`, "utf8").trim().split("\n").map((x) => x.split("\t")).map(([n, v]) => [n, Number(v)]));
const b = rd("base"), h = rd("head");
let sb = 0, sh = 0, changedOther = 0;
const bn = Object.keys(b).sort(), hn = Object.keys(h).sort();
console.log("same row names in census:", JSON.stringify(bn) === JSON.stringify(hn), bn.length);
for (const n of bn) {
  const u = unitOf(n);
  if (!u) { if (b[n] !== h[n]) { changedOther++; console.log("NON-UNIT ROW CHANGED", n, b[n], h[n]); } continue; }
  sb += b[n]; sh += h[n];
  console.log(`${u}\t${b[n]}\t${h[n]}\t${h[n] - b[n]}\t${h[n] < b[n] ? "fewer" : "NOT FEWER"}\t${n.split(/ — [^ ]+ [^ ]+ [^ ]+ [^ ]+ /).pop().slice(0, 90)}`);
}
console.log(`sum\t${sb}\t${sh}\t${sh - sb}`, "| non-unit rows changed:", changedOther);
