// QE ABC-140 — QE's OWN planter (not plant.mjs). Usage: node qe140-plant.mjs <tree> <B1+B2+...>.
// Every anchor must occur EXACTLY once, else exit 3 (PLANT-FAILED). Anchors located independently at 795adca4.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [tree, spec] = process.argv.slice(2);
const src = (f) => join(tree, "src", f);
const NFR = "history-pane.nfr.test.ts";
function once(file, anchor, replacement) {
  const text = readFileSync(src(file), "utf8");
  const n = text.split(anchor).length - 1;
  if (n !== 1) {
    console.error(`ANCHOR x${n} in ${file}: ${JSON.stringify(anchor.slice(0, 90))}`);
    process.exit(3);
  }
  writeFileSync(src(file), text.replace(anchor, () => replacement));
}
const append = (file, s) => writeFileSync(src(file), readFileSync(src(file), "utf8") + s);

const PB_IMPORT = 'import { perft, perftDivide } from "./perft.ts";\n';
const SCAN_HEAD = "    const composers = productionModulesIn(directory).filter((file) =>\n";
const SCAN_TAIL = '      bindsAssembleFrame(readFileSync(`${directory}${file}`, "utf8")),\n    );\n';
const BETWEEN = '    );\n\n    expect(\n      composers,\n';
const CMP_TAIL = "    ).toEqual([COMPOSITION_ROOT]);\n";
const CMP_OPERAND = '      composers,\n      "a second frame composer';
const MSG = '"a second frame composer: make it import the seam, or declare it as the root",\n    ).toEqual';
const PRED_HEAD = "    const bindsAssembleFrame = (source: string): boolean =>\n      [...source.matchAll(";
const SKIP = 'file !== "perft-bench.ts"';

const B = {
  CONTROL() {},
  FMT() {
    execFileSync("node", ["node_modules/@biomejs/biome/bin/biome", "format", "--write", "src"], { cwd: tree, stdio: "ignore" });
  },
  // ---- witnesses, QE's own spellings ----
  // a second composer by an ALIASED brace specifier (the predicate reads `^assembleFrame\b`)
  "Q-WSC"() {
    once("perft-bench.ts", PB_IMPORT, `import { assembleFrame as composeFrame } from "./frame.ts";\n${PB_IMPORT}`);
    append("perft-bench.ts", "\nvoid composeFrame;\n");
  },
  // an unlicensed runtime importer of history.ts
  "Q-WPS"() {
    once("perft-bench.ts", PB_IMPORT, `import { newGame } from "./history.ts";\n${PB_IMPORT}`);
    append("perft-bench.ts", "\nvoid newGame;\n");
  },
  // ---- QE's own spellings of the five survivors (each must change pinned text -> RED expected) ----
  "Q-N-HEAD"() { once(NFR, SCAN_HEAD, `    const composers = productionModulesIn(directory)\n      .filter((file) => ${SKIP})\n      .filter((file) =>\n`); },
  "Q-N-TAIL"() { once(NFR, SCAN_TAIL, `      bindsAssembleFrame(readFileSync(\`\${directory}\${file}\`, "utf8")),\n    ).filter((file) => ${SKIP});\n`); },
  "Q-N-INNER"() { once(NFR, SCAN_TAIL, `      ${SKIP} && bindsAssembleFrame(readFileSync(\`\${directory}\${file}\`, "utf8")),\n    );\n`); },
  "Q-N-WRAP"() {
    once(NFR, SCAN_HEAD, "    const composers = composerCandidatesIn(directory).filter((file) =>\n");
    once(NFR, "\nconst productionModulesIn = (directory: string): readonly string[] =>\n",
      `\nconst composerCandidatesIn = (directory: string): readonly string[] =>\n  productionModulesIn(directory).filter((file) => ${SKIP});\nconst productionModulesIn = (directory: string): readonly string[] =>\n`);
  },
  "Q-N-TYPED"() { once(NFR, SCAN_HEAD, "    const composers = productionModulesIn(directory).filter((file: string) =>\n"); }, // benign reshape
  // ---- matcher swaps (change the comparator's text -> RED expected) ----
  "Q-C-ARRAYCONTAINING"() { once(NFR, CMP_TAIL, "    ).toEqual(expect.arrayContaining([COMPOSITION_ROOT]));\n"); },
  "Q-C-CONTAINEQUAL"() { once(NFR, CMP_TAIL, "    ).toContainEqual(COMPOSITION_ROOT);\n"); },
  "Q-C-STRICT"() { once(NFR, CMP_TAIL, "    ).toStrictEqual([COMPOSITION_ROOT]);\n"); }, // equal strength, still text
  "Q-C-SLICE"() { once(NFR, CMP_OPERAND, '      composers.slice(-1),\n      "a second frame composer'); },
  "Q-C-MSG"() { once(NFR, MSG, '"a second frame composer: import the seam, or declare it as the root",\n    ).toEqual'); },
  // ---- narrowings that KEEP every pinned byte (GREEN = survivor) ----
  // an in-place filter of the operand BETWEEN the two separately pinned statements
  "Q-MUTATE-BETWEEN"() {
    once(NFR, BETWEEN, `    );\n    composers.splice(0, composers.length, ...composers.filter((file) => ${SKIP}));\n\n    expect(\n      composers,\n`);
  },
  // an early return between the two statements
  "Q-RETURN-BETWEEN"() {
    once(NFR, BETWEEN, '    );\n    if (composers.includes("perft-bench.ts")) return;\n\n    expect(\n      composers,\n');
  },
  // a helper indirection by LOCAL SHADOW: the call's text is unchanged, the name it resolves to is not
  "Q-LOCAL-SHADOW"() {
    once(NFR, SCAN_HEAD,
      `    const productionModulesIn = (scanned: string): readonly string[] =>\n      readdirSync(scanned).filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts") && ${SKIP});\n${SCAN_HEAD}`);
  },
  // the predicate (`bindsAssembleFrame`), FENCED OUT by the ticket (ADR-0029 AR-053-COMPOSER) — recorded only
  "Q-PREDICATE"() {
    once(NFR, PRED_HEAD, "    const bindsAssembleFrame = (source: string): boolean =>\n      !source.includes('from \"./perft.ts\"') &&\n      [...source.matchAll(");
  },
};
for (const b of spec.split("+")) {
  if (!B[b]) { console.error(`unknown build ${b}`); process.exit(2); }
  B[b]();
}
