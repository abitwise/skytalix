import { readFileSync, writeFileSync } from "node:fs";
const d = JSON.parse(readFileSync("data.json", "utf8"));
const J = (x: unknown) => JSON.stringify(x);
const out: string[] = [];
out.push(`/**
 * ABC-269 (E1, the tapered evaluation): QE's FROZEN POSITION SETS. TEST-ONLY DATA.
 *
 * Frozen by QE before any E1 code exists (task \`qe-ABC-269-freeze\`; ticket test note 1; the
 * PREREG, the build rules and the verify run are under \`.grugops/context/qe-ABC-269-freeze/\`).
 * Read from \`main\`'s \`src/\` tree \`58fa3eb4\`. NEVER changed to make a row fit: a row that must
 * change is a new, dated QE note and a re-freeze, never an edit here.
 *
 * - \`TAPER_MIRROR_POSITIONS\`: B1 (a), the >= 15 new positions over phases 0-24 (30 here),
 *   read beside \`G3\`'s corpus with the shared \`mirrorPosition\` helper (\`ABC-082\` \`A7\`).
 *   Rows with \`rawPhase >= 24\` are B1 (b)'s full-material rows too (the clamp rows included).
 * - \`TAPER_KP_ENDINGS\`: B1 (d)'s 6 graded king-and-pawn endings (centre >= corner + 20 cp, from
 *   the walking king's side). \`TAPER_KP_SHELTER_STRESS\`: 3 more, a REPORT until the Architect
 *   rules whether a sheltered corner belongs in B1 (d) (QE's finding); then they promote as they
 *   stand.
 * - \`TAPER_PASSER_PAIRS\` and \`TAPER_PASSER_PHASES\`: B1 (e), by position pair and by array.
 * - \`TAPER_DOOR_CORPUS\` and \`G3_CORPUS_MAIN_EVALUATE\`: B1 (c), the pre-ticket \`evaluate\` on
 *   every position above (and its mirror) and on \`G3\`'s 184 in \`buildCorpus\` order.
 *
 * Phase is N 1, B 1, R 2, Q 4 over both sides (\`ADR-0064\` d1); \`rawPhase\` is before the clamp
 * to 24. Not named \`*.test.ts\`, so vitest does not collect it; under \`src/\`, so \`tsc\` and Biome
 * check it. No production module may import it (the shared mirror corpus's precedent). It names
 * no other module by file name: \`ABC-082\` \`A7\`'s guard reads every non-test module's text.
 */

/** Where and when the sets were frozen. */
export const TAPER_FROZEN_AT = {
  task: "qe-ABC-269-freeze",
  ticket: "ABC-269",
  srcTree: "58fa3eb4252509cbb1423991e5ae7948f35f98f4",
  baseCommit: "3e55c6a4",
} as const;

/** A B1 (a) row. \`source\` is how it was built (a stated rule); \`why\` is what it exercises. */
export interface TaperMirrorRow {
  readonly id: string;
  readonly fen: string;
  readonly rawPhase: number;
  readonly source: string;
  readonly why: string;
}

/**
 * B1 (a): one row per phase 0-24 (ladders L1 and L3 from position-4, L2 from position-5: pieces
 * removed in a stated order, the side to move flipped to black on even phases where legal), two
 * clamp rows (raw 28 and 32), two -0 traps (mg exactly 0, |delta x (24 - w)| < 24) and one row
 * with an en-passant square below phase 24.
 */
export const TAPER_MIRROR_POSITIONS: readonly TaperMirrorRow[] = [`);
for (const m of d.mirror) out.push(`  { id: ${J(m.id)}, fen: ${J(m.fen)}, rawPhase: ${m.phase}, source: ${J(m.source)}, why: ${J(m.why)} },`);
out.push(`];

/** A B1 (d) ending: the same position twice, the walking king on a centre square or in a corner. */
export interface TaperKpEnding {
  readonly id: string;
  readonly walkingKing: "white" | "black";
  readonly centreSquare: string;
  readonly cornerSquare: string;
  /** Own pawns in front of the corner king: none, on one of its files, or on both. */
  readonly cornerShelter: "none" | "partial" | "full";
  readonly centreFen: string;
  readonly cornerFen: string;
  readonly rawPhase: number;
  readonly why: string;
  /** Pre-ticket \`evaluate\`, centre minus corner, from the walking king's side (a reading). */
  readonly mainCentreMinusCorner: number;
}

const kp = (row: Omit<TaperKpEnding, "rawPhase">): TaperKpEnding => ({ ...row, rawPhase: 0 });

/** B1 (d), graded: centre minus corner >= 20 cp from the walking king's side, on all 6. */
export const TAPER_KP_ENDINGS: readonly TaperKpEnding[] = [`);
const kpLine = (k: any) => `  kp({ id: ${J(k.id)}, walkingKing: ${J(k.walkingKing)}, centreSquare: ${J(k.centreSquare)}, cornerSquare: ${J(k.cornerSquare)}, cornerShelter: ${J(k.cornerShelter)}, centreFen: ${J(k.centreFen)}, cornerFen: ${J(k.cornerFen)}, why: ${J(k.why)}, mainCentreMinusCorner: ${k.mainCentreMinusCorner} }),`;
for (const k of d.kp) out.push(kpLine(k));
out.push(`];

/**
 * REPORT, not graded, until the Architect rules (QE finding, \`qe-ABC-269-freeze\`): the castled
 * corner with both of its files sheltered. \`kingExposure\` keeps equal halves at E1 (shelter
 * tapering is E3's), so the centre king still pays up to 105 cp there. If the ruling puts the
 * sheltered corner in B1 (d), these rows join it exactly as frozen.
 */
export const TAPER_KP_SHELTER_STRESS: readonly TaperKpEnding[] = [`);
for (const k of d.ss) out.push(kpLine(k));
out.push(`];

/**
 * A B1 (e) pair: the same position with and without one passed pawn. The kings stand where their
 * two halves are equal (white a8, black h1: 40 - 15 x 6 = -50 = the middlegame table), so the
 * passer is the only term whose halves differ: the pair isolates it exactly. \`ownRank\` is counted
 * from the passer's side (2 = its start rank); \`baseBonus\` is the pre-ticket \`PASSED_PAWN_BONUS\`.
 */
export interface TaperPasserPair {
  readonly id: string;
  readonly passer: "white" | "black";
  readonly ownRank: number;
  readonly square: string;
  readonly rawPhase: number;
  readonly withPasserFen: string;
  readonly withoutPasserFen: string;
  readonly baseBonus: number;
}

/** B1 (e) by position: white passers on ranks 2-7, black on 2, 5 and 7; phases 0, 6, 18, 24. */
export const TAPER_PASSER_PAIRS: readonly TaperPasserPair[] = [`);
for (const p of d.passer) out.push(`  { id: ${J(p.id)}, passer: ${J(p.passer)}, ownRank: ${p.ownRank}, square: ${J(p.square)}, rawPhase: ${p.phase}, withPasserFen: ${J(p.withPasserFen)}, withoutPasserFen: ${J(p.withoutPasserFen)}, baseBonus: ${p.baseBonus} },`);
out.push(`];

/**
 * B1 (e) by array (\`VALUE_TABLES_FOR_TEST\`): every rank whose pre-ticket bonus is > 0, read at
 * EVERY integer phase in each bar's range. Bars: \`atMostSix\` >= 1.5 x base; \`identity\` exactly
 * base; \`atLeastEighteen\` <= 1.25 x base.
 */
export const TAPER_PASSER_PHASES = {
  atMostSix: [0, 1, 2, 3, 4, 5, 6],
  atLeastEighteen: [18, 19, 20, 21, 22, 23, 24],
  identity: 24,
  ownRanks: [2, 3, 4, 5, 6, 7],
} as const;

/**
 * B1 (c): the pre-ticket \`evaluate\` (side to move's view) on every position in this file and its
 * \`mirrorPosition\` twin, de-duplicated. The build's \`evaluateWithoutTaper\` must equal each one,
 * \`Object.is\`.
 */
export const TAPER_DOOR_CORPUS: ReadonlyArray<{ readonly fen: string; readonly main: number }> = [`);
for (const r of d.door) out.push(`  { fen: ${J(r.fen)}, main: ${r.main} },`);
out.push(`];

/** B1 (c): the pre-ticket \`evaluate\` on \`G3\`'s 184 (\`buildCorpus()\`), in its order. */
export const G3_CORPUS_MAIN_EVALUATE: readonly number[] = [`);
out.push(`  ${d.g3.join(", ")},`);
out.push(`];
`);
writeFileSync(process.argv[2], out.join("\n"));
