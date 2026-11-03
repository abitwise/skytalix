// SCRATCH PROBE (arch-Q1-see-pruning; arch-ABC-234's probe.ts shape, PROBE/LMR removed, Q1 knobs). Usage: node probe.ts <mode> '<head-json>' ['<door-json>']
import { makeMove, unmakeMove } from "./src/apply.ts";
import { chooseMove } from "./src/engine.ts";
import { phaseOf } from "./src/evaluate.ts";
import { parseFen, toFen } from "./src/fen.ts";
import { gameStatus } from "./src/gameend.ts";
import { legalMoves } from "./src/legal.ts";
import { squareName } from "./src/position.ts";
import { HANGING_CORPUS } from "./src/puzzle-corpus.ts";
import { isLosingCapture, Q1, quiesce, see } from "./src/quiescence.ts";
import { MATE_CORPUS } from "./src/search.mate-corpus.ts";
import { MATE_SCORE, probeNode, search } from "./src/search.ts";

const DEFAULTS = { ...Q1 };
function setCfg(cfg: Record<string, unknown>) {
  Object.assign(Q1, DEFAULTS, { qLog: [], mLog: [], qFired: 0, mFired: 0, qNodes: 0, qMoves: 0, qLosing: 0, qLosingRefuted: 0, qLosingNodes: 0, qPruned: 0, mPruned: 0, mNodes: 0 }, cfg);
}
const [mode, headJson, doorJson] = process.argv.slice(2);
const HEAD = JSON.parse(headJson ?? "{}");
const DOOR = JSON.parse(doorJson && doorJson.startsWith("{") ? doorJson : "{}");
const isMate = (s: number) => Math.abs(s) > MATE_SCORE - 1000;
const mv = (m: { from: number; to: number } | null) => (m ? squareName(m.from) + squareName(m.to) : "-");
const RULES = { evasions: true, quietPromotions: true, taper: true };

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
    out.push([name, fen]);
    const p = parseFen(fen);
    for (const m of legalMoves(p)) {
      const u = makeMove(p, m);
      if (gameStatus(p).result === "in-progress") out.push([`${name}/${mv(m)}`, toFen(p)]);
      unmakeMove(p, m, u);
    }
  }
  return [...out, ...(ENDGAMES as [string, string][])];
}
const choose = (fen: string, d: number) =>
  chooseMove(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth: d }) as unknown as { move: any; score: number; nodes: number; depth: number };

