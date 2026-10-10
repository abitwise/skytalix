#!/bin/bash
# Usage: mutants.sh <commit> <label>
# Builds an out-of-tree `git archive` copy of <commit>, symlinks node_modules, runs a control and
# every ABC-058 mutant against src/cli.test.ts alone. Each mutant is ONE anchored replacement that
# aborts unless its anchor occurs exactly once; the tree is restored from a pristine byte copy.
set -u
COMMIT=$1; LABEL=$2
REPO=<repo>
SP=<scratchpad>/ABC-058
T=$SP/tree-$LABEL
rm -rf "$T" "$T.pristine"; mkdir -p "$T"
git -C "$REPO" archive "$COMMIT" | tar -x -C "$T"
ln -s "$REPO/node_modules" "$T/node_modules"
cp -R "$T/src" "$T.pristine"
OUT=$SP/mutants-$LABEL.out.txt
: > "$OUT"
echo "commit $(git -C "$REPO" rev-parse --short "$COMMIT")  node $(node --version)" >> "$OUT"

restore() { rm -rf "$T/src"; cp -R "$T.pristine" "$T/src"; diff -r "$T/src" "$T.pristine" > /dev/null || { echo "RESTORE FAILED"; exit 2; }; }

run() { # name
  echo "== $1   load1 $(sysctl -n vm.loadavg | awk '{print $2}')  $(date -u +%H:%M:%SZ)" >> "$OUT"
  (cd "$T" && npx vitest run src/cli.test.ts 2>&1) | grep -E "^ +(×|✗)|Tests +[0-9]" | sed 's/ [0-9]*ms$//' >> "$OUT"
}

mutate() { # name file anchor replacement
  node -e '
    const fs = require("fs"); const [f, a, r] = process.argv.slice(1);
    const s = fs.readFileSync(f, "utf8"); const n = s.split(a).length - 1;
    if (n !== 1) { console.error(`anchor occurs ${n} times in ${f}`); process.exit(3); }
    fs.writeFileSync(f, s.replace(a, () => r));
  ' "$T/src/$2" "$3" "$4" || { echo "== $1  ABORTED: anchor" >> "$OUT"; return; }
  run "$1"; restore
}

run control
mutate "A1-prose (docblock names \`spawnSync(\`)" cli.test.ts $'/**\n * `ABC-042`' $'/**\n * Prose only: a later hop never adds a second `spawnSync(` call site.\n * `ABC-042`'
mutate "MS1 (direct spawnSync child, not through childOf)" cli.test.ts 'const startGame = () => newGame(START_FEN);' $'const startGame = () => newGame(START_FEN);\nconst stray = spawnSync(process.execPath, ["-e", ""]);\nvoid stray;'
mutate "MS2 (namespace import of node:child_process)" cli.test.ts 'import { spawnSync } from "node:child_process";' $'import * as childProcess from "node:child_process";\nconst { spawnSync } = childProcess;'
mutate "M3f (src/cli.ts printableOf 0x7f -> 0x7e)" cli.ts 'code === 0x7f' 'code === 0x7e'
mutate "M3g (src/cli.ts printableOf || code === 0x7f deleted)" cli.ts ' || code === 0x7f' ''
mutate "M3h (src/cli.ts printableOf narrowed to && code !== 0x7f)" cli.ts 'code < 0x20 || code === 0x7f' 'code < 0x20 && code !== 0x7f'
cat "$OUT"
