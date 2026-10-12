const W = "/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-qe-ABC-101/src/";
const { createLevelSeam } = await import(W + "level-seam.ts");
const { createLevel, LEVELS } = await import(W + "levels.ts");
const { virtualClock } = await import(W + "virtual-clock.ts");
const { parseFen } = await import(W + "fen.ts");
const { newGame } = await import(W + "history.ts");
const { isDeepStrictEqual: eq } = await import("node:util");
// Kiwipete-like middlegame and the start position; step = budget/4 so each call is a few clock reads deep.
const FENS = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"];
let mismatches = 0, comparisons = 0; const firstKinds: string[] = [];
for (const fen of FENS) for (const seed of [7, 4294967295]) for (const N of [1, 2, 3, 4, 5] as const) {
  const step = LEVELS[N].budgetMs / 4;
  const ref = createLevel(LEVELS[N], { seed, now: virtualClock(step) });
  const seam = createLevelSeam(N, { seed, now: virtualClock(step) });
  const history = newGame(fen);
  for (let call = 0; call < 3; call++) {
    const want = ref(parseFen(fen)); const got = await seam(history); comparisons++;
    if (!eq(got, want?.move)) mismatches++;
    if (N === 1 && call === 0) firstKinds.push(`${fen.split(" ")[0].slice(0, 8)} seed ${seed}: ${want?.kind}`);
  }
  if (!eq(history.position, parseFen(fen))) console.log("position mutated", N, seed);
}
console.log(`A8' independent: ${comparisons} seam-vs-createLevel comparisons (2 positions x 2 seeds x 5 levels x 3 calls, step budget/4), mismatches ${mismatches}`);
console.log("level 1 first draw:", firstKinds.join("; "));
