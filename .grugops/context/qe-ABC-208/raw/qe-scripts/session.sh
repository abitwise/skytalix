#!/bin/bash
# qe-ABC-208 timing session (qe-ABC-207 session.sh, unchanged logic; qe-ABC-215 timing session) (qe-ABC-205 g6.sh + G2): preconditions, sampler, then G2 (base, head, head, base), G6 (5
# interleaved rounds per board per build), G11 (reported). Plain node, one fresh process per measurement.
set -u
SCR=$1; R=$SCR/g6; mkdir -p $R
. $SCR/scripts/common.sh
wait_pre $R/wait.log || exit 3
sampler $R/sampler.log & SP=$!
cd $SCR
B=$SCR/trees/base; H=$SCR/trees/head
echo "$(ts) G2 start" >> $R/runs.log
for t in $B $H $H $B; do
  echo "$(ts) g2 tree=$(basename $t) load1=$(load1) power=$(power) vitest=$(vitest)" >> $R/runs.log
  node scripts/g2.mjs $t >> $R/g2.jsonl
done
echo "$(ts) G2 done; G6 start" >> $R/runs.log
for round in 1 2 3 4 5; do
  for pos in kiwipete position-6; do
    if [ $((round % 2)) = 1 ]; then order="$B $H"; else order="$H $B"; fi
    for t in $order; do
      echo "$(ts) run round=$round pos=$pos tree=$(basename $t) load1=$(load1) power=$(power) vitest=$(vitest)" >> $R/runs.log
      node scripts/timed.mjs $t g6 $pos | sed "s/^{/{\"round\":$round,/" >> $R/g6.jsonl
    done
  done
done
echo "$(ts) G6 done; G11 start" >> $R/runs.log
while IFS= read -r line; do
  label=$(echo "$line" | sed -E 's/.*"before":"([^"]*)".*/\1/'); fen=$(echo "$line" | sed -E 's/.*"fen":"([^"]*)".*/\1/')
  for t in $B $H; do
    echo "$(ts) g11 $label tree=$(basename $t) load1=$(load1) power=$(power) vitest=$(vitest)" >> $R/runs.log
    node scripts/timed.mjs $t g11 "$label" "$fen" >> $R/g11.jsonl
  done
done < $SCR/scripts/g11-fens.jsonl
echo "$(ts) end" >> $R/runs.log
kill $SP
