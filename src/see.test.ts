/**
 * ABC-279 `A1` — the static exchange evaluator and quiescence's losing-capture rule (`ADR-0069`
 * decisions 1-4, 6, 10). Default lane, no full-width search: `see` and `isLosingCapture` called
 * directly, and `quiesce` called directly at one node.
 *
 * - (a) `HAND`: hand-checked exchanges, each with its hand value and the swap written beside it,
 *   x-rays on both sides, both colours to move — the ADR's six rows first. `HANGING_CORPUS`'s 24
 *   losing moves are each `see < 0` and LOSING.
 * - (b) The losing test's truth table, called directly.
 * - (c) The source rows: with `seePruning` on, `quiesce` searches exactly the sorted list less the
 *   moves `isLosingCapture` names, only on the stand-pat branch; a caller's own record does not opt in.
 * - (d) The in-check row: a losing capture among the evasions is searched.
 * - (e) Purity and memory: the board is byte-identical after `see`; the scratch is 288 bytes.
 *
 * DEEP, `SEARCH_DEEP=1` (`N8-LANE`; unset, these cases are NOT DEFINED rather than skipped): `A3`
 * (a) the depth-5 drift on the 190 in both recursions against the doors, (b) the same-depth mate
 * floor on the 287, and `A4` (a) depth 8 on kiwipete and position-6 in both recursions with the
 * instrument's exact counts, (b) the reach at 47 000 nodes on the 190. Each row is deterministic:
 * a fixed depth, or `chooseMove` on a frozen clock with `maxDepth` or `maxNodes`. `A3` (c), the
 * zugzwang bar, is `ADR-0050` decision 9's seven rows, which `src/search.null-move.test.ts` runs on
 * the shipped `chooseMove` at their recorded depths; no depth is re-pinned.
 */

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { makeMove, unmakeMove } from "./apply.ts";
import { chooseMove, chooseMoveWithoutSeePruning, type EngineChoice } from "./engine.ts";
import { evaluateAtPhase, phaseOf } from "./evaluate.ts";
import { parseFen, toFen } from "./fen.ts";
import { gameStatus } from "./gameend.ts";
import { isInCheck, legalCapturesAndQueenPromotions, legalMoves } from "./legal.ts";
import { FLAG_EN_PASSANT, type Move } from "./moves.ts";
import { KING, PAWN, type Position, squareName } from "./position.ts";
import { HANGING_CORPUS } from "./puzzle-corpus.ts";
import { orderCaptures, type QuiescenceRules, quiesce } from "./quiescence.ts";
import { MATE_CORPUS } from "./search.mate-corpus.ts";
import { MATE_SCORE, search, searchWithoutSeePruning } from "./search.ts";
import * as seeModule from "./see.ts";
import { isLosingCapture, see, seeScratchByteLength } from "./see.ts";

const label = (move: Move): string => `${squareName(move.from)}${squareName(move.to)}`;

/** The legal move `uci` of `position`, promotions to a queen only. */
function moveOf(position: Position, uci: string): Move {
  const found = legalMoves(position).find(
    (move) => label(move) === uci && (move.promotion === 0 || move.promotion === 5),
  );
  if (found === undefined) throw new Error(`no legal ${uci} in ${toFen(position)}`);
  return found;
}

/**
 * `A1` (a). Values: P 100, N 320, B 330, R 500, Q 900, K 20 000. The swap reads each capture with
 * the running total for the side to move at the root; the hand value is the fold, each side free
 * to stop when going on loses.
 */
