// Security/NFR ABC-087 probe 3 (out of tree): level 1's blunder path on the REAL clock over the
// deep corpus (perft 184 + puzzles 62): how often it exceeds its 100 ms budget by more than 20 %.
import os from "node:os";
import { createLevel } from "<sec-scratch>/tree/src/levels.ts";
import { parseFen, toFen } from "<sec-scratch>/tree/src/fen.ts";
import { buildCorpus } from "<sec-scratch>/tree/src/evaluate.mirror-corpus.ts";
import { PUZZLES } from "<sec-scratch>/tree/src/puzzle-corpus.ts";
console.log("load1 start", os.loadavg()[0].toFixed(2));
const fens = [...buildCorpus().map((e) => toFen(e.position)), ...PUZZLES.map((p) => p.fen)];
const always = { budgetMs: 100, blunderRate: 1 }; // level 1's budget, the draw forced to fire
const el: number[] = [];
for (const fen of fens) { const c = createLevel(always, { seed: 1 })(parseFen(fen)); if (c) el.push(c.elapsedMs); }
el.sort((a, b) => a - b);
const over = el.filter((x) => x > 120).length;
console.log("level-1 budget, every move a blunder, real clock: n", el.length, "median", el[el.length >> 1], "p90", el[Math.floor(el.length * 0.9)], "max", el.at(-1), "; > 120 ms:", over, "(", (100 * over / el.length).toFixed(1), "% )");
console.log("load1 end", os.loadavg()[0].toFixed(2));
