// SCRATCH PROBE (arch-ABC-236; arch-ABC-234's corpus, zugzwang rows, G1 and reach modes). Root aspiration windows in
// chooseMove only. Usage: node probe.ts <mode> '<head-ASP-json>' ['<door-ASP-json>']
import { makeMove, unmakeMove } from "./src/apply.ts";
import { ASP, aspReset, chooseMove } from "./src/engine.ts";
import { parseFen, toFen } from "./src/fen.ts";
import { gameStatus } from "./src/gameend.ts";
import { legalMoves } from "./src/legal.ts";
import { squareName } from "./src/position.ts";
import { MATE_CORPUS } from "./src/search.mate-corpus.ts";
import { MATE_SCORE } from "./src/search.ts";

const BASE = { on: 0, from: 5, delta: 50, grow: 2, cap: 400, oneStep: 0 };
function setCfg(cfg: Record<string, unknown>, log = false) {
  Object.assign(ASP, BASE, cfg, { log: log ? [] : null });
  aspReset();
}
const [mode, headJson, doorJson] = process.argv.slice(2);
const HEAD = JSON.parse(headJson ?? "{}");
const DOOR = JSON.parse(doorJson ?? "{}");
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
type C = { move: any; score: number; nodes: number; depth: number };
const choose = (fen: string, d: number) => chooseMove(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth: d }) as unknown as C;
const counters = () => ({ ...ASP.c });
const q = (a: number[], p: number) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))]! : 0; };

