// non-timing pre-check: arms import; H(p,ph) Object.is B(p,ph) on the six roots; C === B; P(p) printed.
const [S] = process.argv.slice(2);
const ROOTS = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1","r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1","8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1","r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1","rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8","r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"];
const L = async (k: string) => [await import(`${S}/${k}/src/evaluate.ts`), await import(`${S}/${k}/src/fen.ts`)];
const [[b, bf], [c, cf], [h, hf], [p, pf]] = await Promise.all(["B", "C", "H", "P"].map(L));
let ok = true;
for (const f of ROOTS) { const ph = h.phaseOf(hf.parseFen(f)); const hb = h.evaluateAtPhase(hf.parseFen(f), ph), bb = b.evaluateAtPhase(bf.parseFen(f), ph), cc = c.evaluateAtPhase(cf.parseFen(f), ph);
  const same = Object.is(hb, bb) && Object.is(cc, bb); ok &&= same; console.log(ph, bb, cc, hb, p.evaluate(pf.parseFen(f)), same); }
console.log(ok ? "CHECK OK" : "CHECK FAIL");
