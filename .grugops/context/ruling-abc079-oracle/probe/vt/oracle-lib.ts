// The probe's search copy as a module, src imported STATICALLY by absolute path so vitest
// transforms the imports exactly as it does for src/search.test.ts. Line-for-line src/search.ts +
// src/quiescence.ts with two switches: quiescence on/off, and the quiescence cap.
// TO RE-RUN: copy vt/ out of the tree, symlink vt/node_modules to the repo's node_modules, point
// the absolute src paths here and in oracle.test.ts at your checkout (and SRC/WT in the runners),
// then `node run-vt.mjs <killMs> "pair:off:kiwipete:3,a7:off:3,..."`.
import { makeMove, unmakeMove } from "/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/.claude/worktrees/agent-af43b0d4b90d3dbd1/src/apply.ts";
import { evaluate } from "/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/.claude/worktrees/agent-af43b0d4b90d3dbd1/src/evaluate.ts";
import { gameStatus } from "/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/.claude/worktrees/agent-af43b0d4b90d3dbd1/src/gameend.ts";
import { isInCheck, legalMoves } from "/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/.claude/worktrees/agent-af43b0d4b90d3dbd1/src/legal.ts";
import { EMPTY } from "/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/.claude/worktrees/agent-af43b0d4b90d3dbd1/src/position.ts";
import { mvvLvaKey } from "/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/.claude/worktrees/agent-af43b0d4b90d3dbd1/src/quiescence.ts";

const MATE = 30_000;
export interface Sw { prune: boolean; q: boolean; cap: number }

function quiesce(pos: any, alpha: number, beta: number, qply: number, cap: number, c: { n: number }): number {
  if (qply > 0) c.n++;
  const standPat = evaluate(pos);
  if (standPat >= beta) return standPat;
  if (qply >= cap) return standPat;
  let best = standPat;
  if (best > alpha) alpha = best;
  const caps: any[] = [];
  for (const m of legalMoves(pos)) if (m.captured !== EMPTY) caps.push(m);
  caps.sort((a, b) => mvvLvaKey(b) - mvvLvaKey(a));
  for (const m of caps) {
    const u = makeMove(pos, m);
    const s = 0 - quiesce(pos, 0 - beta, 0 - alpha, qply + 1, cap, c);
    unmakeMove(pos, m, u);
    if (s > best) best = s;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break;
  }
  return best;
}

function leaf(pos: any, ply: number, alpha: number, beta: number, sw: Sw, c: { n: number }): number {
  const st = gameStatus(pos);
  if (st.result === "in-progress") return sw.q ? quiesce(pos, alpha, beta, 0, sw.cap, c) : evaluate(pos);
  if (st.reason === "checkmate") return 0 - (MATE - ply);
  return 0;
}

function negamax(pos: any, d: number, alpha: number, beta: number, ply: number, sw: Sw, c: { n: number }): number {
  c.n++;
  if (d <= 0) return leaf(pos, ply, alpha, beta, sw, c);
  const moves = legalMoves(pos);
  if (moves.length === 0) return isInCheck(pos) ? 0 - (MATE - ply) : 0;
  let best = Number.NEGATIVE_INFINITY;
  for (const m of moves) {
    const u = makeMove(pos, m);
    const s = 0 - negamax(pos, d - 1, 0 - beta, 0 - alpha, ply + 1, sw, c);
    unmakeMove(pos, m, u);
    if (s > best) best = s;
    if (!sw.prune) continue;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break;
  }
  return best;
}

export function root(pos: any, depth: number, sw: Sw) {
  const c = { n: 1 };
  const moves = legalMoves(pos);
  let alpha = Number.NEGATIVE_INFINITY;
  let best = Number.NEGATIVE_INFINITY;
  let bm = moves[0];
  for (const m of moves) {
    const u = makeMove(pos, m);
    const s = 0 - negamax(pos, depth - 1, Number.NEGATIVE_INFINITY, 0 - alpha, 1, sw, c);
    unmakeMove(pos, m, u);
    if (s > best) { best = s; bm = m; }
    if (sw.prune && best > alpha) alpha = best;
  }
  return { score: best, move: bm, nodes: c.n };
}

export function variant(v: string): { q: boolean; cap: number } {
  if (v === "on8") return { q: true, cap: 8 };
  if (v === "off") return { q: false, cap: 0 };
  const m = /^cap(\d+)$/.exec(v);
  if (m) return { q: true, cap: Number(m[1]) };
  throw new Error(v);
}
