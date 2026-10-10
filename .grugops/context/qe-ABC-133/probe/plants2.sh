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
T=$SP/tree2-$LABEL
rm -rf "$T" "$T.pristine"; mkdir -p "$T"
git -C "$REPO" archive "$COMMIT" | tar -x -C "$T"
ln -s "$REPO/node_modules" "$T/node_modules"
cp -R "$T/src" "$T.pristine"
OUT=$SP/plants2-$LABEL.out.txt
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
SOFT_A='    expect(specifiers, "child_process specifier positions and what each binds").toEqual(['
SOFT_B='    expect.soft(specifiers, "child_process specifier positions and what each binds").toEqual(['
probe "X2c (fixed) rename the one import: spawnSync as runChild" cli.test.ts "$IMP" $'import { spawnSync as runChild } from "node:child_process";\nconst spawnSync = runChild;'
probe "SOFT P1 (count (i) made soft so (ii) also reports)" cli.test.ts "$SOFT_A" "$SOFT_B" cli.test.ts "$SITE" "$SITE"$'\nconst strayE = cp.execSync("true");\nvoid strayE;' cli.test.ts "$IMP" "$IMP"$'\nimport * as cp from "node:child_process";'
probe "SOFT Q13" cli.test.ts "$SOFT_A" "$SOFT_B" cli.test.ts "$IMP" "$IMP"$'\nimport * as cp from "node:child_process";' cli.test.ts "$SITE" "$SITE"$'\nconst tag2 = "x//y", stray2 = cp.spawnSync(process.execPath, ["-e", ""]);\nvoid tag2, stray2;'
probe "SOFT X2 default import + cpd.execSync" cli.test.ts "$SOFT_A" "$SOFT_B" cli.test.ts "$IMP" "$IMP"$'\nimport cpd from "node:child_process";' cli.test.ts "$SITE" "$SITE"$'\nconst neverX2 = () => cpd.execSync("true");\nvoid neverX2;'
probe "SOFT X1 bare second import + execSync" cli.test.ts "$SOFT_A" "$SOFT_B" cli.test.ts "$IMP" "$IMP"$'\nimport { execSync } from "child_process";' cli.test.ts "$SITE" "$SITE"$'\nconst neverX1 = () => execSync("true");\nvoid neverX1;'
probe "SOFT X9 import() then m.execSync (m is NOT a binding)" cli.test.ts "$SOFT_A" "$SOFT_B" cli.test.ts "$SITE" "$SITE"$'\nconst neverX9 = () => import("node:child_process").then((m) => m.execSync("true"));\nvoid neverX9;'
probe "SOFT control (soft only, unmutated otherwise)" cli.test.ts "$SOFT_A" "$SOFT_B"
cat "$OUT"
