// QE ABC-054 — A4/A2 lists read OUTSIDE the test: the tree's own bindsAValueFrom (extracted by text)
// over the tree's production modules. Usage: node consumers.cjs <tree> [targets...]
const { readFileSync, readdirSync } = require("node:fs");
const { stripTypeScriptTypes } = require("node:module");
const [tree, ...targets] = process.argv.slice(2);
const t = readFileSync(`${tree}/src/render-seam.test.ts`, "utf8");
const i = t.indexOf("const bindsAValueFrom ="), j = t.indexOf("\n\n/**", i);
if (i < 0) { console.log("no bindsAValueFrom in tree (base?)"); process.exit(0); }
const f = new Function(stripTypeScriptTypes(t.slice(i, j)) + "\nreturn bindsAValueFrom;")();
const prod = readdirSync(`${tree}/src`).filter((x) => x.endsWith(".ts") && !x.endsWith(".test.ts"));
for (const target of targets.length ? targets : ["render.ts", "status-panel.ts", "history-pane.ts"])
  console.log(`consumers ${target} ${JSON.stringify(prod.filter((x) => x !== target && f(readFileSync(`${tree}/src/${x}`, "utf8"), target)))}`);
