// SCRATCH PROBE (arch-E1). Runs on the patched scratch tree (patch_e1.py). Forms: BASE (main), L (linear phase
// 0..24), P (plateau: pure middlegame at phase >= 22, pure endgame at <= 6). Deterministic counts only; no timing.
// Usage: node e1probe.ts <mode> <FORM> [arg]
import { readFileSync } from "node:fs";
import { makeMove, unmakeMove } from "./src/apply.ts";
import { chooseMove, chooseMoveWithoutFutility } from "./src/engine.ts";
import { E1CFG, evaluate } from "./src/evaluate.ts";
import { buildCorpus, mirrorPosition } from "./src/evaluate.mirror-corpus.ts";
import { parseFen, toFen } from "./src/fen.ts";
import { gameStatus } from "./src/gameend.ts";
import { legalMoves } from "./src/legal.ts";
import { pieceType, squareName } from "./src/position.ts";
import { MATE_CORPUS } from "./src/search.mate-corpus.ts";
import { MATE_SCORE, search, searchWithoutFutility } from "./src/search.ts";

const FORMS: Record<string, { on: number; phMg: number; phEg: number }> = {
  BASE: { on: 0, phMg: 24, phEg: 0 },
  L: { on: 1, phMg: 24, phEg: 0 },
  P: { on: 1, phMg: 22, phEg: 6 },
};
const setForm = (f: string) => Object.assign(E1CFG, FORMS[f], { count: 0, calls: 0, pieces: 0, pawns: 0, reach: 0 });
const [mode, form, arg] = process.argv.slice(2) as [string, string, string | undefined];
if (!(form in FORMS)) throw new Error(`form ${form}`);
const isMate = (s: number) => Math.abs(s) > MATE_SCORE - 1000;
const mv = (m: { from: number; to: number } | null) => (m ? squareName(m.from) + squareName(m.to) : "-");
const PROMO = ["", "", "n", "b", "r", "q"];
const uci = (m: { from: number; to: number; promotion: number }) =>
  squareName(m.from) + squareName(m.to) + (m.promotion ? PROMO[pieceType(m.promotion)] : "");
const choose = (fen: string, d: number) =>
  chooseMove(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth: d }) as unknown as { move: any; score: number; nodes: number; depth: number };

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
const fenOf = (name: string) => (ROOTS.find((r) => r[0] === name) as string[])[1] as string;

