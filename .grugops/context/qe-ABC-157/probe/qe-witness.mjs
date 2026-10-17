const T = process.argv[2];
const { parseFen } = await import(`${T}/src/fen.ts`);
const { legalMoves } = await import(`${T}/src/legal.ts`);
const sq = (s) => 'abcdefgh'[s & 7] + ((s >> 4) + 1);
const out = [];
for (const f of ['w K', 'w Q', 'b k', 'b q', 'w kq', 'b KQ', 'w Qk', 'w Kq', 'b Kq', 'b Qk', 'w Qkq', 'b KQk']) {
  const m = legalMoves(parseFen(`r3k2r/8/8/8/8/8/8/R3K2R ${f} - 0 1`));
  out.push(`${f}: ${m.length} [${m.filter((x) => x.flags & 0).length === 0 ? m.filter((x) => Math.abs((x.to & 7) - (x.from & 7)) === 2 && (x.piece & 7) === 6).map((x) => sq(x.from) + sq(x.to)).join(' ') : ''}]`);
}
console.log(out.join('\n'));
