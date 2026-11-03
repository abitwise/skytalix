/**
 * ABC-269 (E1) — the tapered evaluation (`ADR-0064`): its relations (`B1`), its rule rows, its
 * parameter table, and its switch and doors.
 *
 * DEFAULT LANE (no search): `B1` (a)–(e) over QE's frozen sets (`src/evaluate.taper-corpus.ts`,
 * `qe-ABC-269-freeze`, never edited here), the `ABC-215` `A2` rule rows for the two endgame halves
 * that differ, the data-only seam of `src/evaluate-params.ts`, and source rows for the `taper`
 * switch (`ADR-0064` decision 7, the `ADR-0061` decision 5 pattern).
 *
 * DEEP LANE, `SEARCH_DEEP=1`: `B0` (node identity with the design, `ADR-0064` d8: the counts the
 * Architect's probe read for form L, and the doors' pre-ticket counts) and `B2` (the mate floor on
 * the 287). `B3` (zugzwang) and `B4` (`G1`) stay where they live, on the shipped path
 * (`src/search.null-move.test.ts`, `src/puzzle-suite.test.ts`).
 *
 * CUT C1 (`arch-ABC-269-F3` decision …a0468a78): `P2`, the phase oracle walk (`phaseAfterMove`
 * against `phaseOf` after every make, unmake and null move over the perft set, depth 2 here and
 * 3 under `SEARCH_DEEP=1`, plus targeted rows with the exact weight each move kind moves), `P3`'s
 * in-file half (`evaluate` ≡ `evaluateAtPhase` at `phaseOf`), and `P5`, the source guard: the walk
 * holds no phase add, the tapered call sites pass the carried phase, and `phaseOf` is called only
 * at the roots.
 *
 * S1–S3 (the castled corner) are a REPORT, not a row: `QE-269-a` was ruled (a) (`ADR-0064`
 * § Decision log). Their readings are in the build's notes, not asserted here.
 */

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { makeMove, makeNullMove, unmakeMove, unmakeNullMove } from "./apply.ts";
import { chooseMove, chooseMoveWithoutTaper } from "./engine.ts";
import { buildCorpus, mirrorPosition, PERFT_POSITIONS } from "./evaluate.mirror-corpus.ts";
import {
  G3_CORPUS_MAIN_EVALUATE,
  TAPER_DOOR_CORPUS,
  TAPER_KP_ENDINGS,
  TAPER_MIRROR_POSITIONS,
  TAPER_PASSER_PAIRS,
  TAPER_PASSER_PHASES,
} from "./evaluate.taper-corpus.ts";
import {
  evaluate,
  evaluateAtPhase,
  evaluateWithoutTaper,
  phaseAfterMove,
  phaseOf,
  VALUE_TABLES_FOR_TEST,
} from "./evaluate.ts";
import * as PARAMS from "./evaluate-params.ts";
import { parseFen } from "./fen.ts";
import { legalMoves } from "./legal.ts";
import { FLAG_CASTLE, FLAG_EN_PASSANT, type Move } from "./moves.ts";
import {
  BISHOP,
  EMPTY,
  isBlack,
  isOnBoard,
  KNIGHT,
  PAWN,
  type Position,
  pieceType,
  QUEEN,
  ROOK,
  squareName,
} from "./position.ts";
import { MATE_CORPUS } from "./search.mate-corpus.ts";
import { MATE_SCORE, search, searchWithoutTaper } from "./search.ts";

const RUN_DEEP = process.env.SEARCH_DEEP === "1";

/** `ADR-0064` d1's raw phase: N 1, B 1, R 2, Q 4 over both sides, before the clamp. */
function rawPhase(position: Position): number {
  let phase = 0;
  for (let square = 0; square < 128; square++) {
    if (!isOnBoard(square)) continue;
    const type = pieceType(position.board[square] as number);
    if (type === KNIGHT || type === BISHOP) phase += 1;
    else if (type === ROOK) phase += 2;
    else if (type === QUEEN) phase += 4;
  }
  return phase;
}

/** The score from `white`'s side (or black's): `evaluate` is side-to-move relative. */
const fromSide = (score: number, position: Position, side: "white" | "black"): number =>
  position.blackToMove === (side === "black") ? score : 0 - score;

