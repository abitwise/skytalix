#!/bin/bash
# qe-ABC-304 lanes: every run under the host lock, one core, one worker, one at a time.
S=<scratch>
L=$S/host-test.lock; O=$S/qe304
W=<repo>
cd $W || exit 9
export VITEST_MAX_WORKERS=1 NO_COLOR=1
: > $O/exits.txt
echo "head $(git rev-parse --short HEAD) src-tree $(git rev-parse --short HEAD:src)" >> $O/exits.txt
lane() { # name env-assignment file
  local name=$1 envv=$2 file=$3 rc
  env $envv NODE_OPTIONS=--max-old-space-size=400 flock $L taskset -c 0 npx vitest run $file --reporter=verbose --reporter=json --outputFile.json=$O/$name.json > $O/$name.txt 2>&1
  rc=$?
  echo "$name exit $rc bytes $(wc -c < $O/$name.txt)" >> $O/exits.txt
}
g() { n=$1; shift; flock $L taskset -c 0 "$@" > $O/$n.txt 2>&1; echo "$n exit $? bytes $(wc -c < $O/$n.txt)" >> $O/exits.txt; }
lane passer-deep SEARCH_DEEP=1 src/evaluate.passer.test.ts
lane see-deep SEARCH_DEEP=1 src/see.test.ts
lane transposition-search-deep SEARCH_DEEP=1 src/transposition.test.ts
lane transposition-engine-deep ENGINE_DEEP=1 src/transposition.test.ts
g lint npm run lint
g typecheck npm run typecheck
g default-lane npm test
g build npm run build
NODE_OPTIONS=--max-old-space-size=128 flock $L taskset -c 0 npx vitest run --reporter=json 2>/dev/null > $O/skip.json; echo "skip-json exit $? bytes $(wc -c < $O/skip.json)" >> $O/exits.txt
N=$(jq '.numPendingTests + .numTodoTests' $O/skip.json); echo "skip count $N; total $(jq .numTotalTests $O/skip.json) passed $(jq .numPassedTests $O/skip.json) failed $(jq .numFailedTests $O/skip.json)" >> $O/exits.txt
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count "$N" > $O/integrity.txt 2>&1; echo "integrity exit $? : $(tail -1 $O/integrity.txt)" >> $O/exits.txt
echo done >> $O/exits.txt
