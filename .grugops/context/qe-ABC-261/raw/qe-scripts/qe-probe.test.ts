// qe-ABC-261 probe (QE, scratch only): spied isSquareAttackedBy counts for hasLegalMove vs the lazy list vs the full filter.
import { appendFileSync } from "node:fs";
import { expect, it, vi } from "vitest";
import { parseFen } from "./fen.ts";
vi.mock("./moves.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./moves.ts")>();
  return { ...actual, isSquareAttackedBy: vi.fn(actual.isSquareAttackedBy) };
});
import { fullHasLegalMove, hasLegalMove, isInCheck, legalMoves } from "./legal.ts";
import { generateMoves, isSquareAttackedBy } from "./moves.ts";
import { KING } from "./position.ts";
const BOARDS: [string, string][] = [
  ["B0 row board (white, king first)", "4k3/8/8/8/8/8/PPP5/4K3 w - - 0 1"],
  ["B1 mirror, black to move (pawns first)", "4k3/ppp5/8/8/8/8/8/4K3 b - - 0 1"],
  ["B2 white king e3 after a2-c2 pawns", "4k3/8/8/8/8/4K3/PPP5/8 w - - 0 1"],
  ["B3 start position", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
  ["B4 kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
];
it("probe", () => {
  const out: Record<string, unknown>[] = [];
  for (const [name, fen] of BOARDS) {
    const p = parseFen(fen);
    const pseudo = generateMoves(p);
    const count = (f: () => unknown) => { vi.mocked(isSquareAttackedBy).mockClear(); f(); return vi.mocked(isSquareAttackedBy).mock.calls.length; };
    out.push({ name, inCheck: isInCheck(p), first: pseudo[0]?.piece === KING ? "KING" : String(pseudo[0]?.piece),
      kingMoves: pseudo.filter((m) => (m.piece & 7) === KING).length,
      hasLegalMove: count(() => hasLegalMove(p)), lazyListPL3a: count(() => legalMoves(p).length > 0), fullPL1: count(() => fullHasLegalMove(p)) });
  }
  appendFileSync(process.env.QEPROBE_OUT as string, `${JSON.stringify(out)}\n`);
  expect(out.length).toBe(BOARDS.length);
});
