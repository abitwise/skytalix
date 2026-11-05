#!/bin/bash
# ABC-304 lanes: every run under the host lock, one core, one worker, one at a time.
S=<scratch>
L=$S/host-test.lock; O=$S/abc304
cd <repo> || exit 9
export VITEST_MAX_WORKERS=1 NO_COLOR=1
: > $O/exits.txt
lane() { # name env-assignment file
  local name=$1 envv=$2 file=$3 s e rc
  s=$(date +%s)
  env $envv NODE_OPTIONS=--max-old-space-size=400 flock $L taskset -c 0 npx vitest run $file --reporter=verbose --reporter=json --outputFile.json=$O/$name.json > $O/$name.txt 2>&1
  rc=$?; e=$(date +%s)
  echo "$name exit $rc wall-incl-lock-wait $((e-s)) s bytes $(wc -c < $O/$name.txt)" >> $O/exits.txt
}
lane passer-deep SEARCH_DEEP=1 src/evaluate.passer.test.ts
lane see-deep SEARCH_DEEP=1 src/see.test.ts
lane transposition-search-deep SEARCH_DEEP=1 src/transposition.test.ts
lane transposition-engine-deep ENGINE_DEEP=1 src/transposition.test.ts
echo done >> $O/exits.txt
