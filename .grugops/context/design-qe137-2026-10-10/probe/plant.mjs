// Architect design-qe137 — own planter. Usage: node plant.mjs <tree> <B1+B2+...>. Anchors must occur EXACTLY once (exit 3).
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [tree, spec] = process.argv.slice(2);
const p = (f) => join(tree, "src", f);
const T = "history-pane.nfr.test.ts";
function swap(file, anchor, repl) {
  const text = readFileSync(p(file), "utf8");
  const n = text.split(anchor).length - 1;
  if (n !== 1) { console.error(`ANCHOR x${n} in ${file}: ${JSON.stringify(anchor.slice(0, 90))}`); process.exit(3); }
  writeFileSync(p(file), text.replace(anchor, () => repl));
}
const tail = (file, s) => writeFileSync(p(file), readFileSync(p(file), "utf8") + s);
const PB_IMPORT = 'import { perft, perftDivide } from "./perft.ts";\n';

const B = {
  CONTROL() {},
  FMT() { execFileSync("node", ["node_modules/@biomejs/biome/bin/biome", "format", "--write", "src"], { cwd: tree, stdio: "ignore" }); },
  // witnesses (own spellings; perft-bench.ts stays export-free)
  WPS() { swap("perft-bench.ts", PB_IMPORT, `import { playMove } from "./history.ts";\n${PB_IMPORT}`); tail("perft-bench.ts", "\nvoid playMove;\n"); },
  WSC() { swap("perft-bench.ts", PB_IMPORT, `import { assembleFrame } from "./frame.ts";\n${PB_IMPORT}`); tail("perft-bench.ts", "\nvoid assembleFrame;\n"); },
  // QE-137-a: the composer tripwire's call site (:591)
  "N591-HEAD"() { swap(T, "    const composers = productionModulesIn(directory).filter((file) =>\n", "    const composers = productionModulesIn(directory)\n      .filter((file) => !file.startsWith(\"perft\"))\n      .filter((file) =>\n"); },
  "N591-TAIL"() { swap(T, '      bindsAssembleFrame(readFileSync(`${directory}${file}`, "utf8")),\n    );\n', '      bindsAssembleFrame(readFileSync(`${directory}${file}`, "utf8")),\n    ).filter((file) => !file.startsWith("perft"));\n'); },
  "N591-WRAP"() {
    swap(T, "    const composers = productionModulesIn(directory).filter((file) =>\n", "    const composers = scannedModulesIn(directory).filter((file) =>\n");
    swap(T, "\n/**\n * `ADR-0029` — THE FRAME PATH IS DERIVED", "\nconst scannedModulesIn = (directory: string): readonly string[] =>\n  productionModulesIn(directory).filter((file) => !file.startsWith(\"perft\"));\n\n/**\n * `ADR-0029` — THE FRAME PATH IS DERIVED");
  },
  // the composer tripwire's comparator and its asserted operand (measured, not raised by QE)
  "C-CONTAIN"() { swap(T, "    ).toEqual([COMPOSITION_ROOT]);\n", "    ).toContain(COMPOSITION_ROOT);\n"); },
  "C-OPERAND"() { swap(T, "      composers,\n      \"a second frame composer", "      composers.filter((file) => file === COMPOSITION_ROOT),\n      \"a second frame composer"); },
  // the probe's call site (:653)
  "N653-NARROW"() { swap(T, "    const production = productionModulesIn(directory.pathname);\n", "    const production = productionModulesIn(directory.pathname).filter((file) => !file.startsWith(\"perft\"));\n"); },
  "N653-DROPROOT"() { swap(T, "    const production = productionModulesIn(directory.pathname);\n", "    const production = productionModulesIn(directory.pathname).filter((file) => file !== COMPOSITION_ROOT);\n"); },
  "W653-WIDEN"() { swap(T, "    const production = productionModulesIn(directory.pathname);\n", "    const production = [...productionModulesIn(directory.pathname), COMPOSITION_ROOT];\n"); },
  "ROOT-RENAMED"() { swap(T, 'const COMPOSITION_ROOT = "render-seam.ts";\n', 'const COMPOSITION_ROOT = "render-seam-moved.ts";\n'); },
  // QE-137-b: rebinding the helper's callee, helper text untouched
  "H-SHADOW"() {
    swap(T, 'import { readdirSync, readFileSync } from "node:fs";\n', 'import { readdirSync as listDir, readFileSync } from "node:fs";\n');
    swap(T, "\n/**\n * `ADR-0011` CLAUSE 1", "\nconst readdirSync = (directory: string): string[] =>\n  listDir(directory).filter((file) => !file.startsWith(\"perft\"));\n\n/**\n * `ADR-0011` CLAUSE 1");
  },
  "H-FSMOCK"() {
    swap(T, '\nvi.mock("./fen.ts", ', '\nvi.mock("node:fs", async (importOriginal) => {\n  const actual = await importOriginal<typeof import("node:fs")>();\n  return {\n    ...actual,\n    readdirSync: (directory: string) =>\n      actual.readdirSync(directory).filter((file) => !file.startsWith("perft")),\n  };\n});\n\nvi.mock("./fen.ts", ');
  },
  // the pins this ruling prescribes (prototype only; spelling is the Engineer's)
  PIN() {
    const anchor = '\n  });\n\n  it("A6.3 — the type-only exclusion';
    const pins =
      "\n    // `ADR-0011` `R5d` — the composer tripwire's own call and comparator, pinned the same way: a\n" +
      "    // narrowed scan or a containment there drops the second-composer kill and every guard stays\n" +
      "    // green. Its predicate's reach is `ADR-0029`'s (`AR-053-COMPOSER`), not pinned here.\n" +
      "    expect(instrument, \"the composer tripwire scans EVERY production module\").toContain(\n" +
      "      // biome-ignore lint/suspicious/noTemplateCurlyInString: this string IS source, and `${` is its subject\n" +
      "      '\\n    const composers = productionModulesIn(directory).filter((file) =>\\n      bindsAssembleFrame(readFileSync(`${directory}${file}`, \"utf8\")),\\n    );\\n',\n" +
      "    );\n" +
      "    expect(instrument, \"the composer tripwire compares with an EQUALITY\").toContain(\n" +
      "      '\\n    expect(\\n      composers,\\n      \"a second frame composer: make it import the seam, or declare it as the root\",\\n    ).toEqual([COMPOSITION_ROOT]);\\n',\n" +
      "    );";
    swap(T, anchor, pins + anchor);
  },

};
for (const b of spec.split("+")) { if (!B[b]) { console.error(`unknown build ${b}`); process.exit(2); } B[b](); }
