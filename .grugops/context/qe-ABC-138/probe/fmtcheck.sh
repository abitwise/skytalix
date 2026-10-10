#!/bin/bash
# QE ABC-138: L3c / L5 after `biome format --write` — still green, tsc 0, biome check 0? Usage: fmtcheck.sh <repo> <commit> <scratch>
set -u
REPO=$1; COMMIT=$2; SP=$3; MUT=$(cd "$(dirname "$0")" && pwd)/mutate.cjs
SITE='const startGame = () => newGame(START_FEN);'
L3c=$'\nconst neverL3c = () => (process.getBuiltinModule.call(process, "node:child_process") as typeof import("node:child_process")).execSync("true");\nvoid neverL3c;'
L5=$'\nconst neverL5 = () => (Reflect.apply(createRequire(import.meta.url), undefined, ["child_process"]) as typeof import("node:child_process")).execSync("true");\nvoid neverL5;'
for P in L3c L5; do
  T=$SP/fmt-$P; rm -rf "$T"; mkdir -p "$T"; git -C "$REPO" archive "$COMMIT" | tar -x -C "$T"; ln -s "$REPO/node_modules" "$T/node_modules"
  if [ $P = L3c ]; then ADD=$L3c; else ADD=$L5; fi
  node "$MUT" "$T/src/cli.test.ts" "$SITE" "$SITE$ADD" || exit 3
  (cd "$T" && npx biome format --write src/cli.test.ts > /dev/null 2>&1)
  echo "== $P formatted  load1 $(sysctl -n vm.loadavg | awk '{print $2}')"
  (cd "$T" && npx vitest run src/cli.test.ts 2>&1 | grep -E "Tests +[0-9]|AssertionError" | sed 's/ [0-9]*ms$//' | cut -c1-200)
  (cd "$T" && npx tsc --noEmit -p . > /dev/null 2>&1; echo "   typecheck exit $?")
  (cd "$T" && npx biome check src/cli.test.ts > /dev/null 2>&1; echo "   biome check exit $?")
done
