// usage: node nps.mjs <checkout> <r.out> — the tool's stockfishNps on a real -debug all log, plus a raw count.
import { readFileSync } from "node:fs";
import { join } from "node:path";
const [co, file] = process.argv.slice(2);
const { stockfishNps } = await import(join(co, "tools/rating/pair.ts"));
const log = readFileSync(file, "utf8");
console.log("tool stockfishNps:", JSON.stringify(stockfishNps(log)));
const best = log.split("\n").filter((l) => /^\d+ <stockfish\(\d+\): bestmove/.test(l)).length;
const info = log.split("\n").filter((l) => /^\d+ <stockfish\(\d+\): info .* nps \d+/.test(l)).length;
console.log(`stockfish bestmove lines ${best}, info-with-nps lines ${info}`);
