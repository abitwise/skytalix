#!/bin/bash
# G6 reading (se-ABC-268, the SE's reading; QE grades): 5 rounds, kiwipete pair then position-6 pair,
# base first in odd rounds, head first in even; fresh process per search; chooseMove at LEVELS[5] real clock.
S=/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad
B=$S/se268base; H=/home/olger/projects/public/skytalix/.claude/worktrees/se-ABC-268
for r in 1 2 3 4 5; do
  for pos in kiwipete position-6; do
    if [ $((r % 2)) -eq 1 ]; then order="base head"; else order="head base"; fi
    for t in $order; do
      if [ $t = base ]; then T=$B; else T=$H; fi
      node $S/se268-g6one.mjs $T $t $pos $r
      sleep 2
    done
  done
done
