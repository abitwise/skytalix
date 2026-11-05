#!/bin/bash
# qe-ABC-301-miss batch 4. The caller holds the host lock. usage: batch4.sh <cand> <base> <land> <plant> <rawdir> <outdir> <lichess>
# The default lane on both trees (the class of every red), the 26 relations by QE's own copy of the driver, the plant, and the landing rehearsal.
C=$1; B=$2; L=$3; P=$4; D=$5; O=$6; LI=$7
scrub() { sed -e 's/\x1b\[[0-9;]*m//g' -e "s#$C#<cand>#g" -e "s#$B#<base>#g" -e "s#$L#<land>#g" -e "s#$P#<plant>#g" -e "s#$O#<out>#g" -e "s#$LI#<lichess>#g" -e "s#$HOME#<home>#g"; }
{ echo "cand"; node $D/treecheck.ts $C 4 2>&1; echo "base"; node $D/treecheck.ts $B 4 2>&1; echo "plant: enemy distance capped at 4, not 5, in passerTerms, emitted table"; node $D/treecheck.ts $P 4 2>&1; } | scrub > $D/treecheck.txt
{ echo "the tool's own gate on the plant, emitted table:"; (cd $P && timeout 300 node --max-old-space-size=3000 tools/tune/tune.ts extract $O/plant --lichess $LI 2>&1 | tail -4; echo "exit ${PIPESTATUS[0]}"); } | scrub | cut -c1-240 > $D/plant-gate.txt
for n in cand base land; do
  T=$C; [ $n = base ] && T=$B; [ $n = land ] && T=$L
  (cd $T && NODE_OPTIONS=--max-old-space-size=128 npx vitest run --reporter=json --outputFile=$O/lane-$n.json > $O/lane-$n.out 2>&1; echo "$n lane exit $?") | scrub
done > $D/lanes.txt
sed -e "s#<repo>#$C#g" $D/../../se-ABC-301-fit/raw/relations-on-emission.ts > $O/rel.ts
node $O/rel.ts 2>&1 | scrub > $D/relations-on-emission.txt
{ cd $L
  echo "tree $(git rev-parse --short HEAD), emission an ancestor: $(git merge-base --is-ancestor dd88560f HEAD && echo YES || echo no), params sha $(sha256sum src/evaluate-params.ts | cut -c1-16)"
  git diff --stat origin/main HEAD -- src tools package.json vitest.config.ts
  npx tsc --noEmit; echo "typecheck exit $?"
  npx biome check . 2>&1 | tail -3; echo "lint exit ${PIPESTATUS[0]}"
  npm run -s build; echo "build exit $?"
  TUNE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run tools/tune 2>&1 | tail -6; echo "tune deep exit ${PIPESTATUS[0]}"
  SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/evaluate.passer.test.ts 2>&1 | tail -6; echo "passer deep exit ${PIPESTATUS[0]}"
} 2>&1 | scrub > $D/land.txt
