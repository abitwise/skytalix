// arch-ABC-239-f3f4 D2: forced root move m on zugzwang.001; v(m) = -search(after m, 8) from White's side,
// then the expected line: the move search(., d) returns for d = 8 down to 1, made in turn; its leaf FEN and evaluate.
// usage: node forced.ts <srcdir> <label> <uci>
const [srcdir, label, uci] = process.argv.slice(2) as [string, string, string];
const { search } = await import(`${srcdir}/search.ts`);
const { evaluate } = await import(`${srcdir}/evaluate.ts`);
const { parseFen, toFen } = await import(`${srcdir}/fen.ts`);
const { squareName } = await import(`${srcdir}/position.ts`);
const { legalMoves } = await import(`${srcdir}/legal.ts`);
const { makeMove } = await import(`${srcdir}/apply.ts`);
const FEN = "8/8/p1p5/1p5p/1P5p/8/PPP2K1p/4R1rk w - - 0 1";
const name = (m: any) => `${squareName(m.from)}${squareName(m.to)}${m.promotion ? "nbrq"[m.promotion - 2] ?? "" : ""}`;
const pos = parseFen(FEN);
const root = legalMoves(pos).find((m: any) => name(m) === uci);
if (!root) throw new Error(`no move ${uci}`);
makeMove(pos, root);
const r = search(pos, 8);
const line: string[] = [uci];
// expected line: at each ply the move search(., d) returns, d = 8 .. 1
for (let d = 8; d >= 1; d--) {
  const s = search(pos, d);
  if (!s.move) break;
  line.push(name(s.move));
  makeMove(pos, s.move);
}
const leafWhite = pos.blackToMove ? 0 - evaluate(pos) : evaluate(pos);
console.log(JSON.stringify({ label, root: uci, vWhite: 0 - r.score, line: line.join(" "), leaf: toFen(pos), leafEvalWhite: leafWhite }));
