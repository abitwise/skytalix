/**
 * ABC-271 (E4a, structure only; `ADR-0070` ACCEPTED, form (a)): passed pawns read the kings and the
 * path. Three endgame terms (king distance to the queening square, a free path, the unstoppable
 * passer by the rule of the square) enter the evaluation with every value 0, computed outside the
 * pawn memo from two passer words the memo stores. No switch and no door pair: every existing door
 * reads its pre-ticket counts.
 *
 * DEFAULT LANE (no search): the data row; K1 (a) the mirror, at 0 and at the probed values; K1 (b)
 * `evaluate` `Object.is`-equal to the pre-ticket `evaluate` on the frozen corpora; K1 (c) QE's
 * frozen fixtures through the seam `passerTermsForTest`, per side (`QE-271-a`); K1 (e) the memo
 * returns the passer words a fresh `pawnStructure` returns; the source rows; `ABC-301` P1, the hot
 * path against the seam at the probed values (`QE-271-h`). K1 (d), the int16 range
 * row, is `ABC-274` `A9` in `src/evaluate.taper.test.ts`. K2's two re-pins are
 * `src/evaluate.pawns.test.ts`'s memo-size row and `src/transposition.test.ts`'s A7 sum.
 *
 * DEEP LANE (`SEARCH_DEEP=1`): K0, the seven node counts, exact.
 *
 * `src/evaluate.passer-fixtures.json` is QE's frozen file, copied byte for byte from
 * `.grugops/context/qe-ABC-271-freeze/raw/fixtures.json` (PREREG `qe-ABC-271-freeze` `…67b5eeac`);
 * the first row below checks its sha256. A row that must change is a new, dated QE note and a
 * re-freeze, never an edit here. The `*_PRE` arrays are the pre-ticket `evaluate` (`main`
 * `3a08d244`, `src/` tree `4fb3da04`), read on a copy of `main` before this ticket's code ran.
 */

import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { chooseMove, type EngineChoice } from "./engine.ts";
import { buildCorpus, mirrorPosition, PERFT_POSITIONS } from "./evaluate.mirror-corpus.ts";
import { TAPER_DOOR_CORPUS, TAPER_MIRROR_POSITIONS } from "./evaluate.taper-corpus.ts";
import {
  clearPawnCacheForTest,
  type EvaluationParameters,
  evaluate,
  evaluateAtPhase,
  passerTermsForTest,
  pawnCacheProbeForTest,
  pawnStructureForTest,
  phaseOf,
  withParametersForTest,
} from "./evaluate.ts";
import * as PARAMS from "./evaluate-params.ts";
import { parseFen, toFen } from "./fen.ts";
import { type Position, squareName } from "./position.ts";
import { search } from "./search.ts";

const FIXTURES_FILE = new URL("./evaluate.passer-fixtures.json", import.meta.url);
const FIXTURES_SHA256 = "bf3c205bf4106209e3151717d93542180d90d344cecfdfbb6f2a30c9d5db887a";

interface Parts {
  readonly kd: number;
  readonly free: number;
  readonly un: number;
}
interface FrozenPasser {
  readonly sq: string;
  readonly R: number;
  readonly dE: number;
  readonly dO: number;
  readonly free: number;
}
interface FrozenSide {
  readonly passers: readonly FrozenPasser[];
  readonly U: number;
  readonly seam: Parts;
}
interface SeamRow {
  readonly id: string;
  readonly group: string;
  readonly pair?: string;
  readonly half?: string;
  readonly fen: string;
  readonly phase: number;
  readonly white: FrozenSide;
  readonly black: FrozenSide;
}
interface Frozen {
  readonly values: {
    readonly PASSED_KING_ENEMY: readonly number[];
    readonly PASSED_KING_OWN: readonly number[];
    readonly PASSED_FREE: readonly number[];
    readonly PASSED_UNSTOPPABLE: number;
  };
  readonly k0: Readonly<Record<string, number>>;
  readonly k1c: readonly SeamRow[];
  readonly k1a: ReadonlyArray<{
    readonly id: string;
    readonly fen: string;
    readonly phase: number;
  }>;
}

const FIXTURES_TEXT = readFileSync(FIXTURES_FILE);
const FROZEN = JSON.parse(FIXTURES_TEXT.toString("utf8")) as Frozen;

/** QE's arrays run R 0 … 6; the table's run 0 … 7 (`PASSED`'s shape), index 7 never read. */
const byRank = (values: readonly number[]): number[] => [...values, 0];

/** `ADR-0070` decision 1's probed values: the K1 (c) seam's table, every middlegame half 0. */
const PROBED: EvaluationParameters = {
  ...PARAMS,
  PASSED_KING_ENEMY: {
    mg: PARAMS.PASSED_KING_ENEMY.mg,
    eg: byRank(FROZEN.values.PASSED_KING_ENEMY),
  },
  PASSED_KING_OWN: { mg: PARAMS.PASSED_KING_OWN.mg, eg: byRank(FROZEN.values.PASSED_KING_OWN) },
  PASSED_FREE: { mg: PARAMS.PASSED_FREE.mg, eg: byRank(FROZEN.values.PASSED_FREE) },
  PASSED_UNSTOPPABLE: { mg: 0, eg: FROZEN.values.PASSED_UNSTOPPABLE },
};

