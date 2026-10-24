const tree = process.argv[2];
const { parseFen } = await import(`${tree}/src/fen.ts`);
const { legalMoves, givesCheck, isInCheck } = await import(`${tree}/src/legal.ts`);
const { makeMove, unmakeMove } = await import(`${tree}/src/apply.ts`);
const { parseSquareName } = await import(`${tree}/src/position.ts`);
const cases = [
  ["king move discovers", "8/8/8/8/R2K3k/8/8/8 w - - 0 1", "d4", "d5"],
  ["pawn single push discovers", "8/7k/8/8/8/8/2P5/1B4K1 w - - 0 1", "c2", "c3"],
  ["pawn double push discovers", "8/7k/8/8/8/8/2P5/1B4K1 w - - 0 1", "c2", "c4"],
  ["en passant discovers on rank", "8/8/8/R2Pp2k/8/8/8/6K1 w - e6 0 1", "d5", "e6"],
  ["castle gives check", "5k2/8/8/8/8/8/8/4K2R w K - 0 1", "e1", "g1"],
  ["promotion gives check", "3r2k1/4P3/8/8/8/8/8/4K3 w - - 0 1", "e7", "e8"],
  ["capture-promotion gives check", "3r2k1/4P3/8/8/8/8/8/4K3 w - - 0 1", "e7", "d8"],
  ["knight capture gives check", "4k3/8/3n4/8/8/3B4/8/R3K2R b KQ - 0 1", "d6", "f5"],
];
let bad = 0;
for (const [name, fen, f, t] of cases) {
  const p = parseFen(fen);
  const ms = legalMoves(p).filter((m) => m.from === parseSquareName(f) && m.to === parseSquareName(t));
  for (const m of ms) {
    const u = makeMove(p, m); const want = isInCheck(p); unmakeMove(p, m, u);
    const got = givesCheck(p, m);
    if (got !== want) bad++;
    console.log(`${name}: flags ${m.flags} promo ${m.promotion} oracle ${want} givesCheck ${got}`);
  }
  if (ms.length === 0) { console.log(`${name}: NO SUCH MOVE`); bad++; }
}
console.log(`bad ${bad}`);
