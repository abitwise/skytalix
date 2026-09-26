/** PROBE: per-item cost (plain node, warm) of candidate default-lane guards. Median of 5. */
import { parseFen } from "../../../../src/fen.ts";
import { MATE_CORPUS_SEEDS } from "../../../../src/search.mate-corpus.ts";
import { search, searchWithoutPvsOrReductions, searchWithoutReductions } from "../../../../src/search.ts";
import { ENDGAMES, ROOTS } from "./corpus.ts";

const med = (f: () => void): number => {
  const xs: number[] = [];
  for (let i = 0; i < 5; i++) {
    const t = performance.now();
    f();
    xs.push(performance.now() - t);
  }
  xs.sort((a, b) => a - b);
  return Math.round((xs[2] as number) * 10) / 10;
};
const fenOf = (n: string) => (ROOTS.find(([m]) => m === n) as [string, string])[1];
const rows: Record<string, unknown> = {};
for (const [n, f] of ENDGAMES) rows[`pvsId d4 ${n}`] = med(() => { searchWithoutReductions(parseFen(f), 4); searchWithoutPvsOrReductions(parseFen(f), 4); });
rows["pvsId d4 position-3"] = med(() => { searchWithoutReductions(parseFen(fenOf("position-3")), 4); searchWithoutPvsOrReductions(parseFen(fenOf("position-3")), 4); });
for (const f of MATE_CORPUS_SEEDS) rows[`mateFloor ${f}`] = med(() => { searchWithoutReductions(parseFen(f), 4); search(parseFen(f), 5); });
for (const d of [4, 5]) {
  const p3 = fenOf("position-3");
  rows[`A5 position-3 d${d}`] = { ms: med(() => { search(parseFen(p3), d); searchWithoutPvsOrReductions(parseFen(p3), d); }), shipped: search(parseFen(p3), d).nodes, pre: searchWithoutPvsOrReductions(parseFen(p3), d).nodes };
}
for (const n of ["kiwipete", "position-6"]) rows[`A5 ${n} d4`] = med(() => { search(parseFen(fenOf(n)), 4); searchWithoutPvsOrReductions(parseFen(fenOf(n)), 4); });
rows["A4 search d4"] = med(() => { search(parseFen("8/2p5/3p4/KP5r/5p1k/8/4P1P1/1R6 b - - 1 1"), 4); searchWithoutReductions(parseFen("8/2p5/3p4/KP5r/5p1k/8/4P1P1/1R6 b - - 1 1"), 4); });
console.log(JSON.stringify(rows, null, 1));
