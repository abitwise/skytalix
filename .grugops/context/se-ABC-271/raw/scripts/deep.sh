#!/bin/bash
# usage: deep.sh <repo dir> <out dir>
L=<scratch>/host-test.lock
cd "$1"; OUT=$2; mkdir -p $OUT
run() { # name env file
  local name=$1 envv=$2 file=$3; shift 3
  local t0=$(date -u +%s)
  flock $L env $envv NODE_OPTIONS=--max-old-space-size=400 npx vitest run $file "$@" > $OUT/$name.log 2>&1
  local rc=$?
  echo "$name rc=$rc secs=$(( $(date -u +%s) - t0 )) $(grep -E '^\s+Tests ' $OUT/$name.log | tr -s ' ')" >> $OUT/summary.txt
}
[ -f src/evaluate.passer.test.ts ] && run K0 SEARCH_DEEP=1 src/evaluate.passer.test.ts
run search SEARCH_DEEP=1 src/search.test.ts
run pvslmr SEARCH_DEEP=1 src/search.pvs-lmr.test.ts
run nullmove SEARCH_DEEP=1 src/search.null-move.test.ts
run futility SEARCH_DEEP=1 src/search.futility.test.ts
run see SEARCH_DEEP=1 src/see.test.ts
run taper SEARCH_DEEP=1 src/evaluate.taper.test.ts
run quiescence SEARCH_DEEP=1 src/quiescence.test.ts
run tt-search SEARCH_DEEP=1 src/transposition.test.ts
run engine ENGINE_DEEP=1 src/engine.test.ts
run tt-engine ENGINE_DEEP=1 src/transposition.test.ts
run pawns-engine ENGINE_DEEP=1 src/evaluate.pawns.test.ts
run tune TUNE_DEEP=1 tools/tune/tune.test.ts
run puzzle PUZZLE_DEEP=1 src/puzzle-suite.test.ts
run levels ENGINE_DEEP=1 src/levels.test.ts --reporter=verbose
echo DONE >> $OUT/summary.txt
