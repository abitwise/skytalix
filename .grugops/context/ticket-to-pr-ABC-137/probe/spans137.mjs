// SE port (ABC-137) of qe-ABC-057/probe/spansqe.py (same anchors, sha256 first 16 hex), plus
// ABC-136's three pinned expect statements, the helper, and the framed counts the ticket names.
// Usage: node spans137.mjs <file>
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const src = readFileSync(process.argv[2], "utf8");
const h = (s) => createHash("sha256").update(s).digest("hex").slice(0, 16);
const span = (start, endAfter) => {
  const a = src.indexOf(start);
  if (a < 0) return `<missing ${start.slice(0, 30)}>`;
  const b = src.indexOf(endAfter, a) + endAfter.length;
  return src.slice(a, b);
};
const count = (t) => src.split(t).length - 1;
const rows = {
  "licence-regex-lines": src.split("\n").filter((l) => l.includes('"\\.\\/history\\.ts";/')).join("\n"),
  "licence-it-body": span(`  it("licenses src/history.ts's runtime importers`, `'import type { GameHistory } from "./history.ts";',\n    );\n  });\n`),
  "sibling-tripwire": span('    expect(instrument, "the guard above runs the expression the witnesses below run")', "flags}.test(`,\n    );\n"),
  "composer-tripwire-code": span('    const directory = new URL(".", import.meta.url).pathname;\n    const bindsAssembleFrame', ").toEqual([COMPOSITION_ROOT]);\n  });\n"),
  "witnessed-expression": span("  const WITNESSED_EXPRESSION =", ";/m;\n"),
  LICENSED_DRIVERS: span("const LICENSED_DRIVERS", ";\n"),
  "probe-it": span(`  it("evaluates history.ts's module body NOWHERE ON THE FRAME PATH`, "\n  });\n"),
  // ABC-136 (R5 + R5b) pinned statements, each from its expect( to its closing `);\n`
  "R5-operator-pin": span('    expect(instrument, "the licence guard compares with an EQUALITY")', "\n    );\n"),
  "R5b-scan-pin": span('    expect(instrument, "the licence guard scans EVERY production module")', "\n    );\n"),
  "R5b-importer-pin": span('    expect(instrument, "the licence guard compares EVERY runtime importer")', "\n    );\n"),
  "clause1-helper": span("const productionModulesIn = ", ";\n"),
};
for (const [k, v] of Object.entries(rows)) console.log(`${k}\t${v.split("\n").length} lines\t${h(v)}`);
const FRAMED_HELPER =
  '\nconst productionModulesIn = (directory: string): readonly string[] =>\n  readdirSync(directory).filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts"));\n';
const HELPER_ANCHOR = '  readdirSync(directory).filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts"));\n';
console.log(`count framed-helper(real newlines)\t${count(FRAMED_HELPER)}`);
console.log(`count plantqe136 HELPER anchor\t${count(HELPER_ANCHOR)}`);
console.log(`count LICENSED_DRIVERS decl\t${count("const LICENSED_DRIVERS: readonly string[] = [")}`);
console.log(`count COMPOSITION_ROOT decl lines\t${src.split("\n").filter((l) => /^const COMPOSITION_ROOT = "render-seam\.ts";$/.test(l)).length}`);
