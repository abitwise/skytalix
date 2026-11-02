// SCRATCH (se-ABC-268): fire + cut audit on the ABC-268 build, the arch-phase2-p3 probe3.ts audit mode re-pointed at
// the shipped switch (search() = rule on, searchWithoutFutility = door). Usage: node se268-driver.ts <fire|audit>
import { makeMove, unmakeMove } from "./src/apply.ts";
import { parseFen, toFen } from "./src/fen.ts";
import { gameStatus } from "./src/gameend.ts";
import { legalMoves } from "./src/legal.ts";
import { squareName } from "./src/position.ts";
import { AUDIT, auditNode, search, searchWithoutFutility } from "./src/search.ts";

const mv = (m: { from: number; to: number } | null) => (m ? squareName(m.from) + squareName(m.to) : "-");
const ROOTS = [
  ["startpos", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],
  ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"],
  ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"],
];
const ENDGAMES = [
  ["kq-corner", "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1"],
  ["kr-corner", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1"],
  ["kqk-h8", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1"],
  ["kp-vs-k", "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1"],
  ["krk-a-file", "8/8/8/8/8/k7/8/KR6 w - - 0 1"],
  ["pawn-race", "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"],
];
function corpus(): [string, string][] {
  const out: [string, string][] = [];
  for (const [name, fen] of ROOTS) {
    out.push([name as string, fen as string]);
    const p = parseFen(fen as string);
    for (const m of legalMoves(p)) {
      const u = makeMove(p, m);
      if (gameStatus(p).result === "in-progress") out.push([`${name}/${mv(m)}`, toFen(p)]);
      unmakeMove(p, m, u);
    }
  }
  return [...out, ...(ENDGAMES as [string, string][])];
}
const mode = process.argv[2];
const reset = (every: number) => Object.assign(AUDIT, { fired: 0, pruned: 0, every, log: [] });
if (mode === "fire") {
  const depth = Number(process.env.D ?? 6);
  let hn = 0, dn = 0;
  reset(0);
  const rows = corpus();
  for (const [, fen] of rows) hn += search(parseFen(fen), depth).nodes;
  const head = { fired: AUDIT.fired, pruned: AUDIT.pruned };
  reset(0);
  for (const [, fen] of rows) dn += searchWithoutFutility(parseFen(fen), depth).nodes;
  console.log(JSON.stringify({ depth, rows: rows.length, headNodes: hn, doorNodes: dn, ratio: +(hn / dn).toFixed(4), head, door: { fired: AUDIT.fired, pruned: AUDIT.pruned } }));
}
if (mode === "audit") {
  const depth = Number(process.env.D ?? 6);
  const every = Number(process.env.AUD ?? 10);
  const log: { fen: string; depth: number; alpha: number; beta: number }[] = [];
  let fired = 0;
  const rows = corpus();
  for (const [, fen] of rows) {
    reset(every);
    search(parseFen(fen), depth);
    fired += AUDIT.fired;
    log.push(...AUDIT.log);
  }
  reset(0);
  const INF = Number.POSITIVE_INFINITY;
  type Row = { n: number; flips: number; ffl: number; ffh: number; e100: number; e200: number; e300: number; e500: number; unstable: number; doorNoise: number };
  const blank = (): Row => ({ n: 0, flips: 0, ffl: 0, ffh: 0, e100: 0, e200: 0, e300: 0, e500: 0, unstable: 0, doorNoise: 0 });
  const by: Record<string, Row> = {};
  const big: unknown[] = [];
  for (const r of log) {
    if (Math.abs(r.alpha) > 15000) continue;
    const h = auditNode(parseFen(r.fen), r.depth, r.alpha, r.beta, true);
    const dnw = auditNode(parseFen(r.fen), r.depth, r.alpha, r.beta, false);
    const v = auditNode(parseFen(r.fen), r.depth, 0 - INF, INF, false);
    for (const key of ["all", `fut@d${r.depth}`]) {
      const row = (by[key] ??= blank());
      row.n++;
      if ((dnw <= r.alpha) !== (v <= r.alpha)) row.doorNoise++;
      const hFL = h <= r.alpha, dFL = dnw <= r.alpha;
      if (hFL === dFL) continue;
      row.flips++;
      let err = 0;
      if (hFL) { row.ffl++; err = v - r.alpha; } else { row.ffh++; err = r.beta - v; }
      if (err <= 0) { row.unstable++; continue; }
      if (err >= 100) row.e100++;
      if (err >= 200) row.e200++;
      if (err >= 300) row.e300++;
      if (err >= 500) row.e500++;
      if (key === "all") big.push({ err, depth: r.depth, fen: r.fen, a: r.alpha, h, dnw, v });
    }
  }
  console.log(JSON.stringify({ depth, every, rows: rows.length, fired, sampled: log.length }));
  for (const [k, row] of Object.entries(by).sort()) console.log(JSON.stringify({ key: k, ...row, flipPct: +(100 * row.flips / row.n).toFixed(2) }));
  for (const b of big.slice(0, 8)) console.log(JSON.stringify({ top: b }));
}
