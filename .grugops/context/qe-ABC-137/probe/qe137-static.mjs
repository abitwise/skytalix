// QE ABC-137 — static checks on two versions of src/history-pane.nfr.test.ts (base, head), QE's own.
// usage: node qe137-static.mjs <base-file> <head-file>
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const [baseFile, headFile] = process.argv.slice(2);
const base = readFileSync(baseFile, "utf8");
const head = readFileSync(headFile, "utf8");
const h = (s) => createHash("sha256").update(s).digest("hex").slice(0, 16);
const count = (s, n) => s.split(n).length - 1;

// 1. every `it(` block, by title, hashed — base vs head
const itBlocks = (s) => {
  const out = new Map();
  const re = /^ {2}it\("([^"]+)"/gm;
  const starts = [...s.matchAll(re)];
  starts.forEach((m, i) => {
    const end = i + 1 < starts.length ? starts[i + 1].index : s.length;
    out.set(m[1], s.slice(m.index, end));
  });
  return out;
};
const bi = itBlocks(base);
const hi = itBlocks(head);
console.log(`it-blocks base=${bi.size} head=${hi.size}`);
for (const [t, b] of bi) {
  const a = hi.get(t);
  console.log(`${a === b ? "SAME   " : "CHANGED"}\t${h(b)}\t${a ? h(a) : "MISSING"}\t${t.slice(0, 70)}`);
}
for (const t of hi.keys()) if (!bi.has(t)) console.log(`NEW\t${t}`);

// 2. everything OUTSIDE the drift-tripwire `it` is byte-identical
const TRIP = "runs the guard's OWN expression — a drift tripwire, not a copy that can go stale";
const outside = (s) => s.replace(itBlocks(s).get(TRIP), "<TRIPWIRE>");
console.log(`outside-tripwire base=${h(outside(base))} head=${h(outside(head))} ${outside(base) === outside(head) ? "IDENTICAL" : "DIFFERENT"}`);

// 3. inside the tripwire: base's code lines (non-comment) all survive in order in head
const codeLines = (s) => s.split("\n").filter((l) => !/^\s*\/\//.test(l));
const bt = codeLines(bi.get(TRIP));
const ht = codeLines(hi.get(TRIP));
let j = 0;
for (const l of ht) if (j < bt.length && l === bt[j]) j++;
console.log(`tripwire base code lines=${bt.length} kept-in-order=${j} head code lines=${ht.length} added=${ht.length - bt.length}`);
console.log("tripwire head code lines NOT in base:");
for (const l of ht) if (!bt.includes(l)) console.log(`  + ${l}`);

// 4. clause 1's helper: byte identity and framed counts (real newlines)
const HELPER =
  '\nconst productionModulesIn = (directory: string): readonly string[] =>\n  readdirSync(directory).filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts"));\n';
const helperLine = (s) => s.split("\n").slice(162, 164).join("\n");
console.log(`helper :163-164 base=${h(helperLine(base))} head=${h(helperLine(head))} ${helperLine(base) === helperLine(head) ? "IDENTICAL" : "DIFFERENT"}`);
console.log(`framed helper (real newlines) count base=${count(base, HELPER)} head=${count(head, HELPER)}`);

// 5. QE's planter anchors (plantqe136.py / plantqe057.py), RETYPED by QE-137 from reading them, counted
const anchors = {
  "136 SCAN": "\n    const production = productionModulesIn(directory);\n    const runtimeImporters = production.filter((file) =>\n",
  "136 DIR_SCAN": '\n    const directory = new URL(".", import.meta.url).pathname;\n    const production = productionModulesIn(directory);\n',
  "136/057 LHS_END": '        readFileSync(`${directory}${file}`, "utf8"),\n      ),\n    );\n',
  "136 TOEQ": "    expect(runtimeImporters).toEqual(production.filter((file) => LICENSED_DRIVERS.includes(file)));\n",
  "136 HELPER": '  readdirSync(directory).filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts"));\n',
  "136 LICIT_END": "      'import type { GameHistory } from \"./history.ts\";',\n    );\n  });\n",
  "057 G framed": "\n    expect(runtimeImporters).toEqual(production.filter((file) => LICENSED_DRIVERS.includes(file)));\n",
  "057 HP": '    expect(readFileSync(`${directory}history-pane.ts`, "utf8")).toContain(\n      \'import type { GameHistory } from "./history.ts";\',\n    );\n',
  "057 QSCAN anchor": "    const production = productionModulesIn(directory);\n    const runtimeImporters",
  "136 biome-ignore line": "      // biome-ignore lint/suspicious/noTemplateCurlyInString: this string IS source, and `${` is its subject\n",
};
for (const [k, a] of Object.entries(anchors)) console.log(`anchor ${k}\tbase=${count(base, a)}\thead=${count(head, a)}`);

// 6. raw readers: declarations must occur exactly once
console.log(`LICENSED_DRIVERS decl base=${count(base, "const LICENSED_DRIVERS: readonly string[] = [")} head=${count(head, "const LICENSED_DRIVERS: readonly string[] = [")}`);
console.log(`COMPOSITION_ROOT decl lines base=${(base.match(/^const COMPOSITION_ROOT = "render-seam\.ts";$/gm) || []).length} head=${(head.match(/^const COMPOSITION_ROOT = "render-seam\.ts";$/gm) || []).length}`);
console.log(`biome-ignore base=${count(base, "biome-ignore")} head=${count(head, "biome-ignore")}; it( base=${count(base, "\n  it(")} head=${count(head, "\n  it(")}`);

// 7. A3 phrases on COLLAPSED text (ABC-134's rule: strip leading " * " / "// " prefixes, collapse whitespace)
const collapse = (s) => s.replace(/^\s*(\*|\/\/)\s?/gm, "").replace(/\s+/g, " ");
for (const p of ["it pins four spans of the guard by TEXT", "R5c", "clause 1's helper definition", "helper definition"])
  console.log(`collapsed "${p}"\tbase=${count(collapse(base), p)}\thead=${count(collapse(head), p)}`);
// the tripwire's `//` comment lines only
const trComments = (s) => itBlocks(s).get(TRIP).split("\n").filter((l) => /^\s*\/\//.test(l)).join("\n");
for (const p of ["R5c", "helper definition", "clause 1"])
  console.log(`tripwire // comments "${p}"\tbase=${count(collapse(trComments(base)), p)}\thead=${count(collapse(trComments(head)), p)}`);
