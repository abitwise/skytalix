// qe-ABC-095 A2 instrument (QE's own; derived from wire-ABC-095/probe/time.ts cold-hit). One fresh process per reading,
// outside the suite: node time-strict.ts <tree-root>
// Difference from the SE's cold-hit: NOTHING runs before the timed call except the imports, newGame(START) and the probe /
// stub construction. The SE's version also plays 1. e4 e5 2. Ke2 through legalMoves BEFORE the timer, which warms the move
// generator the probe re-validates with; this one does not. The timed call is the first withBook(probe, stub)(start), so the
// one read (readBookFile) and parse of book.json are inside it.
const R = process.argv[2];
const { readBookFile } = await import(`${R}/src/book-file.ts`);
const { createBookProbe } = await import(`${R}/src/book.ts`);
const { withBook } = await import(`${R}/src/book-engine.ts`);
const { newGame } = await import(`${R}/src/history.ts`);
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
let warned = 0;
let innerCalls = 0;
const probe = createBookProbe({ read: readBookFile, warn: () => warned++, random: Math.random });
const seam = withBook(probe, async () => {
  innerCalls++;
  throw new Error("inner seam reached on the start position");
});
const start = newGame(START);
const t = performance.now();
const move = await seam(start);
const ms = performance.now() - t;
console.log(JSON.stringify({ strictColdHitMs: ms, innerCalls, warned, move: move !== undefined }));