if (mode === "nodes") {
  const depth = Number(process.env.D ?? 8);
  const names = (process.env.POS ?? "kiwipete,position-6").split(",");
  for (const name of names) {
    const fen = (ROOTS.find((r) => r[0] === name) as string[])[1] as string;
    for (const [label, cfg] of [["door", DOOR], ["head", HEAD]] as const) {
      setCfg(cfg);
      const s = search(parseFen(fen), depth);
      setCfg(cfg);
      const c = choose(fen, depth);
      console.log(JSON.stringify({ name, label, depth, search: { nodes: s.nodes, score: s.score, move: mv(s.move) }, choose: { nodes: c.nodes, score: c.score, move: mv(c.move), depth: c.depth } }));
    }
  }
} else if (mode === "drift") {
  const depth = Number(process.env.D ?? 5);
  const which = process.env.REC ?? "search";
  const rows = corpus();
  let n = 0, within = 0, max = 0, maxName = "", mateFlip = 0, signFlip = 0, moveDiff = 0;
  const big: string[] = [];
  for (const [name, fen] of rows) {
    let a: { score: number; move: any }, b: { score: number; move: any };
    if (which === "search") { setCfg(DOOR); a = search(parseFen(fen), depth); setCfg(HEAD); b = search(parseFen(fen), depth); }
    else { setCfg(DOOR); a = choose(fen, depth); setCfg(HEAD); b = choose(fen, depth); }
    if (mv(a.move) !== mv(b.move)) moveDiff++;
    if (isMate(a.score) !== isMate(b.score)) { mateFlip++; continue; }
    if (isMate(a.score)) { if (Math.sign(a.score) !== Math.sign(b.score)) signFlip++; continue; }
    n++;
    const d = Math.abs(a.score - b.score);
    if (d <= 25) within++;
    else big.push(`${name} ${a.score}->${b.score}`);
    if (d > max) { max = d; maxName = `${name} ${a.score}->${b.score}`; }
  }
  console.log(JSON.stringify({ which, depth, rows: rows.length, nonMate: n, withinPct: +(100 * within / n).toFixed(2), max, maxName, mateFlip, signFlip, moveDiff, beyond25: big }));
} else if (mode === "mate") {
  const d = Number(process.env.D ?? 5);
  const plus = Number(process.env.PLUS ?? 0);
  let mates = 0, viol = 0, longer = 0;
  for (const fen of MATE_CORPUS) {
    setCfg(DOOR); const a = search(parseFen(fen), d);
    if (!isMate(a.score)) continue;
    mates++;
    setCfg(HEAD); const b = search(parseFen(fen), d + plus);
    if (!isMate(b.score) || Math.sign(b.score) !== Math.sign(a.score)) viol++;
    else if (Math.abs(b.score) < Math.abs(a.score)) longer++;
  }
  console.log(JSON.stringify({ d, plus, total: MATE_CORPUS.length, mates, viol, longer }));
} else if (mode === "fire") {
  // Premise counters at depth D over the 190 (+6 endgames), search(): quiescence moves that are LOSING captures (out of
  // check, by the head's qMargin), refuted share, nodes under them; and the head's pruned counts.
  const depth = Number(process.env.D ?? 6);
  const run = (cfg: Record<string, unknown>) => {
    setCfg({ ...cfg, count: true });
    let n = 0;
    for (const [, fen] of corpus()) n += search(parseFen(fen), depth).nodes;
    const pct = (a: number, b: number) => (b ? +(100 * a / b).toFixed(2) : 0);
    const r = { nodes: n, qNodes: Q1.qNodes, qMoves: Q1.qMoves, qLosing: Q1.qLosing, qLosingPct: pct(Q1.qLosing, Q1.qMoves), qLosingRefutedPct: pct(Q1.qLosingRefuted, Q1.qLosing), qLosingNodesPct: pct(Q1.qLosingNodes, Q1.qNodes), qPruned: Q1.qPruned, mNodes: Q1.mNodes, mPruned: Q1.mPruned };
    Q1.count = false;
    return r;
  };
  const door = run({ ...DOOR, qMargin: (HEAD as any).qMargin ?? 0 }), head = run(HEAD);
  console.log(JSON.stringify({ depth, ratio: +(head.nodes / door.nodes).toFixed(4), door, head }));
} else if (mode === "zug") {
  const rows = [
    ["zugzwang.001", "8/8/p1p5/1p5p/1P5p/8/PPP2K1p/4R1rk w - - 0 1", "e1f1", 9],
    ["kpk-b6c6", "2k5/8/1K6/2P5/8/8/8/8 w - - 0 1", "b6c6", 8],
    ["kpk-c6d6", "3k4/8/2K5/3P4/8/8/8/8 w - - 0 1", "c6d6", 8],
    ["kpk-d6e6", "4k3/8/3K4/4P3/8/8/8/8 w - - 0 1", "d6e6", 8],
    ["kpk-e6f6", "5k2/8/4K3/5P2/8/8/8/8 w - - 0 1", "e6f6", 8],
    ["zugzwang.004", "8/6B1/p5p1/Pp4kp/1P5r/5P1Q/4q1PK/8 w - - 0 32", "h3h4", 11],
    ["zugzwang.005", "8/8/1p1r1k2/p1pPN1p1/P3KnP1/1P6/8/3R4 b - - 0 1", "f4d5", 12],
  ] as const;
  setCfg(HEAD);
  for (const [name, fen, want, d] of rows) {
    const c = choose(fen, d);
    console.log(JSON.stringify({ name, d, played: mv(c.move), want, ok: mv(c.move) === want, nodes: c.nodes }));
  }
} else if (mode === "reach") {
  const maxNodes = Number(process.env.N ?? 47000);
  const rows = corpus();
  const res: Record<string, number[]> = { door: [], head: [] };
  const mvs: Record<string, string[]> = { door: [], head: [] };
  for (const [label, cfg] of [["door", DOOR], ["head", HEAD]] as const) {
    setCfg(cfg);
    for (const [, fen] of rows) {
      const c = chooseMove(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxNodes }) as unknown as { depth: number; move: any };
      res[label]!.push(c.depth);
      mvs[label]!.push(mv(c.move));
    }
  }
  const d = res.door!, h = res.head!;
  const mean = (a: number[]) => +(a.reduce((x, y) => x + y, 0) / a.length).toFixed(3);
  console.log(JSON.stringify({ maxNodes, rows: rows.length, doorMeanDepth: mean(d), headMeanDepth: mean(h), gain: +(mean(h) - mean(d)).toFixed(3), deeper: h.filter((x, i) => x > d[i]!).length, shallower: h.filter((x, i) => x < d[i]!).length, moveDiff: h.filter((_, i) => mvs.head![i] !== mvs.door![i]).length }));
} else if (mode === "g1") {
  const { PUZZLES } = await import("./src/puzzle-corpus.ts");
  const { virtualClock } = await import("./src/virtual-clock.ts");
  const base = JSON.parse((await import("node:fs")).readFileSync("./src/puzzle-suite.baseline.json", "utf8"));
  setCfg(HEAD);
  let solved = 0; const missed: string[] = [];
  for (const p of PUZZLES as any[]) {
    const c = chooseMove(parseFen(p.fen), { budgetMs: base.budgetMs, now: virtualClock(base.stepMs) }) as any;
    const chosen = c === null ? "null" : mv(c.move);
    const ok = p.kind === "do-not-hang" ? chosen !== p.losing : p.accept.includes(chosen);
    if (ok) solved++; else missed.push(p.name);
  }
  const newly = missed.filter((n) => !base.unsolved.includes(n));
  const newlySolved = (base.unsolved as string[]).filter((n) => !missed.includes(n));
  console.log(JSON.stringify({ solved, total: (PUZZLES as any[]).length, newlyMissed: newly, newlySolved }));
} else if (mode === "qaudit") {
  // Quiescence-prune audit (information only): search() at depth D over the 190 (+6), every AUD-th quiescence node where
  // the head skipped a capture is re-searched fresh three times: head at the node's window (h), door at that window (dnw),
  // door full window (v). A flip is a node where h and dnw fall in different classes (<= alpha, inside, >= beta); its error
  // is |clamp(h) - clamp(v)| in cp (the window-relevant disagreement against the reference value).
  const depth = Number(process.env.D ?? 6);
  const every = Number(process.env.AUD ?? 50);
  const log: { fen: string; alpha: number; beta: number; qply: number; ply: number }[] = [];
  let fired = 0;
  for (const [, fen] of corpus()) {
    setCfg({ ...HEAD, qAudit: every });
    search(parseFen(fen), depth);
    fired += Q1.qFired;
    log.push(...Q1.qLog);
  }
  const INF = Number.POSITIVE_INFINITY;
  const cls = (x: number, a: number, b: number) => (x <= a ? 0 : x >= b ? 2 : 1);
  const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
  let n = 0, flips = 0, e100 = 0, e200 = 0, e300 = 0, e500 = 0, mateRows = 0;
  const big: unknown[] = [];
  for (const r of log) {
    if (Math.abs(r.alpha) > 15000 || Math.abs(r.beta) > 15000) { mateRows++; continue; }
    const q = (cfg: Record<string, unknown>, a: number, b: number) => { setCfg(cfg); const p = parseFen(r.fen); return quiesce(p, a, b, r.qply, r.ply, RULES, () => {}, phaseOf(p)); };
    const h = q(HEAD, r.alpha, r.beta), dnw = q(DOOR, r.alpha, r.beta), v = q(DOOR, 0 - INF, INF);
    n++;
    if (cls(h, r.alpha, r.beta) === cls(dnw, r.alpha, r.beta) && (cls(h, r.alpha, r.beta) !== 1 || h === dnw)) continue;
    flips++;
    const err = Math.abs(clamp(h, r.alpha, r.beta) - clamp(v, r.alpha, r.beta));
    if (err >= 100) e100++;
    if (err >= 200) e200++;
    if (err >= 300) e300++;
    if (err >= 500) e500++;
    big.push({ err, fen: r.fen, alpha: r.alpha, beta: r.beta, h, dnw, v });
  }
  (big as any[]).sort((x, y) => y.err - x.err);
  console.log(JSON.stringify({ depth, every, fired, sampled: log.length, n, mateRows, flips, flipPct: +(100 * flips / n).toFixed(3), e100, e200, e300, e500 }));
  for (const b of big.slice(0, Number(process.env.TOP ?? 8))) console.log(JSON.stringify({ top: b }));
} else if (mode === "maudit") {
  // Main-search rule audit (ADR-0061's shape; information only): every AUD-th null-window node where the main rule skipped
  // a move is re-searched fresh three times (probeNode): head at the window (h), door at the window (dnw), door full (v).
  const depth = Number(process.env.D ?? 6);
  const every = Number(process.env.AUD ?? 10);
  const log: { fen: string; depth: number; alpha: number; beta: number }[] = [];
  let fired = 0;
  for (const [, fen] of corpus()) {
    setCfg({ ...HEAD, mAudit: every });
    search(parseFen(fen), depth);
    fired += Q1.mFired;
    log.push(...Q1.mLog);
  }
  const INF = Number.POSITIVE_INFINITY;
  let n = 0, flips = 0, e100 = 0, e200 = 0, e300 = 0, e500 = 0;
  const big: unknown[] = [];
  for (const r of log) {
    if (Math.abs(r.alpha) > 15000) continue;
    setCfg(HEAD); const h = probeNode(parseFen(r.fen), r.depth, r.alpha, r.beta);
    setCfg(DOOR); const dnw = probeNode(parseFen(r.fen), r.depth, r.alpha, r.beta);
    const v = probeNode(parseFen(r.fen), r.depth, 0 - INF, INF);
    n++;
    const hFL = h <= r.alpha, dFL = dnw <= r.alpha;
    if (hFL === dFL) continue;
    flips++;
    const err = hFL ? v - r.alpha : r.beta - v;
    if (err >= 100) e100++;
    if (err >= 200) e200++;
    if (err >= 300) e300++;
    if (err >= 500) e500++;
    big.push({ err, depth: r.depth, fen: r.fen, alpha: r.alpha, h, dnw, v });
  }
  (big as any[]).sort((x, y) => y.err - x.err);
  console.log(JSON.stringify({ depth, every, fired, sampled: log.length, n, flips, flipPct: n ? +(100 * flips / n).toFixed(3) : 0, e100, e200, e300, e500 }));
  for (const b of big.slice(0, Number(process.env.TOP ?? 8))) console.log(JSON.stringify({ top: b }));
} else if (mode === "seecheck") {
  const byName = (p: any, uci: string) => legalMoves(p).find((m) => mv(m) === uci && m.promotion === 0);
  let ok = 0; const bad: string[] = [];
  for (const row of HANGING_CORPUS) {
    const p = parseFen(row.fen); const m = byName(p, row.losing)!;
    const v = see(p, m); const l = isLosingCapture(p, m, 0);
    if (v < 0 && l) ok++; else bad.push(`${row.name} see=${v}`);
  }
  console.log(JSON.stringify({ hanging: ok, of: HANGING_CORPUS.length, bad }));
  const HAND: [string, string, string, number][] = [
    ["undefended pawn", "1k1r4/1pp4p/p7/4p3/8/P5P1/1PP4P/2K1R3 w - - 0 1", "e1e5", 100],
    ["x-rays both sides (CPW)", "1k1r3q/1ppn3p/p4b2/4p3/8/P2N2P1/1PP1R1BP/2K1Q3 w - - 0 1", "d3e5", -220],
    ["QxP defended by P", "4k3/8/3p4/4p3/8/8/8/4QK2 w - - 0 1", "e1e5", -800],
    ["RxR, recaptured by R, x-ray Q, king takes Q", "3rk3/3r4/8/8/8/8/3R4/3QK3 w - - 0 1", "d2d7", 0],
    ["equal trade NxN defended", "4k3/8/4p3/3n4/8/4N3/8/4K3 w - - 0 1", "e3d5", 0],
    ["BxN defended by P", "4k3/8/4p3/3n4/8/8/6B1/4K3 w - - 0 1", "g2d5", -10],
  ];
  for (const [name, fen, uci, want] of HAND) {
    const p = parseFen(fen); const m = byName(p, uci);
    const v = m ? see(p, m) : Number.NaN;
    console.log(JSON.stringify({ name, uci, see: v, want, ok: v === want }));
  }
}
