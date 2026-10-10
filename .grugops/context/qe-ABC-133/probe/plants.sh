#!/bin/bash
# QE ABC-133 plant harness. Usage: plants.sh <commit> <label>
# Out-of-tree `git archive` copy, node_modules symlinked, `npx vitest run src/cli.test.ts` alone per
# plant; every anchor must occur exactly once (QE-058's mutate.cjs, unchanged) else ABORTED; tree
# restored from a pristine copy and diff-checked after every plant. Attribution: the failing test name,
# the failing source line, and the assertion message (count (i) "specifier positions", count (ii)
# "calls that resolve").
set -u
COMMIT=$1; LABEL=$2
REPO=${REPO:-<repo>}
SP=$(cd "$(dirname "$0")" && pwd)
T=$SP/tree-$LABEL
rm -rf "$T" "$T.pristine"; mkdir -p "$T"
git -C "$REPO" archive "$COMMIT" | tar -x -C "$T"
ln -s "$REPO/node_modules" "$T/node_modules"
cp -R "$T/src" "$T.pristine"
OUT=$SP/plants-$LABEL.out.txt
: > "$OUT"
echo "commit $(git -C "$REPO" rev-parse --short "$COMMIT")  node $(node --version)  $(date -u +%FT%TZ)" >> "$OUT"
restore() { rm -rf "$T/src"; cp -R "$T.pristine" "$T/src"; diff -r "$T/src" "$T.pristine" > /dev/null || { echo "RESTORE FAILED"; exit 2; }; }
run() {
  echo "== $1   load1 $(sysctl -n vm.loadavg | awk '{print $2}')  $(date -u +%H:%M:%SZ)" >> "$OUT"
  (cd "$T" && npx vitest run src/cli.test.ts 2>&1) \
    | grep -E "^ +(×|✗)|Tests +[0-9]|❯ src/cli.test.ts:[0-9]|AssertionError|Error:|FAIL " \
    | sed 's/ [0-9]*ms$//' | cut -c1-220 | sort -u >> "$OUT"
}
probe() { # name then triples: file anchor replacement
  local name=$1; shift; local args=()
  while [ $# -gt 0 ]; do args+=("$T/src/$1" "$2" "$3"); shift 3; done
  node "$SP/mutate.cjs" "${args[@]}" 2>> "$OUT" || { echo "== $name  ABORTED: anchor" >> "$OUT"; restore; return; }
  run "$name"; restore
}
SITE='const startGame = () => newGame(START_FEN);'
IMP='import { spawnSync } from "node:child_process";'
NL=$'\n'
run "control (unmutated)"
# ---- A1: the kills (recipes as in QE-058 mutants.sh / SecNFR pin-gaps.sh / ticket A1) ----
probe "Q11 REAL call after a \"//\" string on the same line" cli.test.ts "$SITE" "$SITE"$'\nconst tag = "a//b", stray = spawnSync(process.execPath, ["-e", ""]);\nvoid tag, stray;'
probe "Q12 REAL call between \"/*\" and \"*/\" strings" cli.test.ts "$SITE" "$SITE"$'\nconst open = "/*";\nconst stray = spawnSync(process.execPath, ["-e", ""]);\nconst close = "*/";\nvoid open, stray, close;'
probe "Q13 MS2 + call hidden after \"//\" string" cli.test.ts "$IMP" "$IMP"$'\nimport * as cp from "node:child_process";' cli.test.ts "$SITE" "$SITE"$'\nconst tag2 = "x//y", stray2 = cp.spawnSync(process.execPath, ["-e", ""]);\nvoid tag2, stray2;'
probe "P1 namespace import + cp.execSync (a shell child)" cli.test.ts "$SITE" "$SITE"$'\nconst strayE = cp.execSync("true");\nvoid strayE;' cli.test.ts "$IMP" "$IMP"$'\nimport * as cp from "node:child_process";'
probe "P2 real spawnSync after a URL string (SecNFR)" cli.test.ts "$SITE" "$SITE"$'\nconst site = "https://example.org/x", strayU = spawnSync(process.execPath, ["-e", ""]); void site, strayU;'
probe "P-DYN module-level dynamic import" cli.test.ts "$SITE" "$SITE"$'\nvoid import("node:child_process");'
# ---- A2: no kill traded, no false red ----
probe "E-MS1 direct spawnSync child" cli.test.ts "$SITE" "$SITE"$'\nconst stray = spawnSync(process.execPath, ["-e", ""]);\nvoid stray;'
probe "E-MS2 namespace import" cli.test.ts "$IMP" $'import * as childProcess from "node:child_process";\nconst { spawnSync } = childProcess;'
probe "E-A1 prose docblock names \`spawnSync(\`" cli.test.ts $'/**\n * `ABC-042`' $'/**\n * Prose only: a later hop never adds a second `spawnSync(` call site.\n * `ABC-042`'
probe "S-CTRL string control, no call" cli.test.ts "$SITE" "$SITE"$'\nconst tag = "a//b /* c"; void tag;'
# ---- A3 and QE-058's other pin shapes ----
probe "Q14 REAL call through an alias (out of scope)" cli.test.ts "$SITE" "$SITE"$'\nconst alias = spawnSync;\nconst stray3 = alias(process.execPath, ["-e", ""]);\nvoid stray3;'
probe "Q8 template-literal TEXT \`spawnSync(\` (not a call)" cli.test.ts "$SITE" "$SITE"$'\nconst note = `never a second spawnSync( call site`;\nvoid note;'
probe "Q9 REAL call inside a template interpolation" cli.test.ts "$SITE" "$SITE"$'\nconst strayT = `${spawnSync(process.execPath, ["-e", ""]).status}`;\nvoid strayT;'
probe "Q10 // line comment names \`spawnSync(\`" cli.test.ts "$SITE" "$SITE"$'\n// never a second spawnSync( call site'
# ---- QE-133 own: specifier spellings (never-called functions where runtime would break) ----
probe "X1 second import, BARE spelling + execSync" cli.test.ts "$IMP" "$IMP"$'\nimport { execSync } from "child_process";' cli.test.ts "$SITE" "$SITE"$'\nconst neverX1 = () => execSync("true");\nvoid neverX1;'
probe "X2 DEFAULT import + cp.execSync" cli.test.ts "$IMP" "$IMP"$'\nimport cpd from "node:child_process";' cli.test.ts "$SITE" "$SITE"$'\nconst neverX2 = () => cpd.execSync("true");\nvoid neverX2;'
probe "X2b default+named in one import" cli.test.ts "$IMP" 'import cpd, { spawnSync } from "node:child_process";'
probe "X2c rename the one import (spawnSync as run)" cli.test.ts "$IMP" $'import { spawnSync as run } from "node:child_process";\nconst spawnSync = run;'
probe "X3 require() with a TEMPLATE LITERAL specifier" cli.test.ts "$SITE" "$SITE"$'\nconst neverX3 = () => require(`node:child_process`).execSync("true");\nvoid neverX3;'
probe "X3b require() bare string" cli.test.ts "$SITE" "$SITE"$'\nconst neverX3b = () => require("child_process").execSync("true");\nvoid neverX3b;'
probe "X3c import() with a TEMPLATE LITERAL" cli.test.ts "$SITE" "$SITE"$'\nconst neverX3c = () => import(`child_process`);\nvoid neverX3c;'
probe "X4 RE-EXPORT named (export { execSync } from)" cli.test.ts "$SITE" "$SITE"$'\nexport { execSync } from "node:child_process";'
probe "X4b RE-EXPORT star (export * from)" cli.test.ts "$SITE" "$SITE"$'\nexport * from "child_process";'
probe "X4c RE-EXPORT namespace (export * as cpx from)" cli.test.ts "$SITE" "$SITE"$'\nexport * as cpx from "node:child_process";'
probe "X5 createRequire(import.meta.url)(\"node:child_process\") inline" cli.test.ts "$SITE" "$SITE"$'\nconst neverX5 = () => createRequire(import.meta.url)("node:child_process").execSync("true");\nvoid neverX5;'
probe "X5b const req = createRequire(...); req(\"child_process\")" cli.test.ts "$SITE" "$SITE"$'\nconst neverX5b = () => { const req = createRequire(import.meta.url); return req("child_process").execSync("true"); };\nvoid neverX5b;'
probe "X6 process.getBuiltinModule(\"node:child_process\")" cli.test.ts "$SITE" "$SITE"$'\nconst neverX6 = () => process.getBuiltinModule("node:child_process").execSync("true");\nvoid neverX6;'
probe "X7 vi.importActual(\"node:child_process\")" cli.test.ts "$SITE" "$SITE"$'\nconst neverX7 = async () => (await vi.importActual<typeof import("node:child_process")>("node:child_process")).execSync("true");\nvoid neverX7;'
probe "X8 import TYPE from child_process (no runtime binding)" cli.test.ts "$IMP" "$IMP"$'\nimport type { SpawnSyncReturns } from "node:child_process";\ntype X8 = SpawnSyncReturns<string>;\nexport type { X8 };'
probe "X8b inline type specifier in the one import" cli.test.ts "$IMP" 'import { spawnSync, type SpawnSyncReturns } from "node:child_process";'
probe "X8c typeof import(\"node:child_process\") in a TYPE position only" cli.test.ts "$SITE" "$SITE"$'\ntype X8c = typeof import("node:child_process");\nexport type { X8c };'
probe "X9 import() then member call" cli.test.ts "$SITE" "$SITE"$'\nconst neverX9 = () => import("node:child_process").then((m) => m.execSync("true"));\nvoid neverX9;'
# ---- QE-133 own: call shapes the callee resolution might miss or over-count ----
probe "C1 optional call spawnSync?.()" cli.test.ts "$SITE" "$SITE"$'\nconst neverC1 = () => spawnSync?.(process.execPath, ["-e", ""]);\nvoid neverC1;'
probe "C2 spawnSync.call" cli.test.ts "$SITE" "$SITE"$'\nconst neverC2 = () => spawnSync.call(undefined, process.execPath, ["-e", ""]);\nvoid neverC2;'
probe "C3 spawnSync.apply" cli.test.ts "$SITE" "$SITE"$'\nconst neverC3 = () => spawnSync.apply(undefined, [process.execPath, ["-e", ""]]);\nvoid neverC3;'
probe "C3b spawnSync?.call (optional member)" cli.test.ts "$SITE" "$SITE"$'\nconst neverC3b = () => spawnSync?.call(undefined, process.execPath, ["-e", ""]);\nvoid neverC3b;'
probe "C4 COMPUTED member spawnSync[\"call\"]" cli.test.ts "$SITE" "$SITE"$'\nconst neverC4 = () => spawnSync["call"](undefined, process.execPath, ["-e", ""]);\nvoid neverC4;'
probe "C5 PARENTHESISED callee (spawnSync)()" cli.test.ts "$SITE" "$SITE"$'\nconst neverC5 = () => (spawnSync)(process.execPath, ["-e", ""]);\nvoid neverC5;'
probe "C6 COMMA callee (0, spawnSync)()" cli.test.ts "$SITE" "$SITE"$'\nconst neverC6 = () => (0, spawnSync)(process.execPath, ["-e", ""]);\nvoid neverC6;'
probe "C7 NON-NULL callee spawnSync!()" cli.test.ts "$SITE" "$SITE"$'\nconst neverC7 = () => spawnSync!(process.execPath, ["-e", ""]);\nvoid neverC7;'
probe "C8 AS-cast callee (spawnSync as typeof spawnSync)()" cli.test.ts "$SITE" "$SITE"$'\nconst neverC8 = () => (spawnSync as typeof spawnSync)(process.execPath, ["-e", ""]);\nvoid neverC8;'
probe "C9 TAGGED TEMPLATE spawnSync\`x\`" cli.test.ts "$SITE" "$SITE"$'\nconst neverC9 = () => spawnSync`true`;\nvoid neverC9;'
probe "C10 Reflect.apply(spawnSync, ...)" cli.test.ts "$SITE" "$SITE"$'\nconst neverC10 = () => Reflect.apply(spawnSync, undefined, [process.execPath, ["-e", ""]]);\nvoid neverC10;'
probe "C11 call nested in a callback (.map), outside childOf" cli.test.ts "$SITE" "$SITE"$'\nconst neverC11 = () => [1].map(() => spawnSync(process.execPath, ["-e", ""]));\nvoid neverC11;'
probe "C12 SHADOWED local named spawnSync (false-red check)" cli.test.ts "$SITE" "$SITE"$'\nconst shadowC12 = (spawnSync: () => number) => spawnSync();\nvoid shadowC12;'
probe "C13 RegExp.exec + local object .execSync (false-red control)" cli.test.ts "$SITE" "$SITE"$'\nconst reC13 = /a/; void reC13.exec("a");\nconst objC13 = { execSync: () => 0 }; void objC13.execSync();'
probe "C14 \"child_process\" string NOT a specifier (array/arg)" cli.test.ts "$SITE" "$SITE"$'\nconst namesC14 = ["node:child_process", "child_process"]; void String(namesC14); void JSON.stringify("child_process");'
probe "C15 import of a lookalike path ./child_process (not the module)" cli.test.ts "$SITE" "$SITE"$'\nconst neverC15 = () => import("./child_process.ts");\nvoid neverC15;'
cat "$OUT"