const SIDES = ["white", "black"] as const;
const PHASE_SPAN = PARAMS.PHASE_MG - PARAMS.PHASE_EG;
const ZERO: Parts = { kd: 0, free: 0, un: 0 };

/** The squares a passer word names (3 bits a file, the board rank, 0 for none), in file order. */
const wordSquares = (word: number): string[] => {
  const squares: string[] = [];
  for (let file = 0; file < 8; file++) {
    const rank = (word >> (3 * file)) & 7;
    if (rank !== 0) squares.push(squareName(rank * 16 + file));
  }
  return squares;
};

/** `src/evaluate.ts` without comments, whitespace flattened. */
const CODE = readFileSync(new URL("./evaluate.ts", import.meta.url), "utf8")
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\/\/.*$/gm, "")
  .replace(/\s+/g, " ");
const between = (from: string, to: string): string => {
  const start = CODE.indexOf(from);
  expect(start, from).toBeGreaterThanOrEqual(0);
  const end = CODE.indexOf(to, start);
  expect(end, to).toBeGreaterThan(start);
  return CODE.slice(start, end);
};

describe("ABC-271 — the E4a terms are data: four exports, every half 0 (ADR-0070 decision 1)", () => {
  it("PASSED_KING_ENEMY, PASSED_KING_OWN, PASSED_FREE: by own rank in PASSED's shape, every half 0", () => {
    for (const pair of [PARAMS.PASSED_KING_ENEMY, PARAMS.PASSED_KING_OWN, PARAMS.PASSED_FREE]) {
      expect(pair.mg).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
      expect(pair.eg).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
      expect(pair.mg).toHaveLength(PARAMS.PASSED.mg.length);
    }
    expect(PARAMS.PASSED_UNSTOPPABLE).toEqual({ mg: 0, eg: 0 });
  });

  it("every E4a middlegame half is 0: the evaluation skips the terms at phase 24, exact only so", () => {
    const mgHalves = [
      ...PARAMS.PASSED_KING_ENEMY.mg,
      ...PARAMS.PASSED_KING_OWN.mg,
      ...PARAMS.PASSED_FREE.mg,
      PARAMS.PASSED_UNSTOPPABLE.mg,
    ];
    expect(mgHalves.every((half) => Object.is(half, 0))).toBe(true);
  });

  it("each comment records its rule as the prior and that it was probed and not shipped", () => {
    const source = readFileSync(new URL("./evaluate-params.ts", import.meta.url), "utf8");
    const prior = "start (prior): 0. The rule (below) was probed and not shipped (`ADR-0070`)";
    for (const name of [
      "PASSED_KING_ENEMY",
      "PASSED_KING_OWN",
      "PASSED_FREE",
      "PASSED_UNSTOPPABLE",
    ]) {
      const head = source.slice(0, source.indexOf(`export const ${name}:`));
      const comment = head.slice(head.lastIndexOf("/**")).replace(/\s*\n\s*\*\s*/g, " ");
      expect(comment, name).toContain(prior);
    }
  });
});

describe("ABC-271 — QE's frozen fixtures, copied unchanged (PREREG qe-ABC-271-freeze …67b5eeac)", () => {
  it("src/evaluate.passer-fixtures.json is byte-identical to QE's fixtures.json (sha256)", () => {
    expect(createHash("sha256").update(FIXTURES_TEXT).digest("hex")).toBe(FIXTURES_SHA256);
  });

  it("44 seam fixtures (U, KD, FP) and 12 mirror positions; K0's seven counts", () => {
    expect(FROZEN.k1c).toHaveLength(44);
    expect(FROZEN.k1a).toHaveLength(12);
    expect(Object.keys(FROZEN.k0)).toHaveLength(7);
    for (const row of [...FROZEN.k1c, ...FROZEN.k1a]) {
      expect(phaseOf(parseFen(row.fen)), row.id).toBe(row.phase);
    }
  });
});

