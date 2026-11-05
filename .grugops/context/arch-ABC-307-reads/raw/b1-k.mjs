// b1-k.mjs <tree> : the smallest k with three distinct replies after 1. e4 on seeds 1..k, and the reply per seed. Same read as ABC-094 A3.
import { readFileSync } from "node:fs";
const t = process.argv[2];
const { createBookProbe } = await import(`${t}/src/book.ts`);
const { seededRandom } = await import(`${t}/src/levels.ts`);
const { parseFen } = await import(`${t}/src/fen.ts`);
const { legalMoves } = await import(`${t}/src/legal.ts`);
const { makeMove } = await import(`${t}/src/apply.ts`);
const { squareName } = await import(`${t}/src/position.ts`);
const bytes = readFileSync(`${t}/data/opening-book/book.json`);
const label = (m) => `${squareName(m.from)}${squareName(m.to)}`;
const seen = new Set(); let k = 0; const per = [];
for (let seed = 1; seed <= 10; seed++) {
  const position = parseFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  makeMove(position, legalMoves(position).find((m) => label(m) === "e2e4"));
  const probe = createBookProbe({ read: () => bytes, warn: () => {}, random: seededRandom(seed) });
  const r = label(probe.bookMove(position));
  per.push(`${seed}:${r}`); seen.add(r);
  if (k === 0 && seen.size >= 3) k = seed;
}
console.log(`k ${k}; distinct over ten ${seen.size}; ${per.join(" ")}`);
