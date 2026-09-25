/** PROBE: searchWithoutReductions vs searchWithoutPvsOrReductions, score identity at depth d, per-position ms. */
import { parseFen } from "../../../../src/fen.ts";
import { searchWithoutPvsOrReductions, searchWithoutReductions } from "../../../../src/search.ts";
import { broad } from "./corpus.ts";

const d = Number(process.argv[2]);
const corpus = broad();
let bad = 0;
const rows: Array<[string, number]> = [];
const t0 = performance.now();
for (const [name, fen] of corpus) {
  const t = performance.now();
  const a = searchWithoutReductions(parseFen(fen), d);
  const b = searchWithoutPvsOrReductions(parseFen(fen), d);
  if (a.score !== b.score) {
    bad++;
    console.log(JSON.stringify({ diverge: name, pvs: a.score, base: b.score }));
  }
  rows.push([name, Math.round((performance.now() - t) * 10) / 10]);
}
rows.sort((x, y) => x[1] - y[1]);
console.log(JSON.stringify({ depth: d, positions: corpus.length, divergences: bad, ms: Math.round(performance.now() - t0), cheapest: rows.slice(0, 40), dearest: rows.slice(-5) }));