describe("ABC-271 K1 (c) — the structure through the seam, per side (QE-271-a), at ADR-0070 d1's probed values", () => {
  it("passerTermsForTest returns exactly QE's frozen { kd, free, un } on every fixture, each side apart", () => {
    withParametersForTest(PROBED, () => {
      const misses = FROZEN.k1c.flatMap((row) => {
        const got = passerTermsForTest(parseFen(row.fen));
        return SIDES.filter(
          (side) => JSON.stringify(got[side]) !== JSON.stringify(row[side].seam),
        ).map((side) => `${row.id} ${side}: ${JSON.stringify(got[side])}`);
      });
      expect(misses).toEqual([]);
    });
  });

  it("U is 400 exactly where the square names it at phase 0, never netted (U7-both: 400 each side), else 0", () => {
    withParametersForTest(PROBED, () => {
      let fired = 0;
      for (const row of FROZEN.k1c) {
        const got = passerTermsForTest(parseFen(row.fen));
        for (const side of SIDES) {
          const expected = row[side].U === 1 ? FROZEN.values.PASSED_UNSTOPPABLE : 0;
          expect(got[side].un, `${row.id} ${side}`).toBe(expected);
          if (expected !== 0) {
            expect(row.phase, row.id).toBe(0);
            fired++;
          }
        }
      }
      const both = passerTermsForTest(
        parseFen(FROZEN.k1c.find((r) => r.id === "U7-both")?.fen ?? ""),
      );
      expect([both.white.un, both.black.un]).toEqual([400, 400]);
      expect(fired).toBeGreaterThanOrEqual(5);
    });
  });

  it("each pair's A − B per side is QE's frozen difference: kd by KE[R] / KO[R] per capped step, 0 past the cap; free only where the path is empty", () => {
    const pairs = new Map<string, { A?: SeamRow; B?: SeamRow }>();
    for (const row of FROZEN.k1c) {
      if (!row.pair || !row.half) continue; // the singles carry ""
      const entry = pairs.get(row.pair) ?? {};
      entry[row.half as "A" | "B"] = row;
      pairs.set(row.pair, entry);
    }
    expect(pairs.size).toBe(19);
    withParametersForTest(PROBED, () => {
      for (const [name, { A, B }] of pairs) {
        const a = passerTermsForTest(parseFen((A as SeamRow).fen));
        const b = passerTermsForTest(parseFen((B as SeamRow).fen));
        for (const side of SIDES) {
          for (const part of ["kd", "free", "un"] as const) {
            expect(a[side][part] - b[side][part], `${name} ${side} ${part}`).toBe(
              (A as SeamRow)[side].seam[part] - (B as SeamRow)[side].seam[part],
            );
          }
        }
      }
    });
  });

  it("at the shipped values (every half 0) every part is 0 on every fixture", () => {
    for (const row of FROZEN.k1c) {
      const got = passerTermsForTest(parseFen(row.fen));
      expect(got, row.id).toEqual({ white: ZERO, black: ZERO });
    }
  });
});

describe("ABC-301 P1 — the hot path's E4a sum at the probed values (QE-271-h, ADR-0070 d4's dated line)", () => {
  /**
   * At phase 0 this is the ticket's form: live − shipped, white's view, is the seam's white minus
   * black. Each fixture runs at its OWN phase, not at a forced 0: U fires on the phase argument and
   * the seam reads `phaseOf`, so the forced form reads 31 of 44, the 13 misses each ± U on a fixture
   * of phase 1 … 5 where the square holds. The blend then gives mg + trunc((D + e) × (24 − k) / 24),
   * QE's hot-row identity, with mg and D read at the shipped values and e the seam's move between
   * the two tables. So a hot path that fires U off phase 0 is red here too.
   */
  it("evaluateAtPhase at each fixture's own phase is exact against the seam, on 44 of 44", () => {
    const whitePov = (position: Position, phase: number): number => {
      const score = evaluateAtPhase(position, phase);
      return position.blackToMove ? 0 - score : score;
    };
    const net = (position: Position): number => {
      const { white, black } = passerTermsForTest(position);
      return white.kd + white.free + white.un - black.kd - black.free - black.un;
    };
    const shipped = FROZEN.k1c.map((row) => {
      const position = parseFen(row.fen);
      const mg = whitePov(position, PHASE_SPAN);
      return { row, position, mg, delta: whitePov(position, 0) - mg, seam: net(position) };
    });
    const misses = withParametersForTest(PROBED, () =>
      shipped
        .filter(({ row, position, mg, delta, seam }) => {
          const blend = (delta + net(position) - seam) * (PHASE_SPAN - row.phase);
          return whitePov(position, row.phase) !== mg + Math.trunc(blend / PHASE_SPAN);
        })
        .map(({ row }) => row.id),
    );
    expect(shipped).toHaveLength(44);
    expect(misses).toEqual([]);
  });
});

describe("ABC-271 K1 (e) — the memo: a hit returns what a fresh pawnStructure returns, the two passer words included", () => {
  it("cold miss, then hit, each equal to the fresh call; the words name exactly QE's frontmost passers", () => {
    clearPawnCacheForTest();
    for (const row of FROZEN.k1c) {
      const position = parseFen(row.fen);
      const fresh = pawnStructureForTest(position, false);
      expect(wordSquares(fresh.whitePassers), `${row.id} white`).toEqual(
        row.white.passers.map((passer) => passer.sq),
      );
      expect(wordSquares(fresh.blackPassers), `${row.id} black`).toEqual(
        row.black.passers.map((passer) => passer.sq),
      );
    }
    clearPawnCacheForTest();
    const positions = [
      ...FROZEN.k1c.map((row) => parseFen(row.fen)),
      ...FROZEN.k1a.map((row) => parseFen(row.fen)),
      ...buildCorpus().map(({ position }) => position),
    ];
    let hits = 0;
    for (const position of positions) {
      const fresh = pawnStructureForTest(position, false);
      const first = pawnStructureForTest(position, true);
      expect(pawnCacheProbeForTest(position).hit, toFen(position)).toBe(true);
      const hit = pawnStructureForTest(position, true);
      expect(first, toFen(position)).toEqual(fresh);
      expect(hit, toFen(position)).toEqual(fresh);
      hits++;
    }
    expect(hits).toBe(positions.length);
    clearPawnCacheForTest();
  });

  it("KD8's doubled d-pawns record only the front one (d5), not the rear (d3)", () => {
    const row = FROZEN.k1c.find((r) => r.id.startsWith("KD8")) as SeamRow;
    expect(wordSquares(pawnStructureForTest(parseFen(row.fen), false).whitePassers)).toEqual([
      "d5",
    ]);
  });
});

