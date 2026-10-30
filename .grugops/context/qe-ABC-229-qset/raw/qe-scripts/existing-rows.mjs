// qe-ABC-229-qset: every FEN literal in src/quiescence.test.ts, quiesce at qply 0 / ply 0, full window, under the
// shipped rule (base) and under d5 (oracle). Lists the rows whose value moves, so the SE knows what to route.
// usage: node existing-rows.mjs <baseTree> <oracleTree>
import { readFileSync } from "node:fs";
const [B, O] = process.argv.slice(2);
const { parseFen } = await import(`${B}/src/fen.ts`);
const qb = await import(`${B}/src/quiescence.ts`);
const qo = await import(`${O}/src/quiescence.ts`);
const { parseFen: parseFenO } = await import(`${O}/src/fen.ts`);
const src = readFileSync(`${B}/src/quiescence.test.ts`, "utf8");
const fens = [...new Set([...src.matchAll(/"([1-8pnbrqkPNBRQK]+(?:\/[1-8pnbrqkPNBRQK]+){7} [wb] [KQkq-]+ [a-h1-8-]+ \d+ \d+)"/g)].map((m) => m[1]))];
let moved = 0;
for (const fen of fens) {
  let old, neu;
  try {
    old = qb.quiesce(parseFen(fen), -Infinity, Infinity, 0, 0, { evasions: true }, () => {});
    neu = qo.quiesce(parseFenO(fen), -Infinity, Infinity, 0, 0, { evasions: true, quietPromotions: true }, () => {});
  } catch (e) { console.log(`ERR ${fen} ${e.message}`); continue; }
  if (old !== neu) moved++;
  console.log(`${old === neu ? "same " : "MOVES"} ${String(old).padStart(7)} -> ${String(neu).padStart(7)}  ${fen}`);
}
console.log(`fens: ${fens.length}, moved: ${moved}`);
