/**
 * ABC-210 acceptance — the check extension at the horizon (`ADR-0051`): `A2`, `A3`, and the rows
 * `ADR-0051`'s Consequences owe the rule. `A1` compares two builds and runs out of tree (the page's
 * 2026-10-27 line); the export lists of `ABC-077` `A6` and `ABC-078` `A4` grow by the new names, and
 * `QE-208-c`'s door maps by the two doors.
 *
 * THE BOUNDED ORACLE IS A REGRESSION NET, NOT A PROOF OF THE RULE (`ADR-0051` decision 7). It reds an
 * extension at every node in check and at every horizon node; it passes a 2-ply extension, no cap and
 * a dead switch. So the rule is guarded row by row: the predicate's table reds a 2-ply extension, no
 * cap, an interior extension and an extension out of check; the source row reds a recursion that
 * does not call the predicate where the ruling says; `A2`'s rows and the instrument red a dead switch
 * and a 2-ply extension; the cap row reds "no cap".
 *
 * THE INSTRUMENT (`ADR-0051` decision 8, the page's test note 1): call-through module mocks of
 * `src/apply.ts` (make and unmake, null included) and `src/quiescence.ts` (`quiesce`). The line's
 * length is replayed from their global invocation order: every make lengthens it by one, every
 * unmake shortens it, and each `quiesce` call at qply 0 reads it. No production counter is added.
 *
 * LANES (`N8-LANE`): the default lane holds the predicate's table, the source rows, the switch
 * literal row, `A2`'s five horizon rows, the cap row and the instrument at depths 1 and 2.
 * `SEARCH_DEEP=1` adds the instrument on four roots at depth 5, `A3`'s node bound at depth 6, the
 * depth-5 drift in both recursions on the 190 and the same-depth mate floor on the 287. Every row is
 * deterministic: a fixed depth, or `chooseMove` on a frozen clock with `maxDepth`. Unset, the deep
 * cases are NOT DEFINED rather than skipped.
 */

import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { makeMove, unmakeMove } from "./apply.ts";
import { chooseMove, chooseMoveWithoutCheckExtension, type EngineChoice } from "./engine.ts";
import { parseFen, toFen } from "./fen.ts";
import { gameStatus } from "./gameend.ts";
import { givesCheck, isInCheck, legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import { squareName } from "./position.ts";
import { MATE_CORPUS } from "./search.mate-corpus.ts";
import {
  checkExtensionPlies,
  MATE_SCORE,
  type SearchResult,
  search,
  searchWithoutCheckExtension,
} from "./search.ts";

const RUN_DEEP = process.env.SEARCH_DEEP === "1";

/** The line's length now, and the longest one any qply-0 `quiesce` call has seen while `on`. */
const line = vi.hoisted(() => ({ on: false, ply: 0, deepest: 0, leaves: 0 }));

vi.mock("./apply.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./apply.ts")>();
  return {
    ...actual,
    makeMove: (...args: Parameters<typeof actual.makeMove>) => {
      line.ply++;
      return actual.makeMove(...args);
    },
    unmakeMove: (...args: Parameters<typeof actual.unmakeMove>) => {
      line.ply--;
      actual.unmakeMove(...args);
    },
    makeNullMove: (...args: Parameters<typeof actual.makeNullMove>) => {
      line.ply++;
      return actual.makeNullMove(...args);
    },
    unmakeNullMove: (...args: Parameters<typeof actual.unmakeNullMove>) => {
      line.ply--;
      actual.unmakeNullMove(...args);
    },
  };
});

vi.mock("./quiescence.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./quiescence.ts")>();
  return {
    ...actual,
    quiesce: (...args: Parameters<typeof actual.quiesce>) => {
      if (line.on && args[3] === 0) {
        line.leaves++;
        if (line.ply > line.deepest) line.deepest = line.ply;
      }
      return actual.quiesce(...args);
    },
  };
});

afterEach(() => {
  line.on = false;
  line.deepest = 0;
  line.leaves = 0;
});

