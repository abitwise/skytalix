// se-ABC-303: R2 (ADR-0061 d8 (d)'s sample, arch-bundle-1 probe.ts audit mode) and R6's firing figures, on the patched
// scratch copy. Head = all on, door = P4's own door (moveCount off, countermove on). Usage: node audit.ts <audit|fire> <root>
const [mode, root] = process.argv.slice(2);
const S = await import(`${root}/src/search.ts`);
const E = await import(`${root}/src/engine.ts`);
const { makeMove, unmakeMove } = await import(`${root}/src/apply.ts`);
const { parseFen, toFen } = await import(`${root}/src/fen.ts`);
const { gameStatus } = await import(`${root}/src/gameend.ts`);
const { legalMoves } = await import(`${root}/src/legal.ts`);
const { squareName } = await import(`${root}/src/position.ts`);
const out = (o: unknown) => console.log(JSON.stringify(o));
const mv = (m: { from: number; to: number }) => squareName(m.from) + squareName(m.to);
const ROOTS = [["startpos", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"], ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"], ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"], ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"], ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"], ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"]] as const;
const ENDGAMES = [["kq-corner", "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1"], ["kr-corner", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1"], ["kqk-h8", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1"], ["kp-vs-k", "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1"], ["krk-a-file", "8/8/8/8/8/k7/8/KR6 w - - 0 1"], ["pawn-race", "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"]] as const;
function corpus(): [string, string][] {
  const rows: [string, string][] = [];
  for (const [name, fen] of ROOTS) { rows.push([name, fen]); const p = parseFen(fen); for (const m of legalMoves(p)) { const u = makeMove(p, m); if (gameStatus(p).result === "in-progress") rows.push([`${name}/${mv(m)}`, toFen(p)]); unmakeMove(p, m, u); } }
  return [...rows, ...(ENDGAMES as unknown as [string, string][])];
}
const A = S.AUD;
A.toFen = toFen;
if (mode === "audit") {
  const depth = 6, every = 10, INF = Number.POSITIVE_INFINITY;
  const blank = () => ({ n: 0, flips: 0, ffl: 0, ffh: 0, unstable: 0, e100: 0, e200: 0, e300: 0, e500: 0 });
  const by: Record<string, ReturnType<typeof blank>> = {};
  const big: any[] = [];
  let fired = 0, sampled = 0;
  for (const [, fen] of corpus()) {
    A.every = every; A.log = []; A.firedNodes = 0;
    S.search(parseFen(fen), depth);
    fired += A.firedNodes;
    const log = A.log; A.every = 0;
    sampled += log.length;
    for (const r of log) {
      if (Math.abs(r.alpha) > 15000) continue;
      const hv = S.audNode(parseFen(r.fen), r.depth, r.alpha, r.beta, r, false);
      const dnw = S.audNode(parseFen(r.fen), r.depth, r.alpha, r.beta, r, true);
      const v = S.audNode(parseFen(r.fen), r.depth, 0 - INF, INF, r, true);
      for (const key of ["all", `d${r.depth}`]) {
        const row = (by[key] ??= blank());
        row.n++;
        const hFL = hv <= r.alpha, dFL = dnw <= r.alpha;
        if (hFL === dFL) continue;
        row.flips++;
        let err: number;
        if (hFL) { row.ffl++; err = v - r.alpha; } else { row.ffh++; err = r.beta - v; }
        if (err <= 0) { row.unstable++; continue; }
        if (err >= 100) row.e100++;
        if (err >= 200) row.e200++;
        if (err >= 300) row.e300++;
        if (err >= 500) row.e500++;
        if (key === "all" && err >= 200) big.push({ err, depth: r.depth, fen: r.fen, alpha: r.alpha, hv, dnw, v });
      }
    }
  }
  out({ head: "ALL", door: "NOP4", depth, every, fired, sampled });
  for (const [k, row] of Object.entries(by).sort()) out({ key: k, ...row, flipPct: +(100 * row.flips / row.n).toFixed(2) });
  for (const b of big.sort((x, y) => y.err - x.err).slice(0, 8)) out({ top: b });
}
if (mode === "fire") {
  A.count = true;
  let nodes = 0, depths = 0;
  const rows = corpus();
  for (const [, fen] of rows) { const c = E.chooseMove(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxNodes: 47000 }); nodes += c.nodes; depths += c.depth; }
  out({ head: "ALL", rows: rows.length, nodes, meanDepth: +(depths / rows.length).toFixed(3), eligible: A.eligible, firedNodes: A.firedNodes, skipped: A.skipped, firedPer1000Nodes: +(1000 * A.firedNodes / nodes).toFixed(2), firedPctOfEligible: +(100 * A.firedNodes / A.eligible).toFixed(2), avgSkipped: +(A.skipped / A.firedNodes).toFixed(1), ordChangedPct: +(100 * A.ordChanged / A.ordNodes).toFixed(2), cmHitPct: +(100 * A.cmHit / A.ordNodes).toFixed(2) });
}
