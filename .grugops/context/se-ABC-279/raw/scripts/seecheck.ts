import { parseFen } from "<worktree>/src/fen.ts";
import { legalMoves } from "<worktree>/src/legal.ts";
import { squareName } from "<worktree>/src/position.ts";
import { HANGING_CORPUS } from "<worktree>/src/puzzle-corpus.ts";
import { isLosingCapture, see } from "<worktree>/src/see.ts";
const mv = (m: any) => squareName(m.from) + squareName(m.to);
const byName = (p: any, uci: string) => legalMoves(p).find((m) => mv(m) === uci && m.promotion === 0)!;
let ok = 0; const rows: string[] = [];
for (const row of HANGING_CORPUS) { const p = parseFen(row.fen); const m = byName(p, row.losing); const v = see(p, m); if (v < 0 && isLosingCapture(p, m)) ok++; rows.push(row.name + " " + row.losing + " " + v + " " + mv(m)); }
console.log("hanging", ok, HANGING_CORPUS.length); console.log(rows.join("\n"));