if (mode === "nodes") {
  // nodes to complete each depth, both recursions, on the G6 boards; plus the work-proxy counters at the last depth
  const depths = (process.env.DS ?? "7,8").split(",").map(Number);
  const rec = process.env.REC ?? "choose";
  for (const name of (process.env.POS ?? "kiwipete,position-6").split(",")) {
    for (const d of depths) {
      setForm(form);
      E1CFG.count = 1;
      const r = rec === "search" ? search(parseFen(fenOf(name)), d) : choose(fenOf(name), d);
      console.log(JSON.stringify({ form, rec, name, d, nodes: r.nodes, score: r.score, move: mv(r.move), evalCalls: E1CFG.calls, piecesPerCall: +(E1CFG.pieces / E1CFG.calls).toFixed(2), pawnsPerCall: +(E1CFG.pawns / E1CFG.calls).toFixed(2), reachPerCall: +(E1CFG.reach / E1CFG.calls).toFixed(2), callsPerNode: +(E1CFG.calls / r.nodes).toFixed(3) }));
    }
  }
} else if (mode === "reach") {
  const maxNodes = Number(process.env.N ?? 47000);
  setForm(form);
  const depths: number[] = [];
  const moves: string[] = [];
  for (const [, fen] of corpus()) {
    const c = chooseMove(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxNodes }) as unknown as { depth: number; move: any };
    depths.push(c.depth);
    moves.push(mv(c.move));
  }
  console.log(JSON.stringify({ form, maxNodes, rows: depths.length, meanDepth: +(depths.reduce((a, b) => a + b, 0) / depths.length).toFixed(3), depths, moves }));
} else if (mode === "drift") {
  // report only (drift is expected for an evaluation change): form vs BASE at depth D in chooseMove on the 196
  const depth = Number(process.env.D ?? 5);
  let n = 0, within = 0, max = 0, maxName = "", mateFlip = 0, signFlip = 0, moveDiff = 0;
  for (const [name, fen] of corpus()) {
    setForm("BASE"); const a = choose(fen, depth);
    setForm(form); const b = choose(fen, depth);
    if (mv(a.move) !== mv(b.move)) moveDiff++;
    if (isMate(a.score) !== isMate(b.score)) { mateFlip++; continue; }
    if (isMate(a.score)) { if (Math.sign(a.score) !== Math.sign(b.score)) signFlip++; continue; }
    n++;
    const dd = Math.abs(a.score - b.score);
    if (dd <= 25) within++;
    if (dd > max) { max = dd; maxName = `${name} ${a.score}->${b.score}`; }
  }
  console.log(JSON.stringify({ form, depth, nonMate: n, withinPct: +(100 * within / n).toFixed(2), max, maxName, mateFlip, signFlip, moveDiff }));
} else if (mode === "mate") {
  const d = Number(process.env.D ?? 4);
  const plus = Number(process.env.PLUS ?? 1);
  let mates = 0, viol = 0, longer = 0;
  for (const fen of MATE_CORPUS) {
    setForm("BASE"); const a = search(parseFen(fen), d);
    if (!isMate(a.score)) continue;
    mates++;
    setForm(form); const b = search(parseFen(fen), d + plus);
    if (!isMate(b.score) || Math.sign(b.score) !== Math.sign(a.score)) viol++;
    else if (Math.abs(b.score) < Math.abs(a.score)) longer++;
  }
  console.log(JSON.stringify({ form, d, plus, corpus: MATE_CORPUS.length, mates, viol, longer }));
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
  setForm(form);
  let ok = 0;
  for (const [name, fen, want, d] of rows) {
    const c = choose(fen, d);
    const hit = mv(c.move) === want;
    if (hit) ok++;
    console.log(JSON.stringify({ form, name, d, played: mv(c.move), want, ok: hit, nodes: c.nodes }));
  }
  console.log(JSON.stringify({ form, zugzwang: `${ok} / ${rows.length}` }));
} else if (mode === "g1") {
  const { PUZZLES } = await import("./src/puzzle-corpus.ts");
  const { virtualClock } = await import("./src/virtual-clock.ts");
  const base = JSON.parse(readFileSync("./src/puzzle-suite.baseline.json", "utf8"));
  setForm(form);
  let solved = 0; const missed: string[] = [];
  for (const p of PUZZLES as any[]) {
    const c = chooseMove(parseFen(p.fen), { budgetMs: base.budgetMs, now: virtualClock(base.stepMs) }) as any;
    const chosen = c === null ? "null" : mv(c.move);
    const ok = p.kind === "do-not-hang" ? chosen !== p.losing : p.accept.includes(chosen);
    if (ok) solved++; else missed.push(p.name);
  }
  const newly = missed.filter((n) => !base.unsolved.includes(n));
  const newlySolved = (base.unsolved as string[]).filter((n) => !missed.includes(n));
  console.log(JSON.stringify({ form, solved, total: (PUZZLES as any[]).length, newlyMissed: newly, newlySolved }));
} else if (mode === "static") {
  // the mirror (exact, Object.is) over G3's corpus; the folded tickets' relation shapes
  setForm(form);
  let pairs = 0, bad = 0;
  for (const { position } of buildCorpus()) {
    pairs++;
    if (!Object.is(evaluate(position), evaluate(mirrorPosition(position)))) bad++;
  }
  const ev = (fen: string) => evaluate(parseFen(fen));
  const kp = [ // king-and-pawn endings: white king centre (e4/d4/d5/e5 family) vs corner/edge, same pawns
    ["8/5ppp/8/8/4K3/8/5PPP/7k w - - 0 1", "8/5ppp/8/8/8/8/5PPP/K6k w - - 0 1"],
    ["k7/5ppp/8/8/4K3/8/PPP5/8 w - - 0 1", "k7/5ppp/8/8/8/8/PPP5/6K1 w - - 0 1"],
    ["7k/pp6/8/3K4/8/8/PP6/8 w - - 0 1", "7k/pp6/8/8/8/8/PP6/7K w - - 0 1"],
    ["8/p4k2/8/4K3/8/8/P7/8 w - - 0 1", "8/p4k2/8/8/8/8/P7/K7 w - - 0 1"],
    ["8/8/2k5/8/3K4/8/1P6/8 w - - 0 1", "8/8/2k5/8/8/8/1P6/7K w - - 0 1"],
    ["8/1p4k1/8/8/4K3/8/1P6/8 w - - 0 1", "8/1p4k1/8/8/8/8/1P6/K7 w - - 0 1"],
  ];
  const kpRows = kp.map(([c, e]) => ({ centreMinusCorner: ev(c as string) - ev(e as string) }));
  setForm("BASE");
  const kpBase = kp.map(([c, e]) => ev(c as string) - ev(e as string));
  const mid = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", ...ROOTS.filter((r) => r[0] === "kiwipete" || r[0] === "position-6").map((r) => r[1] as string),
    "r1bq1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 0 1", "r1bqk2r/pp2bppp/2n1pn2/3p4/8/2NBPN2/PP1P1PPP/R1BQK2R w KQkq - 0 1",
    "r2q1rk1/pp1nbppp/2p1pn2/3p4/2PP4/2NBPN2/PP3PPP/R2Q1RK1 w - - 0 1", "r1bq1rk1/ppp2ppp/2n2n2/3pp3/1bPP4/2N1PN2/PP1B1PPP/R2QKB1R w KQ - 0 1"];
  const midBase = mid.map(ev);
  setForm(form);
  const midDiff = mid.map((f, i) => ev(f) - (midBase[i] as number));
  const pass = [ // passed pawns at ranks 4-7, low phase (bare kings + one minor or none)
    "8/8/1k6/8/3P4/8/8/6K1 w - - 0 1", "8/8/1k6/3P4/8/8/8/6K1 w - - 0 1", "8/8/1k1P4/8/8/8/8/6K1 w - - 0 1",
    "8/3P4/1k6/8/8/8/8/6K1 w - - 0 1", "8/8/1k6/3P4/8/8/8/5NK1 w - - 0 1", "8/8/1k1P4/8/8/8/8/2B3K1 w - - 0 1",
  ];
  const passHead = pass.map(ev);
  setForm("BASE");
  const passBase = pass.map(ev);
  console.log(JSON.stringify({ form, mirrorPairs: pairs, mirrorMismatches: bad, kpCentreMinusCorner: kpRows.map((r) => r.centreMinusCorner), kpBase, midDiffVsBase: midDiff, passHead, passBase }));
} else if (mode === "play") {
  // the arch-next-pull evaluation instrument, skytalix side (information only)
  const N = Number(arg ?? 47000);
  setForm(form);
  for (const line of readFileSync(process.env.POSF as string, "utf8").trim().split("\n")) {
    const { id, fen } = JSON.parse(line);
    const c = chooseMove(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxNodes: N }) as unknown as { move: any; score: number; depth: number; nodes: number };
    console.log(JSON.stringify({ id, move: uci(c.move), score: c.score, depth: c.depth, nodes: c.nodes }));
  }
}
if (mode === "fut") {
  // REPORT added after batch C (not pre-registered; decides nothing): ADR-0061's decision 8 rows re-read on the form's
  // scale (its Consequences "eval-scale coupling"): drift at d5 on the 190, shipped vs the futility door, both
  // recursions, with the form on both sides; and the mate floor on the 287 at d5 (door mate -> shipped same-sign mate).
  setForm(form);
  const opts = (d: number) => ({ budgetMs: 1e9, now: () => 0, maxDepth: d });
  for (const which of ["search", "choose"]) {
    let n = 0, within = 0, max = 0, maxName = "", mateFlip = 0, signFlip = 0;
    for (const [name, fen] of corpus()) {
      const a = which === "search" ? searchWithoutFutility(parseFen(fen), 5) : (chooseMoveWithoutFutility(parseFen(fen), opts(5)) as any);
      const b = which === "search" ? search(parseFen(fen), 5) : (chooseMove(parseFen(fen), opts(5)) as any);
      if (isMate(a.score) !== isMate(b.score)) { mateFlip++; continue; }
      if (isMate(a.score)) { if (Math.sign(a.score) !== Math.sign(b.score)) signFlip++; continue; }
      n++;
      const dd = Math.abs(a.score - b.score);
      if (dd <= 25) within++;
      if (dd > max) { max = dd; maxName = `${name} ${a.score}->${b.score}`; }
    }
    console.log(JSON.stringify({ form, futilityDrift: which, nonMate: n, withinPct: +(100 * within / n).toFixed(2), max, maxName, mateFlip, signFlip }));
  }
  let mates = 0, viol = 0;
  for (const fen of MATE_CORPUS) {
    const a = searchWithoutFutility(parseFen(fen), 5);
    if (!isMate(a.score)) continue;
    mates++;
    const b = search(parseFen(fen), 5);
    if (!isMate(b.score) || Math.sign(b.score) !== Math.sign(a.score)) viol++;
  }
  console.log(JSON.stringify({ form, futilityMateFloor: { mates, viol } }));
}