/** The deepest ply any quiescence leaf of `run` was entered at. */
function deepestLeaf(run: () => unknown): number {
  line.deepest = 0;
  line.leaves = 0;
  line.ply = 0;
  line.on = true;
  try {
    run();
  } finally {
    line.on = false;
  }
  expect(line.ply, "every make was unmade").toBe(0);
  expect(line.leaves, "the run reached a quiescence leaf").toBeGreaterThan(0);
  return line.deepest;
}

/** `chooseMove`-shaped `choose` on a frozen clock, deepened to `depth` exactly. */
const deepenTo = (choose: typeof chooseMove, fen: string, depth: number): EngineChoice => {
  const choice = choose(parseFen(fen), {
    budgetMs: 1_000,
    now: () => 0,
    maxDepth: depth,
  }) as EngineChoice;
  expect(choice.depth).toBe(depth);
  return choice;
};

const uci = (move: Move | null): string =>
  move === null ? "none" : `${squareName(move.from)}${squareName(move.to)}`;

const isMate = (score: number): boolean => Math.abs(score) > MATE_SCORE - 1_000;

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

const fenOf = (name: string): string =>
  (ROOTS.find((root) => root.name === name) as { fen: string }).fen;

// ---------------------------------------------------------------------------
// The rule (`ADR-0051` decision 2): one pure predicate, called at node entry in both recursions.
// ---------------------------------------------------------------------------

/** White to move and in check (the black rook on e8); Black to move and in check; nobody in check. */
const WHITE_IN_CHECK = "4r1k1/8/8/8/8/8/8/4K3 w - - 0 1";
const BLACK_IN_CHECK = "4R1k1/8/8/8/8/8/8/4K3 b - - 0 1";
const QUIET = "6k1/8/8/8/8/8/8/R3K3 w - - 0 1";

describe("checkExtensionPlies — 1 at the horizon in check, once per line; 0 above it, at the cap, out of check", () => {
  const TABLE: ReadonlyArray<{
    why: string;
    fen: string;
    depth: number;
    extensions: number;
    plies: number;
  }> = [
    { why: "at the horizon, in check", fen: WHITE_IN_CHECK, depth: 0, extensions: 0, plies: 1 },
    {
      why: "Black in check at the horizon",
      fen: BLACK_IN_CHECK,
      depth: 0,
      extensions: 0,
      plies: 1,
    },
    { why: "below the horizon, in check", fen: WHITE_IN_CHECK, depth: -1, extensions: 0, plies: 1 },
    { why: "an interior node, in check", fen: WHITE_IN_CHECK, depth: 1, extensions: 0, plies: 0 },
    { why: "a deeper interior node", fen: WHITE_IN_CHECK, depth: 4, extensions: 0, plies: 0 },
    { why: "the line is at the cap", fen: WHITE_IN_CHECK, depth: 0, extensions: 1, plies: 0 },
    { why: "the line is past the cap", fen: BLACK_IN_CHECK, depth: 0, extensions: 2, plies: 0 },
    { why: "at the horizon, out of check", fen: QUIET, depth: 0, extensions: 0, plies: 0 },
    { why: "out of check, below the horizon", fen: QUIET, depth: -1, extensions: 0, plies: 0 },
  ];

  for (const { why, fen, depth, extensions, plies } of TABLE) {
    it(`${why}: depth ${depth}, ${extensions} extension(s) so far -> ${plies}`, () => {
      const position = parseFen(fen);
      const before = toFen(position);
      expect(checkExtensionPlies(position, depth, extensions)).toBe(plies);
      expect(toFen(position)).toBe(before); // pure: the position is untouched
    });
  }

  it("the fixtures bite: each board really is what its row says", () => {
    expect(isInCheck(parseFen(WHITE_IN_CHECK))).toBe(true);
    expect(isInCheck(parseFen(BLACK_IN_CHECK))).toBe(true);
    expect(isInCheck(parseFen(QUIET))).toBe(false);
    expect(checkExtensionPlies.length).toBe(3);
  });
});

