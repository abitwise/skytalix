#!/bin/bash
# one at a time, each under the host lock
L=<scratch>/host-test.lock
O=<scratch>/se303m2
W=<repo>/.claude/worktrees/se-ABC-303
cd $W
run() { n=$1; shift; s=$(date -u +%H:%M:%SZ); flock $L "$@" > $O/$n.out 2>&1; rc=$?; echo "$n rc=$rc start=$s end=$(date -u +%H:%M:%SZ) bytes=$(stat -c %s $O/$n.out)" >> $O/summary.txt; }
: > $O/summary.txt
run typecheck npm run typecheck
run lint npm run lint
run build npm run build
run npmtest npm test
run skip bash -c "NODE_OPTIONS=--max-old-space-size=128 npx vitest run --reporter=json 2>/dev/null > $O/skip.json; echo rc=\$?; jq '.numPendingTests + .numTodoTests, .numTotalTests, .numPassedTests, .numFailedTests' $O/skip.json"
deep() { n=$1; v=$2; f=$3; run $n env $v=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run $f --reporter=verbose --reporter=json --outputFile.json=$O/$n.json; }
deep passer SEARCH_DEEP src/evaluate.passer.test.ts
deep tune TUNE_DEEP tools/tune/tune.test.ts
deep book ENGINE_DEEP src/book.test.ts
deep qehop ENGINE_DEEP tools/grugops/qe-hop-integrity.test.ts
deep uci ENGINE_DEEP src/uci-session.test.ts
deep levels ENGINE_DEEP src/levels.test.ts
echo ALLDONE >> $O/summary.txt