describe("ABC-271 K1 (a) — the mirror, Object.is, 0 mismatches", () => {
  const corpus = [
    ...buildCorpus().map(({ position }) => position),
    ...TAPER_MIRROR_POSITIONS.map(({ fen }) => parseFen(fen)),
    ...FROZEN.k1a.map(({ fen }) => parseFen(fen)),
    ...FROZEN.k1c.map(({ fen }) => parseFen(fen)),
  ];
  const mismatches = (): string[] =>
    corpus
      .filter((position) => !Object.is(evaluate(mirrorPosition(position)), evaluate(position)))
      .map((position) => toFen(position));

  it("G3 + TAPER_MIRROR_POSITIONS + QE's 12 passer positions (+ the 44 fixtures), at the shipped values", () => {
    expect(corpus.length).toBeGreaterThanOrEqual(184 + 12 + 44);
    expect(mismatches()).toEqual([]);
  });

  it("the same corpus with the terms live at the probed values", () => {
    withParametersForTest(PROBED, () => {
      expect(mismatches()).toEqual([]);
    });
  });

  it("the seam is colour-symmetric: on the mirror, the white and black parts swap", () => {
    withParametersForTest(PROBED, () => {
      for (const row of FROZEN.k1c) {
        const position = parseFen(row.fen);
        const got = passerTermsForTest(position);
        const mirrored = passerTermsForTest(mirrorPosition(position));
        expect(mirrored, row.id).toEqual({ white: got.black, black: got.white });
      }
    });
  });
});

describe("ABC-271 K1 (b) — value identity: evaluate is Object.is the pre-ticket evaluate on the frozen corpora", () => {
  it("G3's 184 in buildCorpus order", () => {
    const corpus = buildCorpus();
    expect(corpus).toHaveLength(G3_PRE.length);
    const differ = corpus.filter(({ position }, i) => !Object.is(evaluate(position), G3_PRE[i]));
    expect(differ.map(({ name }) => name)).toEqual([]);
  });

  it("QE's ABC-269 door corpus (176; the KP rows among them)", () => {
    expect(TAPER_DOOR_CORPUS).toHaveLength(DOOR_PRE.length);
    const differ = TAPER_DOOR_CORPUS.filter(
      ({ fen }, i) => !Object.is(evaluate(parseFen(fen)), DOOR_PRE[i]),
    );
    expect(differ.map(({ fen }) => fen)).toEqual([]);
  });

  it("ABC-270's queen pairs and their mirrors (28)", () => {
    expect(QUEEN_PAIR_PRE).toHaveLength(28);
    const differ = QUEEN_PAIR_PRE.filter(
      ([fen, main]) => !Object.is(evaluate(parseFen(fen)), main),
    );
    expect(differ).toEqual([]);
  });

  it("QE's 12 passer positions and 44 fixtures, each with its mirror (112)", () => {
    expect(PASSER_PRE).toHaveLength(2 * (12 + 44));
    const differ = PASSER_PRE.filter(([fen, main]) => !Object.is(evaluate(parseFen(fen)), main));
    expect(differ).toEqual([]);
  });
});

