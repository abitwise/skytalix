// One cold reading per process: build a 300-ply history (not timed), then time formatPgn + writePgnFile
// once, in a fresh mkdtemp cwd. Then 50 warm repeats in the same process for the shape.
import { mkdtempSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";
const [W, scratch] = process.argv.slice(2);
const { formatPgn } = await import(`${W}/src/pgn.ts`);
const { writePgnFile } = await import(`${W}/src/pgn-file.ts`);
const { newGame, playMove } = await import(`${W}/src/history.ts`);
const { legalMoves } = await import(`${W}/src/legal.ts`);
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
let seed = 0x2f6e2b1, h;
for (let attempt = 0; ; attempt++) {
  h = newGame(START); let s = seed + attempt;
  for (let ply = 0; ply < 300; ply++) { const ms = legalMoves(h.position); if (!ms.length) break; s = (s * 1103515245 + 12345) & 0x7fffffff; playMove(h, ms[s % ms.length]); }
  if (h.moves.length === 300) break;
}
const outcome = { result: "draw", reason: "fivefold-repetition", exitCode: 0 }; // longest single-line headline
const game = { startedAt: new Date(2026, 9, 23, 14, 5, 9), difficulty: 5, humanColour: "white" };
const dir = mkdtempSync(join(scratch, "t-")); process.chdir(dir);
const t0 = performance.now();
const text = formatPgn(outcome, h, game);
const t1 = performance.now();
const r = writePgnFile(game.startedAt, text);
const t2 = performance.now();
if (!r.ok) throw new Error(r.code);
const warm = [];
for (let i = 0; i < 50; i++) { const a = performance.now(); const tx = formatPgn(outcome, h, game); const w = writePgnFile(new Date(2026, 9, 23, 14, 5, 9 + 1 + i), tx); const b = performance.now(); if (!w.ok) throw new Error(w.code); warm.push(b - a); }
warm.sort((x, y) => x - y);
process.chdir(scratch); rmSync(dir, { recursive: true, force: true });
console.log(JSON.stringify({ plies: h.moves.length, bytes: text.length, coldFormatMs: +(t1 - t0).toFixed(3), coldWriteMs: +(t2 - t1).toFixed(3), coldTotalMs: +(t2 - t0).toFixed(3), warmMedianMs: +warm[25].toFixed(3), warmMaxMs: +warm[49].toFixed(3) }));
