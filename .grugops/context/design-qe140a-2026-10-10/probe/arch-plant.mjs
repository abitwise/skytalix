// Architect QE-140-a planter. Usage: node arch-plant.mjs <tree> <ONE build>. Anchors must occur exactly once (exit 3).
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [tree, build] = process.argv.slice(2);
const NFR = join(tree, "src", "history-pane.nfr.test.ts");
const read = () => readFileSync(NFR, "utf8");
function once(anchor, replacement) {
  const text = read();
  const n = text.split(anchor).length - 1;
  if (n !== 1) {
    console.error(`ANCHOR x${n}: ${JSON.stringify(anchor.slice(0, 90))}`);
    process.exit(3);
  }
  writeFileSync(NFR, text.replace(anchor, () => replacement));
}

const SCAN_HEAD = "    const composers = productionModulesIn(directory).filter((file) =>\n";
const LIC_SCAN = "    const production = productionModulesIn(directory);\n    const runtimeImporters = production.filter((file) =>\n";
const EARLY = '    if (readdirSync(directory).includes("perft-bench.ts")) return;\n';

const B = {
  // an early return in the composer `it`, ABOVE the pinned scan statement (between the predicate and the scan)
  "A-RETURN-BEFORE"() { once(SCAN_HEAD, EARLY + SCAN_HEAD); },
  // the licence guard's twin: an early return above its pinned scan pair
  "A-LIC-RETURN-BEFORE"() { once(LIC_SCAN, EARLY + LIC_SCAN); },
  // PROTOTYPE of option (b): R5d's two literals merged into ONE contiguous literal (scan + blank line + comparator)
  "A-CONTIG"() {
    const text = read();
    const start = text.indexOf('    expect(instrument, "the composer tripwire scans EVERY production module").toContain(\n');
    const cmp = text.indexOf('    expect(instrument, "the composer tripwire compares with an EQUALITY").toContain(\n');
    const end = text.indexOf("    );\n", cmp) + "    );\n".length;
    if (start < 0 || cmp < start || end <= cmp) { console.error("A-CONTIG anchors"); process.exit(3); }
    const merged = [
      '    expect(instrument, "the composer tripwire scans EVERY production module and compares with an EQUALITY").toContain(\n',
      "      // biome-ignore lint/suspicious/noTemplateCurlyInString: this string IS source, and `${` is its subject\n",
      String.raw`      '\n    const composers = productionModulesIn(directory).filter((file) =>\n      bindsAssembleFrame(readFileSync(${"`"}${"${"}directory}${"${"}file}${"`"}, "utf8")),\n    );\n\n    expect(\n      composers,\n      "a second frame composer: make it import the seam, or declare it as the root",\n    ).toEqual([COMPOSITION_ROOT]);\n',` + "\n",
      "    );\n",
    ].join("");
    writeFileSync(NFR, text.slice(0, start) + merged + text.slice(end));
  },
};
if (!B[build]) { console.error(`unknown build ${build}`); process.exit(2); }
B[build]();