describe("ABC-269 B1 (a) — a position and its colour mirror score exactly equal, Object.is, at every phase", () => {
  it("G3's 184 (buildCorpus)", () => {
    const mismatches = buildCorpus().filter(
      ({ position }) => !Object.is(evaluate(position), evaluate(mirrorPosition(position))),
    );
    expect(mismatches.map(({ name }) => name)).toEqual([]);
  });

  it.each(TAPER_MIRROR_POSITIONS)("$id (raw phase $rawPhase)", ({ fen, rawPhase: phase }) => {
    const position = parseFen(fen);
    expect(rawPhase(position)).toBe(phase); // the fixture bites: the row is at its stated phase
    expect(Object.is(evaluate(position), evaluate(mirrorPosition(position)))).toBe(true);
  });

  it("the frozen rows span phases 0 to 24, and the -0 traps are real (mg exactly 0 on the door)", () => {
    const phases = new Set(TAPER_MIRROR_POSITIONS.map((row) => Math.min(24, row.rawPhase)));
    expect([...phases].sort((a, b) => a - b)).toEqual(Array.from({ length: 25 }, (_, i) => i));
    for (const id of ["M-negzero-a", "M-negzero-b"]) {
      const row = TAPER_MIRROR_POSITIONS.find((r) => r.id === id);
      expect(row, id).toBeDefined();
      const position = parseFen((row as { fen: string }).fen);
      const white = fromSide(evaluateWithoutTaper(position), position, "white");
      expect(Object.is(white, 0), id).toBe(true);
      // The delta form returns +0 on both sides; the full form would return -0 on one of them.
      expect(Object.is(evaluate(position), 0), id).toBe(true);
      expect(Object.is(evaluate(mirrorPosition(position)), 0), id).toBe(true);
    }
  });
});

describe("ABC-269 B1 (b) — at phase 24, evaluate equals evaluateWithoutTaper exactly", () => {
  it("every frozen row at raw phase >= 24 (the clamp rows included)", () => {
    const rows = TAPER_MIRROR_POSITIONS.filter((row) => row.rawPhase >= 24);
    expect(rows.map((row) => row.id).sort()).toEqual(
      ["M-clamp28", "M-clamp32", "M-p24-pos5-btm"].sort(),
    );
    for (const { id, fen } of rows) {
      const position = parseFen(fen);
      expect(Object.is(evaluate(position), evaluateWithoutTaper(position)), id).toBe(true);
    }
  });

  it("every G3 position whose phase is >= 24", () => {
    const full = buildCorpus().filter(({ position }) => rawPhase(position) >= 24);
    expect(full.length).toBeGreaterThanOrEqual(7);
    for (const { name, position } of full) {
      expect(Object.is(evaluate(position), evaluateWithoutTaper(position)), name).toBe(true);
    }
  });
});

describe("ABC-269 B1 (c) — evaluateWithoutTaper is the pre-ticket evaluate, Object.is", () => {
  it("QE's door corpus: 176 positions and their frozen pre-ticket scores", () => {
    expect(TAPER_DOOR_CORPUS).toHaveLength(176);
    const differ = TAPER_DOOR_CORPUS.filter(
      ({ fen, main }) => !Object.is(evaluateWithoutTaper(parseFen(fen)), main),
    );
    expect(differ).toEqual([]);
  });

  it("G3's 184 in buildCorpus order, against the frozen pre-ticket scores", () => {
    const corpus = buildCorpus();
    expect(corpus).toHaveLength(G3_CORPUS_MAIN_EVALUATE.length);
    const differ = corpus
      .map(({ name, position }, i) => ({
        name,
        got: evaluateWithoutTaper(position),
        main: G3_CORPUS_MAIN_EVALUATE[i] as number,
      }))
      .filter(({ got, main }) => !Object.is(got, main));
    expect(differ).toEqual([]);
  });
});

describe("ABC-269 B1 (d) — the king walks: centre beats corner by >= 20 cp on QE's six graded endings", () => {
  it.each(TAPER_KP_ENDINGS)(
    "$id: $walkingKing king, $centreSquare over $cornerSquare (shelter $cornerShelter)",
    ({ walkingKing, centreFen, cornerFen, mainCentreMinusCorner }) => {
      const centre = parseFen(centreFen);
      const corner = parseFen(cornerFen);
      expect(rawPhase(centre)).toBe(0);
      expect(rawPhase(corner)).toBe(0);
      expect(QE_SHELTER_FOR_B1D).toContain(
        TAPER_KP_ENDINGS.find((row) => row.centreFen === centreFen)?.cornerShelter,
      );
      // The door still reads the pre-ticket margin: the change is the taper's alone.
      const base =
        fromSide(evaluateWithoutTaper(centre), centre, walkingKing) -
        fromSide(evaluateWithoutTaper(corner), corner, walkingKing);
      expect(base).toBe(mainCentreMinusCorner);
      const tapered =
        fromSide(evaluate(centre), centre, walkingKing) -
        fromSide(evaluate(corner), corner, walkingKing);
      expect(tapered).toBeGreaterThanOrEqual(20);
    },
  );
});

/** `QE-269-a` ruled (a): B1 (d) covers the corner king NOT behind both of its shelter pawns. */
const QE_SHELTER_FOR_B1D = ["none", "partial"];

