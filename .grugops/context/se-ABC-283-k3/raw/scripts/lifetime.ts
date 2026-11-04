// se-ABC-283-k3: the bundle file's lifetime row figures (non-zero cells after search / chooseMove d5 on ONE),
// read on the branch through the TEST-ONLY historyScore, every cell as the test's cells() reads them.
// usage: node lifetime.ts <repoRoot>
const [root] = process.argv.slice(2);
const S = await import(`${root}/src/search.ts`);
const E = await import(`${root}/src/engine.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`);
const { BLACK, PAWN } = await import(`${root}/src/position.ts`);
const nonZero = (): number => {
  let n = 0;
  for (const colour of [0, BLACK])
    for (let from = 0; from < 64; from++)
      for (let to = 0; to < 64; to++) {
        const sq = (i: number) => (i & 7) | ((i >> 3) << 4);
        if (S.historyScore({ from: sq(from), to: sq(to), piece: colour | PAWN } as never) !== 0) n++;
      }
  return n;
};
const ONE = "8/k7/8/2K5/8/8/8/1R6 w - - 2 2";
S.search(parseFen(ONE), 5);
const a = nonZero();
E.chooseMove(parseFen(ONE), { budgetMs: 1e9, now: () => 0, maxDepth: 5 });
console.log(JSON.stringify({ searchD5NonZero: a, chooseD5NonZero: nonZero() }));
