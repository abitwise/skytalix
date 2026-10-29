#!/bin/bash
# qe-epic008-close M3 deep lanes on the close sha (worktree): G1 (PUZZLE_DEEP) and G5 (ENGINE_DEEP engine + levels,
# unfiltered, one file at a time). Preconditions and a 10 s sampler. usage: deep.sh <scratch> <worktree>
set -u
S=$1; W=$2; R=$S/deep; mkdir -p $R
. $S/scripts/common.sh
wait_pre $R/wait.log; pre=$?; [ $pre = 0 ] || exit $pre
sampler $R/sampler.log "" & SP=$!
cd $W
echo "$(ts) PUZZLE_DEEP start load1=$(load1) power=$(power) vitest=$(vitest)" >> $R/runs.log
PUZZLE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/puzzle-suite.test.ts > $R/PUZZLE_DEEP-puzzle-suite.txt 2>&1
echo "$(ts) PUZZLE_DEEP end rc=$? load1=$(load1) :: $(grep -E '^ +Tests ' $R/PUZZLE_DEEP-puzzle-suite.txt | tr -s ' ') :: $(grep -oE 'solved [0-9]+/[0-9]+, baseline [0-9]+/[0-9]+' $R/PUZZLE_DEEP-puzzle-suite.txt | head -1)" >> $R/runs.log
for f in src/engine.test.ts src/levels.test.ts; do
  n=$(basename $f .test.ts)
  echo "$(ts) ENGINE_DEEP $f start load1=$(load1) power=$(power) vitest=$(vitest)" >> $R/runs.log
  ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run $f --reporter=verbose > $R/ENGINE_DEEP-$n.txt 2>&1
  echo "$(ts) ENGINE_DEEP $f end rc=$? load1=$(load1) :: $(grep -E '^ +Tests ' $R/ENGINE_DEEP-$n.txt | tr -s ' ')" >> $R/runs.log
done
echo "$(ts) end" >> $R/runs.log
kill $SP
