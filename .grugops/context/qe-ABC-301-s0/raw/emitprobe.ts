// qe-ABC-301-s0: the emitter, read independently. Base values against main's file by node:assert, and a fit-SHAPED table
// (distinct non-zero E4a eg halves, nothing fitted) through emitSource and back, since base values are all 0 and cannot see a
// crossed column. usage: node emitprobe.ts <tree> <main's evaluate-params.ts> <extract counts json> <out dir>
import assert from "node:assert/strict"; import { readFileSync, writeFileSync } from "node:fs";
const [root, mainPath, countsPath, outDir] = process.argv.slice(2);
const T = await import(`${root}/tools/tune/tune.ts`); const R = await import(`${root}/tools/tune/tracer.ts`);
const counts = JSON.parse(readFileSync(countsPath as string, "utf8")).counts;
const ce = { ce: 0.5 };
const emit = (mg: number[], eg: number[]) => T.emitSource({ counts, manifest: ["a", "b"], manifestSha256: "0".repeat(64), baseTableSha256: "0".repeat(64), lichess: true },
  { table: { mg, eg, wmg: R.SHIPPED.wmg, weg: R.SHIPPED.weg, cap: R.SHIPPED.cap }, rows: { ownTrain: 1, ownVal: 1, lichess: 1 }, K_own: 1, K_lichess: 1, ownWeight: T.OWN_WEIGHT, config: "C-S", lambda: 0, ratio: 1, val: { base: ce, fit: ce }, train: { base: ce, fit: ce } }, "0".repeat(40));
const res: any = {};
const baseSrc = emit(Array.from(R.SHIPPED.mg), Array.from(R.SHIPPED.eg)); writeFileSync(`${outDir}/base.ts`, baseSrc);
const base = await import(`${outDir}/base.ts`), main = await import(mainPath as string);
const names = Object.keys(main).sort(); assert.deepEqual(Object.keys(base).sort(), names);
for (const n of names) assert.deepStrictEqual(base[n], main[n], n);
res.exports = names.length; res.valueExports = names.filter((n) => !/^PHASE_/.test(n)).length; res.baseEqualMain = true; res.U = base.PASSED_UNSTOPPABLE;
const mg = Array.from(R.SHIPPED.mg) as number[], eg = Array.from(R.SHIPPED.eg) as number[];
for (let i = 0; i < 6; i++) { eg[R.T_KE + i] = 11 + i; eg[R.T_KO + i] = 21 + i; eg[R.T_FP + i] = 31 + i; }
const fitSrc = emit(mg, eg); writeFileSync(`${outDir}/fit.ts`, fitSrc);
const fit = await import(`${outDir}/fit.ts`);
res.roundTrip = { KE: fit.PASSED_KING_ENEMY.eg, KO: fit.PASSED_KING_OWN.eg, FP: fit.PASSED_FREE.eg, U: fit.PASSED_UNSTOPPABLE };
const back = R.tableOf(fit); let bad = 0; for (let t = 0; t < R.N_TERMS; t++) { if (back.mg[t] !== mg[t] || back.eg[t] !== eg[t]) bad++; }
res.roundTripTermMismatches = bad; res.nTerms = R.N_TERMS;
console.log(JSON.stringify(res));