describe("ABC-269 B1 (e) — the passers: >= 1.5 x at phase <= 6, exact at 24, <= 1.25 x at >= 18", () => {
  const passedTerm = (
    pair: (typeof TAPER_PASSER_PAIRS)[number],
  ): { term: number; phase: number } => {
    const a = parseFen(pair.withPasserFen);
    const b = parseFen(pair.withoutPasserFen);
    // QE's reading: sign x ((E(A) - E(B)) - (W(A) - W(B))) + base bonus.
    const e = fromSide(evaluate(a), a, pair.passer) - fromSide(evaluate(b), b, pair.passer);
    const w =
      fromSide(evaluateWithoutTaper(a), a, pair.passer) -
      fromSide(evaluateWithoutTaper(b), b, pair.passer);
    return { term: e - w + pair.baseBonus, phase: rawPhase(a) };
  };

  it.each(TAPER_PASSER_PAIRS)(
    "$id: $passer passer on $square, own rank $ownRank, phase $rawPhase",
    (pair) => {
      const { term, phase } = passedTerm(pair);
      expect(phase).toBe(pair.rawPhase);
      expect(pair.baseBonus).toBe(
        (VALUE_TABLES_FOR_TEST.PASSED_PAWN_BONUS[pair.ownRank - 1] as number) + 0,
      );
      if (phase <= 6) expect(term).toBeGreaterThanOrEqual(1.5 * pair.baseBonus);
      if (phase >= 24) expect(term).toBe(pair.baseBonus);
      if (phase >= 18) expect(term).toBeLessThanOrEqual(1.25 * pair.baseBonus);
    },
  );

  it("by array: the blended passed bonus at every phase in each bar's range, from VALUE_TABLES_FOR_TEST", () => {
    const { PASSED_PAWN_BONUS: mg, PASSED_PAWN_BONUS_EG: eg } = VALUE_TABLES_FOR_TEST;
    // The blend for one term alone: mg + trunc((eg - mg) x (24 - phase) / 24).
    const blended = (index: number, phase: number): number =>
      (mg[index] as number) +
      Math.trunc((((eg[index] as number) - (mg[index] as number)) * (24 - phase)) / 24);
    for (const ownRank of TAPER_PASSER_PHASES.ownRanks) {
      const index = ownRank - 1; // own rank 2 is the start rank, PASSED index 1
      const base = mg[index] as number;
      expect(base, `rank ${ownRank}`).toBeGreaterThan(0);
      for (const phase of TAPER_PASSER_PHASES.atMostSix) {
        expect(blended(index, phase), `rank ${ownRank} phase ${phase}`).toBeGreaterThanOrEqual(
          1.5 * base,
        );
      }
      expect(blended(index, TAPER_PASSER_PHASES.identity)).toBe(base);
      for (const phase of TAPER_PASSER_PHASES.atLeastEighteen) {
        expect(blended(index, phase), `rank ${ownRank} phase ${phase}`).toBeLessThanOrEqual(
          1.25 * base,
        );
      }
    }
  });
});

describe("ABC-269 — ABC-215 A2's rule rows for the two endgame halves that differ", () => {
  // Table index i is rank-8-first: i = 0 is a8, i = 63 is h1.
  const fileOf = (i: number): number => i % 8;
  const rankOf = (i: number): number => 7 - Math.floor(i / 8); // 0 = rank 1

  it("KING_TABLE_EG is 40 - 15 m, m the Manhattan distance to the nearest of d4, e4, d5, e5", () => {
    const centre = [
      [3, 3],
      [4, 3],
      [3, 4],
      [4, 4],
    ] as const;
    const rebuilt = Array.from({ length: 64 }, (_, i) => {
      const m = Math.min(
        ...centre.map(([f, r]) => Math.abs(fileOf(i) - f) + Math.abs(rankOf(i) - r)),
      );
      return 40 - 15 * m;
    });
    expect(Array.from(VALUE_TABLES_FOR_TEST.KING_TABLE_EG)).toEqual(rebuilt);
    expect(Math.max(...rebuilt)).toBe(40);
    expect(Math.min(...rebuilt)).toBe(-50);
  });

  it("PASSED_PAWN_BONUS_EG is 2 x the middlegame bonus by rank; the middlegame half is the pre-ticket table", () => {
    expect(Array.from(VALUE_TABLES_FOR_TEST.PASSED_PAWN_BONUS)).toEqual([
      0, 5, 10, 20, 35, 60, 100, 0,
    ]);
    expect(Array.from(VALUE_TABLES_FOR_TEST.PASSED_PAWN_BONUS_EG)).toEqual(
      VALUE_TABLES_FOR_TEST.PASSED_PAWN_BONUS.map((value) => 2 * value),
    );
  });
});

