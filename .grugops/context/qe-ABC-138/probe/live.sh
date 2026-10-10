#!/bin/bash
# QE ABC-138: W5/W6 LIVE — the hole spawns a real child at module scope; is the suite green, and is the
# planted file gate-admissible (tsc, biome after `biome format --write`)? Usage: live.sh <repo> <commit> <scratch>
set -u
REPO=$1; COMMIT=$2; SP=$3
MUT=$(cd "$(dirname "$0")" && pwd)/mutate.cjs
SITE='const startGame = () => newGame(START_FEN);'
CHILD='["-e", "require(\"node:fs\").appendFileSync(process.env.QE_MARK, \"child-ran\\n\")"]'
for P in W5 W6; do
  T=$SP/live-$P; rm -rf "$T"; mkdir -p "$T"; git -C "$REPO" archive "$COMMIT" | tar -x -C "$T"; ln -s "$REPO/node_modules" "$T/node_modules"
  if [ $P = W5 ]; then
    ADD=$'\nclass SpawnerW5 extends (spawnSync as unknown as new (f: string, a: string[]) => object) {}\nconst strayW5 = new SpawnerW5(process.execPath, '"$CHILD"$');\nvoid strayW5;'
  else
    ADD=$'\nconst aliasW6 = (spawnSync as unknown as <T>(f: string, a: string[]) => T)<object>;\nconst strayW6 = aliasW6(process.execPath, '"$CHILD"$');\nvoid strayW6;'
  fi
  node "$MUT" "$T/src/cli.test.ts" "$SITE" "$SITE$ADD" || exit 3
  (cd "$T" && npx biome format --write src/cli.test.ts > /dev/null 2>&1)
  MARK=$SP/live-$P.mark; : > "$MARK"
  echo "== $P LIVE  load1 $(sysctl -n vm.loadavg | awk '{print $2}')  $(date -u +%H:%M:%SZ)"
  grep -n -A3 "Spawner\|aliasW6 =" "$T/src/cli.test.ts" | head -8
  (cd "$T" && QE_MARK=$MARK npx vitest run src/cli.test.ts 2>&1 | grep -E "Tests +[0-9]|AssertionError" | sed 's/ [0-9]*ms$//')
  echo "   child marks written: $(grep -c child-ran "$MARK")"
  (cd "$T" && npx tsc --noEmit -p . > /dev/null 2>&1; echo "   typecheck exit $?")
  (cd "$T" && npx biome check src/cli.test.ts > /dev/null 2>&1; echo "   biome check exit $?")
done
