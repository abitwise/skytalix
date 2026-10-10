#!/bin/bash
# Security/NFR ABC-133: re-run a sample of QE's kills and holes, plus shapes QE did not plant (S1-S3).
# Out-of-tree `git archive` copy, node_modules symlinked, `npx vitest run src/cli.test.ts` alone per plant.
# Every anchor must occur exactly once (mutate.cjs, byte-identical to QE-058's/QE-133's), else ABORTED.
# The tree is restored from a pristine copy and diff-checked after every plant.
# Usage: plants.sh <repo> <commit> <label> <scratch-dir>
set -u
REPO=$1; COMMIT=$2; LABEL=$3; SCR=$4
PR=$(cd "$(dirname "$0")" && pwd)
T=$SCR/tree-$LABEL
rm -rf "$T" "$T.pristine"; mkdir -p "$T"
git -C "$REPO" archive "$COMMIT" | tar -x -C "$T"
ln -s "$REPO/node_modules" "$T/node_modules"
cp -R "$T/src" "$T.pristine"
OUT=$PR/plants-$LABEL.out.txt; : > "$OUT"
echo "commit $(git -C "$REPO" rev-parse --short "$COMMIT")  node $(node --version)  $(date -u +%FT%TZ)" >> "$OUT"
restore() { rm -rf "$T/src"; cp -R "$T.pristine" "$T/src"; /usr/bin/diff -r "$T/src" "$T.pristine" >/dev/null || { echo "RESTORE FAILED"; exit 2; }; }
run() {
  echo "== $1   load1 $(sysctl -n vm.loadavg | awk '{print $2}')  $(date -u +%H:%M:%SZ)" >> "$OUT"
  (cd "$T" && npx vitest run src/cli.test.ts 2>&1) \
    | grep -E "^ +(×|✗)|Tests +[0-9]|AssertionError|Error:|FAIL |specifier positions|calls that resolve" \
    | sed 's/ [0-9]*ms$//' | cut -c1-200 | sort -u >> "$OUT"
  if [ "${TSC:-0}" = 1 ]; then
    echo "   tsc: $(cd "$T" && npx tsc --noEmit -p . 2>&1 | grep -c 'error TS') error(s); first: $(cd "$T" && npx tsc --noEmit -p . 2>&1 | grep 'error TS' | head -1 | cut -c1-160)" >> "$OUT"
  fi
}
probe() { local name=$1; shift; local args=()
  while [ $# -gt 0 ]; do args+=("$T/src/$1" "$2" "$3"); shift 3; done
  node "$PR/mutate.cjs" "${args[@]}" 2>> "$OUT" || { echo "== $name  ABORTED: anchor" >> "$OUT"; restore; return; }
  run "$name"; restore; }
SITE='const startGame = () => newGame(START_FEN);'
IMP='import { spawnSync } from "node:child_process";'
run "control (unmutated)"
probe "Q11 real spawnSync after a \"a//b\" string" cli.test.ts "$SITE" "$SITE"$'\nconst tag = "a//b", stray = spawnSync(process.execPath, ["-e", ""]);\nvoid tag, stray;'
probe "P1 namespace import + cp.execSync(\"true\")" cli.test.ts "$IMP" "$IMP"$'\nimport * as cp from "node:child_process";' cli.test.ts "$SITE" "$SITE"$'\nconst strayE = cp.execSync("true");\nvoid strayE;'
probe "P-DYN void import(\"node:child_process\")" cli.test.ts "$SITE" "$SITE"$'\nvoid import("node:child_process");'
probe "X5 createRequire(import.meta.url)(\"node:child_process\").execSync (QE-133-a)" cli.test.ts "$SITE" "$SITE"$'\nconst neverX5 = () => createRequire(import.meta.url)("node:child_process").execSync("true");\nvoid neverX5;'
probe "C7 spawnSync!(…) (QE-133-b)" cli.test.ts "$SITE" "$SITE"$'\nconst neverC7 = () => spawnSync!(process.execPath, ["-e", ""]);\nvoid neverC7;'
TSC=1 probe "S1 TS import-equals: import cp = require(\"node:child_process\") + cp.execSync" cli.test.ts "$IMP" "$IMP"$'\nimport cp = require("node:child_process");' cli.test.ts "$SITE" "$SITE"$'\nconst neverS1 = () => cp.execSync("true");\nvoid neverS1;'
probe "S2 vi.mock partial mock via importOriginal (no new child)" cli.test.ts "$SITE" "$SITE"$'\nvi.mock("node:child_process", async (importOriginal) => ({ ...(await importOriginal<object>()) }));'
probe "S3 node:module namespace createRequire(\"child_process\").execSync" cli.test.ts "$IMP" "$IMP"$'\nimport * as nodeModule from "node:module";' cli.test.ts "$SITE" "$SITE"$'\nconst neverS3 = () => nodeModule.createRequire(import.meta.url)("child_process").execSync("true");\nvoid neverS3;'
cat "$OUT"
