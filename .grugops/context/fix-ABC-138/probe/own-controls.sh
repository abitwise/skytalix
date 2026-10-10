#!/bin/bash
# SE fix-ABC-138 own controls for the (iii) narrowing: a bound name inside the TYPE ARGUMENTS of an
# ExpressionWithTypeArguments (class extends / interface extends / implements) is still type-only -> GREEN.
# Usage: own-controls.sh <repo> <commit> <scratch> <mutate.cjs>
set -u
REPO=$1; COMMIT=$2; SP=$3; MUT=$4
SITE='const startGame = () => newGame(START_FEN);'
declare -a NAMES=(G1 G2 G3)
G1=$'\nclass ListG1 extends Array<ReturnType<typeof spawnSync>> {}\nvoid ListG1;'
G2=$'\ninterface ShapeG2 extends Pick<ReturnType<typeof spawnSync>, "status"> {}\nconst noneG2: ShapeG2 | undefined = undefined;\nvoid noneG2;'
G3=$'\nclass ImplG3 implements Pick<ReturnType<typeof spawnSync>, "status"> {\n  status = 0;\n}\nvoid ImplG3;'
for P in "${NAMES[@]}"; do
  T=$SP/own-$P; rm -rf "$T"; mkdir -p "$T"; git -C "$REPO" archive "$COMMIT" | tar -x -C "$T"; ln -s "$REPO/node_modules" "$T/node_modules"
  node "$MUT" "$T/src/cli.test.ts" "$SITE" "$SITE${!P}" || exit 3
  echo "== $P  load1 $(sysctl -n vm.loadavg | awk '{print $2}')"
  grep -n -A1 "${P}" "$T/src/cli.test.ts" | head -3
  (cd "$T" && npx vitest run src/cli.test.ts 2>&1 | grep -E "Tests +[0-9]|AssertionError" | sed 's/ [0-9]*ms$//' | cut -c1-200)
  (cd "$T" && npx tsc --noEmit -p . > /dev/null 2>&1; echo "   typecheck exit $?")
  (cd "$T" && npx biome check src/cli.test.ts > /dev/null 2>&1; echo "   biome check exit $?")
done
