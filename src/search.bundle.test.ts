/**
 * ABC-283 — the ordering bundle (the owner's word of 2026-11-04): the history table (`ADR-0063`),
 * SEE ordering of the losing captures (`ADR-0065`) and aspiration at the root (`ADR-0066`), each
 * behind its own switch and test-only door, plus one door that turns all three off.
 *
 * Default lane, cheap units only (`NFR-008`):
 * - (h) the history table: the update (+d² to a quiet cutter, -d² to each quiet move searched
 *   before it, gravity at the bound, nothing for a capture or a futility-skipped move), the order
 *   (a higher cell sorts first, every cell below both killers), the lifetime (cleared at every
 *   `search()` entry and `chooseMove` call, never written by a door), and the source rows;
 * - (s) SEE ordering: a capture below -50 sorts after both killers and before every other quiet
 *   move, a -10 trade stays with the captures, the hash move stays first, no SEE is computed with
 *   the switch off, and the source rows;
 * - (a) aspiration: iterations 1-4 are the door's node for node, a fail high is re-searched to the
 *   door's exact move and score, the door never stores a root lower bound, and the source rows.
 *
 * DEEP, `SEARCH_DEEP=1` (unset, NOT DEFINED rather than skipped): `P0`, the all-off doors' node
 * counts at depth 8 on kiwipete and position-6 equal `main`'s (`ABC-279` A4's head figures); the
 * bundle's own counts there (the instrument, information, not a bar); and the same-depth mate
 * floor on the 287 in both recursions against the all-off doors. The other `ADR-0064` d7 safety
 * rows run on the shipped path where they already stand: zugzwang 7 / 7 in
 * `src/search.null-move.test.ts` and `src/search.futility.test.ts`, `G1` in
 * `src/puzzle-suite.test.ts` (`PUZZLE_DEEP=1`). No zugzwang depth is re-pinned.
 *
 * ABC-303 — the quiet bundle (the owner's word of 2026-11-04): move-count pruning (`ADR-0072`, form
 * M3) and the countermove (`ADR-0073`, form C1), one door each plus one all-off door. Default lane,
 * direct calls only, no search above depth 2 (`ADR-0072` d7): `moveCountNode` clause by clause,
 * `moveCountFrom`, the malus, the countermove's update, read, clear, bytes and tier, the doors'
 * switches and the source rows. DEEP, `SEARCH_DEEP=1`: P0 (the ABC-283 counts above, re-pointed to
 * the all-off doors, figures unchanged), the head's counts, and the same-depth floors in both
 * recursions against the all-off doors.
 */

import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import {
  chooseMove,
  chooseMoveWithoutAspiration,
  chooseMoveWithoutBundle,
  chooseMoveWithoutCountermove,
  chooseMoveWithoutHistory,
  chooseMoveWithoutMoveCountPruning,
  chooseMoveWithoutQuietBundle,
  type EngineChoice,
} from "./engine.ts";
import { parseFen } from "./fen.ts";
import { legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import { BLACK, PAWN, type Position, squareName } from "./position.ts";
import { MATE_CORPUS } from "./search.mate-corpus.ts";
import {
  clearHistory,
  countermoveAt,
  countermoveByteLength,
  historyByteLength,
  historyScore,
  MATE_SCORE,
  moveCountFrom,
  moveCountNode,
  orderMoves,
  recordHistoryCutoff,
  search,
  searchWithoutBundle,
  searchWithoutCountermove,
  searchWithoutHistory,
  searchWithoutMoveCountPruning,
  searchWithoutQuietBundle,
  searchWithoutSeeOrdering,
} from "./search.ts";
import { BOUND_LOWER, MATE_FLOOR } from "./transposition.ts";

const RUN_DEEP = process.env.SEARCH_DEEP === "1";

/** Counts `see` calls made through the module's export: `src/search.ts`'s ordering is the only such caller. */
const seeCalls = vi.hoisted(() => ({ count: 0 }));
vi.mock("./see.ts", async (importOriginal) => {
  const real = await importOriginal<typeof import("./see.ts")>();
  return {
    ...real,
    see: (...args: Parameters<typeof real.see>) => {
      seeCalls.count++;
      return real.see(...args);
    },
  };
});

/** Every root store at ply 0 with its bound: a lower bound there is an aspiration fail high. */
const rootStores = vi.hoisted(() => ({ log: [] as { depth: number; bound: number }[] }));
vi.mock("./transposition.ts", async (importOriginal) => {
  const real = await importOriginal<typeof import("./transposition.ts")>();
  return {
    ...real,
    storeEntry: (...args: Parameters<typeof real.storeEntry>) => {
      const [, depth, bound, , ply] = args;
      if (ply === 0) rootStores.log.push({ depth, bound });
      real.storeEntry(...args);
    },
  };
});

const label = (move: Move): string => `${squareName(move.from)}${squareName(move.to)}`;
const KIWIPETE = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1";
const POSITION_6 = "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10";
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const deepenTo = (choose: typeof chooseMove, fen: string, maxDepth: number): EngineChoice =>
  choose(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth }) as EngineChoice;

/** The legal move `uci` of `position`. */
function moveOf(position: Position, uci: string): Move {
  const found = legalMoves(position).find((move) => label(move) === uci);
  if (found === undefined) throw new Error(`no legal ${uci}`);
  return found;
}

/** Every history cell, read through `historyScore`: both colours × 64 × 64, on 0x88 squares. */
function cells(): number[] {
  const out: number[] = [];
  for (const colour of [0, BLACK]) {
    for (let from = 0; from < 64; from++) {
      for (let to = 0; to < 64; to++) {
        const move = {
          from: (from >> 3) * 16 + (from & 7),
          to: (to >> 3) * 16 + (to & 7),
          piece: PAWN | colour,
        } as Move;
        out.push(historyScore(move));
      }
    }
  }
  return out;
}