const HAND = [
  // The ADR's six rows (`ADR-0069` § Context, `ADR-0065`'s corrected R×R row).
  {
    name: "R×P undefended",
    fen: "1k1r4/1pp4p/p7/4p3/8/P5P1/1PP4P/2K1R3 w - - 0 1",
    move: "e1e5",
    value: 100,
  }, // +100, nothing recaptures
  {
    name: "N×P, x-rays both sides (CPW)",
    fen: "1k1r3q/1ppn3p/p4b2/4p3/8/P2N2P1/1PP1R1BP/2K1Q3 w - - 0 1",
    move: "d3e5",
    value: -220,
  }, // +100, N×N −320: White stops, −220
  {
    name: "Q×P defended by P",
    fen: "4k3/8/3p4/4p3/8/8/8/4QK2 w - - 0 1",
    move: "e1e5",
    value: -800,
  }, // +100, P×Q −900
  {
    name: "R×R, R recaptures, Q x-ray, K takes Q",
    fen: "3rk3/3r4/8/8/8/8/3R4/3QK3 w - - 0 1",
    move: "d2d7",
    value: 0,
  }, // +500, R×R −500; Q×R would lose the queen to K×Q: stop at 0
  { name: "N×N defended by P", fen: "4k3/8/4p3/3n4/8/4N3/8/4K3 w - - 0 1", move: "e3d5", value: 0 }, // +320, P×N −320
  {
    name: "B×N defended by P",
    fen: "4k3/8/4p3/3n4/8/8/6B1/4K3 w - - 0 1",
    move: "g2d5",
    value: -10,
  }, // +320, P×B −330
  // Hand rows added by ABC-279.
  { name: "P×N undefended", fen: "4k3/8/8/3n4/4P3/8/8/4K3 w - - 0 1", move: "e4d5", value: 320 }, // +320
  {
    name: "R×P, R recaptures, White's R x-ray",
    fen: "3rk3/8/8/3p4/8/8/3R4/3RK3 w - - 0 1",
    move: "d2d5",
    value: 100,
  }, // +100, R×R −500, R×R +500: +100
  {
    name: "R×P, x-rays both sides (R behind R, Q behind R)",
    fen: "3qk3/3r4/8/3p4/8/8/3R4/3RK3 w - - 0 1",
    move: "d2d5",
    value: -400,
  }, // +100, R×R −400, R×R +100, Q×R −400
  {
    name: "B×P defended by P, Q x-ray behind B",
    fen: "4k3/8/2p5/3p4/8/8/6B1/4K2Q w - - 0 1",
    move: "g2d5",
    value: -130,
  }, // +100, P×B −230, Q×P −130
  { name: "P×P defended by P", fen: "4k3/8/4p3/3p4/4P3/8/8/4K3 w - - 0 1", move: "e4d5", value: 0 }, // +100, P×P 0
  { name: "Q×R undefended", fen: "4k3/8/8/3r4/8/8/8/3QK3 w - - 0 1", move: "d1d5", value: 500 }, // +500
  {
    name: "R×N defended by B, White's R x-ray",
    fen: "4k3/8/8/2b5/3n4/8/3R4/3RK3 w - - 0 1",
    move: "d2d4",
    value: 150,
  }, // +320, B×R −180, R×B +150
  {
    name: "Q×P defended by the king",
    fen: "4k3/3p4/8/8/8/8/8/3QK3 w - - 0 1",
    move: "d1d7",
    value: -800,
  }, // +100, K×Q −800
  {
    name: "Q×P, the king may not recapture: R x-ray behind Q",
    fen: "4k3/3p4/8/8/8/8/3Q4/3RK3 w - - 0 1",
    move: "d2d7",
    value: 100,
  }, // +100; K×Q then R×K: Black stops
  {
    name: "Black R×P defended by P",
    fen: "3rk3/8/8/8/3P4/2P5/8/4K3 b - - 0 1",
    move: "d8d4",
    value: -400,
  }, // +100, P×R −400
  {
    name: "Black R×P, R recaptures, Black's Q x-ray",
    fen: "3qk3/3r4/8/8/3P4/8/8/3RK3 b - - 0 1",
    move: "d7d4",
    value: 100,
  }, // +100, R×R −400, Q×R +100
  {
    name: "N×P defended twice by P, two knights",
    fen: "4k3/8/3p1p2/4p3/2N5/5N2/8/4K3 w - - 0 1",
    move: "f3e5",
    value: -220,
  }, // +100, P×N −220; N×P −120, P×N −440: stop at −220
  {
    name: "P×Q defended by P",
    fen: "4k3/8/2p5/3q4/4P3/8/8/4K3 w - - 0 1",
    move: "e4d5",
    value: 800,
  }, // +900, P×P −100
  {
    name: "Q×P defended by P, R x-ray behind Q",
    fen: "4k3/8/2p5/3p4/8/8/3Q4/3RK3 w - - 0 1",
    move: "d2d5",
    value: -700,
  }, // +100, P×Q −800, R×P −700
  {
    name: "N×P defended by B, Black's Q x-ray behind B",
    fen: "6qk/5b2/8/3p4/8/2N5/8/3RK3 w - - 0 1",
    move: "c3d5",
    value: -220,
  }, // +100, B×N −220, R×B +110, Q×R −390: stop at −220
  {
    name: "Black Q×P, the king may not recapture: R x-ray behind Q",
    fen: "3rk3/3q4/8/8/8/8/3P4/4K3 b - - 0 1",
    move: "d7d2",
    value: 100,
  }, // +100; K×Q then R×K: White stops
  { name: "N×B defended by R", fen: "3rk3/8/8/3b4/8/2N5/8/4K3 w - - 0 1", move: "c3d5", value: 10 }, // +330, R×N +10
] as const;

