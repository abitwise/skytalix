#!/bin/bash
# One timed window of the ENGINE_DEEP levels lane: wait for the preconditions, run the named row(s)
# with the verbose reporter (prints the rows' logs and durations), monitor every 10 s during it.
# usage: window.sh <name> <vitest -t filter>
S=<scratch>
W=<worktree>
name=$1; filter=$2
$S/scripts/waitclear.sh $S/raw/win-$name-wait.txt || { echo "$name UNRESOLVED (never cleared)"; exit 4; }
tail -1 $S/raw/win-$name-wait.txt
cd $W
( echo "start $(date -u +%FT%TZ)"; ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts --reporter=verbose -t "$filter"; echo "rc=$? end $(date -u +%FT%TZ)" ) > $S/raw/win-$name.txt 2>&1 &
pid=$!
: > $S/raw/win-$name-monitor.txt
while kill -0 $pid 2>/dev/null; do $S/scripts/precheck.sh $pid >> $S/raw/win-$name-monitor.txt; sleep 10; done
wait $pid
broken=$(grep -c "ok=0" $S/raw/win-$name-monitor.txt)
echo "$name samples=$(wc -l < $S/raw/win-$name-monitor.txt) broken_samples=$broken"
grep -E "ABC-212 A4 level|A5: |✓|×|Tests |rc=|start " $S/raw/win-$name.txt | grep -v "↓" | cut -c1-600
