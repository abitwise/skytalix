#!/bin/bash
W=<repo>/.claude/worktrees/se-ABC-291; S=<scratch>/se291; L=<scratch>/host-test.lock; O=$S/gates; mkdir -p $O; cd $W; : > $O/summary.txt
run() { n=$1; shift; s=$(date -u +%H:%M:%SZ); flock $L "$@" > $O/$n.out 2>&1; rc=$?; echo "$n rc=$rc start=$s end=$(date -u +%H:%M:%SZ) bytes=$(stat -c %s $O/$n.out)" >> $O/summary.txt; }
run typecheck npm run typecheck
run lint npm run lint
run build npm run build
run npmtest npm test
run skip bash -c "NODE_OPTIONS=--max-old-space-size=128 npx vitest run --reporter=json 2>/dev/null > $O/skip.json; echo rc=\$?; jq '.numPendingTests + .numTodoTests, .numTotalTests, .numPassedTests, .numFailedTests' $O/skip.json"
deep() { n=$1; v=$2; f=$3; shift 3; run $n env $v=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run $f --reporter=default --reporter=json --outputFile.json=$O/$n.json "$@"; }
deep tune TUNE_DEEP tools/tune/tune.test.ts
deep bundle SEARCH_DEEP src/search.bundle.test.ts
deep engineS SEARCH_DEEP src/engine.test.ts
deep engineE ENGINE_DEEP src/engine.test.ts
deep pawnsE ENGINE_DEEP src/evaluate.pawns.test.ts
echo ALLDONE >> $O/summary.txt