describe("ABC-271 — the source rows (ADR-0070 decisions 2–4)", () => {
  it("the king squares come from the walk: no new pass over the pieces", () => {
    const body = between("function whiteMinusBlack(", "export function evaluate(");
    // The walk's two loops, and no other.
    expect(body.match(/for \(/g)?.length).toBe(2);
    expect(body).toContain(
      "passerTerms(board, whitePassers, whiteKing, blackKing, true, blackToMove, phase)",
    );
    expect(body).toContain(
      "passerTerms(board, blackPassers, blackKing, whiteKing, false, !blackToMove, phase)",
    );
    const terms = between("function passerTerms(", "export function phaseOf(");
    expect(terms).not.toMatch(/pieceType\(|0x88|< 128/);
  });

  it("the loop runs after the walk when w < D and a passer exists, with no fast path at value 0", () => {
    const body = between("function whiteMinusBlack(", "export function evaluate(");
    expect(body).toContain("if (w < PHASE_SPAN && (whitePassers | blackPassers) !== 0) {");
    expect(body.match(/passerTerms\(/g)?.length).toBe(2);
    const terms = between("function passerTerms(", "export function phaseOf(");
    expect(terms).not.toMatch(/=== 0 \? 0|_EG\[\w+\] as number\) === 0|passedUnstoppableEg ===/);
  });

  it("the seams passerTermsForTest and pawnStructureForTest are called from test files only: no other file under src/, no tools/ file, no script (QE-271-g)", () => {
    const root = new URL("../", import.meta.url).pathname;
    const tree = (directory: string): string[] =>
      existsSync(`${root}${directory}`)
        ? (readdirSync(`${root}${directory}`, { recursive: true }) as string[]).map(
            (name) => `${directory}${name}`,
          )
        : [];
    const files = [
      ...tree("src/")
        .filter((name) => name.endsWith(".ts") && !name.endsWith(".test.ts"))
        .filter((name) => name !== "src/evaluate.ts"),
      ...tree("tools/"),
      ...tree("spike/"),
      ...tree("scripts/"),
      "package.json",
      "vitest.config.ts",
    ].filter((name) => statSync(`${root}${name}`).isFile());
    expect(files.length).toBeGreaterThan(50);
    const callers = files.filter((name) =>
      /passerTermsForTest|pawnStructureForTest/.test(readFileSync(`${root}${name}`, "utf8")),
    );
    expect(callers).toEqual([]);
    for (const seam of ["passerTermsForTest(", "pawnStructureForTest("]) {
      expect(CODE.split(seam).length - 1, `${seam} in src/evaluate.ts: its definition only`).toBe(
        1,
      );
    }
  });
});

if (process.env.SEARCH_DEEP === "1") {
  describe("ABC-271 K0 — node identity with main: the seven counts, exact [deep, SEARCH_DEEP=1]", () => {
    const fenOf = (name: string): string =>
      (PERFT_POSITIONS.find((p) => p.name === name) as { fen: string }).fen;
    const deepenTo = (name: string, maxDepth: number): EngineChoice =>
      chooseMove(parseFen(fenOf(name)), { budgetMs: 1e9, now: () => 0, maxDepth }) as EngineChoice;
    const ROWS = [
      ["kiwipete_chooseMove_d8", () => deepenTo("kiwipete", 8).nodes],
      ["kiwipete_chooseMove_d9", () => deepenTo("kiwipete", 9).nodes],
      ["pos6_chooseMove_d8", () => deepenTo("position-6", 8).nodes],
      ["pos6_chooseMove_d9", () => deepenTo("position-6", 9).nodes],
      ["pos6_chooseMove_d10", () => deepenTo("position-6", 10).nodes],
      ["kiwipete_search_d8", () => search(parseFen(fenOf("kiwipete")), 8).nodes],
      ["pos6_search_d8", () => search(parseFen(fenOf("position-6")), 8).nodes],
    ] as const;
    for (const [name, read] of ROWS) {
      it(`${name} = ${FROZEN.k0[name]} [deep, SEARCH_DEEP=1]`, () => {
        const nodes = read();
        console.log(`ABC-271 K0 ${name}: ${nodes}`);
        expect(nodes).toBe(FROZEN.k0[name]);
      }, 300_000);
    }
  });
}

/* The pre-ticket evaluate, read on a copy of main before this ticket's code ran (see the header). */
const G3_PRE: readonly number[] = [
  0, -66, -18, -18, -66, 0, -8, -10, -12, -12, -20, -38, -33, -50, -41, -4, 3, -10, -12, 0, -8, 41,
  -37, -37, -29, -66, -37, -41, -33, -49, -49, -43, -59, -47, -53, -47, -27, -59, -71, -73, -390,
  -31, -7, -39, -37, -102, -53, -17, -1, 9, -45, -57, -432, -52, -155, -45, -37, -44, -51, -55,
  -153, -134, -126, -129, -45, -1, -33, -17, -99, -58, -30, 24, 26, 28, -10, 14, 18, 18, -109, 30,
  18, 34, 18, 38, 17, 110, -118, -129, -150, -150, -140, -114, 110, -168, -120, -108, -112, -158,
  -154, -144, -122, -119, -164, -177, -165, -192, -135, -502, -86, -106, -110, -114, -122, -116,
  -126, -118, -154, -154, -138, -154, -92, -108, -114, -114, -118, -112, -110, -225, -92, -78, -94,
  -92, -1094, -675, -498, -490, -176, 0, 20, 12, 16, 20, 28, 4, 4, 8, 12, 2, 6, -8, -13, 0, 17, 21,
  -6, -8, 15, 0, 4, 32, 52, 70, 80, 86, -18, -112, 48, -16, 36, 76, -2, -16, -111, 26, -60, 14, 32,
  10, -377, 26, -14, -14, 8, 34,
];
const DOOR_PRE: readonly number[] = [
  -110, -110, -247, -247, 74, 74, -259, -259, -92, -92, -279, -279, -98, -98, -235, -235, -100,
  -100, -235, -235, -243, -243, -248, -248, -204, -204, 338, 338, -172, -172, 326, 326, -189, -189,
  -123, -123, -195, -195, -131, -131, -194, -194, -164, -164, -194, -194, -156, -156, -209, -209,
  1063, 1063, 89, 89, 0, 0, 0, 0, 196, 196, -22, -22, -97, -97, -10, -10, 24, 24, -12, -12, -97,
  -97, 22, 22, 66, 66, -10, -10, 45, 45, 70, 70, 105, 105, 25, 25, 12, 12, 25, 25, 12, 12, -200,
  -200, -223, -223, 100, 100, 0, 0, 98, 98, 0, 0, 76, 76, 0, 0, 75, 75, 0, 0, 116, 116, 93, 93, 88,
  88, 78, 78, 142, 142, 133, 133, 123, 123, 118, 118, 178, 178, 169, 169, 151, 151, 127, 127, 234,
  234, 227, 227, 197, 197, 182, 182, 320, 320, 295, 295, 257, 257, 232, 232, -100, -100, -98, -98,
  -76, -76, -75, -75, -178, -178, -169, -169, -151, -151, -127, -127, -320, -320, -295, -295, -257,
  -257, -232, -232,
];
const QUEEN_PAIR_PRE: ReadonlyArray<readonly [string, number]> = [
  ["3q2k1/ppp2p1p/6p1/8/8/7P/PPP2P2/3Q2K1 w - - 0 1", -143],
  ["6k1/ppp2p1p/6p1/8/8/7P/PPP2P2/3Q2K1 w - - 0 1", 816],
  ["3qk3/ppp1pppp/8/8/8/8/PPP1PPPP/3QK3 w - - 0 1", 0],
  ["4k3/ppp1pppp/8/8/8/8/PPP1PPPP/3QK3 w - - 0 1", 931],
  ["3q2k1/ppp2p2/7p/8/8/6P1/PPP2P1P/3Q2K1 b - - 0 1", -143],
  ["3q2k1/ppp2p2/7p/8/8/6P1/PPP2P1P/6K1 b - - 0 1", 816],
  ["6k1/pp1q1p2/4p3/2p3p1/7P/4P3/PP2QPP1/2K5 w - - 0 1", -34],
  ["6k1/pp1q1p2/4p3/2p3p1/7P/4P3/PP3PP1/2K5 w - - 0 1", -978],
  ["6k1/pp3p2/4p3/2p3p1/7P/4P3/PP2QPP1/2K5 w - - 0 1", 926],
  ["2k5/ppp1q3/3p4/4p3/4P3/2P5/PP1Q2P1/7K w - - 0 1", -60],
  ["2k5/ppp5/3p4/4p3/4P3/2P5/PP1Q2P1/7K w - - 0 1", 880],
  ["1kqq4/p1p5/1p6/8/7P/8/5PK1/8 w - - 0 1", -2015],
  ["1k6/p1p5/1p6/8/7P/8/5PK1/8 w - - 0 1", -131],
  ["1k1q4/p1p5/1p6/8/7P/8/5PK1/8 w - - 0 1", -1095],
  ["3q2k1/ppp2p2/7p/8/8/6P1/PPP2P1P/3Q2K1 b - - 0 1", -143],
  ["3q2k1/ppp2p2/7p/8/8/6P1/PPP2P1P/6K1 b - - 0 1", 816],
  ["3qk3/ppp1pppp/8/8/8/8/PPP1PPPP/3QK3 b - - 0 1", 0],
  ["3qk3/ppp1pppp/8/8/8/8/PPP1PPPP/4K3 b - - 0 1", 931],
  ["3q2k1/ppp2p1p/6p1/8/8/7P/PPP2P2/3Q2K1 w - - 0 1", -143],
  ["6k1/ppp2p1p/6p1/8/8/7P/PPP2P2/3Q2K1 w - - 0 1", 816],
  ["2k5/pp2qpp1/4p3/7p/2P3P1/4P3/PP1Q1P2/6K1 b - - 0 1", -34],
  ["2k5/pp3pp1/4p3/7p/2P3P1/4P3/PP1Q1P2/6K1 b - - 0 1", -978],
  ["2k5/pp2qpp1/4p3/7p/2P3P1/4P3/PP3P2/6K1 b - - 0 1", 926],
  ["7k/pp1q2p1/2p5/4p3/4P3/3P4/PPP1Q3/2K5 b - - 0 1", -60],
  ["7k/pp1q2p1/2p5/4p3/4P3/3P4/PPP5/2K5 b - - 0 1", 880],
  ["8/5pk1/8/7p/8/1P6/P1P5/1KQQ4 b - - 0 1", -2015],
  ["8/5pk1/8/7p/8/1P6/P1P5/1K6 b - - 0 1", -131],
  ["8/5pk1/8/7p/8/1P6/P1P5/1K1Q4 b - - 0 1", -1095],
];
const PASSER_PRE: ReadonlyArray<readonly [string, number]> = [
  ["8/3k4/8/4PP2/8/8/8/6K1 b - - 0 1", -323],
  ["6k1/8/8/8/4pp2/8/3K4/8 w - - 0 1", -323],
  ["8/8/8/7p/P7/3k4/8/5K2 w - - 0 1", -57],
  ["5k2/8/3K4/p7/7P/8/8/8 b - - 0 1", -57],
  ["8/5pk1/6p1/8/P7/6P1/5PK1/8 w - - 0 1", 130],
  ["8/5pk1/6p1/p7/8/6P1/5PK1/8 b - - 0 1", 130],
  ["8/8/8/2P5/8/2P5/k7/4K3 b - - 0 1", -266],
  ["4k3/K7/2p5/8/2p5/8/8/8 w - - 0 1", -266],
  ["8/1P6/8/8/5k2/8/2n5/6K1 w - - 0 1", -130],
  ["6k1/2N5/8/5K2/8/8/1p6/8 b - - 0 1", -130],
  ["8/5k2/8/1P6/6p1/8/5K2/r6R b - - 0 1", 10],
  ["R6r/5k2/8/6P1/1p6/8/5K2/8 w - - 0 1", 10],
  ["3r2k1/5ppp/8/3P4/4P3/p7/5PPP/2B1R1K1 w - - 0 1", 423],
  ["2b1r1k1/5ppp/P7/4p3/3p4/8/5PPP/3R2K1 b - - 0 1", 423],
  ["r1bqkb1r/5ppp/2n2n2/1P6/8/2N2N2/P4PPP/R1BQKB1R w KQkq - 0 1", 206],
  ["r1bqkb1r/p4ppp/2n2n2/8/1p6/2N2N2/5PPP/R1BQKB1R b KQkq - 0 1", 206],
  ["6k1/8/8/7n/8/8/1p3K2/1B6 b - - 0 1", 241],
  ["1b6/1P3k2/8/8/7N/8/8/6K1 w - - 0 1", 241],
  ["8/p6p/8/8/8/2k5/8/K7 w - - 0 1", -235],
  ["k7/8/2K5/8/8/8/P6P/8 b - - 0 1", -235],
  ["8/8/8/2k5/1pP5/8/5K2/6R1 b - c3 0 1", -459],
  ["6r1/5k2/8/1Pp5/2K5/8/8/8 w - c6 0 1", -459],
  ["8/8/8/8/1p6/8/5PK1/3k4 w - - 0 1", -53],
  ["3K4/5pk1/8/1P6/8/8/8/8 b - - 0 1", -53],
  ["8/5k2/8/8/P7/8/8/7K w - - 0 1", 100],
  ["7k/8/8/p7/8/8/5K2/8 b - - 0 1", 100],
  ["8/4k3/8/8/P7/8/8/7K w - - 0 1", 85],
  ["7k/8/8/p7/8/8/4K3/8 b - - 0 1", 85],
  ["8/8/8/8/8/8/2P5/K5k1 b - - 0 1", -112],
  ["k5K1/2p5/8/8/8/8/8/8 w - - 0 1", -112],
  ["8/8/8/8/8/8/2P3k1/K7 b - - 0 1", -85],
  ["k7/2p3K1/8/8/8/8/8/8 w - - 0 1", -85],
  ["7k/8/8/8/5p2/8/1K6/8 b - - 0 1", 157],
  ["8/1k6/8/5P2/8/8/8/7K w - - 0 1", 157],
  ["7k/8/8/8/5p2/8/2K5/8 b - - 0 1", 142],
  ["8/2k5/8/5P2/8/8/8/7K w - - 0 1", 142],
  ["k7/8/8/8/3K4/7p/8/8 w - - 0 1", -135],
  ["8/8/7P/3k4/8/8/8/K7 b - - 0 1", -135],
  ["k7/8/8/8/4K3/7p/8/8 w - - 0 1", -135],
  ["8/8/7P/4k3/8/8/8/K7 b - - 0 1", -135],
  ["8/4k1P1/8/8/8/8/8/K7 w - - 0 1", 255],
  ["k7/8/8/8/8/8/4K1p1/8 b - - 0 1", 255],
  ["8/5kP1/8/8/8/8/8/K7 w - - 0 1", 260],
  ["k7/8/8/8/8/8/5Kp1/8 b - - 0 1", 260],
  ["8/5k2/8/8/P7/8/8/7K b - - 0 1", -100],
  ["7k/8/8/p7/8/8/5K2/8 w - - 0 1", -100],
  ["7k/8/P7/8/8/7p/8/K7 w - - 0 1", 0],
  ["k7/8/7P/8/8/p7/8/7K b - - 0 1", 0],
  ["8/8/P6P/8/8/3k4/8/4K3 w - - 0 1", 378],
  ["4k3/8/3K4/8/8/p6p/8/8 b - - 0 1", 378],
  ["8/8/3K4/8/3P4/8/8/7k w - - 0 1", 222],
  ["7K/8/8/3p4/8/3k4/8/8 b - - 0 1", 222],
  ["8/5k2/8/8/P7/8/7N/7K w - - 0 1", 415],
  ["7k/7n/8/p7/8/8/5K2/8 b - - 0 1", 415],
  ["r7/8/8/4P3/7k/8/2K5/R7 w - - 0 1", 154],
  ["r7/2k5/8/7K/4p3/8/8/R7 b - - 0 1", 154],
  ["r7/8/8/4P2k/8/8/2K5/R7 w - - 0 1", 152],
  ["r7/2k5/8/8/4p2K/8/8/R7 b - - 0 1", 152],
  ["8/7k/8/8/2P1K3/8/8/n7 w - - 0 1", -119],
  ["N7/8/8/2p1k3/8/8/7K/8 b - - 0 1", -119],
  ["8/7k/8/4K3/2P5/8/8/n7 w - - 0 1", -119],
  ["N7/8/8/2p5/4k3/8/7K/8 b - - 0 1", -119],
  ["r7/8/8/8/8/1P4k1/8/2K5 w - - 0 1", -432],
  ["2k5/8/1p4K1/8/8/8/8/R7 b - - 0 1", -432],
  ["r7/8/8/8/8/1P5k/8/2K5 w - - 0 1", -441],
  ["2k5/8/1p5K/8/8/8/8/R7 b - - 0 1", -441],
  ["r7/8/8/8/5k2/1P6/8/2K5 w - - 0 1", -459],
  ["2k5/8/1p6/5K2/8/8/8/R7 b - - 0 1", -459],
  ["r7/8/8/8/6k1/1P6/8/2K5 w - - 0 1", -446],
  ["2k5/8/1p6/6K1/8/8/8/R7 b - - 0 1", -446],
  ["r7/8/4k3/8/4p3/1K6/8/7R b - - 0 1", 228],
  ["7r/8/1k6/4P3/8/4K3/8/R7 w - - 0 1", 228],
  ["r7/4k3/8/8/4p3/1K6/8/7R b - - 0 1", 203],
  ["7r/8/1k6/4P3/8/8/4K3/R7 w - - 0 1", 203],
  ["7N/8/8/8/3k4/2p5/7K/8 b - - 0 1", -1],
  ["8/7k/2P5/3K4/8/8/8/7n w - - 0 1", -1],
  ["7N/8/8/8/8/2pk4/7K/8 b - - 0 1", -31],
  ["8/7k/2PK4/8/8/8/8/7n w - - 0 1", -31],
  ["r7/2k5/8/7K/4p3/8/8/R7 b - - 0 1", 154],
  ["r7/8/8/4P3/7k/8/2K5/R7 w - - 0 1", 154],
  ["r7/2k5/8/8/4p2K/8/8/R7 b - - 0 1", 152],
  ["r7/8/8/4P2k/8/8/2K5/R7 w - - 0 1", 152],
  ["7r/8/7k/3P4/8/3P4/8/RK6 w - - 0 1", 221],
  ["rk6/8/3p4/8/3p4/7K/8/7R b - - 0 1", 221],
  ["7r/8/6k1/3P4/8/3P4/8/RK6 w - - 0 1", 206],
  ["rk6/8/3p4/8/3p4/6K1/8/7R b - - 0 1", 206],
  ["8/7N/8/1P2k3/6p1/8/K7/8 w - - 0 1", 290],
  ["8/k7/8/6P1/1p2K3/8/7n/8 b - - 0 1", 290],
  ["8/7N/8/1P6/4k1p1/8/K7/8 w - - 0 1", 290],
  ["8/k7/8/4K1P1/1p6/8/7n/8 b - - 0 1", 290],
  ["7r/8/3n3k/3P4/8/8/8/R5K1 w - - 0 1", -240],
  ["r5k1/8/8/8/3p4/3N3K/8/7R b - - 0 1", -240],
  ["7r/8/7k/3P4/8/8/8/R5K1 w - - 0 1", 146],
  ["r5k1/8/8/8/3p4/7K/8/7R b - - 0 1", 146],
  ["6n1/1B6/5k2/8/1P6/8/4K3/8 w - - 0 1", 180],
  ["8/4k3/8/1p6/8/5K2/1b6/6N1 b - - 0 1", 180],
  ["6n1/8/5k2/8/1P6/8/4K3/8 w - - 0 1", -180],
  ["8/4k3/8/1p6/8/5K2/8/6N1 b - - 0 1", -180],
  ["n7/8/8/7k/8/1K3p2/8/5R2 b - - 0 1", 6],
  ["5r2/8/1k3P2/8/7K/8/8/N7 w - - 0 1", 6],
  ["n7/8/8/7k/8/1K3p2/8/8 b - - 0 1", 548],
  ["8/8/1k3P2/8/7K/8/8/N7 w - - 0 1", 548],
  ["8/r7/8/4k3/8/7N/P7/2K5 w - - 0 1", -181],
  ["2k5/p7/7n/8/4K3/8/R7/8 b - - 0 1", -181],
  ["8/8/8/4k3/8/7N/P7/2K5 w - - 0 1", 363],
  ["2k5/p7/7n/8/4K3/8/8/8 b - - 0 1", 363],
  ["r7/2k5/8/2P5/8/8/8/6KR w - - 0 1", 91],
  ["6kr/8/8/8/2p5/8/2K5/R7 b - - 0 1", 91],
  ["r7/1k6/8/2P5/8/8/8/6KR w - - 0 1", 105],
  ["6kr/8/8/8/2p5/8/1K6/R7 b - - 0 1", 105],
  ["7r/8/2n4k/3P4/8/8/8/R5K1 w - - 0 1", -240],
  ["r5k1/8/8/8/3p4/2N4K/8/7R b - - 0 1", -240],
];
