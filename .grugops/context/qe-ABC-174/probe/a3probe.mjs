// qe-ABC-174: grades ABC-174 A3's discrimination by step. Replicates the A3 row (src/levels.test.ts at be6a5599):
// reference = chooseMove(fen, { budgetMs: 3000, now: virtualClock(step) }); viaLevel = createLevel(L, { seed, now:
// virtualClock(step) }); equal = kind engine && same from-to label && same depth && same nodes. A row is RED when
// fewer than 30 of 30 are equal for either seed (1, 87). L is a synthetic level (a table-entry mutant at level 5),
// step is either L.budgetMs/3 (what the row does) or a fixed step. Usage: node a3probe.mjs <tree-root> [json-steps]
import { pathToFileURL } from "node:url";
import { readFileSync } from "node:fs";
const root = process.argv[2];
const imp = (f) => import(pathToFileURL(`${root}/src/${f}`).href);
const { chooseMove } = await imp("engine.ts");
const { createLevel } = await imp("levels.ts");
const { parseFen, toFen } = await imp("fen.ts");
const { legalMoves } = await imp("legal.ts");
const { makeMove, unmakeMove } = await imp("apply.ts");
const { virtualClock } = await imp("virtual-clock.ts");
const { squareName } = await imp("position.ts");
// ENDGAMES roots, read from the test file so the probe uses the row's own corpus.
const src = readFileSync(`${root}/src/levels.test.ts`, "utf8");
const block = src.slice(src.indexOf("const ENDGAMES = withChildren(["), src.indexOf("]);", src.indexOf("const ENDGAMES = withChildren([")));
const roots = [...block.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
const fens = [];
for (const r of roots) { const p = parseFen(r); fens.push(r); for (const m of legalMoves(p)) { const u = makeMove(p, m); if (legalMoves(p).length > 0) fens.push(toFen(p)); unmakeMove(p, m, u); } }
const THIRTY = fens.filter((f) => legalMoves(parseFen(f)).length <= 8).slice(0, 30);
const label = (m) => `${squareName(m.from)}${squareName(m.to)}`;
const grade = (L, step) => {
  const ref = THIRTY.map((f) => chooseMove(parseFen(f), { budgetMs: 3000, now: virtualClock(step) }));
  const out = {};
  for (const seed of [1, 87]) {
    out[seed] = THIRTY.filter((f, i) => {
      const v = createLevel(L, { seed, now: virtualClock(step) })(parseFen(f)); const e = ref[i];
      return v && e && v.kind === "engine" && label(v.move) === label(e.move) && v.depth === e.depth && v.nodes === e.nodes;
    }).length;
  }
  return { equal: out, red: out[1] < 30 || out[87] < 30, depths: [...new Set(ref.map((r) => r.depth))].sort().join("/") };
};
console.log(`THIRTY ${THIRTY.length}`);
const budgets = [2000, 2500, 2900, 2990, 2999, 3000, 3001, 3010, 3100, 3500, 4500];
const rates = [0, 0.01, 0.05];
const STEPS = process.argv[3] ? JSON.parse(process.argv[3]) : ["b/3", 100, 10]; // optional: a JSON list of steps
for (const stepKind of STEPS) {
  for (const b of budgets) for (const r of rates) {
    if (r > 0 && b !== 3000) continue;
    const step = stepKind === "b/3" ? b / 3 : stepKind;
    const t = Date.now(); const g = grade({ budgetMs: b, blunderRate: r }, step);
    console.log(`step ${String(stepKind).padEnd(4)} (${step.toFixed(1)})\tbudget ${b}\trate ${r}\tequal s1 ${g.equal[1]} s87 ${g.equal[87]}\t${g.red ? "RED" : "green"}\tref depths ${g.depths}\t${Date.now() - t} ms`);
  }
}
