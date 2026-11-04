// se-ABC-270: the pawn-ending ABC-083 A2 (b) / A3 (b) rows on the tree given, as written and with their term zeroed (a report).
const W = process.argv[2];
const ev = await import(`${W}/src/evaluate.ts`); const P = await import(`${W}/src/evaluate-params.ts`); const { parseFen } = await import(`${W}/src/fen.ts`);
const sc = (f: string) => ev.evaluate(parseFen(f)); const z = (n: string) => ({ ...P, [n]: { mg: 0, eg: 0 } });
const S = "6k1/5ppp/8/8/8/8/5PPP/6K1 w - - 0 1", G6 = "6k1/5ppp/6P1/8/8/8/5P1P/6K1 w - - 0 1", F5 = "6k1/5ppp/8/5P2/8/8/6PP/6K1 w - - 0 1", E5 = "6k1/5ppp/8/4P3/8/8/6PP/6K1 w - - 0 1";
console.log(JSON.stringify({ A2: [sc(S), sc(G6)], A2zero: ev.withParametersForTest(z("KING_SHELTER_MISSING"), () => [sc(S), sc(G6)]), A3: [sc(F5), sc(E5)], A3zero: ev.withParametersForTest(z("KING_FILE_HALF_OPEN"), () => [sc(F5), sc(E5)]) }));
