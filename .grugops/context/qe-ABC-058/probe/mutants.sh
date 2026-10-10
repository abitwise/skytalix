#!/bin/bash
# QE ABC-058 mutant harness. Usage: mutants.sh <commit> <label>
# Out-of-tree `git archive` copy of <commit>, node_modules symlinked, `npx vitest run src/cli.test.ts`
# alone per probe. Each probe = one or more anchored replacements (each anchor must occur exactly
# once, else the probe is ABORTED and not run); tree restored from a pristine byte copy, diff-checked.
set -u
COMMIT=$1; LABEL=$2
REPO=<repo>
SP=$(cd "$(dirname "$0")" && pwd)
T=$SP/tree-$LABEL
rm -rf "$T" "$T.pristine"; mkdir -p "$T"
git -C "$REPO" archive "$COMMIT" | tar -x -C "$T"
ln -s "$REPO/node_modules" "$T/node_modules"
cp -R "$T/src" "$T.pristine"
OUT=$SP/mutants-$LABEL.out.txt
: > "$OUT"
echo "commit $(git -C "$REPO" rev-parse --short "$COMMIT")  node $(node --version)" >> "$OUT"
restore() { rm -rf "$T/src"; cp -R "$T.pristine" "$T/src"; diff -r "$T/src" "$T.pristine" > /dev/null || { echo "RESTORE FAILED"; exit 2; }; }
run() {
  echo "== $1   load1 $(sysctl -n vm.loadavg | awk '{print $2}')  $(date -u +%H:%M:%SZ)" >> "$OUT"
  (cd "$T" && npx vitest run src/cli.test.ts 2>&1) | grep -E "^ +(×|✗)|Tests +[0-9]" | sed 's/ [0-9]*ms$//' >> "$OUT"
}
probe() { # name then triples: file anchor replacement
  local name=$1; shift; local args=()
  while [ $# -gt 0 ]; do args+=("$T/src/$1" "$2" "$3"); shift 3; done
  node "$SP/mutate.cjs" "${args[@]}" 2>> "$OUT" || { echo "== $name  ABORTED: anchor" >> "$OUT"; restore; return; }
  run "$name"; restore
}
SITE='const startGame = () => newGame(START_FEN);'
FILT='code < 0x20 || code === 0x7f) continue;'
TOK='"\u0007\u001b[2Jpurple\u007f"'
run control
# --- the Engineer's table, re-run ---
probe "E-A1 prose docblock names \`spawnSync(\`" cli.test.ts $'/**\n * `ABC-042`' $'/**\n * Prose only: a later hop never adds a second `spawnSync(` call site.\n * `ABC-042`'
probe "E-MS1 direct spawnSync child" cli.test.ts "$SITE" "$SITE"$'\nconst stray = spawnSync(process.execPath, ["-e", ""]);\nvoid stray;'
probe "E-MS2 namespace import" cli.test.ts 'import { spawnSync } from "node:child_process";' $'import * as childProcess from "node:child_process";\nconst { spawnSync } = childProcess;'
probe "E-M3f 0x7f -> 0x7e" cli.ts 'code === 0x7f' 'code === 0x7e'
probe "E-M3g || code === 0x7f deleted" cli.ts ' || code === 0x7f' ''
probe "E-M3h && code !== 0x7f" cli.ts 'code < 0x20 || code === 0x7f' 'code < 0x20 && code !== 0x7f'
# --- QE's own: byte classes (production filter; string literals only, so the A8 number row cannot see them) ---
probe "Q1 BEL passes (C0-not-ESC class)" cli.ts "$FILT" '(code < 0x20 && character !== "\u0007") || code === 0x7f) continue;'
probe "Q2 ESC passes (ESC class)" cli.ts "$FILT" '(code < 0x20 && character !== "\u001b") || code === 0x7f) continue;'
probe "Q3 TAB passes (C0 member absent from token)" cli.ts "$FILT" '(code < 0x20 && character !== "\t") || code === 0x7f) continue;'
# --- QE's own: the probe token (test-side) ---
probe "Q4 token BEL->TAB, correct build (control)" cli.test.ts "$TOK" '"\u0009\u001b[2Jpurple\u007f"'
probe "Q5 token BEL->TAB + TAB passes" cli.test.ts "$TOK" '"\u0009\u001b[2Jpurple\u007f"' cli.ts "$FILT" '(code < 0x20 && character !== "\t") || code === 0x7f) continue;'
probe "Q4b token TAB inside the locator (\`[2J\\tpurple\`), correct build (control)" cli.test.ts "$TOK" '"\u0007\u001b[2J\u0009purple\u007f"'
probe "Q5b token BEL->TAB inside (\`[2J\\tpurple\`) + TAB passes" cli.test.ts "$TOK" '"\u0007\u001b[2J\u0009purple\u007f"' cli.ts "$FILT" '(code < 0x20 && character !== "\t") || code === 0x7f) continue;'
probe "Q6 token BEL->TAB + BEL passes" cli.test.ts "$TOK" '"\u0009\u001b[2Jpurple\u007f"' cli.ts "$FILT" '(code < 0x20 && character !== "\u0007") || code === 0x7f) continue;'
probe "Q7 token BEL removed + BEL passes" cli.test.ts "$TOK" '"\u001b[2Jpurple\u007f"' cli.ts "$FILT" '(code < 0x20 && character !== "\u0007") || code === 0x7f) continue;'
probe "Q7b token DEL removed + M3h" cli.test.ts "$TOK" '"\u0007\u001b[2Jpurple"' cli.ts 'code < 0x20 || code === 0x7f' 'code < 0x20 && code !== 0x7f'
# --- QE's own: the spawn pin ---
probe "Q8 template-literal TEXT \`spawnSync(\` (not a call)" cli.test.ts "$SITE" "$SITE"$'\nconst note = `never a second spawnSync( call site`;\nvoid note;'
probe "Q9 REAL call inside a template interpolation" cli.test.ts "$SITE" "$SITE"$'\nconst strayT = `${spawnSync(process.execPath, ["-e", ""]).status}`;\nvoid strayT;'
probe "Q10 // line comment names \`spawnSync(\`" cli.test.ts "$SITE" "$SITE"$'\n// never a second spawnSync( call site'
probe "Q11 REAL call after a \"//\" string on the same line" cli.test.ts "$SITE" "$SITE"$'\nconst tag = "a//b", stray = spawnSync(process.execPath, ["-e", ""]);\nvoid tag, stray;'
probe "Q12 REAL call between \"/*\" and \"*/\" strings" cli.test.ts "$SITE" "$SITE"$'\nconst open = "/*";\nconst stray = spawnSync(process.execPath, ["-e", ""]);\nconst close = "*/";\nvoid open, stray, close;'
probe "Q13 MS2 + call hidden after \"//\" string" cli.test.ts 'import { spawnSync } from "node:child_process";' $'import { spawnSync } from "node:child_process";\nimport * as cp from "node:child_process";' cli.test.ts "$SITE" "$SITE"$'\nconst tag2 = "x//y", stray2 = cp.spawnSync(process.execPath, ["-e", ""]);\nvoid tag2, stray2;'
probe "Q14 REAL call through an alias (pre-existing evasion, not traded)" cli.test.ts "$SITE" "$SITE"$'\nconst alias = spawnSync;\nconst stray3 = alias(process.execPath, ["-e", ""]);\nvoid stray3;'
cat "$OUT"
