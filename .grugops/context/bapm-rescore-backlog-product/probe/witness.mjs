const root = process.argv[2];
const { parseFen } = await import(`${root}/src/fen.ts`);
const { generateMoves, FLAG_CASTLE } = await import(`${root}/src/moves.ts`);
const { legalMoves } = await import(`${root}/src/legal.ts`);
const { squareName } = await import(`${root}/src/position.ts`);
const fens = [
  "rn2k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1",
  "r1b1k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1",
  "r2qk2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1",
  "r3k1nr/8/8/8/8/8/8/R3K2R b KQkq - 0 1",
  "rN2k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1",
  "4k3/8/8/8/8/8/8/R3K2R w - - 5 9",
  "r3k2r/8/8/8/8/8/8/4K3 b - - 5 9",
  "4k3/8/8/2p5/8/8/8/R3K2R w - c6 0 12",
  "r3k2r/8/8/8/2P5/8/8/4K3 b - c3 0 12",
  "4k3/8/8/8/8/8/8/R3K2R w KQ - 5 9",
];
for (const f of fens) {
  let p;
  try { p = parseFen(f); } catch (e) { console.log("REJECTED", f, String(e.message).slice(0, 120)); continue; }
  const gen = generateMoves(p);
  const castles = gen.filter((m) => (m.flags & FLAG_CASTLE) !== 0).map((m) => squareName(m.from) + squareName(m.to));
  console.log(f.padEnd(42), "gen[" + castles.join(" ") + "]", legalMoves(p).length);
}
