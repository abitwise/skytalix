// QE ABC-137 — QE's OWN independent planter (not plantqe136.py/plantqe057.py, not the SE's plant137.mjs).
// Usage: node qe137-plant.mjs <tree> <build[+build...]>. Every anchor must occur EXACTLY once, else exit 3.
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
    console.error(`ANCHOR x${n} in ${file}: ${JSON.stringify(anchor.slice(0, 80))}`);
    process.exit(3);
  }
  writeFileSync(src(file), text.replace(anchor, () => replacement));
}
const append = (file, tail) => writeFileSync(src(file), readFileSync(src(file), "utf8") + tail);

// QE's anchors, located independently from the file at 2946e22a / 54280bc8.
const HELPER_SIG = "\nconst productionModulesIn = (directory: string): readonly string[] =>\n";
const HELPER_BODY =
  '  readdirSync(directory).filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts"));\n';
const GUARD_SCAN = "    const production = productionModulesIn(directory);\n    const runtimeImporters";
const GUARD_EQ =
  "\n    expect(runtimeImporters).toEqual(production.filter((file) => LICENSED_DRIVERS.includes(file)));\n";
const GUARD_LHS_TAIL = '        readFileSync(`${directory}${file}`, "utf8"),\n      ),\n    );\n\n    expect(production).toContain(';
const COMPOSER_CALL = "    const composers = productionModulesIn(directory).filter((file) =>\n";
const PROBE_CALL = "    const production = productionModulesIn(directory.pathname);\n";
const FS_IMPORT = 'import { readdirSync, readFileSync } from "node:fs";\n';

