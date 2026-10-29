// Probe Q3-1: how many book entries are keyed on a position carrying an uncapturable ep square
// (they would be re-keyed under Q3 option (b)). Walks the book from startpos through its own moves.
import { readFileSync } from "node:fs";
import { parseFen, toFen } from "./src/fen.ts";
import { makeMove, unmakeMove } from "./src/apply.ts";
import { parseCoordinateMove } from "./src/coordinate-move.ts";
import { hasLegalEnPassant } from "./src/legal.ts";
import { zobristKey } from "./src/zobrist.ts";
import { NO_SQUARE } from "./src/position.ts";
const book = JSON.parse(readFileSync(process.argv[2]!, "utf8"));
const entries: Record<string, { m: [string, number][] }> = book.positions;
const total = Object.keys(entries).length;
const hex = (k: bigint) => k.toString(16).padStart(16, "0");
const seen = new Set<string>();
let reached = 0, epSet = 0, epUncapturable = 0;
const pos = parseFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
function walk(): void {
  const key = hex(zobristKey(pos));
  if (seen.has(key)) return;
  const e = entries[key];
  if (!e || !e.m || e.m.length === 0) return;
  seen.add(key); reached++;
  if (pos.epSquare !== NO_SQUARE) { epSet++; if (!hasLegalEnPassant(pos)) epUncapturable++; }
  for (const [uci] of e.m) {
    const p = parseCoordinateMove(pos, uci);
    if (p.outcome !== "move") continue;
    const u = makeMove(pos, p.move); walk(); unmakeMove(pos, p.move, u);
  }
}
walk();
console.log(JSON.stringify({ totalEntries: total, reachedFromStartpos: reached, epSet, epUncapturable, startFenRoundTrip: toFen(pos) }));