describe("ABC-279 A1 (a) — see equals the hand value on every committed exchange", () => {
  it("the fixture holds at least 20 rows, with x-rays on both sides", () => {
    expect(HAND.length).toBeGreaterThanOrEqual(20);
  });

  for (const row of HAND) {
    it(`${row.name}: ${row.move} reads ${row.value}`, () => {
      const position = parseFen(row.fen);
      expect(see(position, moveOf(position, row.move))).toBe(row.value);
    });
  }

  it("HANGING_CORPUS: each of the 24 losing moves reads see < 0 and is LOSING", () => {
    expect(HANGING_CORPUS).toHaveLength(24);
    const notLosing: string[] = [];
    for (const row of HANGING_CORPUS) {
      const position = parseFen(row.fen);
      const move = moveOf(position, row.losing);
      if (!(see(position, move) < 0 && isLosingCapture(position, move))) notLosing.push(row.name);
    }
    expect(notLosing).toEqual([]);
  });
});

describe("ABC-279 A1 (b) — the losing test, called directly (ADR-0069 decision 2)", () => {
  // Only the king clause can meet a negative `see` on its own: the fold gives
  // `see >= victim - attacker`, so a capture of an equal or bigger piece, en passant (P×P) and a
  // capturing promotion (a pawn mover) never read below 0. Each such row stands on a defended
  // square, and its `see` is pinned beside the verdict.
  it("a king capture is never losing, though see alone reads it as losing (K×P onto a defended square)", () => {
    // Not a legal move — the king may not step into the rook's file — built by hand, which is
    // exactly the case the clause exists for: see would charge the king's 20 000.
    const position = parseFen("3rk3/8/8/8/8/8/3p4/4K3 w - - 0 1");
    const move: Move = {
      from: 0x04,
      to: 0x13,
      piece: KING,
      captured: PAWN | 8,
      flags: 0,
      promotion: 0,
    };
    expect(see(position, move)).toBe(-19_900);
    expect(isLosingCapture(position, move)).toBe(false);
  });

  it("a capturing promotion onto a defended square is never losing", () => {
    const position = parseFen("r3k3/1P6/1n6/8/8/8/8/4K3 w - - 0 1");
    const move = moveOf(position, "b7a8"); // b×a8=Q +500, N×a8 −100 (see counts the pawn): 400
    expect(move.promotion).not.toBe(0);
    expect(see(position, move)).toBe(400);
    expect(isLosingCapture(position, move)).toBe(false);
  });

  it("en passant onto a defended square is never losing", () => {
    const position = parseFen("4k3/2p5/8/3pP3/8/8/8/4K3 w - d6 0 1");
    const move = moveOf(position, "e5d6");
    expect(move.flags & FLAG_EN_PASSANT).not.toBe(0);
    expect(see(position, move)).toBe(0);
    expect(isLosingCapture(position, move)).toBe(false);
  });

  it("a capture of an equal or bigger piece onto a defended square is never losing", () => {
    const rr = parseFen("3rk3/3r4/8/8/8/8/3R4/4K3 w - - 0 1"); // R×R, R recaptures
    expect(see(rr, moveOf(rr, "d2d7"))).toBe(0);
    expect(isLosingCapture(rr, moveOf(rr, "d2d7"))).toBe(false);
    const nb = parseFen("3rk3/8/8/3b4/8/2N5/8/4K3 w - - 0 1"); // N×B, R recaptures
    expect(isLosingCapture(nb, moveOf(nb, "c3d5"))).toBe(false);
  });

  it("true for Q×P defended by a pawn (−800) and B×N defended by a pawn (−10); false for N×N defended (0)", () => {
    const qp = parseFen("4k3/8/3p4/4p3/8/8/8/4QK2 w - - 0 1");
    expect(isLosingCapture(qp, moveOf(qp, "e1e5"))).toBe(true);
    const bn = parseFen("4k3/8/4p3/3n4/8/8/6B1/4K3 w - - 0 1");
    expect(isLosingCapture(bn, moveOf(bn, "g2d5"))).toBe(true);
    const nn = parseFen("4k3/8/4p3/3n4/8/4N3/8/4K3 w - - 0 1");
    expect(isLosingCapture(nn, moveOf(nn, "e3d5"))).toBe(false);
  });

  it("a quiet move is never losing, even onto a square a pawn attacks", () => {
    const position = parseFen("3k4/8/3p4/8/8/8/8/4QK2 w - - 0 1");
    expect(isLosingCapture(position, moveOf(position, "e1e5"))).toBe(false);
  });
});

