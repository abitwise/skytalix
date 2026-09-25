const SRC = "/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-ruling-abc080-081/src/";
const { parseFen } = await import(SRC + "fen.ts");
const { legalMoves } = await import(SRC + "legal.ts");
const { makeMove, unmakeMove } = await import(SRC + "apply.ts");
const { search } = await import(SRC + "search.ts");
const { zobristKey } = await import(SRC + "zobrist.ts");
function perft(p, d) { if (d === 0) return 1; let n = 0; for (const m of legalMoves(p)) { const u = makeMove(p, m); n += perft(p, d - 1); unmakeMove(p, m, u); } return n; }
const pairs = [
  ["startpos", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1"],
  ["knight-g1", "4k3/8/8/8/8/8/8/4K1NR w K - 0 1", "4k3/8/8/8/8/8/8/4K1NR w - - 0 1"],
  ["in-check", "4k3/8/8/8/8/8/8/r3K2R w K - 0 1", "4k3/8/8/8/8/8/8/r3K2R w - - 0 1"],
  ["f1-attacked", "5r2/4k3/8/8/8/8/8/4K2R w K - 0 1", "5r2/4k3/8/8/8/8/8/4K2R w - - 0 1"],
];
for (const [n, a, b] of pairs) {
  const pa = parseFen(a), pb = parseFen(b);
  const row = [n, "keys-differ=" + (zobristKey(pa) !== zobristKey(pb)), "d1 moves", legalMoves(pa).length, legalMoves(pb).length];
  for (const d of [2, 3, 4]) if (n !== "startpos" || d <= 3) row.push(`perft${d}`, perft(parseFen(a), d), perft(parseFen(b), d));
  for (const d of [3, 4]) { if (n === "startpos") continue; const sa = search(parseFen(a), d), sb = search(parseFen(b), d); row.push(`search${d}`, sa.score, sb.score); }
  console.log(row.join(" "));
}
