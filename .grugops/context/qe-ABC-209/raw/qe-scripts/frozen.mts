// QE qe-ABC-209, page Test note 4 (the frozen-clock pre-check): nodes to complete depth k, chooseMove, now: () => 0,
// maxDepth: k, ONE FIRST SEARCH IN THIS FRESH PROCESS. Usage: node frozen.mts <treeRoot> <board> <k> <none|token>
const [root, board, kArg, variant] = process.argv.slice(2);
const FENS: Record<string, string> = {
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};
const { chooseMove } = await import(`${root}/src/engine.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`);
const k = Number(kArg);
const options: Record<string, unknown> = { budgetMs: 3_000, now: () => 0, maxDepth: k };
if (variant === "token") options.game = {}; // a first token: the table holds nothing for it, so it clears
const c = chooseMove(parseFen(FENS[board as string] as string), options);
const tree = (root as string).split("/").pop();
console.log(JSON.stringify({ tree, board, k, variant, depth: c.depth, nodes: c.nodes, score: c.score }));
