#!/bin/bash
# BA/PM bapm-cuts-r5c-f1331-2026-10-10: a SUBSET of the ABC-133 plants, re-run at the wave tip for ABC-138 (F-133-1).
# Recipes are copied byte-for-byte from .grugops/context/qe-ABC-133/probe/plants.sh (E-A1, S-CTRL, Q14, X5-X7, C5-C8, C10, C13-C15)
# and .grugops/context/secnfr-ABC-133/probe/plants.sh (S2, S3). Harness = QE-133's (archive copy, node_modules symlinked,
# `npx vitest run src/cli.test.ts` alone per plant, mutate.cjs anchors must occur once, tree restored + diff-checked).
# Usage: f1331-plants.sh <repo> <commit> <label> <scratch-dir>
set -u
REPO=$1; COMMIT=$2; LABEL=$3; SP=$4
MUT=$(cd "$(dirname "$0")/../../qe-ABC-133/probe" && pwd)/mutate.cjs
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
  node "$MUT" "${args[@]}" 2>> "$OUT" || { echo "== $name  ABORTED: anchor" >> "$OUT"; restore; return; }
  run "$name"; restore
}
SITE='const startGame = () => newGame(START_FEN);'
IMP='import { spawnSync } from "node:child_process";'
NL=$'\n'
run "control (unmutated)"
# ---- A1: the kills (recipes as in QE-058 mutants.sh / SecNFR pin-gaps.sh / ticket A1) ----
probe "E-A1 prose docblock names \`spawnSync(\`" cli.test.ts $'/**\n * `ABC-042`' $'/**\n * Prose only: a later hop never adds a second `spawnSync(` call site.\n * `ABC-042`'
probe "S-CTRL string control, no call" cli.test.ts "$SITE" "$SITE"$'\nconst tag = "a//b /* c"; void tag;'
probe "Q14 REAL call through an alias (out of scope)" cli.test.ts "$SITE" "$SITE"$'\nconst alias = spawnSync;\nconst stray3 = alias(process.execPath, ["-e", ""]);\nvoid stray3;'
probe "X5 createRequire(import.meta.url)(\"node:child_process\") inline" cli.test.ts "$SITE" "$SITE"$'\nconst neverX5 = () => createRequire(import.meta.url)("node:child_process").execSync("true");\nvoid neverX5;'
probe "X5b const req = createRequire(...); req(\"child_process\")" cli.test.ts "$SITE" "$SITE"$'\nconst neverX5b = () => { const req = createRequire(import.meta.url); return req("child_process").execSync("true"); };\nvoid neverX5b;'
probe "X6 process.getBuiltinModule(\"node:child_process\")" cli.test.ts "$SITE" "$SITE"$'\nconst neverX6 = () => process.getBuiltinModule("node:child_process").execSync("true");\nvoid neverX6;'
probe "X7 vi.importActual(\"node:child_process\")" cli.test.ts "$SITE" "$SITE"$'\nconst neverX7 = async () => (await vi.importActual<typeof import("node:child_process")>("node:child_process")).execSync("true");\nvoid neverX7;'
probe "C5 PARENTHESISED callee (spawnSync)()" cli.test.ts "$SITE" "$SITE"$'\nconst neverC5 = () => (spawnSync)(process.execPath, ["-e", ""]);\nvoid neverC5;'
probe "C6 COMMA callee (0, spawnSync)()" cli.test.ts "$SITE" "$SITE"$'\nconst neverC6 = () => (0, spawnSync)(process.execPath, ["-e", ""]);\nvoid neverC6;'
probe "C7 NON-NULL callee spawnSync!()" cli.test.ts "$SITE" "$SITE"$'\nconst neverC7 = () => spawnSync!(process.execPath, ["-e", ""]);\nvoid neverC7;'
probe "C8 AS-cast callee (spawnSync as typeof spawnSync)()" cli.test.ts "$SITE" "$SITE"$'\nconst neverC8 = () => (spawnSync as typeof spawnSync)(process.execPath, ["-e", ""]);\nvoid neverC8;'
probe "C10 Reflect.apply(spawnSync, ...)" cli.test.ts "$SITE" "$SITE"$'\nconst neverC10 = () => Reflect.apply(spawnSync, undefined, [process.execPath, ["-e", ""]]);\nvoid neverC10;'
probe "C13 RegExp.exec + local object .execSync (false-red control)" cli.test.ts "$SITE" "$SITE"$'\nconst reC13 = /a/; void reC13.exec("a");\nconst objC13 = { execSync: () => 0 }; void objC13.execSync();'
probe "C14 \"child_process\" string NOT a specifier (array/arg)" cli.test.ts "$SITE" "$SITE"$'\nconst namesC14 = ["node:child_process", "child_process"]; void String(namesC14); void JSON.stringify("child_process");'
probe "C15 import of a lookalike path ./child_process (not the module)" cli.test.ts "$SITE" "$SITE"$'\nconst neverC15 = () => import("./child_process.ts");\nvoid neverC15;'
probe "S2 vi.mock partial mock via importOriginal (no new child)" cli.test.ts "$SITE" "$SITE"$'\nvi.mock("node:child_process", async (importOriginal) => ({ ...(await importOriginal<object>()) }));'
probe "S3 node:module namespace createRequire(\"child_process\").execSync" cli.test.ts "$IMP" "$IMP"$'\nimport * as nodeModule from "node:module";' cli.test.ts "$SITE" "$SITE"$'\nconst neverS3 = () => nodeModule.createRequire(import.meta.url)("child_process").execSync("true");\nvoid neverS3;'