describe("ABC-269 — src/evaluate-params.ts is the one parameter table, data only (ADR-0064 decision 4)", () => {
  it("no imports and no logic: no function, no loop, no call", () => {
    const source = readFileSync(new URL("./evaluate-params.ts", import.meta.url), "utf8");
    const code = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
    expect(code).not.toMatch(/\bimport\b/);
    expect(code).not.toMatch(/\bfunction\b|=>|\bfor\b|\bwhile\b|\bnew\b/);
    expect(code).not.toMatch(/[A-Za-z_]\w*\s*\(/); // no call
  });

  it("phase weights N 1, B 1, R 2, Q 4 by pieceType, and the linear form's ends 24 / 0", () => {
    expect(PARAMS.PHASE_WEIGHT).toEqual([0, 0, 1, 1, 2, 4, 0]);
    expect([PARAMS.PHASE_MG, PARAMS.PHASE_EG]).toEqual([24, 0]);
  });

  it("every pair holds two halves of one shape; only the king's square and the passers differ", () => {
    const pairs: Array<[string, { mg: unknown; eg: unknown }]> = [
      ["MATERIAL", PARAMS.MATERIAL],
      ...Object.entries(PARAMS.PST).map(([piece, pair]): [string, typeof pair] => [
        `PST.${piece}`,
        pair,
      ]),
      ["PASSED", PARAMS.PASSED],
      ["DOUBLED", PARAMS.DOUBLED],
      ["ISOLATED", PARAMS.ISOLATED],
      ["KING_SHELTER_MISSING", PARAMS.KING_SHELTER_MISSING],
      ["KING_FILE_HALF_OPEN", PARAMS.KING_FILE_HALF_OPEN],
      ["KING_FILE_OPEN", PARAMS.KING_FILE_OPEN],
      ["MOBILITY_WEIGHT", PARAMS.MOBILITY_WEIGHT],
      ["MOBILITY_CAP", PARAMS.MOBILITY_CAP],
    ];
    const differ = pairs
      .filter(([, pair]) => JSON.stringify(pair.mg) !== JSON.stringify(pair.eg))
      .map(([name]) => name);
    // `src/evaluate.ts` reads only the middlegame half of every other term (decision 6); a pair
    // that starts to differ needs the two-accumulator form first (E2), and reddens this row.
    expect(differ.sort()).toEqual(["PASSED", "PST.king"]);
    expect(Object.keys(PARAMS.PST)).toEqual(["pawn", "knight", "bishop", "rook", "queen", "king"]);
    for (const [name, pair] of pairs) {
      if (Array.isArray(pair.mg)) {
        expect((pair.eg as unknown[]).length, name).toBe(pair.mg.length);
      }
    }
  });

  it("the middlegame halves are the arrays evaluate reads (VALUE_TABLES_FOR_TEST)", () => {
    expect(VALUE_TABLES_FOR_TEST.PIECE_VALUE).toEqual(PARAMS.MATERIAL.mg);
    expect(VALUE_TABLES_FOR_TEST.KING_TABLE).toEqual(PARAMS.PST.king.mg);
    expect(VALUE_TABLES_FOR_TEST.KING_TABLE_EG).toEqual(PARAMS.PST.king.eg);
    expect(VALUE_TABLES_FOR_TEST.PAWN_TABLE).toEqual(PARAMS.PST.pawn.mg);
  });
});

/** The production sources of the two recursions, read as text (`ADR-0061` decision 5's pattern). */
const SOURCES = {
  search: readFileSync(new URL("./search.ts", import.meta.url), "utf8"),
  engine: readFileSync(new URL("./engine.ts", import.meta.url), "utf8"),
  quiescence: readFileSync(new URL("./quiescence.ts", import.meta.url), "utf8"),
};

/** Each `call`'s literal in `source`, keyed by the exported function that holds it. */
function literalsByEntry(source: string, call: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const match of source.matchAll(/export function (\w+)\(/g)) {
    const at = source.indexOf(call, match.index);
    const next = source.indexOf("export function ", (match.index as number) + 1);
    if (at < 0 || (next >= 0 && at > next)) continue;
    out[match[1] as string] = source.slice(at, source.indexOf("});", at));
  }
  return out;
}

/** `source` with its comments removed and its whitespace flattened: the code, as one line. */
const code = (source: string): string =>
  source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "")
    .replace(/\s+/g, " ");

