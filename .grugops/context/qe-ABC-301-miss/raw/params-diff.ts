// qe-ABC-301-miss: QE's own comparator of the two evaluate-params.ts and of fit.json's table. No tool code. usage: node params-diff.ts <cand> <base> <fit.json>
import { readFileSync } from "node:fs";
const [cand, base, fit] = process.argv.slice(2) as [string, string, string];
const C = await import(`${cand}/src/evaluate-params.ts`);
const B = await import(`${base}/src/evaluate-params.ts`);
const flat = (v: unknown, k: string, o: Map<string, number>) => {
  if (typeof v === "number") o.set(k, v);
  else if (Array.isArray(v)) v.forEach((x, i) => flat(x, `${k}[${i}]`, o));
  else if (v && typeof v === "object") for (const [a, b] of Object.entries(v)) flat(b, `${k}.${a}`, o);
};
const fc = new Map<string, number>(), fb = new Map<string, number>();
for (const k of Object.keys(C)) flat(C[k], k, fc);
for (const k of Object.keys(B)) flat(B[k], k, fb);
console.log("exports cand", Object.keys(C).length, "base", Object.keys(B).length, "same names", JSON.stringify(Object.keys(C).sort()) === JSON.stringify(Object.keys(B).sort()));
console.log("leaves cand", fc.size, "base", fb.size, "same keys", [...fc.keys()].every((k) => fb.has(k)));
const fam = (k: string) => k.replace(/\[\d+\]/g, "");
const moved = new Map<string, number>(), total = new Map<string, number>();
let nonInt = 0;
for (const [k, v] of fc) {
  const f = fam(k); total.set(f, (total.get(f) ?? 0) + 1);
  if (v !== fb.get(k)) moved.set(f, (moved.get(f) ?? 0) + 1);
  if (!Number.isInteger(v)) nonInt++;
}
console.log("non-integer leaves", nonInt);
for (const [f, t] of total) console.log(`${f}: moved ${moved.get(f) ?? 0} of ${t}`);
// d6 held set, as the PREREG states it.
const held: [string, (k: string) => boolean][] = [
  ["MATERIAL", (k) => k.startsWith("MATERIAL")],
  ["PHASE_*", (k) => k.startsWith("PHASE_")],
  ["MOBILITY_CAP", (k) => k.startsWith("MOBILITY_CAP")],
  ["queen-on eg halves", (k) => /_QUEEN\.eg/.test(k)],
  ["E4a mg halves", (k) => /^PASSED_(KING_ENEMY|KING_OWN|FREE)\.mg/.test(k)],
  ["E4a R 0 and 7", (k) => /^PASSED_(KING_ENEMY|KING_OWN|FREE)\.eg\[(0|7)\]/.test(k)],
  ["PASSED_UNSTOPPABLE", (k) => k.startsWith("PASSED_UNSTOPPABLE")],
];
for (const [n, t] of held) {
  const ks = [...fc.keys()].filter(t);
  const bad = ks.filter((k) => fc.get(k) !== fb.get(k));
  console.log(`held ${n}: ${ks.length} leaves, ${bad.length} moved`);
}
const free: RegExp[] = [/^PASSED\.(mg|eg)\[[1-6]\]/, /^(DOUBLED|ISOLATED|KING_SHELTER_MISSING|KING_FILE_HALF_OPEN|KING_FILE_OPEN)\.(mg|eg)/, /^MOBILITY_WEIGHT/, /_QUEEN\.mg/, /^PASSED_(KING_ENEMY|KING_OWN|FREE)\.eg\[[1-6]\]/];
let neg = 0, nf = 0;
for (const [k, v] of fc) if (free.some((r) => r.test(k))) { nf++; if (v < 0) { neg++; console.log("NEGATIVE", k, v); } }
console.log(`free non-PST leaves ${nf}, below 0: ${neg}`);
// PST left/right tie on the emission
let tieMiss = 0, cells = 0;
for (const pc of Object.keys(C.PST)) for (const h of ["mg", "eg"] as const) { const t = C.PST[pc][h] as number[]; for (let r = 0; r < 8; r++) for (let f = 0; f < 4; f++) { cells++; if (t[r * 8 + f] !== t[r * 8 + 7 - f]) tieMiss++; } }
console.log(`PST left/right tied pairs ${cells}, untied ${tieMiss}`);
// fit.json's table against the file, by QE's own layout: MATERIAL 5, PST 6 x 64 in PST_NAMES order, then PASSED 1..6, DBL, ISO, SHEL, HALF, OPEN, the 3 queen-on, KE 1..6, KO 1..6, FP 1..6, U.
const j = JSON.parse(readFileSync(fit, "utf8")).table;
const mism: string[] = [];
for (const h of ["mg", "eg"] as const) {
  const v: number[] = [];
  for (let i = 1; i <= 5; i++) v.push(C.MATERIAL[h][i]);
  for (const n of ["pawn", "knight", "bishop", "rook", "queen", "king"]) v.push(...C.PST[n][h]);
  for (let r = 1; r <= 6; r++) v.push(C.PASSED[h][r]);
  for (const n of ["DOUBLED", "ISOLATED", "KING_SHELTER_MISSING", "KING_FILE_HALF_OPEN", "KING_FILE_OPEN", "KING_SHELTER_MISSING_QUEEN", "KING_FILE_HALF_OPEN_QUEEN", "KING_FILE_OPEN_QUEEN"]) v.push(C[n][h]);
  for (const n of ["PASSED_KING_ENEMY", "PASSED_KING_OWN", "PASSED_FREE"]) for (let r = 1; r <= 6; r++) v.push(C[n][h][r]);
  v.push(C.PASSED_UNSTOPPABLE[h]);
  const t = j[h] as number[];
  if (t.length !== v.length) mism.push(`${h} length ${t.length} vs ${v.length}`);
  v.forEach((x, i) => { if (x !== t[i]) mism.push(`${h}[${i}] file ${x} fit ${t[i]}`); });
}
console.log(`fit.json table vs file, own layout: ${mism.length} mismatches`, mism.slice(0, 12).join("; "));
console.log("fit.json other keys", Object.keys(j).filter((k) => k !== "mg" && k !== "eg").map((k) => `${k}=${JSON.stringify(j[k])}`).join(" "), "file MOBILITY_WEIGHT", JSON.stringify(C.MOBILITY_WEIGHT), "cap", JSON.stringify(C.MOBILITY_CAP));
