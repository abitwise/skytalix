// qe-ABC-303: R2 and R6's firing figures, QE's own reader, on a scratch copy carrying the audit hooks. The build has no
// hook (ADR-0056's block). The hooks are the engineer's raw/audit_patch.py, in arch-bundle-1's shape: they count and log
// and change no search; QE's S1, R7 and R2 counts on that copy are the check. usage: node audit.ts <audit|fire> <root>
const [mode, R] = process.argv.slice(2) as [string, string];
const s = await import(`${R}/src/search.ts`), e = await import(`${R}/src/engine.ts`);
const { parseFen, toFen } = await import(`${R}/src/fen.ts`);
const { legalMoves } = await import(`${R}/src/legal.ts`);
const { makeMove, unmakeMove } = await import(`${R}/src/apply.ts`);
const { gameStatus } = await import(`${R}/src/gameend.ts`);
const print = (x: unknown) => console.log(JSON.stringify(x));
const KIWI = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", POS6 = "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10";
const roots = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", KIWI, "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8", POS6];
const ends = ["k7/8/1K6/8/8/8/8/1Q6 w - - 0 1", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1", "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1", "8/8/8/8/8/k7/8/KR6 w - - 0 1", "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"];
const rows: string[] = [];
for (const f of roots) { rows.push(f); const p = parseFen(f); for (const m of legalMoves(p)) { const u = makeMove(p, m); if (gameStatus(p).result === "in-progress") rows.push(toFen(p)); unmakeMove(p, m, u); } }
rows.push(...ends);
const A = s.AUD; A.toFen = toFen;
if (mode === "audit") {
  // ADR-0061 d8 (d): search() d6 over the rows, every 10th node where the rule skips; each re-searched fresh three times.
  let fired = 0, sampled = 0, n = 0, flips = 0, failLow = 0, e200 = 0, e300 = 0, e500 = 0; const by: Record<string, [number, number]> = {};
  for (const f of rows) {
    A.every = 10; A.log = []; A.firedNodes = 0; s.search(parseFen(f), 6); fired += A.firedNodes;
    const log = A.log; A.every = 0; sampled += log.length;
    for (const r of log) {
      if (Math.abs(r.alpha) > 15000) continue;
      const head = s.audNode(parseFen(r.fen), r.depth, r.alpha, r.beta, r, false);
      const door = s.audNode(parseFen(r.fen), r.depth, r.alpha, r.beta, r, true);
      const k = `d${r.depth}`; by[k] ??= [0, 0]; by[k][0]++; n++;
      if ((head <= r.alpha) === (door <= r.alpha)) continue;
      flips++; by[k][1]++;
      const v = s.audNode(parseFen(r.fen), r.depth, -Infinity, Infinity, r, true);
      const headLow = head <= r.alpha; if (headLow) failLow++;
      const err = headLow ? v - r.alpha : r.beta - v;
      if (err >= 200) e200++; if (err >= 300) e300++; if (err >= 500) e500++;
    }
  }
  print({ rows: rows.length, fired, sampled, n, flips, pct: +(100 * flips / n).toFixed(2), headFailsLow: failLow, e200, e300, e500, by });
}
if (mode === "fire") {
  A.count = true; let nodes = 0, depth = 0;
  for (const f of rows) { const c = e.chooseMove(parseFen(f), { budgetMs: 1e9, now: () => 0, maxNodes: 47000 }); nodes += c.nodes; depth += c.depth; }
  print({ rows: rows.length, nodes, meanDepth: +(depth / rows.length).toFixed(3), firedNodes: A.firedNodes, eligible: A.eligible, skipped: A.skipped, per1000: +(1000 * A.firedNodes / nodes).toFixed(2), pctEligible: +(100 * A.firedNodes / A.eligible).toFixed(2), avgSkipped: +(A.skipped / A.firedNodes).toFixed(1), orderChangedPct: +(100 * A.ordChanged / A.ordNodes).toFixed(2), cmInListPct: +(100 * A.cmHit / A.ordNodes).toFixed(2) });
}
