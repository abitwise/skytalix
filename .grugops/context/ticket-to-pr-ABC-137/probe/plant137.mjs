// SE port (ABC-137) of the builds this ticket's ledger needs from QE's plantqe136.py + plantqe057.py.
// Same anchors, same replacement text, same count==1 assertion; tokens applied in order.
// Usage: node plant137.mjs <tree> <build[+build...]>
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const [tree, spec] = process.argv.slice(2);
const SRC = join(tree, "src");
const P = "history-pane.nfr.test.ts";
const LIC = "production.filter((file) => LICENSED_DRIVERS.includes(file))";
const G = `    expect(runtimeImporters).toEqual(${LIC});`;
const LHS_END = '        readFileSync(`${directory}${file}`, "utf8"),\n      ),\n    );\n';
const HELPER = '  readdirSync(directory).filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts"));\n';
const DIR_SCAN = '\n    const directory = new URL(".", import.meta.url).pathname;\n    const production = productionModulesIn(directory);\n';

const count = (s, t) => s.split(t).length - 1;
function edit(rel, old, neu) {
  const p = join(SRC, rel);
  const s = readFileSync(p, "utf8");
  const n = count(s, old);
  if (n !== 1) throw new Error(`anchor count ${n} != 1 in ${rel}: ${JSON.stringify(old.slice(0, 70))}`);
  writeFileSync(p, s.replace(old, () => neu));
}
const append = (rel, text) => writeFileSync(join(SRC, rel), readFileSync(join(SRC, rel), "utf8") + text);
const guard = (neu) => edit(P, `\n${G}\n`, `\n${neu}\n`);
const beforeScan = (lines) =>
  edit(P, DIR_SCAN, DIR_SCAN.replace("\n    const production", `\n${lines}\n    const production`));

for (const b of spec.split("+")) {
  switch (b) {
    case "CONTROL":
      break;
    case "FMT":
      execFileSync("node", ["node_modules/@biomejs/biome/bin/biome", "format", "--write", "src"], { cwd: tree, stdio: "ignore" });
      break;
    case "M15":
      guard(`    expect(${LIC}).toEqual(expect.arrayContaining(runtimeImporters));`);
      break;
    case "M15SUB":
      guard(`    expect(runtimeImporters).toEqual(expect.arrayContaining(${LIC}));`);
      break;
    case "QLHS-INTERSECT":
      edit(P, LHS_END, '        readFileSync(`${directory}${file}`, "utf8"),\n      ),\n    ).filter((file) => LICENSED_DRIVERS.includes(file));\n');
      break;
    case "QSCAN-NARROW":
      edit(P, "    const production = productionModulesIn(directory);\n    const runtimeImporters",
        '    const production = productionModulesIn(directory).filter((file) => file !== "perft-bench.ts");\n    const runtimeImporters');
      break;
    case "XHELPER-NARROW":
      edit(P, HELPER, HELPER.replace('!file.endsWith(".test.ts"))', '!file.endsWith(".test.ts") && file !== "perft-bench.ts")'));
      break;
    case "XSHADOW-HELPER":
      beforeScan('    const productionModulesIn = (path: string): readonly string[] =>\n' +
        '      readdirSync(path).filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts") && file !== "perft-bench.ts");');
      break;
    case "WLAUNDER":
      append("zobrist.ts", '\nexport { repetitionCounts } from "./history.ts";\n');
      edit("perft.ts", 'import { legalMoves } from "./legal.ts";',
        'import { legalMoves } from "./legal.ts";\nimport { repetitionCounts } from "./zobrist.ts";');
      append("perft.ts", "\nexport const launderedCounts = repetitionCounts;\n");
      break;
    case "WPERFT-STATIC":
      edit("perft-bench.ts", 'import { parseFen } from "./fen.ts";',
        'import { parseFen } from "./fen.ts";\nimport { gameStatusOf } from "./history.ts";');
      append("perft-bench.ts", "\nvoid gameStatusOf;\n");
      break;
    case "WSTALELICENCE":
      edit("turn-loop.ts", 'import { type GameHistory, gameStatusOf, keyHistory, playMove, takeBack } from "./history.ts";',
        'import type { GameHistory } from "./history.ts";\n\nconst { gameStatusOf, keyHistory, playMove, takeBack } = await import("./history.ts");');
      break;
    default:
      throw new Error(`unknown build ${b}`);
  }
}
