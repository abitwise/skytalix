#!/bin/bash
# qe-ABC-208 real-clock rows: N8-LANE timed, then the ENGINE_DEEP files unfiltered (the static gate's 10 filtered rows plus
# the lane's deterministic rows). Preconditions and a 10 s sampler as session.sh. usage: realclock.sh <scratch> <worktree>
set -u
S=$1; W=$2; R=$S/rc; mkdir -p $R
. $S/scripts/common.sh
wait_pre $R/wait.log || exit 3
sampler $R/sampler.log & SP=$!
cd $W
echo "$(ts) N8-LANE start load1=$(load1) power=$(power) vitest=$(vitest)" >> $R/runs.log
( /usr/bin/time -p env SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/search.null-move.test.ts ) > $R/n8-lane.txt 2> $R/n8-lane.time
echo "$(ts) N8-LANE end rc=$? load1=$(load1)" >> $R/runs.log
for f in src/engine.test.ts src/levels.test.ts src/transposition.test.ts src/search.pvs-lmr.test.ts src/legal.test.ts src/gameend.test.ts; do
  n=$(basename $f .test.ts)
  echo "$(ts) ENGINE_DEEP $f start load1=$(load1) power=$(power) vitest=$(vitest)" >> $R/runs.log
  ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run $f --reporter=verbose > $R/ENGINE_DEEP-$n.txt 2>&1
  echo "$(ts) ENGINE_DEEP $f end rc=$? load1=$(load1) :: $(grep -E '^ +Tests ' $R/ENGINE_DEEP-$n.txt | tr -s ' ')" >> $R/runs.log
done
echo "$(ts) end" >> $R/runs.log
kill $SP
