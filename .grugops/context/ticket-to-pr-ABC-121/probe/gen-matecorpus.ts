/**
 * PROBE: writes src/search.mate-corpus.ts — the review's derivation (validate-adr0026/probe/
 * matecorpus.ts), verbatim: the seven seed FENs, then every in-progress position within two plies
 * of each, deduplicated on the first four FEN fields, in that generation order. Run once; the
 * output is frozen and checked in. Prints the count.
 */
import { writeFileSync } from "node:fs";
import { makeMove, unmakeMove } from "../../../../src/apply.ts";
import { parseFen, toFen } from "../../../../src/fen.ts";
import { gameStatus } from "../../../../src/gameend.ts";
import { legalMoves } from "../../../../src/legal.ts";

const SEEDS = [
  "7k/8/5K2/8/8/8/8/R7 w - - 0 1",
  "7k/8/6K1/8/8/8/8/R7 w - - 0 1",
  "k7/8/8/K7/8/8/8/1R6 b - - 1 1",
  "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1",
  "k7/8/1K6/8/8/8/8/1R6 w - - 0 1",
  "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1",
  "8/8/8/8/8/k7/8/KR6 w - - 0 1",
];
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

const header = `/**
 * ABC-121's MATE-RICH CORPUS — TEST-ONLY DATA, frozen (\`ADR-0026\` decision 9, amended).
 *
 * The one-extra-ply mate floor runs on this list: for every position \`searchWithoutReductions\`
 * scores as a mate at depth 4, the shipped \`search()\` scores a mate of the same sign, no longer,
 * at depth 5. The 190-position drift corpus holds only 3 mates, so it cannot carry that floor.
 *
 * WHAT IT IS: seven seed FENs — the three that carry the suite's five mate rows (\`search.test.ts\`
 * \`A3\`'s mate in 2 and mate in 1, \`transposition.test.ts\`'s depth-10 rook ending) and the four
 * KQK/KRK endgames of \`engine.test.ts\`'s endgame corpus the ruling used — each followed by every
 * in-progress position within two plies of it, deduplicated on the first four FEN fields, in
 * generation order. The
 * derivation is the review's \`.grugops/context/validate-adr0026/probe/matecorpus.ts\`, run once
 * by \`.grugops/context/ticket-to-pr-ABC-121/probe/gen-matecorpus.ts\` and pasted here.
 *
 * FROZEN, NOT GENERATED AT TEST TIME, so a move-generator change cannot silently shrink the net;
 * \`src/search.pvs-lmr.test.ts\` pins its length. Not named \`*.test.ts\`, so vitest does not
 * collect it; under \`src/\`, so \`tsc\` and Biome check it. No production module imports it.
 */

/** The seven seeds the corpus is grown from, in the order it grows them. */
export const MATE_CORPUS_SEEDS: readonly string[] = [
${SEEDS.map((fen) => `  "${fen}",`).join("\n")}
];

/** Each seed, then every in-progress position within two plies of it, first seen first. ${corpus.length} positions. */
export const MATE_CORPUS: readonly string[] = [
${corpus.map((fen) => `  "${fen}",`).join("\n")}
];
`;
writeFileSync(new URL("../../../../src/search.mate-corpus.ts", import.meta.url), header);
console.log(JSON.stringify({ positions: corpus.length }));
