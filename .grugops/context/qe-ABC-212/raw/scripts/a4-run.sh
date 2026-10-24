#!/bin/bash
S=<scratch>; W=<worktree>
$S/scripts/precheck.sh > $S/raw/a4-precheck.txt || { cat $S/raw/a4-precheck.txt; echo PRECHECK-FAILED; exit 3; }
cat $S/raw/a4-precheck.txt
cd $W
( echo "start $(date -u +%FT%TZ)"; ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts; echo "rc=$? end $(date -u +%FT%TZ)" ) > $S/raw/a4-engine-deep-levels.txt 2>&1 &
pid=$!
$S/scripts/monitor.sh $S/raw/a4-monitor.txt $pid &
wait $pid
tail -25 $S/raw/a4-engine-deep-levels.txt