/** The rules records `quiesce` is handed below: the shipped one, and one built without the field. */
const SEE_PRUNING: QuiescenceRules = {
  evasions: true,
  quietPromotions: true,
  taper: true,
  seePruning: true,
};
const OWN_RECORD: QuiescenceRules = { evasions: true, quietPromotions: true, taper: true };

/**
 * The FENs of the children a full-window `quiesce` at `qply` 0 enters, in the order it enters
 * them. The visitor reads the position after each move is made; only qply 1 is recorded.
 */
function childrenSearched(fen: string, rules: QuiescenceRules): string[] {
  const position = parseFen(fen);
  const seen: string[] = [];
  quiesce(
    position,
    Number.NEGATIVE_INFINITY,
    Number.POSITIVE_INFINITY,
    0,
    0,
    rules,
    (qply) => {
      if (qply === 1) seen.push(toFen(position));
    },
    phaseOf(position),
  );
  return seen;
}

/** The FENs after each of `moves`, in order. */
function childrenOf(fen: string, moves: readonly Move[]): string[] {
  const position = parseFen(fen);
  return moves.map((move) => {
    const undo = makeMove(position, move);
    const child = toFen(position);
    unmakeMove(position, move, undo);
    return child;
  });
}

/** Out-of-check nodes with losing captures among their moves, plus two perft roots. */
const STAND_PAT_ROWS = [
  ...HANGING_CORPUS.map((row) => row.fen),
  "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
  "1k1r3q/1ppn3p/p4b2/4p3/8/P2N2P1/1PP1R1BP/2K1Q3 w - - 0 1",
];

