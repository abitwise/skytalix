#!/bin/bash
S=<scratch>
L=$S/host-test.lock; O=$S/abc304
cd <repo> || exit 9
export VITEST_MAX_WORKERS=1 NO_COLOR=1
: > $O/gates.txt
g() { n=$1; shift; flock $L taskset -c 0 "$@" > $O/$n.txt 2>&1; echo "$n exit $? bytes $(wc -c < $O/$n.txt)" >> $O/gates.txt; }
g lint npm run lint
g typecheck npm run typecheck
g default-lane npm test
g build npm run build
NODE_OPTIONS=--max-old-space-size=128 flock $L taskset -c 0 npx vitest run --reporter=json 2>/dev/null > $O/skip.json; echo "skip-json exit $? bytes $(wc -c < $O/skip.json)" >> $O/gates.txt
N=$(jq '.numPendingTests + .numTodoTests' $O/skip.json); echo "skip count $N; total $(jq .numTotalTests $O/skip.json) passed $(jq .numPassedTests $O/skip.json)" >> $O/gates.txt
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count "$N" > $O/integrity.txt 2>&1; echo "integrity exit $? : $(tail -1 $O/integrity.txt)" >> $O/gates.txt
echo done >> $O/gates.txt
