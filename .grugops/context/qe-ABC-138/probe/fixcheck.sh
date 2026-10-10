#!/bin/bash
# QE ABC-138: does the suggested one-line narrowing of (iii)'s type filter red W5 and keep controls green?
# Scratch only — nothing on the branch. Usage: fixcheck.sh <repo> <commit> <scratch>
set -u
REPO=$1; COMMIT=$2; SP=$3; MUT=$(cd "$(dirname "$0")" && pwd)/mutate.cjs
FILT='.filter((name) => bound.has(name.text) && ts.findAncestor(name, ts.isTypeNode) === undefined)'
FIX=$'.filter(\n        (name) =>\n          bound.has(name.text) &&\n          ts.findAncestor(name, (n) => ts.isTypeNode(n) && !ts.isExpressionWithTypeArguments(n)) ===\n            undefined,\n      )'
SITE='const startGame = () => newGame(START_FEN);'
W5=$'\nclass SpawnerW5 extends (spawnSync as unknown as new (f: string, a: string[]) => object) {}\nconst neverW5 = () => new SpawnerW5(process.execPath, ["-e", ""]);\nvoid neverW5;'
F2=$'\ntype ResultF2 = ReturnType<typeof spawnSync>;\nconst noneF2: ResultF2 | undefined = undefined;\nvoid noneF2;'
F2b=$'\nconst nameF2b = (file: Parameters<typeof spawnSync>[0]): string => String(file);\nvoid nameF2b;'
for P in control W5 F2 F2b; do
  T=$SP/fix-$P; rm -rf "$T"; mkdir -p "$T"; git -C "$REPO" archive "$COMMIT" | tar -x -C "$T"; ln -s "$REPO/node_modules" "$T/node_modules"
  ARGS=("$T/src/cli.test.ts" "$FILT" "$FIX")
  case $P in W5) ARGS+=("$T/src/cli.test.ts" "$SITE" "$SITE$W5");; F2) ARGS+=("$T/src/cli.test.ts" "$SITE" "$SITE$F2");; F2b) ARGS+=("$T/src/cli.test.ts" "$SITE" "$SITE$F2b");; esac
  node "$MUT" "${ARGS[@]}" || exit 3
  echo "== fix + $P  load1 $(sysctl -n vm.loadavg | awk '{print $2}')"
  (cd "$T" && npx vitest run src/cli.test.ts 2>&1 | grep -E "Tests +[0-9]|AssertionError" | sed 's/ [0-9]*ms$//' | cut -c1-200)
done
