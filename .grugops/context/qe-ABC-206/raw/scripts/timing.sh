#!/bin/bash
# usage: timing.sh <a4|g6> <n>
Q=<scratchpad>/qe206
source $Q/scripts/host.sh
mode=$1; n=$2; out=$Q/raw/$mode.jsonl; log=$Q/raw/$mode-host.txt; mon=$Q/raw/$mode-monitor.txt
: > $out; : > $log; : > $mon
( while true; do echo "$(hostline)" >> $mon; sleep 1; done ) & MON=$!
trap "kill $MON 2>/dev/null" EXIT
badsince() { tail -n +$(( $1 + 1 )) $mon | grep -E 'ac=BATT|vitest=[1-9]' ; tail -n +$(( $1 + 1 )) $mon | awk '{split($3,a,"=");if(a[2]>8)print}'; }
for round in $(seq 1 $n); do
  for pos in kiwipete position-6; do
    if [ $((round % 2)) = 1 ]; then order="base head"; else order="head base"; fi
    while true; do
      waitok $log || { echo "UNRESOLVED round $round $pos" >> $log; exit 3; }
      n0=$(wc -l < $mon); buf=""
      for t in $order; do buf+=$(node $Q/scripts/timed.mjs $Q/$t $mode $pos)$'\n'; done
      bad=$(badsince $n0)
      if [ -n "$bad" ]; then
        echo "VOID round $round $pos: $(echo "$bad" | head -1)" >> $log
        printf '%s' "$buf" | sed 's/^{/{"void":true,/' >> $out
        continue
      fi
      printf '%s' "$buf" | sed "s/^{/{\"round\":$round,/" >> $out
      break
    done
  done
done
echo "DONE $(hostline)" >> $log
