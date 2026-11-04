// arch-ABC-283-mate: B1-B3 and R1 (mate floors) per candidate, plus the H-pre report.
// The doors are history-off, so no PROBE candidate flag touches them: they are read once.
// usage: node floor.ts <probeRoot> <candidates comma list, e.g. base,K1,K1L,K1F,K2,K3> [hpre]
const [root, candArg, hpre] = process.argv.slice(2);
const S = await import(`${root}/src/search.ts`);
const E = await import(`${root}/src/engine.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`);
const { MATE_CORPUS } = await import(`${root}/src/search.mate-corpus.ts`);
const isMate = (s: number) => Math.abs(s) > S.MATE_SCORE - 1000;
const ch = (f: any, fen: string, d: number) => f(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth: d }).score as number;
const FLAGS: Record<string, any> = { base: {}, K1: { k1L: true, k1F: true }, K1L: { k1L: true }, K1F: { k1F: true }, K2: { k2: true }, K3: { k3: true } };
const setFlags = (f: any) => { S.PROBE.k1L = !!f.k1L; S.PROBE.k1F = !!f.k1F; S.PROBE.k2 = !!f.k2; S.PROBE.k3 = !!f.k3; S.PROBE.reverseQuiet = !!f.reverseQuiet; };
setFlags({});
const doors: Record<string, number[]> = {
  "searchWithoutBundle d5": MATE_CORPUS.map((f: string) => S.searchWithoutBundle(parseFen(f), 5).score),
  "searchWithoutFutility d5": MATE_CORPUS.map((f: string) => S.searchWithoutFutility(parseFen(f), 5).score),
  "searchWithoutSeePruning d5": MATE_CORPUS.map((f: string) => S.searchWithoutSeePruning(parseFen(f), 5).score),
  "searchWithoutTaper d5": MATE_CORPUS.map((f: string) => S.searchWithoutTaper(parseFen(f), 5).score),
  "searchWithoutTaper d4": MATE_CORPUS.map((f: string) => S.searchWithoutTaper(parseFen(f), 4).score),
  "chooseMoveWithoutBundle d5": MATE_CORPUS.map((f: string) => ch(E.chooseMoveWithoutBundle, f, 5)),
  "chooseMoveWithoutBundle d6": MATE_CORPUS.map((f: string) => ch(E.chooseMoveWithoutBundle, f, 6)),
};
const viol = (door: number[], head: number[]) => {
  let mates = 0; const v: string[] = [];
  door.forEach((r, i) => { if (!isMate(r)) return; mates++; const g = head[i] as number; if (!isMate(g) || Math.sign(g) !== Math.sign(r)) v.push(`${MATE_CORPUS[i]}: ${r} -> ${g}`); });
  return { mates, violations: v.length, v };
};
for (const c of candArg.split(",")) {
  setFlags(FLAGS[c]);
  const s5 = MATE_CORPUS.map((f: string) => S.search(parseFen(f), 5).score);
  const c5 = MATE_CORPUS.map((f: string) => ch(E.chooseMove, f, 5));
  const c6 = MATE_CORPUS.map((f: string) => ch(E.chooseMove, f, 6));
  setFlags({});
  const out: any = { candidate: c };
  out.B1 = viol(doors["searchWithoutBundle d5"], s5);
  out.B2 = viol(doors["chooseMoveWithoutBundle d5"], c5);
  out.B3 = { futility: viol(doors["searchWithoutFutility d5"], s5), seePruning: viol(doors["searchWithoutSeePruning d5"], s5), taper5: viol(doors["searchWithoutTaper d5"], s5), taper4to5: viol(doors["searchWithoutTaper d4"], s5) };
  out.R1 = viol(doors["chooseMoveWithoutBundle d6"], c6);
  console.log(JSON.stringify(out));
}
if (hpre) {
  // H-pre: the history-off doors with the bottom (quiet, non-killer) tier reversed, against the same doors unreversed.
  setFlags({ reverseQuiet: true });
  const s5r = MATE_CORPUS.map((f: string) => S.searchWithoutBundle(parseFen(f), 5).score);
  const c5r = MATE_CORPUS.map((f: string) => ch(E.chooseMoveWithoutBundle, f, 5));
  const s5rNoLmr = MATE_CORPUS.map((f: string) => S.searchWith(parseFen(f), 5, { history: false, seeOrdering: false, reductions: false }).score);
  setFlags({});
  console.log(JSON.stringify({ hpre: "searchWithoutBundle d5, bottom tier reversed", ...viol(doors["searchWithoutBundle d5"], s5r) }));
  console.log(JSON.stringify({ hpre: "chooseMoveWithoutBundle d5, bottom tier reversed", ...viol(doors["chooseMoveWithoutBundle d5"], c5r) }));
  console.log(JSON.stringify({ hpre: "searchWithoutBundle d5 with LMR off, bottom tier reversed", ...viol(doors["searchWithoutBundle d5"], s5rNoLmr) }));
}
