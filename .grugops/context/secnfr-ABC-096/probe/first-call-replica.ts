// secnfr-ABC-096 NFR-007 first-call instrument, REPORTED BESIDE (not graded). One fresh process per reading:
//   node first-call-replica.ts <tree-root>     (SMOKE=1: no timing figure)
// The composition root's order, in process: createBookProbe({ read: readBookFile, ... }) and
// makeRenderSeam("ascii", "white-bottom", book) are built, then frame 0 (the start position, empty messages) is timed.
// Frame 0's openingName is the probe's first call, so the one read and parse are inside the timed span.
const R = process.argv[2];
const SMOKE = process.env.SMOKE === "1";
const { readBookFile } = await import(`${R}/src/book-file.ts`);
const { createBookProbe } = await import(`${R}/src/book.ts`);
const { makeRenderSeam } = await import(`${R}/src/render-seam.ts`);
const { newGame, gameStatusOf } = await import(`${R}/src/history.ts`);
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
let reads = 0;
let warned = 0;
const book = createBookProbe({
  read: () => {
    reads++;
    return readBookFile();
  },
  warn: () => warned++,
  random: () => {
    throw new Error("random");
  },
});
const seam = makeRenderSeam("ascii", "white-bottom", book);
const history = newGame(START);
const status = gameStatusOf(history);
const t = performance.now();
const frame = seam(history, status, false, []);
const ms = performance.now() - t;
const out: Record<string, unknown> = { reads, warned, rows: frame.length };
if (!SMOKE) out.frame0WithLoadMs = ms;
console.log(JSON.stringify(out));