const SOURCE = {
  search: readFileSync(new URL("./search.ts", import.meta.url), "utf8"),
  engine: readFileSync(new URL("./engine.ts", import.meta.url), "utf8"),
  quiescence: readFileSync(new URL("./quiescence.ts", import.meta.url), "utf8"),
};
const flat = (source: string): string =>
  source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "")
    .replace(/\s+/g, " ");

describe("ABC-283 (h) — the history table (ADR-0063 decisions 1-5)", () => {
  it("is 2 × 64 × 64 cells of 32 bits: 32 768 bytes", () => {
    expect(historyByteLength()).toBe(32_768);
  });

  it("a quiet cutoff gives +d² to the cutter and -d² to each quiet move before it; a capture cutter changes nothing", () => {
    const position = parseFen(START);
    const list = orderMoves(legalMoves(position), [], null);
    clearHistory();
    recordHistoryCutoff(position, list, 4, 3, false);
    expect(list.slice(0, 6).map((move) => historyScore(move))).toEqual([-9, -9, -9, -9, 9, 0]);
    recordHistoryCutoff(position, list, 4, 3, false);
    // Gravity: 9 + 9 - trunc(9 · 9 / 16 384) = 18; -9 - 9 - trunc(-9 · 9 / 16 384) = -18.
    expect(list.slice(0, 6).map((move) => historyScore(move))).toEqual([-18, -18, -18, -18, 18, 0]);

    const capture = parseFen("4k3/8/8/3p4/4P3/8/8/4K3 w - - 0 1");
    const captureList = orderMoves(legalMoves(capture), [], null);
    expect(label(captureList[0] as Move)).toBe("e4d5");
    clearHistory();
    recordHistoryCutoff(capture, captureList, 0, 5, false);
    // The capture cutting at index 3, behind three quiet moves: still nothing, the malus included.
    const behind = [...captureList.slice(1, 4), captureList[0] as Move, ...captureList.slice(4)];
    recordHistoryCutoff(capture, behind, 3, 5, false);
    expect(cells().filter((value) => value !== 0)).toEqual([]);
  });

  it("gravity bounds every cell to [-16 384, 16 384], with no clamp: the bound is a fixed point", () => {
    const position = parseFen(START);
    const list = orderMoves(legalMoves(position), [], null);
    clearHistory();
    for (let i = 0; i < 60; i++) recordHistoryCutoff(position, list, 1, 100, false);
    const high = historyScore(list[1] as Move);
    const low = historyScore(list[0] as Move);
    expect(high).toBeLessThanOrEqual(16_384);
    expect(high).toBeGreaterThan(16_000);
    expect(low).toBeGreaterThanOrEqual(-16_384);
    expect(low).toBeLessThan(-16_000);
    // At the bound, +b - trunc(16 384 · b / 16 384) = 0: the cell stays, it never passes it.
    for (let i = 0; i < 200; i++) recordHistoryCutoff(position, list, 1, 100, false);
    expect([historyScore(list[1] as Move), historyScore(list[0] as Move)]).toEqual([
      16_384, -16_384,
    ]);
  });

  it("at a futile node a move futility skipped gets no malus; the first move, always searched, does", () => {
    const position = parseFen(START);
    const list = orderMoves(legalMoves(position), [], null);
    clearHistory();
    recordHistoryCutoff(position, list, 4, 2, true);
    expect(list.slice(0, 5).map((move) => historyScore(move))).toEqual([-4, 0, 0, 0, 4]);
  });

  it("orders the quiet moves by max(0, cell), below both killers, ties in generation order; off, generation order", () => {
    const position = parseFen(START);
    const moves = legalMoves(position);
    const plain = orderMoves(moves, [], null).map(label);
    const list = orderMoves(moves, [], null);
    clearHistory();
    recordHistoryCutoff(position, list, 5, 2, false); // [5] +4; [0..4] -4
    recordHistoryCutoff(position, list, 7, 3, false); // [7] +9; [0..6] -9
    // Cells now: [0..4] -13, [5] 4 - 9 - trunc(4 · 9 / 16 384) = -5, [6] -9, [7] +9, the rest 0.
    expect(list.slice(0, 9).map((move) => historyScore(move))).toEqual([
      -13, -13, -13, -13, -13, -5, -9, 9, 0,
    ]);
    const killer = list[10] as Move;
    const at = (indexes: number[]): string[] => indexes.map((i) => plain[i] as string);
    // History promotes, never demotes (ADR-0063 d4, dated 2026-11-04): the negative cells key 0.
    const ordered = orderMoves(moves, [killer], null, null, true).map(label);
    expect(ordered).toEqual([
      label(killer),
      ...at([7]),
      ...at([0, 1, 2, 3, 4, 5, 6, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19]),
    ]);
    // A negative cell sorts level with a zero cell (generation order) and below every positive cell.
    const rank = (i: number): number => ordered.indexOf(plain[i] as string);
    expect([historyScore(list[6] as Move), historyScore(list[8] as Move)]).toEqual([-9, 0]);
    expect(rank(6)).toBe(rank(8) - 1);
    expect(rank(7)).toBeLessThan(Math.min(rank(0), rank(5), rank(6)));
    expect(orderMoves(moves, [killer], null).map(label)).toEqual([
      label(killer),
      ...plain.filter((_, i) => i !== 10),
    ]);
  });

  it("is cleared at every search() entry and chooseMove call, and no door writes it", () => {
    // Small rook endings at depth 5 keep the row cheap (`NFR-008`) and still make quiet cutoffs.
    const ONE = "8/k7/8/2K5/8/8/8/1R6 w - - 2 2";
    const TWO = "6k1/R7/5K2/8/8/8/8/8 w - - 2 2";
    search(parseFen(ONE), 5);
    const after = cells();
    expect(after.filter((value) => value !== 0).length).toBeGreaterThan(0);
    for (const door of [searchWithoutHistory, searchWithoutBundle]) {
      door(parseFen(TWO), 5);
      expect(cells()).toEqual(after);
    }
    for (const door of [chooseMoveWithoutHistory, chooseMoveWithoutBundle]) {
      deepenTo(door, TWO, 5);
      expect(cells()).toEqual(after);
    }
    // Depth 1 makes no cutoff below the root, so whatever the table holds after it was there at entry.
    search(parseFen(TWO), 1);
    expect(cells().filter((value) => value !== 0)).toEqual([]);
    deepenTo(chooseMove, ONE, 5);
    expect(cells().filter((value) => value !== 0).length).toBeGreaterThan(0);
    deepenTo(chooseMove, TWO, 1);
    expect(cells().filter((value) => value !== 0)).toEqual([]);
  });

  it("source: each negamax updates once, at its beta cutoff, behind the switch; the clear sits beside clearTable; quiescence never touches it", () => {
    const search = flat(SOURCE.search);
    const engine = flat(SOURCE.engine);
    expect(search).toContain(
      "if (alpha >= beta) { if (switches.history) { recordHistoryCutoff(position, list, index - 1, depth, futile, previousCut, firstSkipped); } killers.record(ply, move); break; }",
    );
    expect(engine).toContain(
      "if (alpha >= beta) { if (budget.history) { recordHistoryCutoff( position, list, index - 1, remaining, futile, previousCut, firstSkipped, ); } budget.killers.record(ply, move); break; }",
    );
    expect(search.match(/recordHistoryCutoff\(/g)).toHaveLength(3); // the declaration, the loop's cutoff, the hash move's cutoff (ADR-0077 d3 item 10)
    expect(engine.match(/recordHistoryCutoff\(/g)).toHaveLength(2); // the loop's cutoff, the hash move's cutoff
    expect(search).toContain(
      "if (prune && Math.max(alpha, hashScore) >= beta) { if (switches.history) { HASH_CUTTER[0] = hashFirst; recordHistoryCutoff(position, HASH_CUTTER, 0, depth, false, previousCut); } killers.record(ply, hashFirst); storeEntry(key, depth, boundOf(hashScore, alpha, beta), hashScore, ply, hashFirst); return hashScore; }",
    );
    expect(engine).toContain(
      "if (Math.max(alpha, hashScore) >= beta) { if (budget.history) { HASH_CUTTER[0] = hashFirst; recordHistoryCutoff(position, HASH_CUTTER, 0, remaining, false, previousCut); } budget.killers.record(ply, hashFirst); storeEntry(key, remaining, boundOf(hashScore, alpha, beta), hashScore, ply, hashFirst); return hashScore; }",
    );
    expect(search).toContain(
      "if (switches.table) clearTable(); if (switches.history) clearHistory(switches.countermove);",
    );
    expect(engine).toContain(
      "clearTable(); if (heuristics.history) clearHistory(heuristics.countermove);",
    );
    expect(SOURCE.quiescence).not.toMatch(/history/i);
    // The table is written by the gravity update and the clear only.
    expect(search.match(/HISTORY\[[^\]]*\] =/g)).toHaveLength(1);
    expect(search.match(/HISTORY\.fill\(0\)/g)).toHaveLength(1);
  });
});

describe("ABC-283 (s) — SEE orders the losing captures after the killers (ADR-0065 decisions 2-4)", () => {
  // White Qd2 can take d5 (defended by c6: 100 - 900, losing) and Bg2 can take e4 (defended by d5:
  // 320 - 330 = -10, not losing at -50).
  const FEN = "4k3/8/2p5/3p4/4n3/8/3Q2B1/4K3 w - - 0 1";

  it("a capture below -50 sorts after both killers and before every other quiet move; -10 stays a capture", () => {
    const position = parseFen(FEN);
    const moves = legalMoves(position);
    const killers = [moveOf(position, "e1f1"), moveOf(position, "d2d3")];
    const plain = orderMoves(moves, killers, null).map(label);
    expect(plain.slice(0, 4)).toEqual(["g2e4", "d2d5", "e1f1", "d2d3"]);
    const got = orderMoves(moves, killers, null, position).map(label);
    expect(got.slice(0, 4)).toEqual(["g2e4", "e1f1", "d2d3", "d2d5"]);
    expect(got.slice(4)).toEqual(plain.slice(4));
  });

  it("the hash move stays first even when it is a losing capture", () => {
    const position = parseFen(FEN);
    const hash = moveOf(position, "d2d5");
    expect(label(orderMoves(legalMoves(position), [], hash, position)[0] as Move)).toBe("d2d5");
  });

  it("with the switch off the full-width search computes no SEE; on, it does", () => {
    seeCalls.count = 0;
    searchWithoutSeeOrdering(parseFen(KIWIPETE), 2);
    searchWithoutBundle(parseFen(KIWIPETE), 2);
    deepenTo(chooseMoveWithoutBundle, KIWIPETE, 2);
    expect(seeCalls.count).toBe(0);
    search(parseFen(KIWIPETE), 2);
    expect(seeCalls.count).toBeGreaterThan(0);
  });

  it("source: every full-width call site hands the position only when seeOrdering is on", () => {
    const search = flat(SOURCE.search);
    const engine = flat(SOURCE.engine);
    expect(search.match(/switches\.seeOrdering \? position : null/g)).toHaveLength(1); // ordered()
    expect(engine.match(/budget\.seeOrdering \? position : null/g)).toHaveLength(2); // negamax, root
    expect(search).toContain("return see(position, capture) < SEE_ORDER_THRESHOLD;");
    expect(search).toContain("const SEE_ORDER_THRESHOLD = -50;");
    expect(SOURCE.quiescence).not.toMatch(/seeOrdering/);
  });
});

describe("ABC-283 (a) — aspiration at the root of chooseMove (ADR-0066 decisions 1-7)", () => {
  it("iterations 1-4 are the door's, node for node, and store no root lower bound", () => {
    for (const fen of [POSITION_6]) {
      rootStores.log = [];
      // ABC-303: re-pointed to the all-off door, the older door's own shipped side (`ADR-0072` d7).
      const head = deepenTo(chooseMoveWithoutQuietBundle, fen, 4);
      expect(rootStores.log.filter((store) => store.bound === BOUND_LOWER)).toEqual([]);
      expect(head.nodes).toBe(deepenTo(chooseMoveWithoutAspiration, fen, 4).nodes);
    }
  });

  // Rows of the 190 and the 287 where an iteration from 5 on fails high at the root (a lower bound
  // stored at ply 0 at that depth), found by a scan of both corpora at maxDepth 6 (se-ABC-283
  // notes). A non-mate jump (position-5 after Qd6) and a mate first found at iteration 5 or later
  // (`ADR-0066` decision 9): with history promoting only (ADR-0063 d4, dated 2026-11-04) the
  // KRK row's mate is first found at iteration 6, as the door finds it (se-ABC-283-k3 notes).
  for (const [what, fen, move, score, failHigh] of [
    [
      "a non-mate fail high",
      "rnbq1k1r/pp1Pbppp/2pQ4/8/2B5/8/PPP1NnPP/RNB1K2R b KQ - 2 8",
      "e7d6",
      472,
      5,
    ],
    ["a mate found at iteration 6", "8/k7/8/2K5/8/8/8/1R6 w - - 2 2", "c5c6", MATE_SCORE - 5, 6],
  ] as const) {
    it(`${what}: iteration ${failHigh} fails high and is re-searched to the door's exact move and score; the door stores no root lower bound`, () => {
      rootStores.log = [];
      const head = deepenTo(chooseMove, fen, 6);
      expect(
        rootStores.log.filter((store) => store.bound === BOUND_LOWER).map((s) => s.depth),
      ).toEqual([failHigh]);
      rootStores.log = [];
      const door = deepenTo(chooseMoveWithoutAspiration, fen, 6);
      // The door never stores a lower bound at the root: every iteration on the full window.
      expect(rootStores.log.filter((store) => store.bound === BOUND_LOWER)).toEqual([]);
      expect([label(head.move), head.score, head.depth]).toEqual([move, score, 6]);
      expect([label(door.move), door.score]).toEqual([move, score]);
    });
  }

  it("source: the window, the mate guard, the widening and the gate", () => {
    const engine = flat(SOURCE.engine);
    expect(engine).toContain("const ASPIRATION_FROM = 5;");
    expect(engine).toContain("const ASPIRATION_DELTA = 100;");
    expect(engine).toContain("const ASPIRATION_CAP = 400;");
    expect(engine).toContain(
      "heuristics.aspiration && iteration >= ASPIRATION_FROM ? aspirate(position, rootMoves, iteration, budget, rootPhase, best.score) : runIteration(position, rootMoves, iteration, budget, rootPhase, 0 - infinity, infinity);",
    );
    expect(engine).toContain("if (Math.abs(previous) >= MATE_FLOOR) {");
    expect(engine).toContain("let alpha = previous - delta; let beta = previous + delta;");
    expect(engine).toContain("delta *= 2;");
    expect(engine).toContain(
      "alpha = delta > ASPIRATION_CAP || lower <= 0 - MATE_FLOOR ? 0 - infinity : lower;",
    );
    expect(engine).toContain(
      "beta = delta > ASPIRATION_CAP || upper >= MATE_FLOOR ? infinity : upper;",
    );
    expect(engine).toContain("if (best >= betaIn) break;");
    expect(engine).toContain(
      "if (best >= betaIn) { storeEntry(rootKey, remaining, BOUND_LOWER, best, 0, bestMove); return { move: bestMove, score: best, fail: 1 }; } if (best <= alphaIn) return { move: bestMove, score: best, fail: -1 };",
    );
    expect(flat(SOURCE.search)).not.toMatch(/aspiration/);
  });
});

describe("ABC-303 (m) — move-count pruning (ADR-0072 decisions 1-4)", () => {
  // White has a rook, a knight and a bishop: three non-pawn pieces, the rule's least.
  const THREE = "4k3/8/8/8/8/8/8/RNB1K3 w - - 0 1";
  const node = (fen: string, depth = 2, ply = 3, alpha = 10, beta = 11): number =>
    moveCountNode(parseFen(fen), depth, ply, alpha, beta);

  it("T = 4 / 7 / 12 at remaining depth 1 / 2 / 3, and none at 0 or 4", () => {
    expect([0, 1, 2, 3, 4].map((depth) => node(THREE, depth))).toEqual([0, 4, 7, 12, 0]);
  });

  it("never at the root", () => {
    expect(node(THREE, 2, 0)).toBe(0);
  });

  it("only with a null window", () => {
    expect(node(THREE, 2, 3, 10, 12)).toBe(0);
  });

  it("only with alpha and beta strictly inside the mate floor", () => {
    expect(node(THREE, 2, 3, MATE_FLOOR, MATE_FLOOR + 1)).toBe(0);
    expect(node(THREE, 2, 3, MATE_FLOOR - 1, MATE_FLOOR)).toBe(0);
    expect(node(THREE, 2, 3, 0 - MATE_FLOOR, 1 - MATE_FLOOR)).toBe(0);
    expect(node(THREE, 2, 3, 0 - MATE_FLOOR - 1, 0 - MATE_FLOOR)).toBe(0);
    expect(node(THREE, 2, 3, MATE_FLOOR - 2, MATE_FLOOR - 1)).toBe(7);
    expect(node(THREE, 2, 3, 1 - MATE_FLOOR, 2 - MATE_FLOOR)).toBe(7);
  });

  it("never in check", () => {
    expect(node("4r1k1/8/8/8/8/8/8/RNB1K3 w - - 0 1")).toBe(0);
  });

  it("needs three non-pawn pieces of the side to move: pawns, the king and the other side's pieces do not count", () => {
    expect(node("4k3/8/8/8/8/8/8/RN2K3 w - - 0 1")).toBe(0);
    expect(node("4k3/pppp4/8/8/8/8/PPPP4/RN2K3 w - - 0 1")).toBe(0);
    expect(node("rnb1k3/8/8/8/8/8/8/R3K3 w - - 0 1")).toBe(0);
    expect(node("rnb1k3/8/8/8/8/8/8/R3K3 b - - 0 1")).toBe(7);
  });

  it("moveCountFrom is the first key-0 index straight after the sort, and the count when no key is 0", () => {
    const position = parseFen(START);
    const moves = legalMoves(position);
    const list = orderMoves(moves, [], null);
    expect(moveCountFrom(list.length)).toBe(0);
    clearHistory();
    recordHistoryCutoff(position, list, 5, 2, false);
    orderMoves(moves, [list[9] as Move], null, null, true);
    expect(moveCountFrom(moves.length)).toBe(2); // the killer and the one positive cell
    const single = parseFen("k7/8/8/8/8/8/1q6/K7 w - - 0 1");
    const forced = orderMoves(legalMoves(single), [], null);
    expect(forced.map(label)).toEqual(["a1b2"]);
    expect(moveCountFrom(forced.length)).toBe(1);
  });

  it("the malus: from the first skipped index a move the rule skipped keeps its cell; a checking move, searched, does not", () => {
    const position = parseFen("4k3/8/8/8/8/8/8/R2QK3 w - - 0 1");
    const uci = ["a1a2", "a1a3", "a1a4", "d1e2", "e1f1", "a1a8"]; // d1e2 and a1a8 give check
    const list = uci.map((move) => moveOf(position, move));
    clearHistory();
    recordHistoryCutoff(position, list, 5, 2, false, null, 2);
    expect(list.map((move) => historyScore(move))).toEqual([-4, -4, 0, -4, 0, 4]);
    clearHistory();
    recordHistoryCutoff(position, list, 5, 2, false);
    expect(list.map((move) => historyScore(move))).toEqual([-4, -4, -4, -4, -4, 4]);
  });

  it("source: both recursions read the node test and the tail once, skip by the move test, and keep the index", () => {
    const limit = "const zeroFrom = moveLimit > 0 ? moveCountFrom(list.length) : 0;";
    const skip =
      "if (moveLimit > 0) { if (searchedQuiets >= moveLimit && index >= zeroFrom && futileMove(position, move, index)) { if (firstSkipped === -1) firstSkipped = index; index++; continue; } if (move.captured === EMPTY && move.promotion === EMPTY) searchedQuiets++; }";
    const search = flat(SOURCE.search);
    const engine = flat(SOURCE.engine);
    expect(search).toContain(
      `const moveLimit = switches.moveCount ? moveCountNode(position, depth, ply, alphaIn, beta) : 0; ${limit}`,
    );
    expect(engine).toContain(
      `const moveLimit = budget.moveCount ? moveCountNode(position, remaining, ply, alphaIn, beta) : 0; ${limit}`,
    );
    expect(search).toContain(skip);
    expect(engine).toContain(skip);
    expect(search).toContain("const MOVE_COUNT_LIMIT: readonly number[] = [0, 4, 7, 12];");
  });
});

describe("ABC-303 (c) — the countermove (ADR-0073 decisions 1-6)", () => {
  const packed = (move: Move): number => move.from * 128 + move.to + 1;
  // Black's reply a7a6 stands as the previous move of a white node.
  const REPLY = parseFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1");
  const previous = moveOf(REPLY, "a7a6");

  it("is 12 × 64 cells of 32 bits: 3 072 bytes", () => {
    expect(countermoveByteLength()).toBe(3_072);
  });

  it("a quiet cutter overwrites the previous move's cell; a capture cutter, or no previous move, writes nothing", () => {
    const position = parseFen(START);
    const list = orderMoves(legalMoves(position), [], null);
    clearHistory(true);
    recordHistoryCutoff(position, list, 4, 3, false, previous);
    expect(countermoveAt(previous)).toBe(packed(list[4] as Move));
    recordHistoryCutoff(position, list, 7, 3, false, previous);
    expect(countermoveAt(previous)).toBe(packed(list[7] as Move));

    const capture = parseFen("4k3/8/8/3p4/4P3/8/8/4K3 w - - 0 1");
    const captures = orderMoves(legalMoves(capture), [], null);
    recordHistoryCutoff(capture, captures, 0, 3, false, previous);
    expect(countermoveAt(previous)).toBe(packed(list[7] as Move));
    clearHistory(true);
    recordHistoryCutoff(position, list, 4, 3, false, null);
    expect(countermoveAt(previous)).toBe(0);
  });

  it("the read keys on the coloured piece and the to-square: a different piece, colour or square is another cell", () => {
    const position = parseFen(START);
    const list = orderMoves(legalMoves(position), [], null);
    clearHistory(true);
    recordHistoryCutoff(position, list, 4, 3, false, previous);
    // The same square by the other colour, and by another piece; the same piece on another square.
    for (const other of [
      { ...previous, piece: previous.piece ^ BLACK },
      { ...previous, piece: previous.piece + 1 },
      { ...previous, to: previous.to - 16 },
    ]) {
      expect(countermoveAt(other as Move)).toBe(0);
    }
    expect(countermoveAt({ ...previous, from: previous.from + 1 } as Move)).toBe(
      packed(list[4] as Move),
    );
  });

  it("is cleared at every search() entry and chooseMove call with the switch on; a door with it off leaves the table", () => {
    const position = parseFen(START);
    const list = orderMoves(legalMoves(position), [], null);
    const seed = (): void => recordHistoryCutoff(position, list, 4, 3, false, previous);
    const cell = packed(list[4] as Move);
    const ONE = "8/k7/8/2K5/8/8/8/1R6 w - - 2 2";
    seed();
    clearHistory();
    expect(countermoveAt(previous)).toBe(cell);
    for (const door of [searchWithoutCountermove, searchWithoutQuietBundle, searchWithoutBundle]) {
      door(parseFen(ONE), 1);
      expect(countermoveAt(previous)).toBe(cell);
    }
    for (const door of [chooseMoveWithoutCountermove, chooseMoveWithoutQuietBundle]) {
      deepenTo(door, ONE, 1);
      expect(countermoveAt(previous)).toBe(cell);
    }
    search(parseFen(ONE), 1);
    expect(countermoveAt(previous)).toBe(0);
    seed();
    searchWithoutMoveCountPruning(parseFen(ONE), 1);
    expect(countermoveAt(previous)).toBe(0);
    seed();
    deepenTo(chooseMove, ONE, 1);
    expect(countermoveAt(previous)).toBe(0);
    seed();
    deepenTo(chooseMoveWithoutMoveCountPruning, ONE, 1);
    expect(countermoveAt(previous)).toBe(0);
  });

  it("the tier: after both killers, above the losing captures and every history cell; a higher tier keeps its place", () => {
    const position = parseFen("4k3/8/2p5/3p4/4n3/8/3Q2B1/4K3 w - - 0 1");
    const moves = legalMoves(position);
    const killers = [moveOf(position, "e1f1"), moveOf(position, "d2d3")];
    const plain = orderMoves(moves, killers, null, position, true).map(label);
    expect(plain.slice(0, 4)).toEqual(["g2e4", "e1f1", "d2d3", "d2d5"]);
    const counter = moveOf(position, "g2f3");
    clearHistory();
    recordHistoryCutoff(position, [moveOf(position, "g2h3")], 0, 9, false); // a positive cell
    const got = orderMoves(moves, killers, null, position, true, packed(counter)).map(label);
    expect(got.slice(0, 6)).toEqual(["g2e4", "e1f1", "d2d3", "g2f3", "d2d5", "g2h3"]);
    // A killer or the hash move named as the countermove keeps its tier; one not in the list adds nothing.
    const list = (hash: Move | null, cm: number): string[] =>
      orderMoves(moves, killers, hash, position, true, cm).map(label);
    expect(list(null, packed(killers[1] as Move))).toEqual(list(null, 0));
    expect(list(counter, packed(counter))).toEqual(list(counter, 0));
    expect(list(null, 1)).toEqual(list(null, 0));
    expect(list(null, 0)).toEqual(orderMoves(moves, killers, null, position, true).map(label));
  });

  it("source: the cell is read behind the switch, nothing at the root or after a null move; one write, one clear", () => {
    const search = flat(SOURCE.search);
    const engine = flat(SOURCE.engine);
    expect(search).toContain("const previousCut = switches.countermove ? previous : null;");
    expect(engine).toContain("const previousCut = budget.countermove ? previous : null;");
    expect(search).toContain(
      "const countermove = previousCut === null ? 0 : countermoveAt(previousCut);",
    );
    expect(engine).toContain("previousCut === null ? 0 : countermoveAt(previousCut),");
    expect(search).toContain("ordered(position, moves, 0, switches, killers, hashMove, 0);");
    expect(search).toContain("keys, true, phase, null, );");
    expect(engine).toContain("budget, true, phase, null, );");
    expect(search).toContain("const COUNTERMOVE_KEY = 400_000;");
    expect(search.match(/COUNTERMOVE\[[^\]]*\] =/g)).toHaveLength(1);
    expect(search.match(/COUNTERMOVE\.fill\(0\)/g)).toHaveLength(1);
    expect(SOURCE.quiescence).not.toMatch(/countermove/i);
  });
});

