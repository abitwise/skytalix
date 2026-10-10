// QE ABC-054 — spelling table. Usage: node spell.cjs <repo> <tipSha> <baseSha>
// Instruments are EXTRACTED BY TEXT from git (no copy can drift): bindsAValueFrom (tip),
// runtimeImportersOf's regex (base), the composer tripwire's bindsAssembleFrame (tip).
// Oracle: TypeScript transpileModule under verbatimModuleSyntax (the repo's tsconfig setting); an
// import declaration from the target that still carries a binding after transpile binds a VALUE.
const { execFileSync } = require("node:child_process");
const { stripTypeScriptTypes } = require("node:module");
const [repo, tip, base] = process.argv.slice(2);
const ts = require(`${repo}/node_modules/typescript`);
const show = (sha, p) => execFileSync("git", ["-C", repo, "show", `${sha}:${p}`], { encoding: "utf8" });
const cut = (s, from, to) => {
  const i = s.indexOf(from);
  const j = s.indexOf(to, i);
  if (i < 0 || j < 0) throw new Error(`extract failed: ${from}`);
  return s.slice(i, j);
};
const tipSeam = show(tip, "src/render-seam.test.ts");
const tipNfr = show(tip, "src/history-pane.nfr.test.ts");
const baseSeam = show(base, "src/render-seam.test.ts");
const newSrc = cut(tipSeam, "const bindsAValueFrom =", "\n\n/**");
const wireSrc = cut(tipNfr, "const bindsAssembleFrame =", "\n    const composers");
const oldTpl = cut(baseSeam, "`^(?:import|export)", ',\n        "m",');
const code =
  stripTypeScriptTypes(
    `${newSrc}\n${wireSrc}\nconst oldImports = (source, target) => new RegExp(${oldTpl}, "m").test(source);\n`,
  ) + "return { bindsAValueFrom, bindsAssembleFrame, oldImports };";
const { bindsAValueFrom, bindsAssembleFrame, oldImports } = new Function(code)();

