// QE qe-ABC-209 A1, independent of the SE's rows: after a tokened game has filled the table, every call through the clear
// door (chooseMove and its three doors, no token) and the first call with a NEW token equal base's search node for node.
// Base and head are separate module instances (separate tables). Usage: node a1.mts <baseRoot> <headRoot> <depth>
const [baseRoot, headRoot, dArg] = process.argv.slice(2);
const D = Number(dArg ?? 5);
const load = async (root: string) => ({
  e: await import(`${root}/src/engine.ts`),
  fen: await import(`${root}/src/fen.ts`),
  apply: await import(`${root}/src/apply.ts`),
  pos: await import(`${root}/src/position.ts`),
});
const B = await load(baseRoot as string);
const H = await load(headRoot as string);
const { createGameTracker } = await import(`${headRoot}/src/transposition.ts`);
const BOARDS: Record<string, string> = {
  startpos: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-3": "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "position-4": "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "position-5": "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};
const FNS = ["chooseMove", "chooseMoveWithoutNullMove", "chooseMoveWithoutReductions", "chooseMoveWithoutPvsOrReductions"];
const opts = (k: number, game?: object) => ({ budgetMs: 3_000, now: () => 0, maxDepth: k, ...(game === undefined ? {} : { game }) });
const sq = (T: typeof B, s: number) => T.pos.squareName(s);
const shape = (T: typeof B, c: any) => (c === null ? null : { move: `${sq(T, c.move.from)}${sq(T, c.move.to)}${c.move.promotion || ""}`, score: c.score, depth: c.depth, nodes: c.nodes });
/** A game of `plies` searches through one token on another board: the table then holds that game's entries. */
const dirty = (from: string) => {
  const track = createGameTracker();
  const p = H.fen.parseFen(BOARDS[from] as string);
  const moves: string[] = [];
  for (let i = 0; i < 6; i++) {
    const c = H.e.chooseMove(p, opts(4, track(from, moves)));
    if (c === null) break;
    H.apply.makeMove(p, c.move);
    moves.push(`${sq(H, c.move.from)}${sq(H, c.move.to)}${c.move.promotion || ""}`);
  }
};
let cells = 0, equal = 0;
const rows: string[] = [];
for (const [name, fen] of Object.entries(BOARDS)) {
  for (const fn of FNS) {
    const ref = shape(B, B.e[fn](B.fen.parseFen(fen), opts(D)));
    dirty(name === "kiwipete" ? "position-6" : "kiwipete");
    const got = shape(H, H.e[fn](H.fen.parseFen(fen), opts(D)));
    const ok = JSON.stringify(ref) === JSON.stringify(got);
    cells++; if (ok) equal++;
    rows.push(`${name} ${fn} no-token after a tokened game: base ${JSON.stringify(ref)} head ${JSON.stringify(got)} ${ok ? "EQUAL" : "DIFFERS"}`);
  }
  // the first call with a NEW token, after a tokened game: also today's engine
  const ref = shape(B, B.e.chooseMove(B.fen.parseFen(fen), opts(D)));
  dirty(name === "kiwipete" ? "position-6" : "kiwipete");
  const got = shape(H, H.e.chooseMove(H.fen.parseFen(fen), opts(D, createGameTracker()(name, []))));
  const ok = JSON.stringify(ref) === JSON.stringify(got);
  cells++; if (ok) equal++;
  rows.push(`${name} chooseMove first call with a new token after a tokened game: base ${JSON.stringify(ref)} head ${JSON.stringify(got)} ${ok ? "EQUAL" : "DIFFERS"}`);
  // control (power): the same board searched twice through ONE kept token — the second search is expected to differ
  const track = createGameTracker();
  const p = H.fen.parseFen(fen);
  H.e.chooseMove(p, opts(D, track(name, [])));
  const g = track(name, []); // an equal list: the rule gives a new token, so this clears
  const again = shape(H, H.e.chooseMove(H.fen.parseFen(fen), opts(D, g)));
  rows.push(`${name} control: same position re-searched (equal list -> new token): ${JSON.stringify(again)} ${JSON.stringify(again) === JSON.stringify(ref) ? "EQUAL (cleared, as ruled)" : "DIFFERS"}`);
}
for (const r of rows) console.log(r);
console.log(`A1 cells: ${equal} of ${cells} equal (depth ${D})`);
