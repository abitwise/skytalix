#!/bin/bash
SCR=$1; cd <worktree>
for spec in "SEARCH_DEEP src/search.test.ts" "SEARCH_DEEP src/search.ordering.test.ts" "SEARCH_DEEP src/transposition.test.ts" "SEARCH_DEEP src/quiescence.test.ts" "SEARCH_DEEP src/search.pvs-lmr.test.ts" "ENGINE_DEEP src/engine.test.ts" "ENGINE_DEEP src/levels.test.ts" "ENGINE_DEEP src/transposition.test.ts" "ENGINE_DEEP src/search.pvs-lmr.test.ts" "ENGINE_DEEP src/legal.test.ts" "ENGINE_DEEP src/gameend.test.ts" "PUZZLE_DEEP src/puzzle-suite.test.ts"; do
  set -- $spec; v=$1; f=$2; n=$(basename $f .test.ts)
  s=$(date -u +%H:%M:%SZ)
  env $v=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run $f > $SCR/deep/$v-$n.txt 2>&1
  echo "$v $f rc=$? start=$s end=$(date -u +%H:%M:%SZ) load1=$(sysctl -n vm.loadavg)" >> $SCR/deep/summary.txt
done
echo DONE >> $SCR/deep/summary.txt