describe("ABC-303 — the doors (ADR-0072 decision 6, ADR-0073 decision 7)", () => {
  const record = (source: string, door: string): string => {
    const from = source.indexOf(`export function ${door}(`);
    return source.slice(from, source.indexOf("\n}\n", from));
  };
  for (const [door, moveCount, countermove] of [
    ["search", true, true],
    ["searchWithoutMoveCountPruning", false, true],
    ["searchWithoutCountermove", true, false],
    ["searchWithoutQuietBundle", false, false],
    ["chooseMove", true, true],
    ["chooseMoveWithoutMoveCountPruning", false, true],
    ["chooseMoveWithoutCountermove", true, false],
    ["chooseMoveWithoutQuietBundle", false, false],
  ] as const) {
    it(`${door}: moveCount ${moveCount}, countermove ${countermove}, everything older as shipped`, () => {
      const source = door.startsWith("search") ? SOURCE.search : SOURCE.engine;
      const shipped = door.startsWith("search") ? "search" : "chooseMove";
      const older = (text: string): string =>
        text.slice(text.indexOf("{\n")).replace(/ {4}(moveCount|countermove): \w+,\n/g, "");
      const body = record(source, door);
      expect(body).toContain(`moveCount: ${moveCount},`);
      expect(body).toContain(`countermove: ${countermove},`);
      expect(older(body)).toBe(older(record(source, shipped)));
    });
  }

  it("every other door in both modules turns both parts off", () => {
    for (const source of [SOURCE.search, SOURCE.engine]) {
      const doors = source.match(/export function (searchWithout|chooseMoveWithout)\w+/g) ?? [];
      expect(doors.length).toBeGreaterThan(10);
      for (const found of doors) {
        const name = found.replace("export function ", "");
        if (/MoveCountPruning|Countermove/.test(name)) continue;
        expect(`${name} ${record(source, name).match(/moveCount: \w+|countermove: \w+/g)}`).toBe(
          `${name} moveCount: false,countermove: false`,
        );
      }
    }
  });
});

