// se-ABC-270 K1 (e) / F5: the phase-24 twins are green on the tree given (main B and the head), and red with their term zeroed.
const W = process.argv[2];
const ev = await import(`${W}/src/evaluate.ts`); const P = await import(`${W}/src/evaluate-params.ts`); const { parseFen } = await import(`${W}/src/fen.ts`);
const T = { S: "rnbq1rk1/3nbppp/8/8/8/8/3NBPPP/RNBQ1RK1 w - - 0 1", G6: "rnbq1rk1/3nbppp/6P1/8/8/8/3NBP1P/RNBQ1RK1 w - - 0 1", F5: "rnbq1rk1/3nbppp/8/5P2/8/8/3NB1PP/RNBQ1RK1 w - - 0 1", E5: "rnbq1rk1/3nbppp/8/4P3/8/8/3NB1PP/RNBQ1RK1 w - - 0 1" };
const sc = (f: string) => ev.evaluate(parseFen(f));
const z = (n: string) => ({ ...P, [n]: { mg: 0, eg: 0 } });
const out = { phases: Object.values(T).map((f) => ev.phaseOf(parseFen(f))), A2: { S: sc(T.S), G6: sc(T.G6) }, A3: { F5: sc(T.F5), E5: sc(T.E5) },
  A2zero: ev.withParametersForTest(z("KING_SHELTER_MISSING"), () => ({ S: sc(T.S), G6: sc(T.G6) })), A3zero: ev.withParametersForTest(z("KING_FILE_HALF_OPEN"), () => ({ F5: sc(T.F5), E5: sc(T.E5) })) };
console.log(JSON.stringify({ ...out, A2green: out.A2.G6 < out.A2.S, A3green: out.A3.E5 < out.A3.F5, A2redZeroed: !(out.A2zero.G6 < out.A2zero.S), A3redZeroed: !(out.A3zero.E5 < out.A3zero.F5) }));
