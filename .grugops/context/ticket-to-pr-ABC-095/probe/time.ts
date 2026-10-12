import { readFileSync } from "node:fs";
const R = process.argv[2]; const mode = process.argv[3];
const { createBookProbe } = await import(R + "/src/book.ts");
const { withBook } = await import(R + "/src/book-engine.ts");
const { newGame, playMove } = await import(R + "/src/history.ts");
const { legalMoves } = await import(R + "/src/legal.ts");
const { squareName } = await import(R + "/src/position.ts");
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const url = new URL("file://" + R + "/data/opening-book/book.json");
let calls = 0;
const stub = async (h: any) => { calls++; return legalMoves(h.position)[0]; };
const mk = () => createBookProbe({ read: () => readFileSync(url), warn: () => {}, random: Math.random });
const start = newGame(START);
const out = newGame(START);
for (const u of ["e2e4", "e7e5", "e1e2"]) playMove(out, legalMoves(out.position).find((m: any) => squareName(m.from) + squareName(m.to) === u));
if (mode === "cold-hit") { const p = mk(); const seam = withBook(p, stub); const t = performance.now(); await seam(start); console.log(JSON.stringify({ coldHitMs: performance.now() - t, calls })); }
if (mode === "warm") {
  const p = mk(); const seam = withBook(p, stub); await seam(start);
  const hit: number[] = [], miss: number[] = [];
  for (let i = 0; i < 200; i++) { let t = performance.now(); await seam(start); hit.push(performance.now() - t); t = performance.now(); p.bookMove(out.position); miss.push(performance.now() - t); }
  const s = (a: number[]) => { a.sort((x, y) => x - y); return { median: a[100], p99: a[198], max: a[199] }; };
  console.log(JSON.stringify({ warmHitMs: s(hit), warmMissProbeMs: s(miss), stubCallsDuringHits: calls }));
}
if (mode === "cold-miss") { const p = mk(); const t = performance.now(); p.bookMove(out.position); console.log(JSON.stringify({ coldMissProbeMs: performance.now() - t })); }
