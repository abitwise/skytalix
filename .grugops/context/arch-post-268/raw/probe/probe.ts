// SCRATCH PROBE (arch-phase2-p1; arch-post-268 adds audit mode from arch-phase2-p3's probe3.ts). Usage: node probe.ts <mode> '<head-config-json>' [extra]
import { makeMove, unmakeMove } from "./src/apply.ts";
import { chooseMove } from "./src/engine.ts";
import { parseFen, toFen } from "./src/fen.ts";
import { gameStatus } from "./src/gameend.ts";
import { legalMoves } from "./src/legal.ts";
import { squareName } from "./src/position.ts";
import { MATE_CORPUS } from "./src/search.mate-corpus.ts";
import { MATE_SCORE, PROBE, probeNode, search } from "./src/search.ts";

const DEFAULTS = { ...PROBE, hist: [...PROBE.hist] };
function setCfg(cfg: Record<string, unknown>) {
  Object.assign(PROBE, DEFAULTS, { hist: [0, 0, 0, 0, 0, 0, 0, 0], auditLog: [], fired: 0 }, cfg);
}
const [mode, headJson, extra] = process.argv.slice(2);
const HEAD = JSON.parse(headJson ?? "{}");
const DOOR = JSON.parse(extra && extra.startsWith("{") ? extra : "{}");
const isMate = (s: number) => Math.abs(s) > MATE_SCORE - 1000;
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
      setCfg({ ...cfg, count: true });
      const s = search(parseFen(fen), depth);
      const sc = { tries: PROBE.tries, reduced: PROBE.reduced, sumR: PROBE.sumR, hist: [...PROBE.hist], fut: PROBE.futPruned };
      setCfg(cfg);
      const c = choose(fen, depth);
      console.log(JSON.stringify({ name, label, depth, search: { nodes: s.nodes, score: s.score, move: mv(s.move) }, choose: { nodes: c.nodes, score: c.score, move: mv(c.move), depth: c.depth }, lmr: sc }));
    }
  }
} else if (mode === "drift") {
  const depth = Number(process.env.D ?? 5);
  const which = process.env.REC ?? "search";
  const rows = corpus();
  let n = 0, within = 0, max = 0, maxName = "", mateFlip = 0, signFlip = 0, moveDiff = 0;
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
    if (d > max) { max = d; maxName = `${name} ${a.score}->${b.score}`; }
  }
  console.log(JSON.stringify({ which, depth, rows: rows.length, nonMate: n, withinPct: +(100 * within / n).toFixed(2), max, maxName, mateFlip, signFlip, moveDiff }));
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
  console.log(JSON.stringify({ d, plus, mates, viol, longer }));
} else if (mode === "fire") {
  const depth = Number(process.env.D ?? 6);
  let dn = 0, hn = 0;
  setCfg({ ...HEAD, count: true });
  for (const [, fen] of corpus()) hn += search(parseFen(fen), depth).nodes;
  const sc = { tries: PROBE.tries, reduced: PROBE.reduced, sumR: PROBE.sumR, hist: [...PROBE.hist] };
  setCfg({ ...DOOR, count: true });
  for (const [, fen] of corpus()) dn += search(parseFen(fen), depth).nodes;
  const dc = { tries: PROBE.tries, reduced: PROBE.reduced, sumR: PROBE.sumR, hist: [...PROBE.hist] };
  console.log(JSON.stringify({ depth, headNodes: hn, doorNodes: dn, ratio: +(hn / dn).toFixed(4), head: sc, door: dc }));
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
  const lim = Number(process.env.ZN ?? 7);
  for (const [name, fen, want, d] of rows.slice(0, lim)) {
    const c = choose(fen, d);
    console.log(JSON.stringify({ name, d, played: mv(c.move), want, ok: mv(c.move) === want, nodes: c.nodes }));
  }
}
if (mode === "reach") {
  const maxNodes = Number(process.env.N ?? 47000);
  const rows = process.env.ALL === "1" ? corpus() : (ROOTS as [string, string][]);
  const out: Record<string, { sum: number; n: number; deeper: number; shallower: number; moveDiff: number }> = {};
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
  console.log(JSON.stringify({ maxNodes, rows: rows.length, doorMeanDepth: mean(d), headMeanDepth: mean(h), deeper: h.filter((x, i) => x > d[i]!).length, shallower: h.filter((x, i) => x < d[i]!).length, moveDiff: h.filter((_, i) => mvs.head![i] !== mvs.door![i]).length }));
}
if (mode === "g1") {
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
}
if (mode === "zugd") {
  const fen = "8/6B1/p5p1/Pp4kp/1P5r/5P1Q/4q1PK/8 w - - 0 32";
  setCfg(HEAD);
  for (const d of (process.env.DS ?? "10,11,12,13").split(",").map(Number)) {
    const c = choose(fen, d);
    console.log(JSON.stringify({ d, played: mv(c.move), score: c.score, nodes: c.nodes }));
  }
}

if (mode === "audit") {
  // arch-phase2-p3's audit (ADR-0061 § Context), for LMR: sampled null-window nodes from search() at depth D over the
  // 190 (+6 endgames) where the head's reduction differs from main's flat rule on a searched move; each re-searched
  // fresh: head at the node's null window (h), door at the same window (dnw), door full-window (v, the reference).
  const depth = Number(process.env.D ?? 6);
  const every = Number(process.env.AUD ?? 10);
  const maxD = Number(process.env.AMAXD ?? 99);
  const log: { kind: string; fen: string; depth: number; alpha: number; beta: number }[] = [];
  let fired = 0;
  for (const [, fen] of corpus()) {
    setCfg({ ...HEAD, audit: every, auditMaxDepth: maxD });
    search(parseFen(fen), depth);
    fired += PROBE.fired;
    log.push(...PROBE.auditLog);
  }
  const INF = Number.POSITIVE_INFINITY;
  type Row = { n: number; flips: number; ffl: number; ffh: number; e100: number; e200: number; e300: number; e500: number; unstable: number; doorNoise: number };
  const blank = (): Row => ({ n: 0, flips: 0, ffl: 0, ffh: 0, e100: 0, e200: 0, e300: 0, e500: 0, unstable: 0, doorNoise: 0 });
  const by: Record<string, Row> = {};
  const big: { err: number; kind: string; depth: number; fen: string; a: number; h: number; dnw: number; v: number }[] = [];
  for (const r of log) {
    if (Math.abs(r.alpha) > 15000) continue;
    setCfg(HEAD); const h = probeNode(parseFen(r.fen), r.depth, r.alpha, r.beta);
    setCfg(DOOR); const dnw = probeNode(parseFen(r.fen), r.depth, r.alpha, r.beta);
    const v = probeNode(parseFen(r.fen), r.depth, 0 - INF, INF);
    for (const key of ["all", `${r.kind}`, `d${r.depth}`]) {
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
      if (key === "all") big.push({ err, kind: r.kind, depth: r.depth, fen: r.fen, a: r.alpha, h, dnw, v });
    }
  }
  big.sort((x, y) => y.err - x.err);
  console.log(JSON.stringify({ depth, every, fired, sampled: log.length }));
  for (const [k, row] of Object.entries(by).sort()) {
    const pct = (x: number) => +(100 * x / row.n).toFixed(2);
    console.log(JSON.stringify({ key: k, ...row, flipPct: pct(row.flips), e200Pct: pct(row.e200), e300Pct: pct(row.e300) }));
  }
  for (const b of big.slice(0, Number(process.env.TOP ?? 8))) console.log(JSON.stringify({ top: b }));
}
