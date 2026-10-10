#!/bin/bash
# Security/NFR ABC-058: is the spawn pin's blindness to QE-058-a's shapes NEW, or does the pin already
# miss shapes of the same class at base? Out-of-tree trees, `npx vitest run src/cli.test.ts` alone,
# each anchor must occur exactly once (mutate.cjs), tree restored and diff-checked. Usage: pin-gaps.sh <scratch-dir>
set -u
SP=$1; PR=$SP/probe; OUT=$PR/pin-gaps.out.txt; : > "$OUT"
SITE='const startGame = () => newGame(START_FEN);'
restore() { local T=$SP/tree-$1; rm -rf "$T/src"; cp -R "$T.pristine" "$T/src"; /usr/bin/diff -r "$T/src" "$T.pristine" >/dev/null || { echo RESTORE FAILED; exit 2; }; }
probe() { # label tree replacement-after-SITE [import-line-addition]
  local T=$SP/tree-$2
  local args=("$T/src/cli.test.ts" "$SITE" "$SITE"$'\n'"$3")
  [ $# -ge 4 ] && args+=("$T/src/cli.test.ts" 'import { spawnSync } from "node:child_process";' 'import { spawnSync } from "node:child_process";'$'\n'"$4")
  node "$PR/mutate.cjs" "${args[@]}" 2>>"$OUT" || { echo "== $1 $2 ABORTED" >> "$OUT"; restore "$2"; return; }
  echo "== $1 $2   load1 $(sysctl -n vm.loadavg | awk '{print $2}')" >> "$OUT"
  (cd "$T" && npx vitest run src/cli.test.ts 2>&1) | grep -E "^ +(×|✗)|Tests +[0-9]" | sed 's/ [0-9]*ms$//' >> "$OUT"
  restore "$2"
}
echo "node $(node --version)  $(date -u +%FT%TZ)" >> "$OUT"
for t in base head; do
  probe "control" $t "// control: a comment line only"
  probe "P1 namespace import + cp.execSync (a shell child, never counted)" $t $'const strayE = cp.execSync("true");\nvoid strayE;' 'import * as cp from "node:child_process";'
  probe "P2 real spawnSync after a URL string on the same line (QE Q11, realistic shape)" $t 'const site = "https://example.org/x", strayU = spawnSync(process.execPath, ["-e", ""]); void site, strayU;'
done
cat "$OUT"
