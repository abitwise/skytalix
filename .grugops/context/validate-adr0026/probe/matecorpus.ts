/**
 * VALIDATE-ADR0026 probe driver. `node matecorpus.ts <depth> <variant|correct> [slack]`
 *
 * Is the mate floor meaningful? The ruling's corpus carries 3 mate scores in 190. This builds a
 * MATE corpus: every in-progress position within two plies of the mating endgames (the five
 * mate-row FENs plus the ruling's KQK/KRK endgames), deduplicated by FEN, kept when PVS alone
 * (`searchWithoutReductions`' shape) scores it as a mate at <depth>. Then it counts, for LMR
 * (correct or a wrong variant) against PVS at the same depth:
 *   flips     mate <-> no mate, or sign (ADR-0026's floor)
 *   distance  mate both sides, same sign, different ply (NOT counted by ADR-0026's floor)
 * With [slack] = 1, the LMR side searches ONE PLY DEEPER than the PVS side: "every mate PVS sees
 * at depth d, LMR sees at depth d+1" — the floor LMR can actually promise, since it buys the ply.
 */
import { makeMove, unmakeMove } from "../../../../src/apply.ts";
import { parseFen, toFen } from "../../../../src/fen.ts";
import { gameStatus } from "../../../../src/gameend.ts";
import { legalMoves } from "../../../../src/legal.ts";
import { MATE_SCORE } from "../../../../src/search.ts";
import { BASE, type Cfg, fixed } from "./lmr.ts";

const SEEDS = [
  "7k/8/5K2/8/8/8/8/R7 w - - 0 1",
  "7k/8/6K1/8/8/8/8/R7 w - - 0 1",
  "k7/8/8/K7/8/8/8/1R6 b - - 1 1",
  "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1",
  "k7/8/1K6/8/8/8/8/1R6 w - - 0 1",
  "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1",
  "8/8/8/8/8/k7/8/KR6 w - - 0 1",
];
const isMate = (s: number): boolean => Math.abs(s) > MATE_SCORE - 1000;
const out = (o: unknown): void => console.log(JSON.stringify(o));

const [dArg, variant, slackArg] = process.argv.slice(2);
const d = Number(dArg);
const slack = slackArg ? Number(slackArg) : 0;
const PVS: Cfg = { ...BASE, pvs: true };
const ON: Cfg = { ...BASE, pvs: true, lmr: true, ...(variant === "correct" ? {} : { bug: variant as Cfg["bug"] }) };

const seen = new Set<string>();
const corpus: string[] = [];
const add = (fen: string): void => {
  const key = fen.split(" ").slice(0, 4).join(" ");
  if (seen.has(key)) return;
  seen.add(key);
  corpus.push(fen);
};
for (const seed of SEEDS) {
  add(seed);
  const p = parseFen(seed);
  for (const m1 of legalMoves(p)) {
    const u1 = makeMove(p, m1);
    if (gameStatus(p).result === "in-progress") {
      add(toFen(p));
      for (const m2 of legalMoves(p)) {
        const u2 = makeMove(p, m2);
        if (gameStatus(p).result === "in-progress") add(toFen(p));
        unmakeMove(p, m2, u2);
      }
    }
    unmakeMove(p, m1, u1);
  }
}
const t0 = performance.now();
let mates = 0;
let flips = 0;
let distance = 0;
let lmrMatesNotInBase = 0;
const examples: unknown[] = [];
for (const fen of corpus) {
  const b = fixed(parseFen(fen), d, PVS);
  const l = fixed(parseFen(fen), d + slack, ON);
  if (!isMate(b.score)) {
    if (isMate(l.score)) lmrMatesNotInBase++;
    continue;
  }
  mates++;
  if (!isMate(l.score) || Math.sign(l.score) !== Math.sign(b.score)) {
    flips++;
    if (examples.length < 5) examples.push({ flip: fen, pvs: b.score, lmr: l.score });
  } else if (slack === 0 ? l.score !== b.score : b.score > 0 && l.score < b.score) {
    // with slack: the side to move mates, and LMR a ply deeper reports a LONGER mate than PVS saw
    distance++;
    if (examples.length < 5) examples.push({ distance: fen, pvs: b.score, lmr: l.score });
  }
}
out({
  summary: "matecorpus",
  variant,
  depth: d,
  lmrDepth: d + slack,
  positionsBuilt: corpus.length,
  mateScoredByPvs: mates,
  flips,
  distanceChanges: distance,
  lmrMateWherePvsHasNone: lmrMatesNotInBase,
  examples,
  ms: Math.round(performance.now() - t0),
});
