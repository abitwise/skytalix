/**
 * ABC-083 A10 row 10 (ABC-080 Scope tie, class F): positions where search() and searchWithoutOrdering
 * at depth 1 return DIFFERENT moves at the SAME score, and chooseMove's depth-1 iteration returns
 * search()'s move. Corpus: corpus.ts broad() plus every in-progress child of each, de-duplicated.
 * Usage: node tiescan.ts
 */
import { makeMove, unmakeMove } from "../../../../src/apply.ts";
import { chooseMove } from "../../../../src/engine.ts";
import { parseFen, toFen } from "../../../../src/fen.ts";
import { gameStatus } from "../../../../src/gameend.ts";
import { legalMoves } from "../../../../src/legal.ts";
import { search, searchWithoutOrdering } from "../../../../src/search.ts";
import { broad, lbl } from "./corpus.ts";

const seen = new Set<string>();
const list: Array<[string, string]> = [];
for (const [name, fen] of broad()) {
  if (!seen.has(fen)) { seen.add(fen); list.push([name, fen]); }
  const p = parseFen(fen);
  for (const m of legalMoves(p)) {
    const u = makeMove(p, m);
    const f = toFen(p);
    if (gameStatus(p).result === "in-progress" && !seen.has(f)) { seen.add(f); list.push([`${name}/${lbl(m)}`, f]); }
    unmakeMove(p, m, u);
  }
}
let hits = 0;
for (const [name, fen] of list) {
  const o = search(parseFen(fen), 1);
  const u = searchWithoutOrdering(parseFen(fen), 1);
  if (!o.move || !u.move || o.score !== u.score || lbl(o.move) === lbl(u.move)) continue;
  let t = 0;
  const c = chooseMove(parseFen(fen), { budgetMs: 1, now: () => t++ });
  if (!c || c.depth !== 1 || lbl(c.move) !== lbl(o.move)) continue;
  hits++;
  console.log(JSON.stringify({ name, fen, ordered: lbl(o.move), unordered: lbl(u.move), score: o.score }));
}
console.log(JSON.stringify({ summary: "tiescan", scanned: list.length, hits }));
