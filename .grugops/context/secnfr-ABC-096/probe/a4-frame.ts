// secnfr-ABC-096 frame instrument (A4 < 16 ms, NFR-002). One fresh process per reading, outside the suite:
//   node a4-frame.ts <tree-root> <case>        (SMOKE=1: print the checks only, no timing figure)
// The timed call is the seam call alone: makeRenderSeam(mode, "white-bottom", book)(history, status, false, []).
// The status is computed once, before any timer (it is the loop's `gameStatusOf`, not the frame's).
// "first" = the first seam call in the process (cold JIT). Then 200 warm calls: median, p99, max.
// Cases:
//   a4-ascii    A4 literal: a double naming "x" x 100,000, ascii, start position
//   a4-unicode  A4 literal: the same name, unicode
//   a4-astral   A4 literal: U+1D11E x 100,000 code points (200,000 code units), unicode
//   x-sep       Security/NFR's: 100,000 chars of "a: " repeated (split-heavy), ascii
//   x-max       Security/NFR's: "x" x 1,048,576 (BOOK_MAX_BYTES, the most one parse-admitted name could hold), ascii
//   x-real      Security/NFR's: the REAL createBookProbe over the tree's shipped book (readBookFile), after
//               1. e4 e5 2. Nf3 Nc6 3. Bb5, unicode. The one lazy load is triggered BEFORE the timers (that load is
//               the NFR-007 reading's, not this one's).
const [R, CASE] = process.argv.slice(2);
const SMOKE = process.env.SMOKE === "1";
const { makeRenderSeam } = await import(`${R}/src/render-seam.ts`);
const { newGame, playMove, gameStatusOf } = await import(`${R}/src/history.ts`);
const { legalMoves } = await import(`${R}/src/legal.ts`);
const { squareName } = await import(`${R}/src/position.ts`);
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const history = newGame(START);
const play = (uci: string): void => {
  const move = legalMoves(history.position).find(
    (m: { from: number; to: number }) => `${squareName(m.from)}${squareName(m.to)}` === uci,
  );
  if (!move) throw new Error(`no legal ${uci}`);
  playMove(history, move);
};

const named = (name: string) => ({ openingName: () => name });
let mode: "ascii" | "unicode" = "ascii";
let book: { openingName: (p: unknown) => string | undefined };
let expect: string;
switch (CASE) {
  case "a4-ascii":
    book = named("x".repeat(100_000));
    expect = `${"x".repeat(18)}...`;
    break;
  case "a4-unicode":
    mode = "unicode";
    book = named("x".repeat(100_000));
    expect = `${"x".repeat(18)}...`;
    break;
  case "a4-astral":
    mode = "unicode";
    book = named("\u{1D11E}".repeat(100_000));
    expect = `${"\u{1D11E}".repeat(9)}...`;
    break;
  case "x-sep":
    book = named("a: ".repeat(33_334).slice(0, 100_000));
    expect = "a";
    break;
  case "x-max":
    book = named("x".repeat(1_048_576));
    expect = `${"x".repeat(18)}...`;
    break;
  case "x-real": {
    mode = "unicode";
    const { createBookProbe } = await import(`${R}/src/book.ts`);
    const { readBookFile } = await import(`${R}/src/book-file.ts`);
    let warned = 0;
    const probe = createBookProbe({ read: readBookFile, warn: () => warned++, random: () => { throw new Error("random"); } });
    for (const uci of ["e2e4", "e7e5", "g1f3", "b8c6", "f1b5"]) play(uci);
    if (probe.openingName(history.position) !== "Ruy Lopez" || warned !== 0) throw new Error("real probe not loaded");
    book = probe;
    expect = "Ruy Lopez";
    break;
  }
  default:
    throw new Error(`unknown case ${CASE}`);
}

const seam = makeRenderSeam(mode, "white-bottom", book);
const status = gameStatusOf(history);
const call = () => seam(history, status, false, []);

const t0 = performance.now();
const frame0: readonly string[] = call();
const first = performance.now() - t0;

const warm: number[] = [];
let frame: readonly string[] = frame0;
for (let i = 0; i < 200; i++) {
  const t = performance.now();
  frame = call();
  warm.push(performance.now() - t);
}
warm.sort((a, b) => a - b);

// Non-vacuity: message row 1 (rows - 3, the region sits just above the reserved prompt row) shows the expected text.
const row1 = (frame0[frame0.length - 3] as string).trimEnd();
const lone = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/;
const checks = {
  rows: frame0.length,
  row1Ok: row1 === expect,
  row1Units: row1.length,
  noMarker: !frame0.join("\n").includes("more)"),
  noLone: frame0.every((r) => !lone.test(r)),
  sameWarm: frame.join("\n") === frame0.join("\n"),
};
const out: Record<string, unknown> = { case: CASE, mode, ...checks };
if (!SMOKE) {
  out.firstMs = first;
  out.medianMs = (warm[99] + warm[100]) / 2;
  out.p99Ms = warm[197];
  out.maxMs = warm[199];
}
console.log(JSON.stringify(out));
