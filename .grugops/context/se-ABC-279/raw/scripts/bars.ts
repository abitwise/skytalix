// SCRATCH (se-ABC-279): the arch-Q1-see-pruning probe's instrument, driven by the build's doors. Usage: node bars.ts <mode>
import { makeMove, unmakeMove } from "<worktree>/src/apply.ts";
import { chooseMove, chooseMoveWithoutSeePruning } from "<worktree>/src/engine.ts";
import { parseFen, toFen } from "<worktree>/src/fen.ts";
import { gameStatus } from "<worktree>/src/gameend.ts";
import { legalMoves } from "<worktree>/src/legal.ts";
import { squareName } from "<worktree>/src/position.ts";
import { MATE_CORPUS } from "<worktree>/src/search.mate-corpus.ts";
import { MATE_SCORE, search, searchWithoutSeePruning } from "<worktree>/src/search.ts";
const mode = process.argv[2];
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
type C = (p: any, o: any) => any;
const deepenTo = (cm: C, fen: string, d: number) => cm(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth: d });
const S = { head: search, door: searchWithoutSeePruning };
const E = { head: chooseMove as C, door: chooseMoveWithoutSeePruning as C };
if (mode === "nodes") {
  const depth = Number(process.env.D ?? 8);
  for (const name of (process.env.POS ?? "kiwipete,position-6").split(",")) {
    const fen = (ROOTS.find((r) => r[0] === name) as string[])[1] as string;
    for (const label of ["door", "head"] as const) {
      const s = S[label](parseFen(fen), depth);
      const c = deepenTo(E[label], fen, depth);
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
    const a = which === "search" ? S.door(parseFen(fen), depth) : deepenTo(E.door, fen, depth);
    const b = which === "search" ? S.head(parseFen(fen), depth) : deepenTo(E.head, fen, depth);
    if (mv(a.move) !== mv(b.move)) moveDiff++;
    if (isMate(a.score) !== isMate(b.score)) { mateFlip++; continue; }
    if (isMate(a.score)) { if (Math.sign(a.score) !== Math.sign(b.score)) signFlip++; continue; }
    n++;
    const d = Math.abs(a.score - b.score);
    if (d <= 25) within++; else big.push(`${name} ${a.score}->${b.score}`);
    if (d > max) { max = d; maxName = `${name} ${a.score}->${b.score}`; }
  }
  console.log(JSON.stringify({ which, depth, rows: rows.length, nonMate: n, withinPct: +(100 * within / n).toFixed(2), max, maxName, mateFlip, signFlip, moveDiff, beyond25: big }));
} else if (mode === "mate") {
  const d = Number(process.env.D ?? 5);
  let mates = 0, viol = 0, longer = 0;
  for (const fen of MATE_CORPUS) {
    const a = S.door(parseFen(fen), d);
    if (!isMate(a.score)) continue;
    mates++;
    const b = S.head(parseFen(fen), d);
    if (!isMate(b.score) || Math.sign(b.score) !== Math.sign(a.score)) viol++;
    else if (Math.abs(b.score) < Math.abs(a.score)) longer++;
  }
  console.log(JSON.stringify({ d, total: MATE_CORPUS.length, mates, viol, longer }));
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
    const c = deepenTo(E.head, fen, d);
    if (mv(c.move) === want) ok++;
    console.log(JSON.stringify({ name, d, played: mv(c.move), want, ok: mv(c.move) === want, nodes: c.nodes }));
  }
  console.log(JSON.stringify({ zugzwang: ok, of: rows.length }));
} else if (mode === "reach") {
  const maxNodes = Number(process.env.N ?? 47000);
  const rows = corpus();
  const res: Record<string, number[]> = { door: [], head: [] };
  const mvs: Record<string, string[]> = { door: [], head: [] };
  for (const label of ["door", "head"] as const) {
    for (const [, fen] of rows) {
      const c = E[label](parseFen(fen), { budgetMs: 1e9, now: () => 0, maxNodes });
      res[label]!.push(c.depth); mvs[label]!.push(mv(c.move));
    }
  }
  const d = res.door!, h = res.head!;
  const mean = (a: number[]) => +(a.reduce((x, y) => x + y, 0) / a.length).toFixed(3);
  console.log(JSON.stringify({ maxNodes, rows: rows.length, doorMeanDepth: mean(d), headMeanDepth: mean(h), gain: +(mean(h) - mean(d)).toFixed(3), deeper: h.filter((x, i) => x > d[i]!).length, shallower: h.filter((x, i) => x < d[i]!).length, moveDiff: h.filter((_, i) => mvs.head![i] !== mvs.door![i]).length }));
}
if (mode === "g1") {
  const { PUZZLES } = await import("<worktree>/src/puzzle-corpus.ts");
  const { virtualClock } = await import("<worktree>/src/virtual-clock.ts");
  const base = JSON.parse((await import("node:fs")).readFileSync("<worktree>/src/puzzle-suite.baseline.json", "utf8"));
  for (const label of ["door", "head"] as const) {
    let solved = 0; const missed: string[] = [];
    for (const p of PUZZLES as any[]) {
      const c = E[label](parseFen(p.fen), { budgetMs: base.budgetMs, now: virtualClock(base.stepMs) });
      const chosen = c === null ? "null" : mv(c.move);
      const ok = p.kind === "do-not-hang" ? chosen !== p.losing : p.accept.includes(chosen);
      if (ok) solved++; else missed.push(p.name);
    }
    console.log(JSON.stringify({ label, solved, total: (PUZZLES as any[]).length, newlyMissed: missed.filter((n) => !base.unsolved.includes(n)), newlySolved: (base.unsolved as string[]).filter((n) => !missed.includes(n)) }));
  }
}
