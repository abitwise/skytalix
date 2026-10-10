// QE ABC-134 — independent readings. Usage: node qe134.mjs <file>
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
const require = createRequire(process.argv[3] ?? import.meta.url);
const ts = require("typescript");
const file = process.argv[2];
const src = readFileSync(file, "utf8");
const h = (s) => createHash("sha256").update(s).digest("hex").slice(0, 16);
// ticket's definition: strip each line's leading " * " / "// ", collapse whitespace runs
const collapse = (s) => s.split("\n").map((l) => l.replace(/^\s*(\*|\/\/)\s?/, "")).join(" ").replace(/\s+/g, " ");
const C = collapse(src);
const count = (hay, n) => hay.split(n).length - 1;
const phrases = [
  ["A1", "CONDITIONAL on a game state the frames do not reach"],
  ["A2", "only `ABC-041` `A2`'s synchronous spies see that"],
  ["A3", "so it is not load-bearing on Node v26.11.0"],
  ["A4a", "so two static value imports are NOT counted"],
  ["A4b", "A comment ahead of the name inside the brace, and a default binding, are value imports it does not count"],
];
for (const [k, p] of phrases) console.log(`${k} phrase count: ${count(C, p)}`);
// bullets: the docblock list items between WHAT NEITHER PHASE COVERS and THE RECORDED LOSS
const list = C.slice(C.indexOf("WHAT NEITHER PHASE COVERS"), C.indexOf("THE RECORDED LOSS"));
const items = list.split(/ - (?=a )/);
const cond = items.find((i) => i.includes("CONDITIONAL")) ?? "";
const reb = items.find((i) => i.includes("rebuilds the derive")) ?? "";
console.log("A1 bullet:", JSON.stringify(cond));
console.log("A1 words:", ["unicode", "black-bottom", "thinking", "message"].map((w) => `${w}=${cond.includes(w)}`).join(" "));
console.log("A2 bullet:", JSON.stringify(reb));
console.log("A2 words:", ["gameStatus", "replay", "no instrument"].map((w) => `${w}=${reb.includes(w)}`).join(" "));
const settle = C.slice(C.indexOf("THE PER-FRAME PHASE (`ADR-0029` decision 1)"), C.indexOf("const probe = `"));
console.log("A3 settle:", JSON.stringify(settle.slice(settle.indexOf("The settle"))));
console.log("A3 code literal turn < N:", [...src.matchAll(/turn < (\d+)/g)].map((m) => m[1]));
const dock = C.slice(C.indexOf("IT FAILS CLOSED ON A SECOND COMPOSER"), C.indexOf("WHAT NEITHER PHASE COVERS"));
const itStart = C.indexOf('it("the composer tripwire');
const intest = C.slice(itStart, C.indexOf("const directory = new URL", itStart));
for (const [n, t] of [["A4 docblock", dock], ["A4 in-test", intest]])
  console.log(n + ":", ["string-named", "comment containing `;`", "AT LEAST", "not exhaustive"].map((w) => `${w}=${t.includes(w)}`).join(" "));
// comment-free AST print: comments dropped by the compiler, not by a line regex
const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
const printed = ts.createPrinter({ removeComments: true }).printFile(sf);
console.log("AST(no comments) sha:", h(printed));
// template-literal probe string (comment-like text inside it would be code): hash all template literals
const tmpl = []; const walk = (n) => { if (ts.isNoSubstitutionTemplateLiteral(n) || ts.isTemplateExpression(n)) tmpl.push(n.getText(sf)); ts.forEachChild(n, walk); }; walk(sf);
console.log("template literals:", tmpl.length, "sha:", h(tmpl.join("\u0000")));
// number of it( calls
console.log("it( count:", (src.match(/^\s*it\(/gm) ?? []).length, " it.each:", (src.match(/it\.each/g) ?? []).length);
// raw-reader targets
console.log("first ^const LICENSED_DRIVERS line:", src.split("\n").findIndex((l) => /const LICENSED_DRIVERS: readonly string\[\] = \[/.test(l)) + 1,
  " first ^const COMPOSITION_ROOT line:", src.split("\n").findIndex((l) => /^const COMPOSITION_ROOT = /.test(l)) + 1);
