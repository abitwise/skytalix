// arch-ABC-283-mate: does the bundle file's lifetime row (non-zero cells after search / chooseMove d5 on ONE) still hold under K2 / K3?
// Needs one export appended to the probe copy's search.ts after patch_probe.py (read-only, no behaviour change):
//   export const HISTORY_CELLS_PROBE = (): number => HISTORY.filter((v) => v !== 0).length;
const [root] = process.argv.slice(2);
const S = await import(`${root}/src/search.ts`);
const E = await import(`${root}/src/engine.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`);
const ONE = "8/k7/8/2K5/8/8/8/1R6 w - - 2 2";
for (const [k2, k3] of [[false, false], [true, false], [false, true]]) {
  S.PROBE.k2 = k2; S.PROBE.k3 = k3;
  S.search(parseFen(ONE), 5); const a = S.HISTORY_CELLS_PROBE();
  E.chooseMove(parseFen(ONE), { budgetMs: 1e9, now: () => 0, maxDepth: 5 }); const b = S.HISTORY_CELLS_PROBE();
  console.log(JSON.stringify({ k2, k3, searchD5NonZero: a, chooseD5NonZero: b }));
}
