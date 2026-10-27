// qe-ABC-209 page Test note 2 / ADR-0032 d1, independent of code reading (no row pins it: plant
// qe:blunder-children-carry-token is 0 red): at a blunder level, the scored list (each child's score) is the same when the
// level's chooser is handed the game's token right after a tokened engine search filled the table, as with no token in a
// cleared process state. Usage: node tn2.mts <head root>
const [root] = process.argv.slice(2);
const { createLevel, LEVELS } = await import(`${root}/src/levels.ts`);
const { chooseMove } = await import(`${root}/src/engine.ts`);
const { createGameTracker, clearTable } = await import(`${root}/src/transposition.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`);
const { virtualClock } = await import(`${root}/src/virtual-clock.ts`);
const { squareName } = await import(`${root}/src/position.ts`);
const FENS = [
  "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
  "rnbqk1nr/ppppppbp/6p1/8/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1",
];
const sc = (c: any) => c && { kind: c.kind, nodes: c.nodes, depth: c.depth, move: `${squareName(c.move.from)}${squareName(c.move.to)}`, scored: c.scored?.map((s: any) => `${squareName(s.move.from)}${squareName(s.move.to)}:${s.score}`).join(" ") };
let n = 0, eq = 0;
for (const fen of FENS) {
  for (let seed = 1; seed <= 40 && n < 12; seed++) {
    const level = { budgetMs: LEVELS[4].budgetMs, blunderRate: 1 }; // force the blunder path: every call blunders
    clearTable();
    const plain = sc(createLevel(level, { seed, now: virtualClock(50) })(parseFen(fen)));
    const track = createGameTracker();
    const game = track(fen, []);
    chooseMove(parseFen(fen), { budgetMs: 3_000, now: () => 0, maxDepth: 5, game }); // the game's search fills the table
    const tokened = sc(createLevel(level, { seed, now: virtualClock(50) })(parseFen(fen), track(fen, ["x"])));
    n++; if (JSON.stringify(plain) === JSON.stringify(tokened)) eq++;
    else console.log("DIFFERS", fen, seed, JSON.stringify(plain), JSON.stringify(tokened));
    if (seed % 10 === 0) break;
  }
}
console.log(`test note 2: ${eq} of ${n} blunder calls give the same scored list, summed nodes and depth with the game's token as without (children carry no token)`);