describe("both recursions extend through the predicate at node entry, after the repetition scan and before the leaf test", () => {
  const MODULES = [
    { path: "./search.ts", depth: "depth", on: "switches.checkExtension" },
    { path: "./engine.ts", depth: "remaining", on: "budget.checkExtension" },
  ];

  for (const { path, depth, on } of MODULES) {
    it(`${path}: calls checkExtensionPlies once, adds its value to the depth and the count, and passes the count on`, () => {
      const flat = readFileSync(new URL(path, import.meta.url), "utf8").replace(/\s+/g, " ");
      expect(flat.length, path).toBeGreaterThan(1000); // the module, not nothing
      // The rule, called once (search.ts declares it too), with the node's depth and the line's count.
      const calls = flat.match(/checkExtensionPlies\(/g) ?? [];
      expect(calls.length, path).toBe(path === "./search.ts" ? 2 : 1);
      const block =
        `if (${on}) { const extension = checkExtensionPlies(position, ${depth}, extensions); ` +
        `${depth} += extension; extensions += extension; }`;
      expect(flat, path).toContain(block);
      // Its place in negamax: after the repetition scan, before the leaf test and the table probe.
      const body = flat.slice(flat.indexOf("function negamax("));
      const at = body.indexOf(block);
      expect(body.indexOf("repeatsInPath(keys, ply, position.halfmoveClock)"), path).toBeLessThan(
        at,
      );
      expect(body.indexOf(`if (${depth} <= 0 || ply >= KEY_ARRAY_CAPACITY)`), path).toBeGreaterThan(
        at,
      );
      expect(body.indexOf("probeTable("), path).toBeGreaterThan(at);
      // The count is an argument, placed before the null flag (which stays the last one).
      expect(body, path).toMatch(
        /^function negamax\([^)]*extensions: number, afterNull: boolean,? ?\)/,
      );
      // Every child — the null child and each real move's — is handed the node's count on.
      const children = [...flat.matchAll(/(?<!function) negamax\(([^)]*)\)/g)].map((match) =>
        (match[1] as string)
          .replace(/,\s*$/, "")
          .split(",")
          .map((arg) => arg.trim()),
      );
      expect(children.length, path).toBeGreaterThanOrEqual(5);
      for (const args of children) expect(args.at(-2), path).toBe("extensions");
    });
  }
});