const oracle = (source, target) => {
  const out = ts.transpileModule(source, {
    compilerOptions: { verbatimModuleSyntax: true, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const sf = ts.createSourceFile("o.ts", out, ts.ScriptTarget.ES2022, true);
  let value = false;
  let names = [];
  for (const st of sf.statements) {
    if (!ts.isImportDeclaration(st) || st.moduleSpecifier.text !== `./${target}`) continue;
    const c = st.importClause;
    if (!c) continue;
    if (c.name) { value = true; names.push(`default:${c.name.text}`); }
    const nb = c.namedBindings;
    if (nb && ts.isNamespaceImport(nb)) { value = true; names.push(`*:${nb.name.text}`); }
    if (nb && ts.isNamedImports(nb))
      for (const el of nb.elements) { value = true; names.push((el.propertyName ? `${el.propertyName.text} as ` : "") + el.name.text); }
  }
  return { value, names };
};

const M = [
  // [id, spelling, note] — target ./m.ts; ids S* = the ticket's eight in QE's own words
  ["S1", 'import { g } from "./m.ts";', "A1 value"],
  ["S2", 'import { type T, g } from "./m.ts";', "A1 mixed"],
  ["S3", 'import Dflt from "./m.ts";', "A1 default"],
  ["S4", 'import * as mod from "./m.ts";', "A1 namespace"],
  ["S5", 'import type { T } from "./m.ts";', "A1 import type"],
  ["S6", 'import { type T, type U } from "./m.ts";', "A1 inline all-type"],
  ["S7", 'import "./m.ts";', "A1 bare"],
  ["S8", 'export { g } from "./m.ts";', "A1 re-export"],
  ["E1", 'import { g, type T } from "./m.ts";', "mixed, type last"],
  ["E2", 'import {\n  type T,\n  g,\n} from "./m.ts";', "multi-line mixed"],
  ["E3", 'import {\n  type T,\n  type U,\n} from "./m.ts";', "multi-line all-type"],
  ["E4", 'import D, {\n  type T,\n} from "./m.ts";', "multi-line default + type"],
  ["E5", 'import\n  { g }\n  from "./m.ts";', "keyword and from on own lines"],
  ["E6", 'import { g as h } from "./m.ts";', "aliased value"],
  ["E7", 'import { type T as V } from "./m.ts";', "aliased type"],
  ["E8", 'import { default as D } from "./m.ts";', "default via braces"],
  ["E9", 'import D, { type T } from "./m.ts";', "default + type brace"],
  ["E10", 'import D, { g } from "./m.ts";', "default + value brace"],
  ["E11", 'import D, * as ns from "./m.ts";', "default + namespace"],
  ["E12", 'import type D from "./m.ts";', "type default"],
  ["E13", 'import type * as ns from "./m.ts";', "type namespace"],
  ["E14", 'import "./m.ts";\nimport { g } from "./m.ts";', "bare then value, one file"],
  ["E15", 'import { g } from "./m.ts";\nimport "./m.ts";', "value then bare, one file"],
  ["E16", 'import "./m.ts";\nimport { type T } from "./m.ts";', "bare then all-type, one file"],
  ["E17", 'import type { T } from "./m.ts";\nimport { g } from "./m.ts";', "type then value, one file"],
  ["E18", 'import {} from "./m.ts";', "empty braces"],
  ["E19", 'import { type T, } from "./m.ts";', "trailing comma all-type"],
  ["E20", 'export * from "./m.ts";', "star re-export"],
  ["E21", 'export * as ns from "./m.ts";', "namespace re-export"],
  ["E22", 'export type { T } from "./m.ts";', "type re-export"],
  ["E23", 'import { type } from "./m.ts";', "a VALUE named type"],
  ["E24", 'import { type as t } from "./m.ts";', "value `type` aliased"],
  ["E25", 'import { typeX } from "./m.ts";', "name starting type"],
  ["E26", 'import { g } from "./xm.ts";', "other target, same suffix"],
  ["E27", 'import { g } from "./m.tsx";', "other target, longer ext"],
  // over-count probes (instrument says value where none is bound)
  ["O1", 'import { /* g */ type T } from "./m.ts";', "block comment in braces"],
  ["O2", 'import {\n  type T, // g\n  type U,\n} from "./m.ts";', "line comment in braces"],
  ["O3", 'import type{ T } from "./m.ts";', "import type{ no space"],
  ["O4", '/*\nimport { g } from "./m.ts";\n*/', "commented-out import at column 0"],
  ["O5", 'const doc = `\nimport { g } from "./m.ts";\n`;', "template literal at column 0"],
  ["O6", 'import {\n  // g,\n  type T,\n} from "./m.ts";', "commented-out specifier"],
  // under-count probes (instrument misses a value) — A8 fails RED on these
  ["U1", "import { g } from './m.ts';", "single quotes"],
  ["U2", 'import { g } from "./m.ts"', "no semicolon"],
  ["U3", 'import { g } from "./m.ts" with { type: "json" };', "import attributes"],
  ["U4", 'import { "g" as h } from "./m.ts";', "string-named specifier"],
  ["U5", 'import type { T } from "./a.ts"; import { g } from "./m.ts";', "two statements, one line"],
  ["U6", 'import{ g }from "./m.ts";', "no whitespace after import"],
];

const row = (cells) => `| ${cells.join(" | ")} |`;
const esc = (s) => "`" + s.replace(/\n/g, "⏎").replace(/\|/g, "\\|") + "`";
console.log(row(["id", "spelling (⏎ = newline)", "case", "oracle binds value", "NEW bindsAValueFrom", "OLD regex", "new vs oracle"]));
console.log(row(["---", "---", "---", "---", "---", "---", "---"]));
let s1count = 0;
for (const [id, src, note] of M) {
  const o = oracle(src, "m.ts");
  const n = bindsAValueFrom(src, "m.ts");
  const old = oldImports(src, "m.ts");
  if (id.startsWith("S") && n) s1count++;
  const verdict = n === o.value ? "agree" : n ? "OVER-COUNT (false green)" : "under-count (fails red)";
  console.log(row([id, esc(src), note, `${o.value}${o.names.length ? ` (${o.names.join(", ")})` : ""}`, String(n), String(old), verdict]));
}
console.log(`\nticket eight: NEW counts ${s1count} of 8`);

const F = [
  ["F1", 'import { assembleFrame } from "./frame.ts";', "static value"],
  ["F2", 'import assembleFrame from "./frame.ts";', "DEFAULT binding named assembleFrame"],
  ["F3", 'import F, { type FrameParts } from "./frame.ts";', "default + type brace"],
  ["F4", 'import { default as assembleFrame } from "./frame.ts";', "default via braces"],
  ["F5", 'import * as F from "./frame.ts";', "namespace"],
  ["F6", 'import { assembleFrame as c } from "./frame.ts";', "aliased"],
  ["F7", 'import {\n  type FrameParts,\n  assembleFrame,\n} from "./frame.ts";', "multi-line"],
  ["F8", 'import { type assembleFrame } from "./frame.ts";', "inline type"],
  ["F9", 'import F, { assembleFrame } from "./frame.ts";', "default + value"],
  ["F10", 'import { /* x */ assembleFrame } from "./frame.ts";', "comment before name"],
];
console.log("\n" + row(["id", "spelling", "case", "oracle binds (names)", "tripwire counts", "bindsAValueFrom(frame.ts)"]));
console.log(row(["---", "---", "---", "---", "---", "---"]));
for (const [id, src, note] of F) {
  const o = oracle(src, "frame.ts");
  console.log(row([id, esc(src), note, `${o.value}${o.names.length ? ` (${o.names.join(", ")})` : ""}`, String(bindsAssembleFrame(src)), String(bindsAValueFrom(src, "frame.ts"))]));
}
