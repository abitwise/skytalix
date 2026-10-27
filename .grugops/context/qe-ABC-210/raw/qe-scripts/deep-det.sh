#!/bin/bash
# qe-ABC-210 deterministic deep lanes (qe-ABC-207 deep-run.sh; SEARCH_DEEP and PUZZLE_DEEP files, unfiltered: they carry no real-clock row)
S=$1; W=$2; cd "$W"; D=$S/deep; mkdir -p $D
for spec in "SEARCH_DEEP src/search.check-extension.test.ts" "SEARCH_DEEP src/search.null-move.test.ts" "SEARCH_DEEP src/search.test.ts" "SEARCH_DEEP src/search.ordering.test.ts" "SEARCH_DEEP src/transposition.test.ts" "SEARCH_DEEP src/quiescence.test.ts" "SEARCH_DEEP src/search.pvs-lmr.test.ts" "PUZZLE_DEEP src/puzzle-suite.test.ts"; do
  set -- $spec; v=$1; f=$2; n=$(basename $f .test.ts)
  s=$(date -u +%H:%M:%SZ)
  env $v=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run $f --reporter=verbose > $D/$v-$n.txt 2>&1
  echo "$v $f rc=$? start=$s end=$(date -u +%H:%M:%SZ) load1=$(sysctl -n vm.loadavg) :: $(grep -E '^ +Tests ' $D/$v-$n.txt | tr -s ' ')" >> $D/summary.txt
done
echo DONE >> $D/summary.txt