describe("ABC-279 A1 (c) — quiesce skips exactly the moves isLosingCapture names, on the stand-pat branch", () => {
  it("seePruning on: the children are the whole sorted list less the losing captures, in order", () => {
    let skipped = 0;
    for (const fen of STAND_PAT_ROWS) {
      const position = parseFen(fen);
      expect(isInCheck(position), fen).toBe(false);
      const sorted = legalCapturesAndQueenPromotions(position);
      orderCaptures(sorted);
      const kept = sorted.filter((move) => !isLosingCapture(position, move));
      skipped += sorted.length - kept.length;
      expect(childrenSearched(fen, SEE_PRUNING), fen).toEqual(childrenOf(fen, kept));
    }
    expect(skipped).toBeGreaterThanOrEqual(24); // not vacuous: every hanging row skips its move
  });

  it("a record built without the field does not opt in: every capture is searched, in order", () => {
    for (const fen of STAND_PAT_ROWS) {
      const sorted = legalCapturesAndQueenPromotions(parseFen(fen));
      orderCaptures(sorted);
      expect(childrenSearched(fen, OWN_RECORD), fen).toEqual(childrenOf(fen, sorted));
    }
  });

  it("a node whose every capture is losing returns its stand pat", () => {
    const fen = "4k3/8/3p4/4p3/8/8/8/4QK2 w - - 0 1"; // Q×e5 is the only capture
    expect(childrenSearched(fen, SEE_PRUNING)).toEqual([]);
    const position = parseFen(fen);
    const phase = phaseOf(position);
    const stood = quiesce(position, -1e9, 1e9, 0, 0, SEE_PRUNING, () => {}, phase);
    expect(stood).toBe(evaluateAtPhase(position, phase));
  });

  it("the source: one sort of the whole list, then the test in the loop, gated on the stand-pat branch", () => {
    const flat = readFileSync(new URL("./quiescence.ts", import.meta.url), "utf8").replace(
      /\s+/g,
      " ",
    );
    const body = flat.slice(flat.indexOf("export function quiesce("));
    expect(body).toContain("skipLosing = rules.seePruning === true;");
    // The flag is set after the stand pat, inside the out-of-check branch, and before the sort.
    expect(body.indexOf("best = standPat;")).toBeLessThan(
      body.indexOf("skipLosing = rules.seePruning"),
    );
    expect(body.indexOf("skipLosing = rules.seePruning")).toBeLessThan(
      body.indexOf("orderCaptures(moves);"),
    );
    expect(body.indexOf("orderCaptures(moves);")).toBeLessThan(
      body.indexOf("if (skipLosing && isLosingCapture(position, move)) continue;"),
    );
    expect(body.match(/isLosingCapture\(/g)).toHaveLength(1);
  });
});

describe("ABC-279 A1 (d) — in check, nothing is skipped", () => {
  it("a losing capture among the evasions is searched (Q×P defended by a knight, out of the pawn's check)", () => {
    const fen = "4k3/8/8/8/8/1n6/3p4/3QK3 w - - 0 1";
    const position = parseFen(fen);
    expect(isInCheck(position)).toBe(true);
    const qxp = moveOf(position, "d1d2");
    expect(isLosingCapture(position, qxp)).toBe(true);
    const [child] = childrenOf(fen, [qxp]);
    const searched = childrenSearched(fen, SEE_PRUNING);
    expect(searched).toContain(child);
    expect(searched).toHaveLength(legalMoves(position).length);
  });
});

describe("ABC-279 A1 (e) — pure, and a fixed 288 bytes", () => {
  it("the board is byte-identical after see, on every hand row and every hanging row", () => {
    const rows = [
      ...HAND.map((row) => [row.fen, row.move] as const),
      ...HANGING_CORPUS.map((row) => [row.fen, row.losing] as const),
    ];
    for (const [fen, uci] of rows) {
      const position = parseFen(fen);
      const move = moveOf(position, uci);
      const before = JSON.stringify(position);
      const first = see(position, move);
      expect(JSON.stringify(position), fen).toBe(before);
      expect(see(position, move), fen).toBe(first); // the scratch is cleared between calls
    }
  });

  it("seeScratchByteLength() is 288: Uint8Array(128) + Int32Array(32) + Uint8Array(32)", () => {
    expect(seeScratchByteLength()).toBe(288);
  });

  it("src/see.ts has exactly three exports", () => {
    expect(Object.keys(seeModule).sort()).toEqual([
      "isLosingCapture",
      "see",
      "seeScratchByteLength",
    ]);
  });
});

const SOURCE = {
  search: readFileSync(new URL("./search.ts", import.meta.url), "utf8"),
  engine: readFileSync(new URL("./engine.ts", import.meta.url), "utf8"),
  quiescence: readFileSync(new URL("./quiescence.ts", import.meta.url), "utf8"),
  see: readFileSync(new URL("./see.ts", import.meta.url), "utf8"),
};

/** Each exported entry of `source` that calls its recursion with `call`, mapped to its literal. */
function entryLiterals(source: string, call: string): Record<string, string> {
  const flat = source.replace(/\s+/g, " ");
  const found: Record<string, string> = {};
  for (const chunk of flat.split("export function ").slice(1)) {
    if (!chunk.includes(call)) continue;
    const name = chunk.slice(0, chunk.indexOf("("));
    found[name] = chunk.slice(chunk.indexOf(call) + call.length, chunk.indexOf("});"));
  }
  return found;
}

describe("ABC-279 — one switch, seePruning, and two test-only doors (ADR-0069 decisions 6-8)", () => {
  for (const [name, call, shipped, door] of [
    ["search", "searchRoot(position, depth, {", "search", "searchWithoutSeePruning"],
    ["engine", "deepen(position, options, {", "chooseMove", "chooseMoveWithoutSeePruning"],
  ] as const) {
    it(`${name}: seePruning is on in ${shipped} only; ${door} is ${shipped} with it off; every older door turns it off`, () => {
      const literals = entryLiterals(SOURCE[name], call);
      expect(Object.keys(literals).length).toBeGreaterThanOrEqual(name === "search" ? 15 : 9);
      for (const [entry, literal] of Object.entries(literals)) {
        const found = literal.match(/seePruning: (true|false),/g);
        expect(found, entry).toEqual([
          entry === shipped ? "seePruning: true," : "seePruning: false,",
        ]);
      }
      const strip = (literal: string): string =>
        literal.replace(/\s*seePruning: (true|false),/, "");
      expect(strip(literals[door] as string)).toBe(strip(literals[shipped] as string));
    });
  }

  it("seePruning is a field of Switches, Heuristics and QuiescenceRules, and of nothing else: no module state, no option", () => {
    for (const source of [SOURCE.search, SOURCE.engine]) {
      expect(source.match(/readonly seePruning: boolean;/g)).toHaveLength(1);
      expect(source).not.toMatch(/^(let|var|const)\s+seePruning\b/m);
    }
    expect(SOURCE.quiescence.match(/readonly seePruning\?: boolean;/g)).toHaveLength(1);
    const options = SOURCE.engine.slice(SOURCE.engine.indexOf("export interface EngineOptions {"));
    expect(options.slice(0, options.indexOf("\n}")).includes("seePruning")).toBe(false);
    expect(SOURCE.search).toMatch(/export function search\(position: Position, depth: number\)/);
  });

  it("R-TC: the rule reads the position, the move and the check state only — no budget, clock, flag or environment", () => {
    // Code only: quiescence's header says its cap is "not a budget", which is the point.
    const code = (source: string): string =>
      source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
    for (const source of [SOURCE.see, SOURCE.quiescence]) {
      expect(code(source)).not.toMatch(/process\.|budget|deadline|movetime|Date\.|performance\./i);
    }
  });
});

// ---------------------------------------------------------------------------
// A3 — the bounded oracle (`ADR-0069` decision 11) and A4 — it pays (decision 12). Deep only.
// ---------------------------------------------------------------------------

if (process.env.SEARCH_DEEP === "1") {
  const ROOTS: ReadonlyArray<{ name: string; fen: string }> = [
    { name: "startpos", fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" },
    {
      name: "kiwipete",
      fen: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
    },
    { name: "position-3", fen: "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1" },
    { name: "position-4", fen: "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1" },
    { name: "position-5", fen: "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8" },
    {
      name: "position-6",
      fen: "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
    },
  ];
  const ENDGAMES: ReadonlyArray<{ name: string; fen: string }> = [
    { name: "kq-corner", fen: "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1" },
    { name: "kr-corner", fen: "k7/8/1K6/8/8/8/8/1R6 w - - 0 1" },
    { name: "kqk-h8", fen: "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1" },
    { name: "kp-vs-k", fen: "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1" },
    { name: "krk-a-file", fen: "8/8/8/8/8/k7/8/KR6 w - - 0 1" },
    { name: "pawn-race", fen: "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1" },
  ];
  /** `ABC-121`'s 190 (`src/search.futility.test.ts`'s copy): each root, its in-progress children, the endgames. */
  const corpus = (): { name: string; fen: string }[] => {
    const out: { name: string; fen: string }[] = [];
    for (const { name, fen } of ROOTS) {
      out.push({ name, fen });
      const position = parseFen(fen);
      for (const move of legalMoves(position)) {
        const undo = makeMove(position, move);
        if (gameStatus(position).result === "in-progress") {
          out.push({ name: `${name}/${label(move)}`, fen: toFen(position) });
        }
        unmakeMove(position, move, undo);
      }
    }
    return [...out, ...ENDGAMES];
  };
  const fenOf = (name: string): string =>
    (ROOTS.find((root) => root.name === name) as { fen: string }).fen;
  const isMate = (score: number): boolean => Math.abs(score) > MATE_SCORE - 1_000;
  const deepenTo = (choose: typeof chooseMove, fen: string, maxDepth: number): EngineChoice =>
    choose(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth }) as EngineChoice;

  describe("ABC-279 A3 (a) — bounded drift against the doors, depth 5, the 190 [deep, SEARCH_DEEP=1]", () => {
    const drift = (on: (fen: string) => number, reference: (fen: string) => number) => {
      const deltas: Array<[number, string]> = [];
      let signFlips = 0;
      for (const { name, fen } of corpus()) {
        const ref = reference(fen);
        const got = on(fen);
        if (isMate(ref) || isMate(got)) {
          if (Math.sign(ref) !== Math.sign(got)) signFlips++;
          continue;
        }
        deltas.push([Math.abs(got - ref), `${name}: ${ref} -> ${got}`]);
      }
      deltas.sort((a, b) => b[0] - a[0]);
      return {
        compared: deltas.length,
        within25: deltas.filter(([delta]) => delta <= 25).length / deltas.length,
        max: deltas[0]?.[0] ?? 0,
        worst: deltas[0]?.[1] ?? "",
        signFlips,
      };
    };
    const bar = (what: string, result: ReturnType<typeof drift>): void => {
      console.log(
        `ABC-279 A3 ${what}: ${(100 * result.within25).toFixed(2)}% within 25 cp of ` +
          `${result.compared}, max ${result.max} cp (${result.worst}); mate sign flips ${result.signFlips}`,
      );
      expect(result.compared).toBeGreaterThanOrEqual(100);
      expect(result.within25).toBeGreaterThanOrEqual(0.93);
      expect(result.max).toBeLessThanOrEqual(144);
      expect(result.signFlips).toBe(0);
    };

    it("the corpus is the 190", () => {
      expect(corpus()).toHaveLength(190);
    });

    it("search() against searchWithoutSeePruning at depth 5: >= 93% within 25 cp, none beyond 144, 0 mate sign changes [deep, SEARCH_DEEP=1]", () => {
      bar(
        "search() d5",
        drift(
          (fen) => search(parseFen(fen), 5).score,
          (fen) => searchWithoutSeePruning(parseFen(fen), 5).score,
        ),
      );
    }, 600_000);

    it("chooseMove against chooseMoveWithoutSeePruning deepened to 5: >= 93% within 25 cp, none beyond 144, 0 mate sign changes [deep, SEARCH_DEEP=1]", () => {
      bar(
        "chooseMove to d5",
        drift(
          (fen) => deepenTo(chooseMove, fen, 5).score,
          (fen) => deepenTo(chooseMoveWithoutSeePruning, fen, 5).score,
        ),
      );
    }, 600_000);
  });

  describe("ABC-279 A3 (b) — the same-depth mate floor on the 287 [deep, SEARCH_DEEP=1]", () => {
    it("every mate searchWithoutSeePruning scores at depth 5, search() scores as a mate of the same sign at depth 5 [deep, SEARCH_DEEP=1]", () => {
      let mates = 0;
      const violations: string[] = [];
      for (const fen of MATE_CORPUS) {
        const ref = searchWithoutSeePruning(parseFen(fen), 5).score;
        if (!isMate(ref)) continue;
        mates++;
        const got = search(parseFen(fen), 5).score;
        if (!isMate(got) || Math.sign(got) !== Math.sign(ref))
          violations.push(`${fen}: ${ref} -> ${got}`);
      }
      console.log(`ABC-279 A3 mate floor d5: ${violations.length} of ${mates} violated`);
      expect(mates).toBeGreaterThanOrEqual(100);
      expect(violations).toEqual([]);
    }, 300_000);
  });

  describe("ABC-279 A4 (a) — depth 8 on kiwipete and position-6, nodes <= 0.78x the door's in both recursions [deep, SEARCH_DEEP=1]", () => {
    // The instrument check (`ADR-0069` decision 12, not a bar): on `src/` tree `4cb84035` a faithful
    // build reads these exact counts; the doors read `ABC-269` B0's. A re-derived count is a dated
    // line in the ADR, never a moved bar.
    const READ = {
      kiwipete: { search: [605_117, 839_514], choose: [766_275, 1_296_788] },
      "position-6": { search: [406_787, 1_533_901], choose: [87_475, 404_930] },
    } as const;
    for (const name of ["kiwipete", "position-6"] as const) {
      it(`${name}: search() at depth 8 [deep, SEARCH_DEEP=1]`, () => {
        const head = search(parseFen(fenOf(name)), 8);
        const door = searchWithoutSeePruning(parseFen(fenOf(name)), 8);
        console.log(
          `ABC-279 A4 search() ${name} d8: ${head.nodes} / ${door.nodes} = ` +
            `${(head.nodes / door.nodes).toFixed(4)}x; head ${label(head.move as Move)} ${head.score}, ` +
            `door ${label(door.move as Move)} ${door.score}`,
        );
        expect([head.nodes, door.nodes]).toEqual(READ[name].search);
        expect(head.nodes).toBeLessThanOrEqual(0.78 * door.nodes);
      }, 300_000);

      it(`${name}: chooseMove deepened to 8 on a frozen clock [deep, SEARCH_DEEP=1]`, () => {
        const head = deepenTo(chooseMove, fenOf(name), 8);
        const door = deepenTo(chooseMoveWithoutSeePruning, fenOf(name), 8);
        expect([head.depth, door.depth]).toEqual([8, 8]);
        console.log(
          `ABC-279 A4 chooseMove ${name} to 8: ${head.nodes} / ${door.nodes} = ` +
            `${(head.nodes / door.nodes).toFixed(4)}x; head ${label(head.move)} ${head.score}, ` +
            `door ${label(door.move)} ${door.score}`,
        );
        expect([head.nodes, door.nodes]).toEqual(READ[name].choose);
        expect(head.nodes).toBeLessThanOrEqual(0.78 * door.nodes);
      }, 300_000);
    }
  });

  describe("ABC-279 A4 (b) — the mean completed depth at 47 000 nodes on the 190 is >= the door's + 0.55 ply [deep, SEARCH_DEEP=1]", () => {
    it("chooseMove against chooseMoveWithoutSeePruning, maxNodes 47 000, frozen clock [deep, SEARCH_DEEP=1]", () => {
      const rows = corpus();
      const reach = (choose: typeof chooseMove) =>
        rows.map(({ fen }) => {
          const choice = choose(parseFen(fen), {
            budgetMs: 1_000,
            now: () => 0,
            maxNodes: 47_000,
          }) as EngineChoice;
          return { depth: choice.depth, move: label(choice.move) };
        });
      const door = reach(chooseMoveWithoutSeePruning);
      const head = reach(chooseMove);
      const mean = (xs: Array<{ depth: number }>) =>
        xs.reduce((sum, x) => sum + x.depth, 0) / xs.length;
      const deeper = head.filter((x, i) => x.depth > (door[i] as { depth: number }).depth).length;
      const shallower = head.filter(
        (x, i) => x.depth < (door[i] as { depth: number }).depth,
      ).length;
      const moved = head.filter((x, i) => x.move !== (door[i] as { move: string }).move).length;
      console.log(
        `ABC-279 A4 reach at 47 000 nodes on ${rows.length}: door ${mean(door).toFixed(3)} -> head ` +
          `${mean(head).toFixed(3)} (+${(mean(head) - mean(door)).toFixed(3)}); ${deeper} deeper, ` +
          `${shallower} shallower, ${moved} root moves differ`,
      );
      expect(rows).toHaveLength(190);
      expect(mean(head)).toBeGreaterThanOrEqual(mean(door) + 0.55);
    }, 600_000);
  });
}
