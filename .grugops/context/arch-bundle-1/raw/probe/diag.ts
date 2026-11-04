// Exploratory, after the reads (PREREG § A red mate floor): does each red row clear with LMR off? It moves no bar.
import { readFileSync } from "node:fs";
import * as E from "./src/engine.ts";
import { parseFen } from "./src/fen.ts";
import * as S from "./src/search.ts";
const { PROBE } = S as any;
const FORMS = JSON.parse(readFileSync("./forms.json", "utf8"));
const BLANK = { lmp: [0, 0, 0, 0], lmpZero: false, lmpBig3: false, cm: false, ch1: false, ch2: false };
const rows = [
  ["C2", "search", 5, "8/1k6/8/1K6/8/8/8/1Q6 w - - 2 2"],
  ["C3", "search", 5, "8/1k6/8/1K6/8/8/8/1Q6 w - - 2 2"],
  ["C3", "choose", 5, "8/6k1/8/6K1/8/8/8/6Q1 w - - 2 2"],
  ["C4", "choose", 6, "k7/8/8/1K6/8/8/8/1Q6 b - - 1 1"],
  ["M1", "choose", 5, "6k1/R7/5K2/8/8/8/8/8 w - - 2 2"],
  ["M4", "choose", 5, "6k1/R7/5K2/8/8/8/8/8 w - - 2 2"],
] as const;
for (const [form, rec, d, fen] of rows) for (const noLmr of [false, true]) {
  Object.assign(PROBE, BLANK, FORMS[form], { noLmr });
  const r = rec === "search" ? S.search(parseFen(fen), d) : (E.chooseMove(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth: d }) as any);
  console.log(JSON.stringify({ form, rec, d, fen, noLmr, score: r.score }));
}