const builds = {
  CONTROL() {},
  FMT() {
    execFileSync("node", ["node_modules/@biomejs/biome/bin/biome", "format", "--write", "src"], {
      cwd: tree,
      stdio: "ignore",
    });
  },
  // ---- witnesses (QE's own spellings of the ticket's builds) ----
  "WPERFT-STATIC"() {
    // an unlicensed static runtime importer of history.ts, off the frame path
    once("perft-bench.ts", 'import { perft, perftDivide } from "./perft.ts";\n',
      'import { newGame } from "./history.ts";\nimport { perft, perftDivide } from "./perft.ts";\n');
    append("perft-bench.ts", "\nexport const qeProbe = newGame;\n");
  },
  WLAUNDER() {
    // a runtime re-export laundered through zobrist.ts, consumed by perft.ts
    append("zobrist.ts", '\nexport { keyHistory } from "./history.ts";\n');
    once("perft.ts", 'import { legalMoves } from "./legal.ts";\n',
      'import { legalMoves } from "./legal.ts";\nimport { keyHistory } from "./zobrist.ts";\n');
    append("perft.ts", "\nexport const qeLaundered = keyHistory;\n");
  },
  WSTALELICENCE() {
    // the licensed driver keeps only a type import + a dynamic import: the licence entry goes stale
    once("turn-loop.ts",
      'import { type GameHistory, gameStatusOf, keyHistory, playMove, takeBack } from "./history.ts";\n',
      'import type { GameHistory } from "./history.ts";\n\nconst { gameStatusOf, keyHistory, playMove, takeBack } = await import("./history.ts");\n');
  },
  // ---- the guard's operator and operands (A2's still-red set) ----
  M15() {
    once(NFR, GUARD_EQ,
      "\n    expect(production.filter((file) => LICENSED_DRIVERS.includes(file))).toEqual(expect.arrayContaining(runtimeImporters));\n");
  },
  M15SUB() {
    once(NFR, GUARD_EQ,
      "\n    expect(runtimeImporters).toEqual(expect.arrayContaining(production.filter((file) => LICENSED_DRIVERS.includes(file))));\n");
  },
  "QSCAN-NARROW"() {
    once(NFR, GUARD_SCAN,
      '    const production = productionModulesIn(directory).filter((file) => file !== "perft-bench.ts");\n    const runtimeImporters');
  },
  "QLHS-INTERSECT"() {
    once(NFR, GUARD_LHS_TAIL, GUARD_LHS_TAIL.replace("    );\n\n", "    ).filter((file) => LICENSED_DRIVERS.includes(file));\n\n"));
  },
  // ---- clause 1's helper (A1) ----
  "XHELPER-NARROW"() {
    once(NFR, HELPER_BODY, HELPER_BODY.replace('!file.endsWith(".test.ts"))', '!file.endsWith(".test.ts") && file !== "perft-bench.ts")'));
  },
  "XSHADOW-HELPER"() {
    // a local productionModulesIn inside the licence guard, declared before the pinned scan pair
    once(NFR, "    const directory = new URL(\".\", import.meta.url).pathname;\n" + GUARD_SCAN,
      "    const directory = new URL(\".\", import.meta.url).pathname;\n" +
        '    const productionModulesIn = (dir: string): readonly string[] =>\n      readdirSync(dir).filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts") && f !== "perft-bench.ts");\n' +
        GUARD_SCAN);
  },
  // ---- QE-137's OWN helper narrowings ----
  "H-STARTSWITH"() {
    once(NFR, HELPER_BODY, HELPER_BODY.replace('));\n', ') && !file.startsWith("perft-"));\n'));
  },
  "H-INCLUDES"() {
    once(NFR, HELPER_BODY, HELPER_BODY.replace('));\n', ') && !["perft-bench.ts"].includes(file));\n'));
  },
  "H-REGEX"() {
    once(NFR, HELPER_BODY, '  readdirSync(directory).filter((file) => /^(?!perft-bench\\.ts$).+(?<!\\.test)\\.ts$/.test(file));\n');
  },
  "H-CHAIN"() {
    // a second .filter chained onto the pinned line, on its own line
    once(NFR, HELPER_BODY, HELPER_BODY.replace('));\n', '))\n    .filter((file) => file !== "perft-bench.ts");\n'));
  },
  "H-BLOCK"() {
    once(NFR, HELPER_SIG + HELPER_BODY,
      HELPER_SIG.replace("=>\n", "=> {\n") +
        '  const all = readdirSync(directory).filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts"));\n  return all.filter((file) => file !== "perft-bench.ts");\n};\n');
  },
  "H-PARAM-RENAME"() {
    // harmless: the helper's parameter renamed (a false red is expected and acceptable)
    once(NFR, HELPER_SIG + HELPER_BODY, (HELPER_SIG + HELPER_BODY).replaceAll("directory", "dir"));
  },
  "H-RENAME"() {
    // harmless rename of the helper across the whole file (a false red is expected and acceptable)
    const t = readFileSync(src(NFR), "utf8");
    if (!t.includes(HELPER_SIG)) process.exit(3);
    writeFileSync(src(NFR), t.replaceAll("productionModulesIn", "productionModulesOf"));
  },
  "H-COMMENTED"() {
    // the pinned text kept verbatim in a block comment; the live helper narrowed below it
    once(NFR, HELPER_SIG + HELPER_BODY,
      "\n/*" + HELPER_SIG + HELPER_BODY + "*/" + HELPER_SIG +
        HELPER_BODY.replace('!file.endsWith(".test.ts"))', '!file.endsWith(".test.ts") && file !== "perft-bench.ts")'));
  },
  "H-READDIR-SHADOW"() {
    // the helper's TEXT untouched; its callee rebound at module scope to a narrowing wrapper
    once(NFR, FS_IMPORT, 'import { readdirSync as listDirectory, readFileSync } from "node:fs";\n');
    once(NFR, "\n/**\n * `ADR-0011` CLAUSE 1 — THE ONE EXPRESSION.",
      '\nconst readdirSync = (directory: string): string[] =>\n  listDirectory(directory).filter((file) => file !== "perft-bench.ts");\n' +
        "\n/**\n * `ADR-0011` CLAUSE 1 — THE ONE EXPRESSION.");
  },
  "H-COMPOSER-NARROW"() {
    // the composer tripwire's UNPINNED call site narrowed inline (QSCAN-NARROW's twin, other guard)
    once(NFR, COMPOSER_CALL,
      '    const composers = productionModulesIn(directory)\n      .filter((file) => file !== "perft-bench.ts")\n      .filter((file) =>\n');
  },
  "H-WRAP-CALLS"() {
    // helper untouched; a wrapper replaces it at the two UNPINNED call sites (composer, probe)
    once(NFR, HELPER_SIG + HELPER_BODY,
      HELPER_SIG + HELPER_BODY +
        '\nconst scannedModulesIn = (directory: string): readonly string[] =>\n  productionModulesIn(directory).filter((file) => file !== "perft-bench.ts");\n');
    once(NFR, COMPOSER_CALL, COMPOSER_CALL.replace("productionModulesIn", "scannedModulesIn"));
    once(NFR, PROBE_CALL, PROBE_CALL.replace("productionModulesIn", "scannedModulesIn"));
  },
  "QF-SECOND-COMPOSER"() {
    // composer-tripwire witness: a second module value-imports assembleFrame
    once("perft-bench.ts", 'import { parseFen } from "./fen.ts";\n',
      'import { parseFen } from "./fen.ts";\nimport { assembleFrame } from "./frame.ts";\n');
    append("perft-bench.ts", "\nexport const qeComposer = assembleFrame;\n");
  },
  "H-CRLF"() {
    const t = readFileSync(src(NFR), "utf8");
    writeFileSync(src(NFR), t.replaceAll("\r\n", "\n").replaceAll("\n", "\r\n"));
  },
};

for (const b of spec.split("+")) {
  if (!builds[b]) {
    console.error(`unknown build ${b}`);
    process.exit(2);
  }
  builds[b]();
}
console.log(`planted ${spec}`);
