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
 */

import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import {
  chooseMove,
  chooseMoveWithoutAspiration,
  chooseMoveWithoutBundle,
  chooseMoveWithoutHistory,
  type EngineChoice,
} from "./engine.ts";
import { parseFen } from "./fen.ts";
import { legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import { BLACK, PAWN, type Position, squareName } from "./position.ts";
import { MATE_CORPUS } from "./search.mate-corpus.ts";
import {
  clearHistory,
  historyByteLength,
  historyScore,
  MATE_SCORE,
  orderMoves,
  recordHistoryCutoff,
  search,
  searchWithoutBundle,
  searchWithoutHistory,
  searchWithoutSeeOrdering,
} from "./search.ts";
import { BOUND_LOWER } from "./transposition.ts";

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
      "if (alpha >= beta) { if (switches.history) recordHistoryCutoff(position, list, index - 1, depth, futile); killers.record(ply, move); break; }",
    );
    expect(engine).toContain(
      "if (alpha >= beta) { if (budget.history) recordHistoryCutoff(position, list, index - 1, remaining, futile); budget.killers.record(ply, move); break; }",
    );
    expect(search.match(/recordHistoryCutoff\(/g)).toHaveLength(2); // the declaration and negamax
    expect(engine.match(/recordHistoryCutoff\(/g)).toHaveLength(1);
    expect(search).toContain(
      "if (switches.table) clearTable(); if (switches.history) clearHistory();",
    );
    expect(engine).toContain("clearTable(); if (heuristics.history) clearHistory();");
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
      const head = deepenTo(chooseMove, fen, 4);
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
    const READ = {
      kiwipete: { fen: KIWIPETE, search: 523_847, choose: 707_548 },
      "position-6": { fen: POSITION_6, search: 234_214, choose: 101_425 },
    } as const;
    for (const [name, { fen, search: searchNodes, choose }] of Object.entries(READ)) {
      it(`${name}: search() and chooseMove at depth 8 read ${searchNodes} / ${choose}, root move and score the door's [deep, SEARCH_DEEP=1]`, () => {
        const head = search(parseFen(fen), 8);
        const door = searchWithoutBundle(parseFen(fen), 8);
        const headChoice = deepenTo(chooseMove, fen, 8);
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
}
