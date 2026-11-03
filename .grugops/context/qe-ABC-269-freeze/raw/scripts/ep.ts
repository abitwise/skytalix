import { analyse, parseFen, toFen, W } from "./lib.ts";
const { legalMoves } = await import(W + "legal.ts");
const { makeMove, unmakeMove } = await import(W + "apply.ts");
const rows = ["1nb2k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/1NB1K2R w - - 1 8","r3k2r/Pppp1ppp/6b1/1P6/2P1P3/q7/Pp1P2PP/R2Q1RK1 w kq - 0 1","r3k2r/Pppp1ppp/5nbN/1P6/2P1P3/8/Pp1P2PP/R4RK1 w kq - 0 1"];
for (const f of rows) { const p = parseFen(f);
  for (const m of legalMoves(p)) { const u = makeMove(p, m); for (const m2 of legalMoves(p)) { const u2 = makeMove(p, m2); if (p.epSquare !== -1) { const g = toFen(p); console.log(f, "->", g, analyse(g).raw, analyse(g).delta, p.epSquare); } unmakeMove(p, m2, u2); } unmakeMove(p, m, u); }
}
