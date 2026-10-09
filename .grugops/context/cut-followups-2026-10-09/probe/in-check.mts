// BA/PM probe (cut-followups-2026-10-09), read-only: which HANGING_CORPUS rows start in check,
// and does the candidate re-find (king off the bishop's diagonal) keep the row discriminating?
// Run from the repo root: node .grugops/context/cut-followups-2026-10-09/probe/in-check.mts
import { readFileSync } from "node:fs";
import { parseFen } from "../../../../src/fen.ts";
import { isInCheck, legalMoves } from "../../../../src/legal.ts";
import { squareName } from "../../../../src/position.ts";
import { search, searchWithoutQuiescence } from "../../../../src/search.ts";

const label = (m: { from: number; to: number } | null) => (m ? squareName(m.from) + squareName(m.to) : "none");
const src = readFileSync(new URL("../../../../src/quiescence.test.ts", import.meta.url), "utf8");
const rows = [...src.matchAll(/\{ name: "([^"]+)", fen: "([^"]+)", losing: "([^"]+)" \}/g)];
let inCheck = 0;
for (const [, name, fen] of rows) {
  if (isInCheck(parseFen(fen))) {
    inCheck++;
    console.log(`IN CHECK: ${name} | ${fen}`);
  }
}
console.log(`corpus rows ${rows.length}, in check ${inCheck}`);

const pairs: ReadonlyArray<[string, string, string]> = [
  ["shipped", "4k3/8/1p6/b7/8/8/8/R3K3 w - - 0 1", "a1a5"],
  ["shipped mirror", "r3k3/8/8/8/B7/1P6/8/4K3 b - - 0 1", "a8a4"],
  ["candidate K f1", "4k3/8/1p6/b7/8/8/8/R4K2 w - - 0 1", "a1a5"],
  ["candidate mirror K f8", "r4k2/8/8/8/B7/1P6/8/4K3 b - - 0 1", "a8a4"],
];
for (const [name, fen, losing] of pairs) {
  const p = parseFen(fen);
  const legal = legalMoves(p).map(label);
  const run = (f: typeof search, d: number) => {
    const r = f(parseFen(fen), d);
    return `${label(r.move)}/${r.score}`;
  };
  console.log(
    `${name} | check ${isInCheck(p)} | capture legal ${legal.includes(losing)} | legal ${legal.length}` +
      ` | q d1 ${run(search, 1)} | bare d1 ${run(searchWithoutQuiescence, 1)}` +
      ` | q d3 ${run(search, 3)} | bare d3 ${run(searchWithoutQuiescence, 3)}`,
  );
}