describe("ABC-269 — one switch, taper, and three test-only doors (ADR-0064 decision 7)", () => {
  it("the doors take what their shipped twins take", () => {
    expect(evaluateWithoutTaper.length).toBe(1);
    expect(searchWithoutTaper.length).toBe(2);
    expect(chooseMoveWithoutTaper.length).toBe(2);
  });

  it("taper is a field of Switches and Heuristics and of nothing else: no module state, no option", () => {
    for (const source of [SOURCES.search, SOURCES.engine]) {
      expect(source.match(/readonly taper: boolean;/g)).toHaveLength(1);
      expect(source).not.toMatch(/^(let|var|const)\s+taper\b/m);
    }
    const options = SOURCES.engine.slice(
      SOURCES.engine.indexOf("export interface EngineOptions {"),
    );
    expect(options.slice(0, options.indexOf("\n}")).includes("taper")).toBe(false);
  });

  for (const [name, call, shipped, door] of [
    ["search", "searchRoot(position, depth, {", "search", "searchWithoutTaper"],
    ["engine", "deepen(position, options, {", "chooseMove", "chooseMoveWithoutTaper"],
  ] as const) {
    it(`${name}: taper is on in ${shipped} only; ${door} is ${shipped} with taper off; every older door turns it off`, () => {
      const literals = literalsByEntry(SOURCES[name], call);
      expect(Object.keys(literals).length).toBeGreaterThanOrEqual(name === "search" ? 14 : 8);
      for (const [entry, literal] of Object.entries(literals)) {
        expect(literal, entry).toContain(entry === shipped ? "taper: true," : "taper: false,");
      }
      const strip = (literal: string): string => literal.replace(/\s*taper: (true|false),/, "");
      expect(strip(literals[door] as string)).toBe(strip(literals[shipped] as string));
    });
  }

  it("the call sites: futilityNode is handed the switch and the carried phase, the leaf and the stand pat pick by the switch", () => {
    const flat = (source: string): string => source.replace(/\s+/g, " ");
    expect(flat(SOURCES.search)).toContain(
      "futilityNode(position, depth, ply, alphaIn, beta, switches.taper, phase)",
    );
    expect(flat(SOURCES.engine)).toContain(
      "futilityNode(position, remaining, ply, alphaIn, beta, budget.taper, phase)",
    );
    expect(flat(SOURCES.search)).toContain(
      "const staticScore = taper ? evaluateAtPhase(position, phase) : evaluateWithoutTaper(position);",
    );
    expect(flat(SOURCES.search)).toContain(
      "return switches.taper ? evaluateAtPhase(position, phase) : evaluateWithoutTaper(position);",
    );
    expect(flat(SOURCES.quiescence)).toContain(
      "const standPat = rules.taper === true ? evaluateAtPhase(position, phase) : evaluateWithoutTaper(position);",
    );
    for (const source of [SOURCES.search, SOURCES.engine]) {
      expect(flat(source)).toContain(
        "const RULES_TAPERED: QuiescenceRules = { evasions: true, quietPromotions: true, taper: true };",
      );
      expect(source.match(/taper: true \}/g)).toHaveLength(1); // one tapered record per recursion
    }
    // Every evaluation call in the recursions' code (comments aside) sits at one of those sites,
    // and none is the self-walking `evaluate` (`ABC-269` cut C1: the recursions carry the phase).
    expect(code(SOURCES.search).match(/\bevaluate\(/g)).toBeNull();
    expect(code(SOURCES.search).match(/\bevaluateAtPhase\(/g)).toHaveLength(2);
    expect(code(SOURCES.search).match(/\bevaluateWithoutTaper\(/g)).toHaveLength(2);
    expect(code(SOURCES.engine).match(/\bevaluate(AtPhase|WithoutTaper)?\(/g)).toBeNull();
    expect(code(SOURCES.quiescence).match(/\bevaluate\(/g)).toBeNull();
    expect(code(SOURCES.quiescence).match(/\bevaluateAtPhase\(/g)).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// Cut C1 (`arch-ABC-269-F3` …a0468a78): the phase leaves the board walk and rides the recursion.
// ---------------------------------------------------------------------------

/** The phase weight of a piece TYPE, written here from `ADR-0064` d1 and not read from the module. */
const WEIGHT: Readonly<Record<number, number>> = {
  [KNIGHT]: 1,
  [BISHOP]: 1,
  [ROOK]: 2,
  [QUEEN]: 4,
};
const weightOf = (type: number): number => WEIGHT[type] ?? 0;

/** The move kinds `P2`'s walk must see at least once each, and the targeted rows name. */
function kindsOf(move: Move): string[] {
  const kinds: string[] = [];
  const side = isBlack(move.piece) ? "black" : "white";
  if ((move.flags & FLAG_EN_PASSANT) !== 0) kinds.push(`en passant (${side})`);
  if ((move.flags & FLAG_CASTLE) !== 0)
    kinds.push(`castle ${squareName(move.from)}${squareName(move.to)}`);
  if (move.promotion !== EMPTY) {
    kinds.push(
      `${move.captured === EMPTY ? "promotion" : "capture-promotion"} to ${move.promotion}`,
    );
  }
  if (move.captured !== EMPTY) kinds.push(`capture of ${pieceType(move.captured)}`);
  if (move.captured === EMPTY && move.promotion === EMPTY && move.flags === 0) kinds.push("quiet");
  return kinds;
}

/**
 * `P2`'s walk: every legal line from `position` to `depth`. After each `makeMove`,
 * `phaseAfterMove(parent, move)` must equal `phaseOf` of the child; after each `unmakeMove`,
 * `phaseOf` must equal the parent again; a null move at every interior node leaves it unchanged.
 */
function phaseWalk(
  position: Position,
  depth: number,
  seen: Map<string, number>,
  bad: string[],
): number {
  const parent = phaseOf(position);
  let checked = 0;
  const nullUndo = makeNullMove(position);
  if (phaseOf(position) !== parent) bad.push(`null move changed the phase at depth ${depth}`);
  unmakeNullMove(position, nullUndo);
  for (const move of legalMoves(position)) {
    const undo = makeMove(position, move);
    const carried = phaseAfterMove(parent, move);
    const walked = phaseOf(position);
    if (carried !== walked)
      bad.push(`${kindsOf(move).join("+")}: carried ${carried}, walked ${walked}`);
    for (const kind of kindsOf(move)) seen.set(kind, (seen.get(kind) ?? 0) + 1);
    checked++;
    if (depth > 1) checked += phaseWalk(position, depth - 1, seen, bad);
    unmakeMove(position, move, undo);
    if (phaseOf(position) !== parent) bad.push(`unmake did not restore the phase (${parent})`);
  }
  return checked;
}

/** The kinds `P2` requires: every capture victim, both en passants, all four castlings, every promotion. */
const REQUIRED_KINDS = [
  "quiet",
  ...[PAWN, KNIGHT, BISHOP, ROOK, QUEEN].map((type) => `capture of ${type}`),
  "en passant (white)",
  "en passant (black)",
  "castle e1g1",
  "castle e1c1",
  "castle e8g8",
  "castle e8c8",
  ...[KNIGHT, BISHOP, ROOK, QUEEN].flatMap((type) => [
    `promotion to ${type}`,
    `capture-promotion to ${type}`,
  ]),
];

describe("ABC-269 cut C1 P2 — the phase oracle walk: phaseAfterMove is phaseOf after every make, unmake and null move", () => {
  it("phaseOf is ADR-0064 d1's raw phase, unclamped, over G3's 184 and QE's frozen sets", () => {
    const positions = [
      ...buildCorpus().map(({ position }) => position),
      ...TAPER_DOOR_CORPUS.map(({ fen }) => parseFen(fen)),
      ...TAPER_MIRROR_POSITIONS.map(({ fen }) => parseFen(fen)),
      ...TAPER_PASSER_PAIRS.flatMap((row) => [
        parseFen(row.withPasserFen),
        parseFen(row.withoutPasserFen),
      ]),
    ];
    expect(positions.length).toBeGreaterThan(184);
    expect(positions.filter((position) => phaseOf(position) !== rawPhase(position))).toEqual([]);
    for (const row of TAPER_MIRROR_POSITIONS)
      expect(phaseOf(parseFen(row.fen)), row.id).toBe(row.rawPhase);
    expect(phaseOf(parseFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"))).toBe(24);
    // Unclamped: four white queens beside black's whole army read 28, never 24 (the clamp is the
    // blend's, not the phase's).
    expect(phaseOf(parseFen("qqqqk3/8/8/8/8/8/8/4K3 w - - 0 1"))).toBe(16);
    expect(phaseOf(parseFen("rnbqkbnr/pppppppp/8/8/8/8/8/QQQQK3 w kq - 0 1"))).toBe(28);
  });

  const walkDepth = RUN_DEEP ? 3 : 2;
  it(`the perft set to depth ${walkDepth}, and the targeted rows' boards: 0 mismatches, and every move kind seen at least once`, () => {
    const seen = new Map<string, number>();
    const bad: string[] = [];
    let checked = 0;
    for (const { fen } of PERFT_POSITIONS)
      checked += phaseWalk(parseFen(fen), walkDepth, seen, bad);
    // Every move of the published perft tables to that depth was checked: Σ d1 + d2 (+ d3).
    expect(checked).toBe(RUN_DEEP ? 277_949 : 6_637);
    // The targeted boards walked too (white's en passant first appears at perft depth 3).
    let targeted = 0;
    for (const fen of new Set(TARGETED.map((row) => row.fen))) {
      targeted += phaseWalk(parseFen(fen), walkDepth, seen, bad);
    }
    expect(targeted).toBeGreaterThan(100);
    expect(bad.slice(0, 10)).toEqual([]);
    const missing = REQUIRED_KINDS.filter((kind) => (seen.get(kind) ?? 0) < 1);
    expect(missing).toEqual([]);
  }, 600_000);

  /** Targeted rows: each move kind with the exact weight it moves, `ADR-0064` d1's, and the oracle. */
  const TARGETED: ReadonlyArray<{ why: string; fen: string; kind: string; delta: number }> = [
    ...[
      ["white", "r1n1k3/1P6/8/8/8/8/8/4K3 w - - 0 1"],
      ["black", "4k3/8/8/8/8/8/1p6/R1N1K3 b - - 0 1"],
    ].flatMap(([side, fen]) =>
      [KNIGHT, BISHOP, ROOK, QUEEN].flatMap((type) => [
        {
          why: `${side} promotes to ${type}`,
          fen: fen as string,
          kind: `promotion to ${type}`,
          delta: weightOf(type),
        },
        {
          why: `${side} promotes to ${type} taking a rook`,
          fen: fen as string,
          kind: `capture-promotion to ${type}+rook`,
          delta: weightOf(type) - 2,
        },
        {
          why: `${side} promotes to ${type} taking a knight`,
          fen: fen as string,
          kind: `capture-promotion to ${type}+knight`,
          delta: weightOf(type) - 1,
        },
      ]),
    ),
    {
      why: "white takes en passant",
      fen: "4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1",
      kind: "en passant (white)",
      delta: 0,
    },
    {
      why: "black takes en passant",
      fen: "4k3/8/8/8/3Pp3/8/8/4K3 b - d3 0 1",
      kind: "en passant (black)",
      delta: 0,
    },
    ...["e1g1", "e1c1"].map((c) => ({
      why: `castle ${c}`,
      fen: "r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1",
      kind: `castle ${c}`,
      delta: 0,
    })),
    ...["e8g8", "e8c8"].map((c) => ({
      why: `castle ${c}`,
      fen: "r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1",
      kind: `castle ${c}`,
      delta: 0,
    })),
    ...[PAWN, KNIGHT, BISHOP, ROOK, QUEEN].flatMap((type) => {
      const letter = ".pnbrq"[type] as string;
      return [
        {
          why: `white rook takes a black ${letter}`,
          fen: `4k3/8/8/${letter}7/8/8/8/R3K3 w - - 0 1`,
          kind: `capture of ${type}`,
          delta: 0 - weightOf(type),
        },
        {
          why: `black rook takes a white ${letter.toUpperCase()}`,
          fen: `r3k3/8/8/8/${letter.toUpperCase()}7/8/8/4K3 b - - 0 1`,
          kind: `capture of ${type}`,
          delta: 0 - weightOf(type),
        },
      ];
    }),
  ];

  it.each(TARGETED)(
    "$why: the phase moves by exactly $delta, and the oracle agrees",
    ({ fen, kind, delta }) => {
      const position = parseFen(fen);
      const parent = phaseOf(position);
      expect(parent).toBe(rawPhase(position));
      const [first, second] = kind.split("+");
      const victim = second === "rook" ? ROOK : second === "knight" ? KNIGHT : null;
      const matching = legalMoves(position).filter(
        (move) =>
          kindsOf(move).includes(first as string) &&
          (victim === null || pieceType(move.captured) === victim) &&
          (!kind.startsWith("capture of") || pieceType(move.piece) === ROOK),
      );
      expect(matching.length, "the row's move exists").toBeGreaterThan(0);
      for (const move of matching) {
        expect(phaseAfterMove(parent, move)).toBe(parent + delta);
        const undo = makeMove(position, move);
        expect(phaseOf(position)).toBe(parent + delta);
        unmakeMove(position, move, undo);
        expect(phaseOf(position)).toBe(parent);
      }
    },
  );
});

describe("ABC-269 cut C1 P3 (in file) — evaluate is evaluateAtPhase at phaseOf, Object.is", () => {
  it("over G3's 184, QE's frozen sets, the passer pairs and the K+P endings", () => {
    const positions = [
      ...buildCorpus().map(({ position }) => position),
      ...TAPER_DOOR_CORPUS.map(({ fen }) => parseFen(fen)),
      ...TAPER_MIRROR_POSITIONS.map(({ fen }) => parseFen(fen)),
      ...TAPER_KP_ENDINGS.flatMap((row) => [parseFen(row.centreFen), parseFen(row.cornerFen)]),
      ...TAPER_PASSER_PAIRS.flatMap((row) => [
        parseFen(row.withPasserFen),
        parseFen(row.withoutPasserFen),
      ]),
    ];
    expect(positions.length).toBeGreaterThan(184);
    const bad = positions.filter(
      (position) => !Object.is(evaluate(position), evaluateAtPhase(position, phaseOf(position))),
    );
    expect(bad.length).toBe(0);
  });
});

describe("ABC-269 cut C1 P5 — the guard: no per-call phase walk on the shipped path", () => {
  const EVALUATE = readFileSync(new URL("./evaluate.ts", import.meta.url), "utf8");
  const walk = (): string => {
    const at = EVALUATE.indexOf("function whiteMinusBlack(");
    return code(EVALUATE.slice(at, EVALUATE.indexOf("\n}\n", at)));
  };

  it("the board walk holds no phase add and no king delta: both are read after it", () => {
    const body = walk();
    expect(body.length).toBeGreaterThan(500); // the function, not nothing
    const loop = body.slice(
      body.indexOf("for (let rank = 7;"),
      body.indexOf("const mobilityScore"),
    );
    expect(loop.length).toBeGreaterThan(200);
    expect(loop).not.toMatch(/PHASE_WEIGHT|phase|KING_EG_DELTA|egDelta/);
    expect(body).not.toMatch(/PHASE_WEIGHT/);
    expect(body).toContain("phase: number");
    expect(body).toContain("KING_EG_DELTA[(7 - (whiteKing >> 4)) * 8 + (whiteKing & 7)]");
    expect(body).toContain("egDelta -= KING_EG_DELTA[(blackKing >> 4) * 8 + (blackKing & 7)]");
  });

  it("phaseOf is called once per root (search: the root and the depth-less leaf; engine: once per call), and nowhere in quiescence", () => {
    expect(code(SOURCES.search).match(/\bphaseOf\(/g)).toHaveLength(2);
    expect(code(SOURCES.search)).toContain("const rootPhase = phaseOf(position);");
    expect(code(SOURCES.engine).match(/\bphaseOf\(/g)).toHaveLength(1);
    expect(code(SOURCES.engine)).toContain(
      "const rootPhase = phaseOf(position); let best = runIteration(",
    );
    expect(code(SOURCES.quiescence).match(/\bphaseOf\(/g)).toBeNull();
  });

  it("each child is phaseAfterMove of its parent; the null move's child keeps the phase", () => {
    expect(code(SOURCES.search).match(/phaseAfterMove\((phase|rootPhase), move\)/g)).toHaveLength(
      2,
    );
    expect(code(SOURCES.engine).match(/phaseAfterMove\((phase|rootPhase), move\)/g)).toHaveLength(
      2,
    );
    expect(code(SOURCES.quiescence).match(/phaseAfterMove\(phase, move\)/g)).toHaveLength(1);
    expect(code(SOURCES.search)).toContain("killers, keys, true, phase, );");
    expect(code(SOURCES.engine)).toContain("budget, true, phase, );");
  });

  it("the carrier is an argument: no phase on Position, UndoRecord or module state", () => {
    for (const name of ["position.ts", "apply.ts"]) {
      const source = readFileSync(new URL(`./${name}`, import.meta.url), "utf8");
      expect(source.includes("phase"), name).toBe(false);
    }
    for (const source of [EVALUATE, SOURCES.search, SOURCES.engine, SOURCES.quiescence]) {
      expect(source).not.toMatch(/^(let|var|const)\s+\w*[pP]hase\w*\s*=/m);
    }
  });
});

/** `ADR-0064` d8 B0's boards. */
const KIWIPETE = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1";
const POSITION_6 = "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10";

if (RUN_DEEP) {
  const deepen = (
    choose: typeof chooseMove,
    fen: string,
    maxDepth: number,
  ): { nodes: number; depth: number } => {
    const choice = choose(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth });
    if (choice === null) throw new Error("no move");
    return { nodes: choice.nodes, depth: choice.depth };
  };

  describe("ABC-269 B0 — node identity with the design: the probe's form-L counts, and the doors' pre-ticket counts [deep, SEARCH_DEEP=1]", () => {
    const B0: ReadonlyArray<[string, string, number, number]> = [
      ["kiwipete", KIWIPETE, 8, 1_296_788],
      ["kiwipete", KIWIPETE, 9, 2_733_330],
      ["position-6", POSITION_6, 8, 404_930],
      ["position-6", POSITION_6, 9, 926_005],
      ["position-6", POSITION_6, 10, 1_692_669],
    ];
    it.each(B0)(
      "chooseMove, %s, to depth %i: %i nodes [deep, SEARCH_DEEP=1]",
      (_, fen, depth, nodes) => {
        expect(deepen(chooseMove, fen, depth)).toEqual({ nodes, depth });
      },
      600_000,
    );

    it("chooseMoveWithoutTaper to depth 8: main's 1 306 981 / 391 451 [deep, SEARCH_DEEP=1]", () => {
      expect(deepen(chooseMoveWithoutTaper, KIWIPETE, 8).nodes).toBe(1_306_981);
      expect(deepen(chooseMoveWithoutTaper, POSITION_6, 8).nodes).toBe(391_451);
    }, 600_000);

    it("search() at depth 8: 839 514 / 1 533 901; searchWithoutTaper: main's 888 786 / 1 262 046 [deep, SEARCH_DEEP=1]", () => {
      expect(search(parseFen(KIWIPETE), 8).nodes).toBe(839_514);
      expect(search(parseFen(POSITION_6), 8).nodes).toBe(1_533_901);
      expect(searchWithoutTaper(parseFen(KIWIPETE), 8).nodes).toBe(888_786);
      expect(searchWithoutTaper(parseFen(POSITION_6), 8).nodes).toBe(1_262_046);
    }, 600_000);
  });

  describe("ABC-269 B2 — the mate floor on the 287: the door's mates are same-sign mates for search() [deep, SEARCH_DEEP=1]", () => {
    const isMate = (score: number): boolean => Math.abs(score) > MATE_SCORE - 1_000;
    const violations = (doorDepth: number): { mates: number; bad: string[] } => {
      let mates = 0;
      const bad: string[] = [];
      for (const fen of MATE_CORPUS) {
        const door = searchWithoutTaper(parseFen(fen), doorDepth).score;
        if (!isMate(door)) continue;
        mates++;
        const shipped = search(parseFen(fen), 5).score;
        if (!isMate(shipped) || Math.sign(shipped) !== Math.sign(door)) bad.push(fen);
      }
      return { mates, bad };
    };

    it("the door's depth-4 mates, search() at depth 5: 0 violations [deep, SEARCH_DEEP=1]", () => {
      const { mates, bad } = violations(4);
      console.log(
        `ABC-269 B2 mate floor, door d4 -> search() d5: ${bad.length} of ${mates} violated`,
      );
      expect(mates).toBeGreaterThan(100);
      expect(bad).toEqual([]);
    }, 600_000);

    it("the door's depth-5 mates, search() at depth 5: 0 violations [deep, SEARCH_DEEP=1]", () => {
      const { mates, bad } = violations(5);
      console.log(
        `ABC-269 B2 mate floor, door d5 -> search() d5: ${bad.length} of ${mates} violated`,
      );
      expect(mates).toBeGreaterThan(100);
      expect(bad).toEqual([]);
    }, 600_000);
  });
}
