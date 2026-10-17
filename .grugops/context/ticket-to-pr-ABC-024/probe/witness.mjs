const src = process.argv[2];
const { parseFenGrammarOnly: parseFen, parseFen: strict, toFen } = await import(`${src}/fen.ts`);
const { legalMoves } = await import(`${src}/legal.ts`);
const { generateMoves, FLAG_CASTLE } = await import(`${src}/moves.ts`);
const F = "abcdefgh"; const n = (s) => `${F[s & 7]}${(s >> 4) + 1}`;
const fens = process.argv.slice(3);
for (const fen of fens) {
  const p = parseFen(fen);
  let st = "strict=ok"; try { strict(fen); } catch (e) { st = `strict=REFUSED(${e.message})`; }
  const g = generateMoves(p).filter((m) => m.flags & FLAG_CASTLE).map((m) => n(m.from) + n(m.to));
  const l = legalMoves(parseFen(fen));
  const lc = l.filter((m) => m.flags & FLAG_CASTLE).map((m) => n(m.from) + n(m.to));
  console.log(`${fen}\tgen[${g.join(" ")}]\tlegal[${lc.join(" ")}] ${l.length}\trt=${toFen(p) === fen ? "ok" : "DIFF " + toFen(p)}\t${st}`);
}
