// qe-ABC-301-miss: QE's own driver. One fresh process per read. usage: node zz001.ts <tree> <depth>
// Written from the row's contract, not from the engineer's driver. Reads the tree's own src/, by path.
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
const [root, d] = process.argv.slice(2) as [string, string];
const { chooseMove } = await import(`${root}/src/engine.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`);
const { evaluate, phaseOf } = await import(`${root}/src/evaluate.ts`);
const FEN = "8/8/p1p5/1p5p/1P5p/8/PPP2K1p/4R1rk w - - 0 1";
// 0x88: file = s & 15, rank index = s >> 4, read from position.ts's board; the root's rook must decode to e1.
const name = (s: number) => "abcdefgh"[s & 15]! + String((s >> 4) + 1);
const p = parseFen(FEN);
const sq = (n: string) => (n.charCodeAt(1) - 49) * 16 + (n.charCodeAt(0) - 97);
const rootSq = { e1: p.board[sq("e1")], f2: p.board[sq("f2")], g1: p.board[sq("g1")], h1: p.board[sq("h1")] };
const ev = evaluate(p);
const ph = phaseOf(p);
const c = chooseMove(parseFen(FEN), { budgetMs: 1_000, now: () => 0, maxDepth: Number(d) });
console.log(JSON.stringify({
  paramsSha: createHash("sha256").update(readFileSync(`${root}/src/evaluate-params.ts`)).digest("hex").slice(0, 16),
  rootSq, rootEval: ev, rootPhase: ph, maxDepth: Number(d), depth: c.depth,
  move: name(c.move.from) + name(c.move.to), score: c.score, nodes: c.nodes,
}));
