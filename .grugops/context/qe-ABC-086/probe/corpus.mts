// QE probe (qe-ABC-086): the shared 30 of `src/engine.test.ts` (`thirtyPositions()`), rebuilt
// here from the same FENs and the same expansion (legalMoves order, first four children, each
// round-tripped through FEN) — independent of the test file, same corpus.
import { makeMove, unmakeMove } from "../../../../src/apply.ts";
import { parseFen, toFen } from "../../../../src/fen.ts";
import { legalMoves } from "../../../../src/legal.ts";
import { squareName } from "../../../../src/position.ts";

export const ROOTS: ReadonlyArray<[string, string]> = [
  ["startpos", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],
  ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"],
  ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"],
];

export const label = (m: { from: number; to: number; promotion?: string }) =>
  `${squareName(m.from)}${squareName(m.to)}${m.promotion ?? ""}`;

export function thirty(): { name: string; fen: string }[] {
  return ROOTS.flatMap(([name, fen]) => {
    const p = parseFen(fen);
    const kids = legalMoves(p)
      .slice(0, 4)
      .map((m) => {
        const u = makeMove(p, m);
        const kid = { name: `${name}/${squareName(m.from)}${squareName(m.to)}`, fen: toFen(p) };
        unmakeMove(p, m, u);
        return kid;
      });
    return [{ name, fen }, ...kids];
  });
}
