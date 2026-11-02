#!/bin/bash
# G8: npm test wall, base and head interleaved x3 (base first in odd rounds), each under the host lock.
S=/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad
O=$S/se268out; L=$S/host-test.lock
B=$S/se268basefull; H=/home/olger/projects/public/skytalix/.claude/worktrees/se-ABC-268
: > $O/g8.txt
for r in 1 2 3; do
  if [ $((r % 2)) -eq 1 ]; then order="base head"; else order="head base"; fi
  for t in $order; do
    if [ $t = base ]; then D=$B; else D=$H; fi
    ( cd $D && flock $L timeout 300 npm test > $O/g8-$t-$r.log 2>&1 ); rc=$?
    echo "g8-$t-$r rc=$rc load=$(cut -d' ' -f1 /proc/loadavg) $(grep -E 'Tests ' $O/g8-$t-$r.log | tail -1) $(grep -E 'Duration' $O/g8-$t-$r.log | tail -1)" >> $O/g8.txt
  done
done