if (mode === "nodes") {
  const depth = Number(process.env.D ?? 8);
  const names = (process.env.POS ?? "kiwipete,position-6").split(",");
  let sd = 0, sh = 0;
  for (const name of names) {
    const fen = (ROOTS.find((r) => r[0] === name) as string[])[1] as string;
    setCfg(DOOR); const a = choose(fen, depth);
    setCfg(HEAD); const b = choose(fen, depth); const c = counters();
    sd += a.nodes; sh += b.nodes;
    console.log(JSON.stringify({ name, depth, door: { nodes: a.nodes, score: a.score, move: mv(a.move) }, head: { nodes: b.nodes, score: b.score, move: mv(b.move) }, ratio: +(b.nodes / a.nodes).toFixed(4), c }));
  }
  console.log(JSON.stringify({ pooled: true, depth, names, door: sd, head: sh, ratio: +(sh / sd).toFixed(4) }));
} else if (mode === "rates") {
  // Fail and re-search rates over the 190 (+6 endgames) at maxDepth D; per-iteration head vs door; door score swings.
  const depth = Number(process.env.D ?? 7);
  const rows = corpus();
  const agg = { iters: 0, windowed: 0, mateGuard: 0, passes: 0, failLow: 0, failHigh: 0, flip: 0, itersFailed: 0, nodesAll: 0, nodesWindowed: 0, nodesFailed: 0, maxPasses: 0 };
  let doorNodes = 0, headNodes = 0;
  const swing: Record<number, number[]> = {};
  const cmp = { gated: 0, scoreEq: 0, moveEq: 0, failedIters: 0, failedScoreEq: 0, failedMoveEq: 0, mateIters: 0, mateEq: 0, maxDiff: 0, maxDiffAt: "", finalScoreEq: 0, finalMoveEq: 0 };
  for (const [name, fen] of rows) {
    setCfg(DOOR, true); const a = choose(fen, depth); const dl = ASP.log!;
    setCfg(HEAD, true); const b = choose(fen, depth); const hl = ASP.log!; const c = counters();
    doorNodes += a.nodes; headNodes += b.nodes;
    for (const k of Object.keys(agg) as (keyof typeof agg)[]) agg[k] = k === "maxPasses" ? Math.max(agg[k], c[k]) : agg[k] + (c as any)[k];
    for (let i = 1; i < dl.length; i++) {
      const d = dl[i]!.depth, s0 = dl[i - 1]!.score, s1 = dl[i]!.score;
      if (d >= 5 && !isMate(s0) && !isMate(s1)) (swing[d] ??= []).push(Math.abs(s1 - s0));
    }
    for (let i = 0; i < hl.length; i++) {
      const h = hl[i]!, dd = dl[i]!;
      if (h.depth < (HEAD.from ?? 5)) continue;
      cmp.gated++;
      const se = h.score === dd.score, me = mv(h.move) === mv(dd.move);
      if (se) cmp.scoreEq++;
      if (me) cmp.moveEq++;
      if (h.fails > 0) { cmp.failedIters++; if (se) cmp.failedScoreEq++; if (me) cmp.failedMoveEq++; }
      if (isMate(dd.score) || isMate(h.score)) { cmp.mateIters++; if (se) cmp.mateEq++; }
      else if (Math.abs(h.score - dd.score) > cmp.maxDiff) { cmp.maxDiff = Math.abs(h.score - dd.score); cmp.maxDiffAt = `${name} d${h.depth} ${dd.score}->${h.score}`; }
    }
    if (a.score === b.score) cmp.finalScoreEq++;
    if (mv(a.move) === mv(b.move)) cmp.finalMoveEq++;
  }
  const sw: Record<string, unknown> = {};
  for (const [d, a] of Object.entries(swing)) sw[`d${d}`] = { n: a.length, p50: q(a, 0.5), p75: q(a, 0.75), p90: q(a, 0.9), p95: q(a, 0.95), gt25: a.filter((x) => x > 25).length, gt50: a.filter((x) => x > 50).length, gt100: a.filter((x) => x > 100).length };
  const pct = (x: number, y: number) => (y ? +(100 * x / y).toFixed(2) : 0);
  console.log(JSON.stringify({ depth, rows: rows.length, doorNodes, headNodes, ratio: +(headNodes / doorNodes).toFixed(4), agg,
    failRatePerWindowedIter: pct(agg.failLow + agg.failHigh, agg.windowed), itersWithResearchPct: pct(agg.itersFailed, agg.windowed),
    failLowPct: pct(agg.failLow, agg.windowed), failHighPct: pct(agg.failHigh, agg.windowed), wastedNodesPct: pct(agg.nodesFailed, agg.nodesAll), cmp, swing: sw }));
} else if (mode === "drift") {
  // chooseMove at maxDepth D over the 190 (+6), door vs head; plus A2: the first 6 rows (corpus, then G1, then mates)
  // whose door score moves >= 200 cp from depth 5 to depth 6 (no mate on either), head d6 score vs door d6 score.
  const depth = Number(process.env.D ?? 6);
  const rows = corpus();
  let n = 0, within = 0, max = 0, maxName = "", mateFlip = 0, signFlip = 0, moveDiff = 0;
  for (const [name, fen] of rows) {
    setCfg(DOOR); const a = choose(fen, depth);
    setCfg(HEAD); const b = choose(fen, depth);
    if (mv(a.move) !== mv(b.move)) moveDiff++;
    if (isMate(a.score) !== isMate(b.score)) { mateFlip++; continue; }
    if (isMate(a.score)) { if (Math.sign(a.score) !== Math.sign(b.score)) signFlip++; continue; }
    n++;
    const d = Math.abs(a.score - b.score);
    if (d <= 25) within++;
    if (d > max) { max = d; maxName = `${name} ${a.score}->${b.score}`; }
  }
  console.log(JSON.stringify({ which: "choose", depth, rows: rows.length, nonMate: n, withinPct: +(100 * within / n).toFixed(2), max, maxName, mateFlip, signFlip, moveDiff }));
  if (depth === 6) {
    const { PUZZLES } = await import("./src/puzzle-corpus.ts");
    const pool: [string, string][] = [...rows, ...(PUZZLES as any[]).map((p) => [`g1/${p.name}`, p.fen] as [string, string]), ...MATE_CORPUS.map((f, i) => [`mate/${i}`, f] as [string, string])];
    const picked: { name: string; d5: number; d6: number; head: number; doorMove: string; headMove: string; eq: boolean; fails: number }[] = [];
    for (const [name, fen] of pool) {
      if (picked.length >= 6) break;
      setCfg(DOOR, true); const a = choose(fen, 6); const dl = ASP.log!;
      const r5 = dl.find((r) => r.depth === 5), r6 = dl.find((r) => r.depth === 6);
      if (!r5 || !r6 || isMate(r5.score) || isMate(r6.score) || Math.abs(r6.score - r5.score) < 200) continue;
      setCfg(HEAD, true); const b = choose(fen, 6); const hl = ASP.log!;
      const h6 = hl.find((r) => r.depth === 6)!;
      picked.push({ name, d5: r5.score, d6: a.score, head: b.score, doorMove: mv(a.move), headMove: mv(b.move), eq: a.score === b.score, fails: h6.fails });
    }
    for (const r of picked) console.log(JSON.stringify({ a2: r }));
    console.log(JSON.stringify({ a2found: picked.length, a2exact: picked.filter((r) => r.eq).length, a2bounded: picked.filter((r) => r.eq || (Math.abs(r.head - r.d6) <= 25 && r.doorMove === r.headMove)).length }));
  }
} else if (mode === "mate") {
  const d = Number(process.env.D ?? 5);
  let mates = 0, viol = 0, exact = 0, longer = 0, shorter = 0, headMateDoorNot = 0;
  for (const fen of MATE_CORPUS) {
    setCfg(DOOR); const a = choose(fen, d);
    setCfg(HEAD); const b = choose(fen, d);
    if (!isMate(a.score)) { if (isMate(b.score)) headMateDoorNot++; continue; }
    mates++;
    if (!isMate(b.score) || Math.sign(b.score) !== Math.sign(a.score)) { viol++; continue; }
    if (a.score === b.score) exact++;
    else if (Math.abs(b.score) < Math.abs(a.score)) longer++;
    else shorter++;
  }
  console.log(JSON.stringify({ d, corpus: MATE_CORPUS.length, mates, viol, exact, longer, shorter, headMateDoorNot }));
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
  let ok = 0;
  for (const [name, fen, want, d] of rows) {
    setCfg(HEAD);
    const c = choose(fen, d);
    if (mv(c.move) === want) ok++;
    console.log(JSON.stringify({ name, d, played: mv(c.move), want, ok: mv(c.move) === want, nodes: c.nodes, score: c.score, c: counters() }));
  }
  console.log(JSON.stringify({ zug: ok, of: rows.length }));
} else if (mode === "reach") {
  const maxNodes = Number(process.env.N ?? 47000);
  const rows = process.env.ALL === "1" ? corpus() : (ROOTS as [string, string][]);
  const res: Record<string, number[]> = { door: [], head: [] };
  const mvs: Record<string, string[]> = { door: [], head: [] };
  const cs: Record<string, any> = {};
  let rowsWindowed = 0;
  for (const [label, cfg] of [["door", DOOR], ["head", HEAD]] as const) {
    setCfg(cfg);
    for (const [, fen] of rows) {
      const w0 = ASP.c.windowed + ASP.c.mateGuard;
      const c = chooseMove(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxNodes }) as unknown as { depth: number; move: any };
      if (label === "head" && ASP.c.windowed + ASP.c.mateGuard > w0) rowsWindowed++;
      res[label]!.push(c.depth);
      mvs[label]!.push(mv(c.move));
    }
    cs[label] = counters();
  }
  const d = res.door!, h = res.head!;
  const mean = (a: number[]) => +(a.reduce((x, y) => x + y, 0) / a.length).toFixed(3);
  const pct = (x: number, y: number) => (y ? +(100 * x / y).toFixed(2) : 0);
  console.log(JSON.stringify({ maxNodes, rows: rows.length, doorMeanDepth: mean(d), headMeanDepth: mean(h), gain: +(mean(h) - mean(d)).toFixed(3), deeper: h.filter((x, i) => x > d[i]!).length, shallower: h.filter((x, i) => x < d[i]!).length, moveDiff: h.filter((_, i) => mvs.head![i] !== mvs.door![i]).length, rowsWindowed,
    firing: { headWindowedNodesPct: pct(cs.head.nodesWindowed, cs.head.nodesAll), headGatedNodesPct: pct(cs.head.nodesGated, cs.head.nodesAll), doorGatedNodesPct: pct(cs.door.nodesGated, cs.door.nodesAll), failedNodesPct: pct(cs.head.nodesFailed, cs.head.nodesAll) }, head: cs.head }));
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
  console.log(JSON.stringify({ solved, total: (PUZZLES as any[]).length, newlyMissed: newly, newlySolved, c: counters() }));
}
