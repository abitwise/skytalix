// Probe H: ABC-230's pre-root rule on a scratch engine. Fixed depth 4 on a frozen clock.
// base = no prior keys (main's behaviour); r3 = prior keys, a pre-root repeat needs 2 earlier
// occurrences; r2 = prior keys, 1 earlier occurrence is enough. Also: identity rows.
import * as E from "./srcc/engine.ts";
import * as M from "./src/engine.ts";
import { parseFen, toFen } from "./srcc/fen.ts";
import { makeMove } from "./srcc/apply.ts";
import { parseCoordinateMove } from "./srcc/coordinate-move.ts";
import { zobristKey } from "./srcc/zobrist.ts";
import { squareName } from "./srcc/position.ts";
const uci = (m: { from: number; to: number } | null) => (m ? squareName(m.from) + squareName(m.to) : "none");
function replay(fen: string, moves: string[], trim = true) {
  const p = parseFen(fen); const prior: bigint[] = [];
  for (const t of moves) { const r = parseCoordinateMove(p, t); if (r.outcome !== "move") throw new Error(t); prior.push(zobristKey(p)); makeMove(p, r.move); if (trim && p.halfmoveClock === 0) prior.length = 0; }
  return { p, prior };
}
const opts = { budgetMs: 1e9, now: () => 0, maxDepth: 4 };
function row(label: string, fen: string, moves: string[], trim = true) {
  const { p, prior } = replay(fen, moves, trim);
  const before = toFen(p);
  const m = M.chooseMove(parseFen(before), opts)!;
  const base = E.chooseMove(parseFen(before), opts)!;
  const r3 = E.chooseMove(parseFen(before), { ...opts, priorKeys: prior, priorRule: 3 })!;
  const r2 = E.chooseMove(parseFen(before), { ...opts, priorKeys: prior, priorRule: 2 })!;
  console.log(`${label} | root ${before} | prior ${prior.length}`);
  console.log(`   main  ${uci(m.move)} ${m.score} n=${m.nodes}`);
  console.log(`   base  ${uci(base.move)} ${base.score} n=${base.nodes}  ${base.nodes === m.nodes && base.score === m.score ? "== main" : "!= main"}`);
  console.log(`   r3    ${uci(r3.move)} ${r3.score} n=${r3.nodes}`);
  console.log(`   r2    ${uci(r2.move)} ${r2.score} n=${r2.nodes}`);
}
const KQK = "4k3/8/8/8/8/8/8/Q3K3 w - - 0 1";
const KRK_B = "4k3/8/8/8/8/8/8/R3K3 w - - 0 1";
row("H1 black losing, Ke8 would be the 3rd occurrence", KQK, ["a1a2","e8d8","a2a1","d8e8","a1a2","e8d8","a2a1"]);
row("H2 black losing, Ke8 would be the 2nd occurrence", KQK, ["a1a2","e8d8","a2a1"]);
row("H3 knights shuffle, startpos 3rd occurrence available to black", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", ["g1f3","g8f6","f3g1","f6g8","g1f3","g8f6","f3g1"]);
row("H4 identity: untrimmed prior handed in, root right after a pawn move (clock 0)", "4k3/p7/8/8/8/8/P7/Q3K3 w - - 0 1", ["a1b1","e8d8","b1a1","d8e8","a1b1","e8d8","b1a1","d8e8","a2a3"], false);
// H5: bare FEN, no moves: prior empty, all three must equal main
row("H5 bare FEN kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", []);
