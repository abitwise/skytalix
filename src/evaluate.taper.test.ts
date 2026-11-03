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

import { readdirSync, readFileSync, statSync } from "node:fs";
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
  type EvaluationParameters,
  evaluate,
  evaluateAtPhase,
  evaluateWithoutMobility,
  evaluateWithoutTaper,
  isPassedPawn,
  phaseAfterMove,
  phaseOf,
  VALUE_TABLES_FOR_TEST,
  withParametersForTest,
} from "./evaluate.ts";
import * as PARAMS from "./evaluate-params.ts";
import { parseFen, toFen } from "./fen.ts";
import { legalMoves } from "./legal.ts";
import { FLAG_CASTLE, FLAG_EN_PASSANT, type Move } from "./moves.ts";
import {
  BISHOP,
  BLACK,
  EMPTY,
  isBlack,
  isOnBoard,
  KING,
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

  // `ABC-279` (`ADR-0069` decision 8): its door, `searchWithoutSeePruning` / `chooseMoveWithoutSeePruning`,
  // keeps the taper on and is now the shipped path less the newer switch, so `ABC-269`'s door is
  // that door with taper off.
  for (const [name, call, shipped, seeDoor, door] of [
    [
      "search",
      "searchRoot(position, depth, {",
      "search",
      "searchWithoutSeePruning",
      "searchWithoutTaper",
    ],
    [
      "engine",
      "deepen(position, options, {",
      "chooseMove",
      "chooseMoveWithoutSeePruning",
      "chooseMoveWithoutTaper",
    ],
  ] as const) {
    it(`${name}: taper is on in ${shipped} and ${seeDoor} only; ${door} is ${seeDoor} with taper off; every older door turns it off`, () => {
      const literals = literalsByEntry(SOURCES[name], call);
      expect(Object.keys(literals).length).toBeGreaterThanOrEqual(name === "search" ? 15 : 9);
      for (const [entry, literal] of Object.entries(literals)) {
        const on = entry === shipped || entry === seeDoor;
        expect(literal, entry).toContain(on ? "taper: true," : "taper: false,");
      }
      const strip = (literal: string): string => literal.replace(/\s*taper: (true|false),/, "");
      expect(strip(literals[door] as string)).toBe(strip(literals[seeDoor] as string));
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

// ---------------------------------------------------------------------------
// ABC-274 (E2-pre, `ADR-0067` decision 8): every term's two halves enter the blend, value-identical
// at E1's table. A3 (the blend is live for every family) and A9 (the packed sums fit in int16).
// ---------------------------------------------------------------------------

/** White's point of view of a side-to-move score. */
const whitePov = (position: Position, score: number): number =>
  position.blackToMove ? 0 - score : score;

/** Pawns of one colour per file (index 0 = a), ranks 2–7. */
function pawnFiles(position: Position, black: boolean): number[] {
  const files = [0, 0, 0, 0, 0, 0, 0, 0];
  const own = black ? PAWN | BLACK : PAWN;
  for (let rank = 1; rank <= 6; rank++) {
    for (let file = 0; file < 8; file++) {
      if (position.board[rank * 16 + file] === own) files[file] = (files[file] as number) + 1;
    }
  }
  return files;
}

/** ABC-082's doubled count: pawns beyond the first on each file. */
const doubledCount = (position: Position, black: boolean): number =>
  pawnFiles(position, black).reduce((sum, n) => sum + Math.max(0, n - 1), 0);

/** ABC-082's isolated count: pawns with no own pawn on an adjacent file. */
function isolatedCount(position: Position, black: boolean): number {
  const files = pawnFiles(position, black);
  let count = 0;
  for (let file = 0; file < 8; file++) {
    const left = file > 0 ? (files[file - 1] as number) : 0;
    const right = file < 7 ? (files[file + 1] as number) : 0;
    if (left === 0 && right === 0) count += files[file] as number;
  }
  return count;
}

function passedCount(position: Position, black: boolean): number {
  const own = black ? PAWN | BLACK : PAWN;
  let count = 0;
  for (let rank = 1; rank <= 6; rank++) {
    for (let file = 0; file < 8; file++) {
      const square = rank * 16 + file;
      if (position.board[square] === own && isPassedPawn(position.board, square)) count++;
    }
  }
  return count;
}

/** ABC-083's three king-file counts for one king, by the rule in `src/evaluate.ts`. */
function kingFileCounts(
  position: Position,
  black: boolean,
): { shelter: number; halfOpen: number; open: number } {
  const board = position.board;
  const king = board.indexOf(black ? KING | BLACK : KING);
  const own = black ? PAWN | BLACK : PAWN;
  const enemy = own ^ BLACK;
  const step = black ? -1 : 1;
  const counts = { shelter: 0, halfOpen: 0, open: 0 };
  const kingFile = king & 7;
  for (let file = Math.max(0, kingFile - 1); file <= Math.min(7, kingFile + 1); file++) {
    const r1 = (king >> 4) + step;
    const r2 = r1 + step;
    const sheltered =
      (r1 >= 0 && r1 <= 7 && board[r1 * 16 + file] === own) ||
      (r2 >= 0 && r2 <= 7 && board[r2 * 16 + file] === own);
    if (!sheltered) counts.shelter++;
    let hasOwn = false;
    let hasEnemy = false;
    for (let rank = 1; rank <= 6; rank++) {
      if (board[rank * 16 + file] === own) hasOwn = true;
      else if (board[rank * 16 + file] === enemy) hasEnemy = true;
    }
    if (!hasOwn) {
      if (hasEnemy) counts.halfOpen++;
      else counts.open++;
    }
  }
  return counts;
}

/**
 * S1: mobility's count m, white minus black, by `ADR-0031` d2's attack-map rule as
 * `squaresReached` states it: each non-pawn piece (the king too) counts the empty squares it
 * reaches, plus the first occupied square on each line when it holds an enemy piece.
 */
function mobilityCount(position: Position): number {
  const board = position.board;
  const knight = [33, 31, 18, 14, -14, -18, -31, -33];
  const king = [17, 16, 15, 1, -1, -15, -16, -17];
  const diagonals = [17, 15, -15, -17];
  const lines = [16, 1, -1, -16];
  let count = 0;
  for (let square = 0; square < 128; square++) {
    if (!isOnBoard(square)) continue;
    const piece = board[square] as number;
    if (piece === EMPTY) continue;
    const type = pieceType(piece);
    if (type === PAWN) continue;
    const black = isBlack(piece);
    const reachable = (target: number): boolean => target === EMPTY || isBlack(target) !== black;
    let reached = 0;
    if (type === KNIGHT || type === KING) {
      for (const step of type === KNIGHT ? knight : king) {
        const to = square + step;
        if (isOnBoard(to) && reachable(board[to] as number)) reached++;
      }
    } else {
      const rays = type === BISHOP ? diagonals : type === ROOK ? lines : [...diagonals, ...lines];
      for (const ray of rays) {
        for (let at = square + ray; isOnBoard(at); at += ray) {
          const target = board[at] as number;
          if (reachable(target)) reached++;
          if (target !== EMPTY) break;
        }
      }
    }
    count += black ? -reached : reached;
  }
  return count;
}

/** Pieces of `type` on files a–d (the A3 offset's squares), white minus black. */
function queensideCount(position: Position, type: number): number {
  let count = 0;
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 4; file++) {
      const piece = position.board[rank * 16 + file] as number;
      if (piece !== EMPTY && pieceType(piece) === type) count += isBlack(piece) ? -1 : 1;
    }
  }
  return count;
}

function nonKingCount(position: Position): number {
  let count = 0;
  for (let square = 0; square < 128; square++) {
    if (!isOnBoard(square)) continue;
    const piece = position.board[square] as number;
    if (piece === EMPTY || pieceType(piece) === KING) continue;
    count += isBlack(piece) ? -1 : 1;
  }
  return count;
}

describe("ABC-274 A3 — the blend is live for every term family (ADR-0067 decision 8, scope 1)", () => {
  /** The offset on one family's endgame half: a multiple of D, so a non-zero count always moves Δ. */
  const C = 24;
  const SPAN = PARAMS.PHASE_MG - PARAMS.PHASE_EG;
  const plus = (values: readonly number[], at: (i: number) => boolean): number[] =>
    values.map((value, i) => (at(i) ? value + C : value));
  const queenside = (i: number): boolean => (i & 7) < 4;
  const clamp = (value: number, cap: number): number => Math.max(-cap, Math.min(cap, value));
  const weight = PARAMS.MOBILITY_WEIGHT.eg;
  const cap = PARAMS.MOBILITY_CAP.eg;

  /**
   * S1 (`arch-ABC-274-seam`): the mobility count m, white minus black, by the test's own board
   * counter (the `squaresReached` rule), so it reads neither weight nor cap and does not need the
   * two mobility halves to be equal. Checked against `evaluate` (weights 1/1, cap not binding)
   * by its own row below.
   */
  const reach = (position: Position): number => mobilityCount(position);

  /** Each family: its offset table, and the Δ shift (white's view) the offset must cause. */
  const pieceFamilies = (["pawn", "knight", "bishop", "rook", "queen", "king"] as const).map(
    (piece, index) => ({
      name: `PST.${piece}`,
      params: {
        ...PARAMS,
        PST: {
          ...PARAMS.PST,
          [piece]: { mg: PARAMS.PST[piece].mg, eg: plus(PARAMS.PST[piece].eg, queenside) },
        },
      } as EvaluationParameters,
      shift: (p: Position): number | null => C * queensideCount(p, index + 1),
    }),
  );
  const kingFamily = (
    name: "KING_SHELTER_MISSING" | "KING_FILE_HALF_OPEN" | "KING_FILE_OPEN",
    key: "shelter" | "halfOpen" | "open",
    pair: { readonly mg: number; readonly eg: number },
  ) => ({
    name,
    params: { ...PARAMS, [name]: { mg: pair.mg, eg: pair.eg + C } },
    shift: (p: Position): number | null =>
      -C * (kingFileCounts(p, false)[key] - kingFileCounts(p, true)[key]),
  });
  const FAMILIES: {
    name: string;
    params: EvaluationParameters;
    shift: (p: Position) => number | null;
  }[] = [
    {
      name: "MATERIAL",
      params: {
        ...PARAMS,
        MATERIAL: { mg: PARAMS.MATERIAL.mg, eg: plus(PARAMS.MATERIAL.eg, (i) => i >= 1 && i <= 5) },
      },
      shift: (p) => C * nonKingCount(p),
    },
    ...pieceFamilies,
    {
      name: "DOUBLED",
      params: { ...PARAMS, DOUBLED: { mg: PARAMS.DOUBLED.mg, eg: PARAMS.DOUBLED.eg + C } },
      shift: (p) => -C * (doubledCount(p, false) - doubledCount(p, true)),
    },
    {
      name: "ISOLATED",
      params: { ...PARAMS, ISOLATED: { mg: PARAMS.ISOLATED.mg, eg: PARAMS.ISOLATED.eg + C } },
      shift: (p) => -C * (isolatedCount(p, false) - isolatedCount(p, true)),
    },
    {
      name: "PASSED",
      params: {
        ...PARAMS,
        PASSED: { mg: PARAMS.PASSED.mg, eg: plus(PARAMS.PASSED.eg, (i) => i >= 1 && i <= 6) },
      },
      shift: (p) => C * (passedCount(p, false) - passedCount(p, true)),
    },
    kingFamily("KING_SHELTER_MISSING", "shelter", PARAMS.KING_SHELTER_MISSING),
    kingFamily("KING_FILE_HALF_OPEN", "halfOpen", PARAMS.KING_FILE_HALF_OPEN),
    kingFamily("KING_FILE_OPEN", "open", PARAMS.KING_FILE_OPEN),
    {
      name: "MOBILITY_WEIGHT",
      params: { ...PARAMS, MOBILITY_WEIGHT: { mg: PARAMS.MOBILITY_WEIGHT.mg, eg: weight + C } },
      shift: (p) => {
        const m = reach(p);
        return clamp((weight + C) * m, cap) - clamp(weight * m, cap);
      },
    },
    {
      name: "MOBILITY_CAP",
      // Three times C: the cap's offset bites only where |weight × m| is above the new cap.
      params: { ...PARAMS, MOBILITY_CAP: { mg: PARAMS.MOBILITY_CAP.mg, eg: cap - 3 * C } },
      shift: (p) => {
        const m = reach(p);
        return clamp(weight * m, cap - 3 * C) - clamp(weight * m, cap);
      },
    },
  ];

  /**
   * The positions: the frozen corpora already in the repository (`G3`'s 184 in `buildCorpus` order,
   * QE's E1 door corpus, then the mate corpus, `ABC-269` `B2`'s 287), each family's first six at
   * phases 1–23 where the term is present (its shift is not 0). Chosen by that rule alone.
   */
  const CORPUS = [
    ...buildCorpus().map((entry) => entry.position),
    ...TAPER_DOOR_CORPUS.map((row) => parseFen(row.fen)),
    ...MATE_CORPUS.map((fen) => parseFen(fen)),
  ];

  it("names every family in scope 1: material, the six square tables, the pawn and king-file terms, mobility", () => {
    expect(FAMILIES.map((family) => family.name)).toEqual([
      "MATERIAL",
      "PST.pawn",
      "PST.knight",
      "PST.bishop",
      "PST.rook",
      "PST.queen",
      "PST.king",
      "DOUBLED",
      "ISOLATED",
      "PASSED",
      "KING_SHELTER_MISSING",
      "KING_FILE_HALF_OPEN",
      "KING_FILE_OPEN",
      "MOBILITY_WEIGHT",
      "MOBILITY_CAP",
    ]);
  });

  for (const family of FAMILIES) {
    it(`${family.name}: the score is mg + trunc((Δ + offset) × (D − w) / D), exactly, on ≥ 3 positions at phases 1–23`, () => {
      const rows = CORPUS.filter((position) => {
        const phase = phaseOf(position);
        const shift = family.shift(position);
        return phase >= 1 && phase <= 23 && shift !== null && shift !== 0;
      }).slice(0, 6);
      expect(rows.length).toBeGreaterThanOrEqual(3);

      // Read outside the seam, at E1's table: mg, Δ (the blend at phase 0 minus mg) and the
      // offset's shift of Δ.
      const e1 = rows.map((position) => {
        const mg = whitePov(position, evaluateWithoutTaper(position));
        const delta = whitePov(position, evaluateAtPhase(position, 0)) - mg;
        return { mg, delta, shift: family.shift(position) as number };
      });

      withParametersForTest(family.params, () => {
        rows.forEach((position, i) => {
          const { mg, delta, shift } = e1[i] as { mg: number; delta: number; shift: number };
          const w = Math.max(0, Math.min(SPAN, phaseOf(position) - PARAMS.PHASE_EG));
          const expected = mg + Math.trunc(((delta + shift) * (SPAN - w)) / SPAN);
          const fen = toFen(position);
          expect(Object.is(evaluate(position), whitePov(position, expected)), fen).toBe(true);
          // The middlegame half does not move, and at phase 0 the whole offset is read: a blend
          // that ignored this family's endgame half would read 0 here.
          expect(whitePov(position, evaluateWithoutTaper(position)), fen).toBe(mg);
          expect(whitePov(position, evaluateAtPhase(position, 0)) - (mg + delta), fen).toBe(shift);
        });
      });
    });
  }

  it("the seam leaves E1's table in place: every score after it equals the score before it", () => {
    const before = CORPUS.map((position) => evaluate(position));
    withParametersForTest(FAMILIES[0]?.params as EvaluationParameters, () => {
      expect(CORPUS.some((position, i) => evaluate(position) !== before[i])).toBe(true);
    });
    expect(CORPUS.every((position, i) => Object.is(evaluate(position), before[i]))).toBe(true);
  });

  it("S1: the test's mobility count is the engine's, read with weights 1/1 and a cap that never binds", () => {
    const unit = {
      ...PARAMS,
      MOBILITY_WEIGHT: { mg: 1, eg: 1 },
      MOBILITY_CAP: { mg: 1_000_000, eg: 1_000_000 },
    };
    withParametersForTest(unit, () => {
      for (const position of CORPUS) {
        const term = whitePov(position, evaluate(position) - evaluateWithoutMobility(position));
        expect(term, toFen(position)).toBe(mobilityCount(position));
      }
    });
  });

  it("S2: a throwing run and a throwing loader each throw out of the seam, and every score after is Object.is the score before", () => {
    const before = CORPUS.map((position) => evaluate(position));
    expect(() =>
      withParametersForTest(FAMILIES[0]?.params as EvaluationParameters, () => {
        throw new Error("run throws");
      }),
    ).toThrow("run throws");
    expect(CORPUS.every((position, i) => Object.is(evaluate(position), before[i]))).toBe(true);
    // The square tables and terms load first, then the missing mobility pair throws: a loader
    // outside the seam's `try` would leave the offset tables in place.
    const broken = {
      ...(FAMILIES[0]?.params as EvaluationParameters),
      MOBILITY_WEIGHT: undefined,
    } as unknown as EvaluationParameters;
    expect(() => withParametersForTest(broken, () => 0)).toThrow(TypeError);
    expect(CORPUS.every((position, i) => Object.is(evaluate(position), before[i]))).toBe(true);
  });

  it("S3: only src/evaluate.ts and src/*.test.ts name the seam, no tools/ file does, and loadParameters( runs at load and in the seam only", () => {
    const srcDirectory = new URL(".", import.meta.url).pathname;
    const namers = readdirSync(srcDirectory)
      .filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts"))
      .filter((file) =>
        readFileSync(`${srcDirectory}${file}`, "utf8").includes("withParametersForTest"),
      );
    expect(namers).toEqual(["evaluate.ts"]);

    const toolsDirectory = new URL("../tools/", import.meta.url).pathname;
    const toolFiles = (readdirSync(toolsDirectory, { recursive: true }) as string[])
      .map((file) => `${toolsDirectory}${file}`)
      .filter((file) => statSync(file).isFile());
    expect(toolFiles.length).toBeGreaterThan(0);
    expect(
      toolFiles.filter((file) => readFileSync(file, "utf8").includes("withParametersForTest")),
    ).toEqual([]);

    const source = readFileSync(`${srcDirectory}evaluate.ts`, "utf8");
    const calls = source
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.includes("loadParameters(") && !line.startsWith("*"));
    expect(calls).toEqual([
      "function loadParameters(parameters: EvaluationParameters): void {",
      "loadParameters(PARAMETERS);",
      "loadParameters(parameters);",
      "loadParameters(PARAMETERS);",
    ]);
    // The first call sits at module load (column 0); the other two are inside the seam's body.
    expect(source).toContain("\nloadParameters(PARAMETERS);\n");
    const seam = source.slice(source.indexOf("export function withParametersForTest"));
    expect(seam.match(/loadParameters\(/g)?.length).toBe(2);
  });
});

describe("ABC-274 A9 — the packed sums fit in int16, bounded from src/evaluate-params.ts's own maxima", () => {
  /**
   * A bound on |Σ half| (white minus black) over the terms inside the packed sum: material and
   * square tables (one king, at most 15 other pieces a side, any of them the largest entry), the
   * three pawn terms (at most 8 pawns a side, each doubled, isolated and passed at once) and the
   * three king-file terms (at most 3 files per king). The king's square table enters the packed
   * sum by its middlegame half in both halves (its Δ is read after the walk). Mobility is outside
   * the packed sum: it is clamped, so it is not linear, and is carried as a pair of its own.
   */
  const bound = (params: EvaluationParameters, half: "mg" | "eg"): number => {
    const material = params.MATERIAL[half];
    const entries = (type: number, table: readonly number[]): number[] =>
      table.map((value) => (material[type] as number) + value);
    const king = entries(6, params.PST.king.mg);
    const others = [
      entries(1, params.PST.pawn[half]),
      entries(2, params.PST.knight[half]),
      entries(3, params.PST.bishop[half]),
      entries(4, params.PST.rook[half]),
      entries(5, params.PST.queen[half]),
    ].flat();
    const sideMax = Math.max(...king) + 15 * Math.max(0, ...others);
    const sideMin = Math.min(...king) + 15 * Math.min(0, ...others);
    const passed = Math.max(...params.PASSED[half].map(Math.abs));
    const pawns = 8 * (passed + Math.abs(params.DOUBLED[half]) + Math.abs(params.ISOLATED[half]));
    const kingFiles =
      3 *
      (Math.abs(params.KING_SHELTER_MISSING[half]) +
        Math.max(
          Math.abs(params.KING_FILE_HALF_OPEN[half]),
          Math.abs(params.KING_FILE_OPEN[half]),
        ));
    return sideMax - sideMin + 2 * pawns + 2 * kingFiles;
  };

  it("Σ mg and Σ eg, white minus black, each lie inside −32 768 … 32 767", () => {
    for (const half of ["mg", "eg"] as const) {
      const b = bound(PARAMS, half);
      console.log(`ABC-274 A9: |Σ ${half}| <= ${b} (int16 limit 32767)`);
      expect(b).toBeLessThanOrEqual(32_767);
      expect(-b).toBeGreaterThanOrEqual(-32_768);
    }
  });

  it("the bound reads the table: a queen endgame half of 3 000 would turn it red", () => {
    const heavy = {
      ...PARAMS,
      MATERIAL: {
        mg: PARAMS.MATERIAL.mg,
        eg: PARAMS.MATERIAL.eg.map((v, i) => (i === 5 ? 3000 : v)),
      },
    };
    expect(bound(heavy, "eg")).toBeGreaterThan(32_767);
    expect(bound(heavy, "mg")).toBe(bound(PARAMS, "mg"));
  });
});
