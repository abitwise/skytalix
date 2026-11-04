// se-ABC-283-k3: arch-ABC-283-mate's floor.ts on the branch itself (K3 built in), no probe flags, no H-pre.
// usage: node floor.ts <repoRoot>
const [root] = process.argv.slice(2);
const candArg = "branch";
const S = await import(`${root}/src/search.ts`);
const E = await import(`${root}/src/engine.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`);
const { MATE_CORPUS } = await import(`${root}/src/search.mate-corpus.ts`);
const isMate = (s: number) => Math.abs(s) > S.MATE_SCORE - 1000;
const ch = (f: any, fen: string, d: number) => f(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth: d }).score as number;
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
  const s5 = MATE_CORPUS.map((f: string) => S.search(parseFen(f), 5).score);
  const c5 = MATE_CORPUS.map((f: string) => ch(E.chooseMove, f, 5));
  const c6 = MATE_CORPUS.map((f: string) => ch(E.chooseMove, f, 6));
  const out: any = { candidate: c };
  out.B1 = viol(doors["searchWithoutBundle d5"], s5);
  out.B2 = viol(doors["chooseMoveWithoutBundle d5"], c5);
  out.B3 = { futility: viol(doors["searchWithoutFutility d5"], s5), seePruning: viol(doors["searchWithoutSeePruning d5"], s5), taper5: viol(doors["searchWithoutTaper d5"], s5), taper4to5: viol(doors["searchWithoutTaper d4"], s5) };
  out.R1 = viol(doors["chooseMoveWithoutBundle d6"], c6);
  console.log(JSON.stringify(out));
}
