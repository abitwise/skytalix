// SE (ABC-140): hash the spans A2/A5 require byte-identical, by TEXT anchor (not line number), and count
// raw-reader declarations, framed literals, biome-ignore, it( and planter anchors. usage: node spans140.mjs <file>
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
const t = readFileSync(process.argv[2], "utf8");
const h = (s) => createHash("sha256").update(s).digest("hex").slice(0, 16);
const count = (s) => t.split(s).length - 1;
// a statement span: from the line holding `start` through the first line at/after it that equals `end`
function span(label, start, end, back = 0) {
  const lines = t.split("\n");
  const i = lines.findIndex((l) => l.trimStart().startsWith(start.trimStart())) - back;
  if (i < 0) return console.log(`${label}\tMISSING`);
  let j = i; while (j < lines.length && lines[j] !== end) j++;
  const s = lines.slice(i, j + 1).join("\n");
  console.log(`${label}\tlines ${i + 1}-${j + 1}\tn_start=${count(start)}\tsha=${h(s)}`);
}
span("pin1-expression(ABC-057)", 'expect(instrument, "the guard above runs the expression', "    );");
span("pin2-R5-comparator", 'expect(instrument, "the licence guard compares with an EQUALITY")', "    );");
span("pin3-R5b-scan", 'expect(instrument, "the licence guard scans EVERY production module")', "    );");
span("pin4-R5b-importers", 'expect(instrument, "the licence guard compares EVERY runtime importer")', "    );");
span("pin5-R5c-helper", `expect(instrument, "clause 1's one expression is unchanged")`, "    );");
span("helper:163-164", "const productionModulesIn = (directory: string)", '  readdirSync(directory).filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts"));');
span("composer-scan:591-593", "    const composers = productionModulesIn(directory).filter((file) =>", "    );");
span("composer-cmp:595-598", "      composers,", "    ).toEqual([COMPOSITION_ROOT]);", 1);
const SCAN = '\n    const composers = productionModulesIn(directory).filter((file) =>\n      bindsAssembleFrame(readFileSync(`${directory}${file}`, "utf8")),\n    );\n';
const CMP = '\n    expect(\n      composers,\n      "a second frame composer: make it import the seam, or declare it as the root",\n    ).toEqual([COMPOSITION_ROOT]);\n';
console.log(`framed scan statement (real newlines) occurrences\t${count(SCAN)}`);
console.log(`framed comparator statement (real newlines) occurrences\t${count(CMP)}`);
console.log(`decl 'const LICENSED_DRIVERS: readonly string[]'\t${count("const LICENSED_DRIVERS: readonly string[]")}`);
console.log(`decl line /^const COMPOSITION_ROOT = "render-seam\\.ts";$/m\t${(t.match(/^const COMPOSITION_ROOT = "render-seam\.ts";$/gm) || []).length}`);
console.log(`'const COMPOSITION_ROOT =' anywhere\t${count("const COMPOSITION_ROOT =")}`);
console.log(`biome-ignore\t${count("biome-ignore")}`);
console.log(`it( blocks\t${(t.match(/^\s*it\(/gm) || []).length}`);
for (const a of ["    const composers = productionModulesIn(directory).filter((file) =>\n",
  '      bindsAssembleFrame(readFileSync(`${directory}${file}`, "utf8")),\n    );\n',
  "    ).toEqual([COMPOSITION_ROOT]);\n", "      composers,\n      \"a second frame composer",
  "\n/**\n * `ADR-0011` CLAUSE 1", "\n/**\n * `ADR-0029` — THE FRAME PATH IS DERIVED",
  "    const production = productionModulesIn(directory.pathname);\n", '\nvi.mock("./fen.ts", ',
  'import { readdirSync, readFileSync } from "node:fs";\n'])
  console.log(`plant.mjs anchor x${count(a)}\t${JSON.stringify(a.slice(0, 60))}`);
