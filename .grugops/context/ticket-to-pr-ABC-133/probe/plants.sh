#!/bin/bash
# ABC-133 plant harness. Usage: plants.sh <commit> <label>
# Out-of-tree `git archive` copy of <commit>, node_modules symlinked, `npx vitest run src/cli.test.ts`
# alone per plant. Recipes: QE's `qe-ABC-058/probe/mutants.sh` (Q*, E-*), Security/NFR's
# `secnfr-ABC-058/probe/pin-gaps.sh` (P1), the ticket's A1/A2 (P-DYN, string control). Every anchor
# must occur exactly once (mutate.cjs), else ABORTED; tree restored from a pristine copy, diff-checked.
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
  (cd "$T" && npx vitest run src/cli.test.ts 2>&1) | grep -E "^ +(×|✗)|Tests +[0-9]|❯ src/cli.test.ts:[0-9]" | sed 's/ [0-9]*ms$//' | sort -u >> "$OUT"
}
probe() { # name then triples: file anchor replacement
  local name=$1; shift; local args=()
  while [ $# -gt 0 ]; do args+=("$T/src/$1" "$2" "$3"); shift 3; done
  node "$SP/mutate.cjs" "${args[@]}" 2>> "$OUT" || { echo "== $name  ABORTED: anchor" >> "$OUT"; restore; return; }
  run "$name"; restore
}
SITE='const startGame = () => newGame(START_FEN);'
IMP='import { spawnSync } from "node:child_process";'
run "control (unmutated)"
# --- A1: the kills ---
probe "Q11 REAL call after a \"//\" string on the same line" cli.test.ts "$SITE" "$SITE"$'\nconst tag = "a//b", stray = spawnSync(process.execPath, ["-e", ""]);\nvoid tag, stray;'
probe "Q12 REAL call between \"/*\" and \"*/\" strings" cli.test.ts "$SITE" "$SITE"$'\nconst open = "/*";\nconst stray = spawnSync(process.execPath, ["-e", ""]);\nconst close = "*/";\nvoid open, stray, close;'
probe "Q13 MS2 + call hidden after \"//\" string" cli.test.ts "$IMP" "$IMP"$'\nimport * as cp from "node:child_process";' cli.test.ts "$SITE" "$SITE"$'\nconst tag2 = "x//y", stray2 = cp.spawnSync(process.execPath, ["-e", ""]);\nvoid tag2, stray2;'
probe "P1 namespace import + cp.execSync (a shell child)" cli.test.ts "$IMP" "$IMP"$'\nimport * as cp from "node:child_process";' cli.test.ts "$SITE" "$SITE"$'\nconst strayE = cp.execSync("true");\nvoid strayE;'
probe "P-DYN module-level dynamic import" cli.test.ts "$SITE" "$SITE"$'\nvoid import("node:child_process");'
# --- A2: no kill traded, no false red ---
probe "E-MS1 direct spawnSync child" cli.test.ts "$SITE" "$SITE"$'\nconst stray = spawnSync(process.execPath, ["-e", ""]);\nvoid stray;'
probe "E-MS2 namespace import" cli.test.ts "$IMP" $'import * as childProcess from "node:child_process";\nconst { spawnSync } = childProcess;'
probe "E-A1 prose docblock names \`spawnSync(\`" cli.test.ts $'/**\n * `ABC-042`' $'/**\n * Prose only: a later hop never adds a second `spawnSync(` call site.\n * `ABC-042`'
probe "S-CTRL string control, no call" cli.test.ts "$SITE" "$SITE"$'\nconst tag = "a//b /* c"; void tag;'
# --- A3 and QE's other pin shapes, recorded ---
probe "Q14 REAL call through an alias (out of scope)" cli.test.ts "$SITE" "$SITE"$'\nconst alias = spawnSync;\nconst stray3 = alias(process.execPath, ["-e", ""]);\nvoid stray3;'
probe "Q8 template-literal TEXT \`spawnSync(\` (not a call)" cli.test.ts "$SITE" "$SITE"$'\nconst note = `never a second spawnSync( call site`;\nvoid note;'
probe "Q9 REAL call inside a template interpolation" cli.test.ts "$SITE" "$SITE"$'\nconst strayT = `${spawnSync(process.execPath, ["-e", ""]).status}`;\nvoid strayT;'
probe "Q10 // line comment names \`spawnSync(\`" cli.test.ts "$SITE" "$SITE"$'\n// never a second spawnSync( call site'
cat "$OUT"