if (RUN_DEEP) {
  describe("ABC-283 P0 — the all-off doors are main, node for node, at depth 8 [deep, SEARCH_DEEP=1]", () => {
    // `main` `09694a4e`'s search() and chooseMove (`ABC-279` A4's head figures).
    const MAIN = {
      kiwipete: { fen: KIWIPETE, search: 605_117, choose: 766_275 },
      "position-6": { fen: POSITION_6, search: 406_787, choose: 87_475 },
    } as const;
    for (const [name, { fen, search: searchNodes, choose }] of Object.entries(MAIN)) {
      it(`${name}: searchWithoutBundle and chooseMoveWithoutBundle at depth 8 read main's ${searchNodes} / ${choose} [deep, SEARCH_DEEP=1]`, () => {
        expect(searchWithoutBundle(parseFen(fen), 8).nodes).toBe(searchNodes);
        expect(deepenTo(chooseMoveWithoutBundle, fen, 8).nodes).toBe(choose);
      }, 300_000);
    }
  });

  describe("ABC-283 — the bundle's own counts at depth 8 (the instrument: information, not a bar) [deep, SEARCH_DEEP=1]", () => {
    // With history promoting only (ADR-0063 d4, dated 2026-11-04): arch-ABC-283-mate R3's figures.
    // ABC-303: re-pointed to the all-off doors, figures unchanged: these are ABC-303's P0 counts.
    const READ = {
      kiwipete: { fen: KIWIPETE, search: 523_847, choose: 707_548 },
      "position-6": { fen: POSITION_6, search: 234_214, choose: 101_425 },
    } as const;
    for (const [name, { fen, search: searchNodes, choose }] of Object.entries(READ)) {
      it(`${name}: search() and chooseMove at depth 8 read ${searchNodes} / ${choose}, root move and score the door's [deep, SEARCH_DEEP=1]`, () => {
        const head = searchWithoutQuietBundle(parseFen(fen), 8);
        const door = searchWithoutBundle(parseFen(fen), 8);
        const headChoice = deepenTo(chooseMoveWithoutQuietBundle, fen, 8);
        const doorChoice = deepenTo(chooseMoveWithoutBundle, fen, 8);
        console.log(
          `ABC-283 ${name} d8: search() ${head.nodes} / ${door.nodes} = ${(head.nodes / door.nodes).toFixed(4)}x, ` +
            `chooseMove ${headChoice.nodes} / ${doorChoice.nodes} = ${(headChoice.nodes / doorChoice.nodes).toFixed(4)}x`,
        );
        expect([head.nodes, headChoice.nodes]).toEqual([searchNodes, choose]);
        expect([label(head.move as Move), head.score]).toEqual([
          label(door.move as Move),
          door.score,
        ]);
        expect([label(headChoice.move), headChoice.score]).toEqual([
          label(doorChoice.move),
          doorChoice.score,
        ]);
      }, 300_000);
    }
  });

  describe("ABC-283 — the same-depth mate floor on the 287, both recursions, against the all-off doors [deep, SEARCH_DEEP=1]", () => {
    const isMate = (score: number): boolean => Math.abs(score) > MATE_SCORE - 1_000;
    for (const [what, head, door] of [
      [
        "search()",
        (fen: string) => search(parseFen(fen), 5).score,
        (fen: string) => searchWithoutBundle(parseFen(fen), 5).score,
      ],
      [
        "chooseMove",
        (fen: string) => deepenTo(chooseMove, fen, 5).score,
        (fen: string) => deepenTo(chooseMoveWithoutBundle, fen, 5).score,
      ],
    ] as const) {
      it(`every mate the door scores at depth 5, ${what} scores as a mate of the same sign at depth 5 [deep, SEARCH_DEEP=1]`, () => {
        let mates = 0;
        const violations: string[] = [];
        for (const fen of MATE_CORPUS) {
          const ref = door(fen);
          if (!isMate(ref)) continue;
          mates++;
          const got = head(fen);
          if (!isMate(got) || Math.sign(got) !== Math.sign(ref))
            violations.push(`${fen}: ${ref} -> ${got}`);
        }
        console.log(`ABC-283 mate floor ${what} d5: ${violations.length} of ${mates} violated`);
        expect(mates).toBeGreaterThanOrEqual(100);
        expect(violations).toEqual([]);
      }, 600_000);
    }
  });

  describe("ABC-303 — the bundle's own counts at depth 8 (the instrument: R7, information, not a bar) [deep, SEARCH_DEEP=1]", () => {
    // arch-bundle-1's probe of C1+M3 on `0cc9afd1`, reproduced by the build.
    const READ = {
      kiwipete: { fen: KIWIPETE, search: 311_546, choose: 573_518 },
      "position-6": { fen: POSITION_6, search: 163_523, choose: 94_911 },
    } as const;
    for (const [name, { fen, search: searchNodes, choose }] of Object.entries(READ)) {
      it(`${name}: search() and chooseMove at depth 8 read ${searchNodes} / ${choose} [deep, SEARCH_DEEP=1]`, () => {
        expect(search(parseFen(fen), 8).nodes).toBe(searchNodes);
        expect(deepenTo(chooseMove, fen, 8).nodes).toBe(choose);
      }, 300_000);
    }
  });

  describe("ABC-303 — the same-depth mate floor on the 287, both recursions, against the all-off doors [deep, SEARCH_DEEP=1]", () => {
    const isMate = (score: number): boolean => Math.abs(score) > MATE_SCORE - 1_000;
    for (const [what, head, door] of [
      [
        "search()",
        (fen: string) => search(parseFen(fen), 5).score,
        (fen: string) => searchWithoutQuietBundle(parseFen(fen), 5).score,
      ],
      [
        "chooseMove",
        (fen: string) => deepenTo(chooseMove, fen, 5).score,
        (fen: string) => deepenTo(chooseMoveWithoutQuietBundle, fen, 5).score,
      ],
    ] as const) {
      it(`every mate the door scores at depth 5, ${what} scores as a mate of the same sign at depth 5 [deep, SEARCH_DEEP=1]`, () => {
        let mates = 0;
        const violations: string[] = [];
        for (const fen of MATE_CORPUS) {
          const ref = door(fen);
          if (!isMate(ref)) continue;
          mates++;
          const got = head(fen);
          if (!isMate(got) || Math.sign(got) !== Math.sign(ref))
            violations.push(`${fen}: ${ref} -> ${got}`);
        }
        console.log(`ABC-303 mate floor ${what} d5: ${violations.length} of ${mates} violated`);
        expect(mates).toBeGreaterThanOrEqual(100);
        expect(violations).toEqual([]);
      }, 600_000);
    }
  });
}

