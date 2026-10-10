// QE ABC-140 static reader. usage: node qe140-static.mjs <base-file> <head-file>
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
const [b, h] = process.argv.slice(2).map((f) => readFileSync(f, "utf8"));
const sha = (s) => createHash("sha256").update(s).digest("hex").slice(0, 16);
const count = (t, s) => t.split(s).length - 1;
const pins = (t) => [...t.matchAll(/\n    expect\(instrument, "([^"]+)"\)\.toContain\(\n[\s\S]*?\n    \);(?=\n)/g)].map((m) => [m[1], sha(m[0])]);
const pb = pins(b), ph = pins(h);
console.log(`pins base=${pb.length} head=${ph.length}`);
for (const [i, [msg, s]] of pb.entries()) console.log(`  pin ${i + 1} ${s === ph[i]?.[1] && msg === ph[i]?.[0] ? "IDENTICAL" : "CHANGED"} ${s} ${msg}`);
for (const [msg, s] of ph.slice(pb.length)) console.log(`  new ${s} ${msg}`);
const span = (t, a, z) => { const i = t.indexOf(a); const j = t.indexOf(z, i); return i < 0 || j < 0 ? null : t.slice(i, j + z.length); };
const helper = (t) => span(t, "\nconst productionModulesIn = (directory: string)", '!file.endsWith(".test.ts"));\n');
const composer = (t) => span(t, "\n    const composers = productionModulesIn(directory)", ").toEqual([COMPOSITION_ROOT]);\n");
const pred = (t) => span(t, "\n    const bindsAssembleFrame", "    const composers");
for (const [n, f] of [["helper", helper], ["composer scan..comparator", composer], ["bindsAssembleFrame", pred]])
  console.log(`${n}: ${f(b) === f(h) ? "IDENTICAL" : "CHANGED"} base=${sha(f(b))} head=${sha(f(h))}`);
const lineOf = (t, s) => t.slice(0, t.indexOf(s)).split("\n").length;
console.log(`helper line base=${lineOf(b, "\nconst productionModulesIn =") + 1} head=${lineOf(h, "\nconst productionModulesIn =") + 1}; composer scan line base=${lineOf(b, "\n    const composers =") + 1} head=${lineOf(h, "\n    const composers =") + 1}`);
for (const [n, re] of [["LICENSED_DRIVERS decl", /^const LICENSED_DRIVERS: readonly string\[\] = .*$/gm], ["COMPOSITION_ROOT decl", /^const COMPOSITION_ROOT = "render-seam\.ts";$/gm]]) {
  const mb = b.match(re) ?? [], mh = h.match(re) ?? [];
  console.log(`${n}: base x${mb.length} head x${mh.length} ${JSON.stringify(mb) === JSON.stringify(mh) ? "IDENTICAL" : "CHANGED"} ${mh[0]}`);
}
console.log(`raw substring 'const LICENSED_DRIVERS: readonly string[]' base x${count(b, "const LICENSED_DRIVERS: readonly string[]")} head x${count(h, "const LICENSED_DRIVERS: readonly string[]")}; 'const COMPOSITION_ROOT =' base x${count(b, "const COMPOSITION_ROOT =")} head x${count(h, "const COMPOSITION_ROOT =")}`);
for (const s of ["biome-ignore", "\n  it(", "/**\n * `ADR-0011` CLAUSE 1"]) console.log(`${JSON.stringify(s)} base x${count(b, s)} head x${count(h, s)}`);
// docblock above productionModulesIn
const doc = (t) => { const e = t.indexOf("\nconst productionModulesIn ="); const s = t.lastIndexOf("/**", e); return t.slice(s, e); };
const collapse = (t) => t.replace(/^\s*(\*|\/\/)\s?/gm, "").replace(/\s+/g, " ");
const dh = collapse(doc(h));
console.log("DOCBLOCK(head, collapsed):", dh);
for (const s of ["frame-path probe", "composer tripwire", "licence guard", "COMPOSITION_ROOT", "LICENSED_DRIVERS", "share `COMPOSITION_ROOT`", "Three instruments", "TWO properties", "ADR-0029` decision 2", "Both guards", "THE TWO GUARDS"]) console.log(`  docblock x${count(dh, s)} | ${s}`);
// reach comment of the drift tripwire
const reach = (t) => span(t, "// `ABC-029` forbids changing the guard's expression", "const instrument =");
const rh = collapse(reach(h));
console.log("REACH(head, collapsed):", rh);
for (const s of ["seven spans", "five spans", "R5d", "composer tripwire's own", "licence guard's", "all of them in this `it`"]) console.log(`  reach x${count(rh, s)} | ${s}`);
