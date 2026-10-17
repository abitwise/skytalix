const tree = process.argv[2];
const { parseFen } = await import(`${tree}/src/fen.ts`);
const { legalMoves } = await import(`${tree}/src/legal.ts`);
const { FLAG_CASTLE } = await import(`${tree}/src/moves.ts`);
const sq = (s: number) => "abcdefgh"[s & 7] + String((s >> 4) + 1);
for (const fen of ["r3k2r/8/8/8/8/8/8/R3K2R w K - 0 1", "r3k2r/8/8/8/8/8/8/R3K2R w Q - 0 1", "r3k2r/8/8/8/8/8/8/R3K2R b k - 0 1", "r3k2r/8/8/8/8/8/8/R3K2R w kq - 0 1"]) {
  const l = legalMoves(parseFen(fen));
  console.log(fen, "castles[", l.filter((m: any) => m.flags & FLAG_CASTLE).map((m: any) => sq(m.from) + sq(m.to)).join(" "), "] legal", l.length);
}
