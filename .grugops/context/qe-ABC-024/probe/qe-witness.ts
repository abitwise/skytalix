// QE witness: strict parseFen, toFen round-trip, castles and legal count, per row FEN. Run from a tree: node <this> <tree>
const tree = process.argv[2];
const { parseFen, toFen } = await import(`${tree}/src/fen.ts`);
const { legalMoves } = await import(`${tree}/src/legal.ts`);
const { generateMoves, FLAG_CASTLE } = await import(`${tree}/src/moves.ts`);
const sq = (s: number) => "abcdefgh"[s & 7] + String((s >> 4) + 1);
const rows: [string, string, number][] = [
  ["r3k2r/8/8/8/8/8/8/R3KB1R w KQkq - 0 1", "e1c1", 30],
  ["r3k2r/8/8/8/8/8/8/R3K1NR w KQkq - 0 1", "e1c1", 26],
  ["r3k2r/8/8/8/8/8/8/Rn2K2R w KQkq - 0 1", "e1g1", 22],
  ["r3k2r/8/8/8/8/8/8/R1B1K2R w KQkq - 0 1", "e1g1", 30],
  ["r3k2r/8/8/8/8/8/8/R2QK2R w KQkq - 0 1", "e1g1", 39],
  ["r3kb1r/8/8/8/8/8/8/R3K2R b KQkq - 0 1", "e8c8", 30],
  ["r3k1nr/8/8/8/8/8/8/R3K2R b KQkq - 0 1", "e8c8", 26],
  ["rN2k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1", "e8g8", 22],
  ["r1b1k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1", "e8g8", 30],
  ["r2qk2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1", "e8g8", 39],
  ["4k3/8/8/8/8/8/8/R3K2R w - - 5 9", "", 24],
  ["r3k2r/8/8/8/8/8/8/4K3 b - - 5 9", "", 24],
  ["4k3/8/8/2p5/8/8/8/R3K2R w - c6 0 12", "", 24],
  ["r3k2r/8/8/8/2P5/8/8/4K3 b - c3 0 12", "", 24],
  ["4k3/8/8/8/8/8/8/R3K2R w KQ - 5 9", "e1g1 e1c1", 26],
  ["4k3/8/8/2p5/8/8/8/R3K2R w KQ c6 0 12", "e1g1 e1c1", 26],
];
let bad = 0;
for (const [fen, want, n] of rows) {
  const p = parseFen(fen);
  const rt = toFen(p) === fen ? "ok" : `MISMATCH(${toFen(p)})`;
  const gen = generateMoves(parseFen(fen)).filter((m: any) => m.flags & FLAG_CASTLE).map((m: any) => sq(m.from) + sq(m.to));
  const legal = legalMoves(p);
  const lc = legal.filter((m: any) => m.flags & FLAG_CASTLE).map((m: any) => sq(m.from) + sq(m.to));
  const ok = rt === "ok" && gen.join(" ") === want && lc.join(" ") === want && legal.length === n;
  if (!ok) bad++;
  console.log(`${ok ? "OK " : "BAD"} ${fen}  strict-parse ok rt=${rt} gen[${gen.join(" ")}] legal[${lc.join(" ")}] ${legal.length} (want ${want || "-"} ${n})`);
}
console.log(`bad=${bad}`);
