// ABC-095 timing instrument (wire-ABC-095). Run OUTSIDE the suite, one fresh process per reading:
//   node time.ts <tree-root> cold-hit    A2: the FIRST call in a fresh process, through withBook,
//                                        so the one read + parse of book.json are inside the timing
//   node time.ts <tree-root> warm-miss   NFR-004 miss bar, ADR-0037 R3: one warm-up hit on the start
//                                        position, then 200 timed bookMove(P), P = after 1. e4 e5 2. Ke2
// The read is the one the root binds: readBookFile from src/book-file.ts.
const R = process.argv[2];
const mode = process.argv[3];
const { readBookFile } = await import(`${R}/src/book-file.ts`);
const { createBookProbe } = await import(`${R}/src/book.ts`);
const { withBook } = await import(`${R}/src/book-engine.ts`);
const { newGame, playMove } = await import(`${R}/src/history.ts`);
const { legalMoves } = await import(`${R}/src/legal.ts`);
const { squareName } = await import(`${R}/src/position.ts`);
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
let warned = 0;
const probe = createBookProbe({ read: readBookFile, warn: () => warned++, random: Math.random });
let innerCalls = 0;
const stub = async (h: any) => {
  innerCalls++;
  return legalMoves(h.position)[0];
};
const start = newGame(START);
const out = newGame(START);
for (const u of ["e2e4", "e7e5", "e1e2"])
  playMove(out, legalMoves(out.position).find((m: any) => squareName(m.from) + squareName(m.to) === u));
if (mode === "cold-hit") {
  const seam = withBook(probe, stub);
  const t = performance.now();
  const move = await seam(start);
  const ms = performance.now() - t;
  console.log(JSON.stringify({ coldHitMs: ms, innerCalls, warned, move: move !== undefined }));
} else if (mode === "warm-miss") {
  if (probe.bookMove(start.position) === undefined) throw new Error("warm-up was not a hit");
  if (probe.inBook(out.position)) throw new Error("P is in book");
  const a: number[] = [];
  for (let i = 0; i < 200; i++) {
    const t = performance.now();
    const m = probe.bookMove(out.position);
    a.push(performance.now() - t);
    if (m !== undefined) throw new Error("P answered");
  }
  a.sort((x, y) => x - y);
  // nearest-rank: median = 100th of 200, p99 = 198th, max = 200th
  console.log(JSON.stringify({ n: a.length, medianMs: a[99], p99Ms: a[197], maxMs: a[199], warned }));
} else throw new Error(`mode? ${mode}`);
