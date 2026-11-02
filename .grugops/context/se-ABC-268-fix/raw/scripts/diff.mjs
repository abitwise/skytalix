// usage: node diff.mjs a.jsonl b.jsonl
import { readFileSync } from "node:fs";
const [A, B] = process.argv.slice(2);
const load = (f) => readFileSync(f, "utf8").trim().split("\n").map((l) => JSON.parse(l));
const a = load(A), b = load(B);
console.log("root", JSON.stringify(a[0]), JSON.stringify(b[0]));
const bm = new Map(b.slice(1).map((x) => [x.fen, x]));
for (const x of a.slice(1)) {
  const y = bm.get(x.fen);
  if (!y || y.v !== x.v || y.bound !== x.bound || y.d !== x.d) console.log(JSON.stringify(x), "=>", y ? `${y.bound} d${y.d} v${y.v}` : "none");
}
