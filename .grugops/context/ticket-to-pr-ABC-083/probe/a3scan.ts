/**
 * ABC-083 A10 row 9 (ABC-078 A3, class F): positions whose searchWithoutReductions best move at depth 2
 * differs from depth 3, with every 1 ms-tick budget B (2..12) at which chooseMove completes depth 2,
 * spends nodes inside depth 3 and returns the depth-2 move. Corpus: startpos two plies deep, then
 * corpus.ts broad() and each one-ply child. Usage: node a3scan.ts [limit]
 */
import { makeMove, unmakeMove } from "../../../../src/apply.ts";
import { chooseMove } from "../../../../src/engine.ts";
import { parseFen, toFen } from "../../../../src/fen.ts";
import { gameStatus } from "../../../../src/gameend.ts";
import { legalMoves } from "../../../../src/legal.ts";
import { searchWithoutReductions } from "../../../../src/search.ts";
import { broad, lbl } from "./corpus.ts";

const limit = Number(process.argv[2] ?? 12);
const seen = new Set<string>();
const list: Array<[string, string]> = [];
const add = (name: string, fen: string) => { if (!seen.has(fen)) { seen.add(fen); list.push([name, fen]); } };
const children = (name: string, fen: string, plies: number) => {
  const p = parseFen(fen);
  for (const m of legalMoves(p)) {
    const u = makeMove(p, m);
    if (gameStatus(p).result === "in-progress") { const f = toFen(p); add(`${name}/${lbl(m)}`, f); if (plies > 1) children(`${name}/${lbl(m)}`, f, plies - 1); }
    unmakeMove(p, m, u);
  }
};
children("startpos", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", 2);
for (const [name, fen] of broad()) { add(name, fen); children(name, fen, 1); }
let hits = 0;
for (const [name, fen] of list) {
  const r = [1, 2, 3].map((d) => searchWithoutReductions(parseFen(fen), d));
  if (!r[1].move || !r[2].move || lbl(r[1].move) === lbl(r[2].move)) continue;
  const budgets: number[] = [];
  for (let b = 2; b <= limit; b++) {
    let t = 0;
    const c = chooseMove(parseFen(fen), { budgetMs: b, now: () => t++ });
    if (c && c.depth === 2 && c.nodes > r[0].nodes + r[1].nodes && lbl(c.move) === lbl(r[1].move)) budgets.push(b);
  }
  if (budgets.length === 0) continue;
  hits++;
  console.log(JSON.stringify({ name, fen, d1: [r[0].nodes, lbl(r[0].move), r[0].score], d2: [r[1].nodes, lbl(r[1].move), r[1].score], d3: [r[2].nodes, lbl(r[2].move), r[2].score], budgets }));
}
console.log(JSON.stringify({ summary: "a3scan", scanned: list.length, hits }));
