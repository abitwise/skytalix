const root = process.argv[2];
const { newGame, gameStatusOf } = await import(`${root}/src/history.ts`);
const { makeRenderSeam } = await import(`${root}/src/render-seam.ts`);
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const h = newGame(START);
for (const mode of ["ascii", "unicode"]) {
  const seam = makeRenderSeam(mode, "white-bottom");
  const rows = seam(h, gameStatusOf(h), false, []);
  const rowsT = seam(h, gameStatusOf(h), true, []);
  console.log(mode, "rows", rows.length, "W idle", rows[0].length, "W thinking", rowsT[0].length);
}
