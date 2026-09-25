/**
 * ABC-121 acceptance — principal-variation search, and the rows `ADR-0026` owes it.
 *
 * `ADR-0026` decision 8's identity chain has three links. The last one — the pre-`ABC-121` search
 * equals every older door and the unpruned search — is every merged row of `ABC-077`–`ABC-081`,
 * re-pointed at `searchWithoutPvsOrReductions` / `chooseMoveWithoutPvsOrReductions`. This file
 * holds the link `ABC-121` adds: `searchWithoutReductions` (principal-variation search on) scores
 * exactly what `searchWithoutPvsOrReductions` scores.
 *
 * THE CORPUS is the ruling's 190 positions (`.grugops/context/ruling-abc121-lmr-oracle/probe/`):
 * the six perft roots, every in-progress position one legal move from each, and `ABC-078`'s six
 * endgames. The whole pass at depth 4 cost 21 s under plain node at this build, so it runs under
 * `SEARCH_DEEP=1`; the default lane holds the six endgames and `position-3`, about 22 ms.
 */

import { describe, expect, it } from "vitest";
import { makeMove, unmakeMove } from "./apply.ts";
import { parseFen, toFen } from "./fen.ts";
import { gameStatus } from "./gameend.ts";
import { legalMoves } from "./legal.ts";
import { squareName } from "./position.ts";
import { searchWithoutPvsOrReductions, searchWithoutReductions } from "./search.ts";

const RUN_DEEP = process.env.SEARCH_DEEP === "1";

const ROOTS: ReadonlyArray<{ name: string; fen: string }> = [
  { name: "startpos", fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" },
  { name: "kiwipete", fen: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1" },
  { name: "position-3", fen: "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1" },
  { name: "position-4", fen: "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1" },
  { name: "position-5", fen: "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8" },
  {
    name: "position-6",
    fen: "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
  },
];

/** `src/engine.test.ts`'s mate- and stalemate-adjacent endgames, same FENs. */
const ENDGAMES: ReadonlyArray<{ name: string; fen: string }> = [
  { name: "kq-corner", fen: "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1" },
  { name: "kr-corner", fen: "k7/8/1K6/8/8/8/8/1R6 w - - 0 1" },
  { name: "kqk-h8", fen: "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1" },
  { name: "kp-vs-k", fen: "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1" },
  { name: "krk-a-file", fen: "8/8/8/8/8/k7/8/KR6 w - - 0 1" },
  { name: "pawn-race", fen: "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1" },
];

/** The ruling's 190: each root, then its in-progress children in generation order; then the endgames. */
function corpus(): { name: string; fen: string }[] {
  const out: { name: string; fen: string }[] = [];
  for (const { name, fen } of ROOTS) {
    out.push({ name, fen });
    const position = parseFen(fen);
    for (const move of legalMoves(position)) {
      const undo = makeMove(position, move);
      if (gameStatus(position).result === "in-progress") {
        out.push({
          name: `${name}/${squareName(move.from)}${squareName(move.to)}`,
          fen: toFen(position),
        });
      }
      unmakeMove(position, move, undo);
    }
  }
  return [...out, ...ENDGAMES];
}

/** Every position whose two scores differ at `depth`, as a readable line. */
function pvsDivergences(positions: ReadonlyArray<{ name: string; fen: string }>, depth: number) {
  const out: string[] = [];
  for (const { name, fen } of positions) {
    const pvs = searchWithoutReductions(parseFen(fen), depth).score;
    const base = searchWithoutPvsOrReductions(parseFen(fen), depth).score;
    if (pvs !== base) out.push(`${name}: ${pvs} with PVS, ${base} without`);
  }
  return out;
}

// ---------------------------------------------------------------------------
// The PVS identity link (`ADR-0026` decision 8): PVS changes the WORK and not the VALUE.
// ---------------------------------------------------------------------------

describe("PVS identity — searchWithoutReductions scores what searchWithoutPvsOrReductions scores", () => {
  it("the corpus is the ruling's 190 positions", () => {
    expect(corpus()).toHaveLength(190);
  });

  it("the six endgames and position-3 at depth 4 — the default lane's standing guard", () => {
    const positions = [...ENDGAMES, ROOTS[2] as { name: string; fen: string }];
    expect(pvsDivergences(positions, 4)).toEqual([]);
  });

  it("the default-lane guard bites: PVS really does change the work at depth 4", () => {
    // Identity of the scores means nothing if the two doors are one search. Position-3 at depth 4.
    const fen = (ROOTS[2] as { fen: string }).fen;
    expect(searchWithoutReductions(parseFen(fen), 4).nodes).not.toBe(
      searchWithoutPvsOrReductions(parseFen(fen), 4).nodes,
    );
  });

  if (RUN_DEEP) {
    it("all 190 positions at depth 4 [deep, SEARCH_DEEP=1]", () => {
      expect(pvsDivergences(corpus(), 4)).toEqual([]);
    }, 300_000);
  }
});
