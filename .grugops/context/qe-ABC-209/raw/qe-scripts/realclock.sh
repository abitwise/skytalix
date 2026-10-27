#!/bin/bash
# qe-ABC-209 real-clock rows (qe-ABC-208 realclock.sh, without its N8-LANE): the ENGINE_DEEP files UNFILTERED (the 12
# real-clock rows the build filtered, plus the lane's deterministic rows), then the two real-engine lanes that drive the
# changed entry points (CLI_DEEP: the delivered CLI and its level seam; UCI_DEEP: the delivered UCI session).
# Preconditions and a 10 s sampler as session.sh. usage: realclock.sh <scratch> <worktree>
set -u
S=$1; W=$2; R=$S/rc; mkdir -p $R
. $S/scripts/common.sh
wait_pre $R/wait.log || exit 3
sampler $R/sampler.log & SP=$!
cd $W
for f in src/engine.test.ts src/levels.test.ts src/transposition.test.ts src/search.pvs-lmr.test.ts src/legal.test.ts src/gameend.test.ts; do
  n=$(basename $f .test.ts)
  echo "$(ts) ENGINE_DEEP $f start load1=$(load1) power=$(power) vitest=$(vitest)" >> $R/runs.log
  ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run $f --reporter=verbose > $R/ENGINE_DEEP-$n.txt 2>&1
  echo "$(ts) ENGINE_DEEP $f end rc=$? load1=$(load1) :: $(grep -E '^ +Tests ' $R/ENGINE_DEEP-$n.txt | tr -s ' ')" >> $R/runs.log
done
for spec in "CLI_DEEP src/cli.real-engine.test.ts" "UCI_DEEP src/uci.real-engine.test.ts"; do
  set -- $spec; v=$1; f=$2; n=$(basename $f .test.ts)
  echo "$(ts) $v $f start load1=$(load1) power=$(power) vitest=$(vitest)" >> $R/runs.log
  env $v=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run $f --reporter=verbose > $R/$v-$n.txt 2>&1
  echo "$(ts) $v $f end rc=$? load1=$(load1) :: $(grep -E '^ +Tests ' $R/$v-$n.txt | tr -s ' ')" >> $R/runs.log
done
echo "$(ts) end" >> $R/runs.log
kill $SP