// ---------------------------------------------------------------------------
// ABC-298 SG1 (a) (`ADR-0077` d6): the shipped path at QE's frozen figures (qe-ABC-298-freeze,
// `sg1a.jsonl`, on `main` `69a8abf6`, `src/` tree `bba42fb7`). V3 is node-identical, so every
// figure is `main`'s: nodes, root move and score, and for `chooseMove` the depth reached and the
// clock reads. The depth-8 node counts are the ABC-303 rows above, unchanged; depths 9 and 10 are
// new. Every row leaves the position byte-identical.
// ---------------------------------------------------------------------------

if (RUN_DEEP) {
  describe("ABC-298 SG1 (a) — the shipped path equals the freeze, node for node [deep, SEARCH_DEEP=1]", () => {
    const state = (position: Position): string =>
      [
        position.board.join(","),
        position.blackToMove,
        position.castling,
        position.epSquare,
        position.halfmoveClock,
        position.fullmoveNumber,
      ].join("|");
    const SEARCH_ROWS = [
      ["kiwipete", KIWIPETE, 311_546, "e2a6", -81],
      ["position-6", POSITION_6, 163_523, "c3d5", 71],
    ] as const;
    for (const [name, fen, nodes, move, score] of SEARCH_ROWS) {
      it(`search() ${name} at depth 8: ${nodes} nodes, ${move}, ${score} [deep, SEARCH_DEEP=1]`, () => {
        const position = parseFen(fen);
        const before = state(position);
        const result = search(position, 8);
        expect([result.nodes, label(result.move as Move), result.score]).toEqual([
          nodes,
          move,
          score,
        ]);
        expect(state(position)).toBe(before);
      }, 300_000);
    }
    const CHOOSE_ROWS = [
      ["kiwipete", KIWIPETE, 8, 573_518, "e2a6", -114, 568],
      ["kiwipete", KIWIPETE, 9, 1_320_857, "e2a6", -128, 1_299],
      ["position-6", POSITION_6, 8, 94_911, "c3d5", 45, 102],
      ["position-6", POSITION_6, 9, 234_984, "c3d5", 34, 240],
      ["position-6", POSITION_6, 10, 523_610, "c3d5", 64, 523],
    ] as const;
    for (const [name, fen, depth, nodes, move, score, reads] of CHOOSE_ROWS) {
      it(`chooseMove ${name} at maxDepth ${depth}: ${nodes} nodes, ${move}, ${score}, ${reads} clock reads [deep, SEARCH_DEEP=1]`, () => {
        const position = parseFen(fen);
        const before = state(position);
        let clockReads = 0;
        const choice = chooseMove(position, {
          budgetMs: 1e9,
          now: () => {
            clockReads++;
            return 0;
          },
          maxDepth: depth,
        }) as EngineChoice;
        expect([choice.depth, choice.nodes, label(choice.move), choice.score, clockReads]).toEqual([
          depth,
          nodes,
          move,
          score,
          reads,
        ]);
        expect(state(position)).toBe(before);
      }, 300_000);
    }
  });
}