describe("the switch — checkExtension is true on search() and chooseMove only, false on every door", () => {
  const MODULES = [
    {
      path: "./search.ts",
      call: "searchRoot(position, depth, {",
      doors: {
        search: "true",
        searchWithoutCheckExtension: "false",
        searchWithoutNullMove: "false",
        searchWithoutPruning: "false",
        searchWithoutQuiescence: "false",
        searchWithoutPruningOrQuiescence: "false",
        searchWithoutOrdering: "false",
        searchWithoutKillers: "false",
        searchWithoutTable: "false",
        searchWithoutReductions: "false",
        searchWithoutPvsOrReductions: "false",
      },
    },
    {
      path: "./engine.ts",
      call: "deepen(position, options, {",
      doors: {
        chooseMove: "true",
        chooseMoveWithoutCheckExtension: "false",
        chooseMoveWithoutNullMove: "false",
        chooseMoveWithoutReductions: "false",
        chooseMoveWithoutPvsOrReductions: "false",
      },
    },
  ];

  for (const { path, call, doors } of MODULES) {
    it(`${path}: each exported entry passes exactly one checkExtension literal, and only the shipped one is true`, () => {
      const flat = readFileSync(new URL(path, import.meta.url), "utf8").replace(/\s+/g, " ");
      const found: Record<string, string> = {};
      for (const chunk of flat.split("export function ").slice(1)) {
        if (!chunk.includes(call)) continue;
        const name = chunk.slice(0, chunk.indexOf("("));
        const literals = [...chunk.matchAll(/checkExtension: (true|false)\b/g)].map((m) => m[1]);
        expect(literals, name).toHaveLength(1);
        found[name] = literals[0] as string;
      }
      expect(found).toEqual(doors);
    });
  }

  it("the doors take what search() and chooseMove take, and no depth on the engine side", () => {
    expect(searchWithoutCheckExtension.length).toBe(2);
    expect(chooseMoveWithoutCheckExtension.length).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// A2 (`ADR-0051` decision 8): five horizon rows, the instrument, and the cap row.
// ---------------------------------------------------------------------------

/** `ADR-0051` decision 8's table: the check the shipped search plays at depth 1, and the door's move. */
const HORIZON_ROWS: ReadonlyArray<{ name: string; fen: string; check: string; door: string }> = [
  {
    name: "knight fork K+R",
    fen: "r3k3/7p/8/1N6/8/8/7P/4K3 w - - 0 1",
    check: "b5c7",
    door: "b5d6",
  },
  {
    name: "knight fork K+Q",
    fen: "6k1/p2q4/8/8/4N3/8/P7/6K1 w - - 0 1",
    check: "e4f6",
    door: "g1h1",
  },
  {
    name: "bishop skewer K+Q",
    fen: "4q3/7p/2k5/8/P7/8/7P/5BK1 w - - 0 1",
    check: "f1b5",
    door: "f1d3",
  },
  { name: "rook skewer K+R", fen: "7r/p7/8/7k/8/K7/P7/1R6 w - - 0 1", check: "b1h1", door: "b1b7" },
  {
    name: "knight fork K+R, Black",
    fen: "4k3/7p/8/8/1n6/8/7P/R3K3 b - - 0 1",
    check: "b4c2",
    door: "b4c6",
  },
];

/** The recorded move, played on `fen`: whether it gives check. */
function checks(fen: string, uciMove: string): boolean {
  const position = parseFen(fen);
  const move = legalMoves(position).find((candidate) => uci(candidate) === uciMove);
  expect(move, `${uciMove} is legal`).toBeDefined();
  return givesCheck(position, move as Move);
}

describe("A2 — at depth 1 the shipped search plays the check that wins one ply later; each door plays another move", () => {
  it("five rows, each recorded check really gives check, and each door move is another legal move", () => {
    expect(HORIZON_ROWS).toHaveLength(5);
    for (const { name, fen, check, door } of HORIZON_ROWS) {
      expect(checks(fen, check), name).toBe(true);
      expect(door, name).not.toBe(check);
      checks(fen, door); // asserts it is legal
    }
  });

  for (const { name, fen, check, door } of HORIZON_ROWS) {
    it(`${name}: search() at depth 1 plays ${check}; searchWithoutCheckExtension plays ${door}`, () => {
      expect(uci(search(parseFen(fen), 1).move)).toBe(check);
      expect(uci(searchWithoutCheckExtension(parseFen(fen), 1).move)).toBe(door);
    });

    it(`${name}: chooseMove to depth 1 plays ${check}; chooseMoveWithoutCheckExtension plays ${door}`, () => {
      expect(uci(deepenTo(chooseMove, fen, 1).move)).toBe(check);
      expect(uci(deepenTo(chooseMoveWithoutCheckExtension, fen, 1).move)).toBe(door);
    });
  }
});

describe("A2 — the instrument: depth 1 reaches leaves at ply 2 on the horizon rows, and the doors stop at ply 1", () => {
  for (const { name, fen } of HORIZON_ROWS) {
    it(`${name}: search() and chooseMove at depth 1 reach ply 2; their doors reach ply 1`, () => {
      expect(deepestLeaf(() => search(parseFen(fen), 1))).toBe(2);
      expect(deepestLeaf(() => deepenTo(chooseMove, fen, 1))).toBe(2);
      expect(deepestLeaf(() => searchWithoutCheckExtension(parseFen(fen), 1))).toBe(1);
      expect(deepestLeaf(() => deepenTo(chooseMoveWithoutCheckExtension, fen, 1))).toBe(1);
    });
  }
});

/**
 * The cap row (`ADR-0051` decision 8). After Qe2+ the only evasion is Ne3, a discovered check, so a
 * line that was extended once meets a second check at its next horizon. Cap 1 stops it there.
 */
const CAP_ROW = "3rkr2/3p1p1p/Q7/8/8/8/6PP/r2n2K1 w - - 0 1";

describe("A2 — the cap: a line is extended at most once", () => {
  it("the fixture bites: Qe2+ leaves Black one evasion, Ne3, and Ne3 gives check", () => {
    const position = parseFen(CAP_ROW);
    const qe2 = legalMoves(position).find((move) => uci(move) === "a6e2") as Move;
    expect(givesCheck(position, qe2)).toBe(true);
    const undo = makeMove(position, qe2);
    const evasions = legalMoves(position);
    expect(evasions.map(uci)).toEqual(["d1e3"]);
    expect(givesCheck(position, evasions[0] as Move)).toBe(true);
    unmakeMove(position, qe2, undo);
  });

  it("search() and chooseMove at depth 1 reach ply 2 and never 3; search() at depth 2 reaches 3", () => {
    expect(deepestLeaf(() => search(parseFen(CAP_ROW), 1))).toBe(2);
    expect(deepestLeaf(() => deepenTo(chooseMove, CAP_ROW, 1))).toBe(2);
    expect(deepestLeaf(() => search(parseFen(CAP_ROW), 2))).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// Deep (`SEARCH_DEEP=1`): the instrument at depth 5, A3's node bound, drift and mate floor.
// ---------------------------------------------------------------------------

if (RUN_DEEP) {
  const FOUR = ["kiwipete", "position-4", "position-5", "position-6"];

  describe("A2 — the instrument on four roots at depth 5: leaves at ply 6, never 7 [deep, SEARCH_DEEP=1]", () => {
    for (const name of FOUR) {
      it(`${name}: search() at 5 and chooseMove to 5 reach ply 6 and never 7 [deep, SEARCH_DEEP=1]`, () => {
        expect(deepestLeaf(() => search(parseFen(fenOf(name)), 5))).toBe(6);
        expect(deepestLeaf(() => deepenTo(chooseMove, fenOf(name), 5))).toBe(6);
      }, 120_000);
    }
  });

  describe("A3 — nodes at fixed depth 6 stay within 1.5x the door's [deep, SEARCH_DEEP=1]", () => {
    for (const name of ["kiwipete", "position-6"]) {
      it(`${name}: search(position, 6).nodes <= 1.5 x searchWithoutCheckExtension(position, 6).nodes [deep, SEARCH_DEEP=1]`, () => {
        const head: SearchResult = search(parseFen(fenOf(name)), 6);
        const door: SearchResult = searchWithoutCheckExtension(parseFen(fenOf(name)), 6);
        console.log(
          `ABC-210 A3 ${name} d6: ${head.nodes} / ${door.nodes} = ${(head.nodes / door.nodes).toFixed(3)}x`,
        );
        expect(head.nodes).toBeLessThanOrEqual(1.5 * door.nodes);
      }, 120_000);
    }
  });

  /** `src/engine.test.ts`'s mate- and stalemate-adjacent endgames, same FENs. */
  const ENDGAMES: ReadonlyArray<{ name: string; fen: string }> = [
    { name: "kq-corner", fen: "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1" },
    { name: "kr-corner", fen: "k7/8/1K6/8/8/8/8/1R6 w - - 0 1" },
    { name: "kqk-h8", fen: "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1" },
    { name: "kp-vs-k", fen: "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1" },
    { name: "krk-a-file", fen: "8/8/8/8/8/k7/8/KR6 w - - 0 1" },
    { name: "pawn-race", fen: "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1" },
  ];

  /** `ABC-121`'s 190 (`src/search.pvs-lmr.test.ts`): each root, its in-progress children, the endgames. */
  const corpus = (): { name: string; fen: string }[] => {
    const out: { name: string; fen: string }[] = [];
    for (const { name, fen } of ROOTS) {
      out.push({ name, fen });
      const position = parseFen(fen);
      for (const move of legalMoves(position)) {
        const undo = makeMove(position, move);
        if (gameStatus(position).result === "in-progress") {
          out.push({ name: `${name}/${uci(move)}`, fen: toFen(position) });
        }
        unmakeMove(position, move, undo);
      }
    }
    return [...out, ...ENDGAMES];
  };

  interface Drift {
    readonly compared: number;
    readonly within25: number;
    readonly max: number;
    /** Mate <-> no mate, or sign, on the 190 — a REPORT, never a bar (`ADR-0051` decision 7). */
    readonly mateFlips: number;
    readonly worst: string;
  }

  const drift = (on: (fen: string) => number, reference: (fen: string) => number): Drift => {
    const deltas: Array<[number, string]> = [];
    let mateFlips = 0;
    for (const { name, fen } of corpus()) {
      const ref = reference(fen);
      const got = on(fen);
      if (isMate(ref) || isMate(got)) {
        if (isMate(ref) !== isMate(got) || Math.sign(ref) !== Math.sign(got)) mateFlips++;
        continue;
      }
      deltas.push([Math.abs(got - ref), `${name}: ${ref} -> ${got}`]);
    }
    deltas.sort((a, b) => b[0] - a[0]);
    return {
      compared: deltas.length,
      within25: deltas.filter(([delta]) => delta <= 25).length / deltas.length,
      max: deltas[0]?.[0] ?? 0,
      mateFlips,
      worst: deltas[0]?.[1] ?? "",
    };
  };

  const reportAndBar = (what: string, result: Drift): void => {
    console.log(
      `ABC-210 A3 ${what}: ${(100 * result.within25).toFixed(2)}% within 25 cp of ` +
        `${result.compared}, max ${result.max} cp (${result.worst}); mate-status flips on the 190: ` +
        `${result.mateFlips} (a report, not a bar)`,
    );
    expect(result.compared).toBeGreaterThanOrEqual(100);
    expect(result.within25).toBeGreaterThanOrEqual(0.9);
    expect(result.max).toBeLessThanOrEqual(174);
  };

  describe("A3 — bounded drift against the check-extension doors, depth 5, the 190 [deep, SEARCH_DEEP=1]", () => {
    it("the corpus is the 190", () => {
      expect(corpus()).toHaveLength(190);
    });

    it("search() against searchWithoutCheckExtension at fixed depth 5: >= 90% within 25 cp, none beyond 174 cp [deep, SEARCH_DEEP=1]", () => {
      reportAndBar(
        "search() d5",
        drift(
          (fen) => search(parseFen(fen), 5).score,
          (fen) => searchWithoutCheckExtension(parseFen(fen), 5).score,
        ),
      );
    }, 600_000);

    it("chooseMove against chooseMoveWithoutCheckExtension deepened to 5: >= 90% within 25 cp, none beyond 174 cp [deep, SEARCH_DEEP=1]", () => {
      reportAndBar(
        "chooseMove to d5",
        drift(
          (fen) => deepenTo(chooseMove, fen, 5).score,
          (fen) => deepenTo(chooseMoveWithoutCheckExtension, fen, 5).score,
        ),
      );
    }, 600_000);
  });

  describe("A3 — the same-depth mate floor on the 287 [deep, SEARCH_DEEP=1]", () => {
    it("every mate searchWithoutCheckExtension scores at depth 5, search() scores at depth 5: same sign, no longer [deep, SEARCH_DEEP=1]", () => {
      let mates = 0;
      const violations: string[] = [];
      for (const fen of MATE_CORPUS) {
        const ref = searchWithoutCheckExtension(parseFen(fen), 5).score;
        if (!isMate(ref)) continue;
        mates++;
        const got = search(parseFen(fen), 5).score;
        // A mate n plies away reads MATE_SCORE - n, so "no longer" is |got| >= |ref|.
        if (!isMate(got) || Math.sign(got) !== Math.sign(ref) || Math.abs(got) < Math.abs(ref)) {
          violations.push(`${fen}: ${ref} without the extension, ${got} with it, depth 5`);
        }
      }
      console.log(`ABC-210 A3 mate floor d5 -> d5: ${violations.length} of ${mates} violated`);
      expect(mates).toBeGreaterThanOrEqual(100);
      expect(violations).toEqual([]);
    }, 300_000);
  });
}
