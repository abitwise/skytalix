#!/bin/bash
# qe-epic008-close G6 session (qe-ABC-208 session.sh, G6 only; EPIC-008 G6 row rule A): preconditions, sampler, then
# 5 rounds, each a kiwipete pair then a position-6 pair; base (3497aad2) first in odd rounds, head (close) first in even.
# usage: g6.sh <scratch>
set -u
SCR=$1; R=$SCR/g6; mkdir -p $R
. $SCR/scripts/common.sh
wait_pre $R/wait.log; pre=$?; [ $pre = 0 ] || exit $pre
sampler $R/sampler.log "" & SP=$!
cd $SCR
B=$SCR/trees/base; H=$SCR/trees/head
echo "$(ts) G6 start" >> $R/runs.log
for round in 1 2 3 4 5; do
  for pos in kiwipete position-6; do
    if [ $((round % 2)) = 1 ]; then order="$B $H"; else order="$H $B"; fi
    for t in $order; do
      echo "$(ts) run round=$round pos=$pos tree=$(basename $t) load1=$(load1) power=$(power) thermal=$(thermal) vitest=$(vitest)" >> $R/runs.log
      node scripts/timed.mjs $t g6 $pos | sed "s/^{/{\"round\":$round,/" >> $R/g6.jsonl
    done
  done
done
echo "$(ts) end" >> $R/runs.log
kill $SP
