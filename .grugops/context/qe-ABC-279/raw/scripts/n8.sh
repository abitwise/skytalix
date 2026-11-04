#!/usr/bin/env bash
# qe-ABC-279 N8-LANE (run under ONE flock): npm test, 5 interleaved rounds, base first in odd rounds, head first in even.
# usage: n8.sh <scratch-qe-dir>
Q=$1; O=$Q/out/n8; mkdir -p $O; : > $O/n8.txt
echo "start $(date -u +%FT%TZ) $(uptime)" >> $O/n8.txt
for r in 1 2 3 4 5; do
  if [ $((r % 2)) -eq 1 ]; then order="base head"; else order="head base"; fi
  for t in $order; do
    cd $Q/$t; l=$(cut -d' ' -f1 /proc/loadavg); o=$(timeout 300 npm test 2>&1); rc=$?
    echo "$o" > $O/$t-r$r.out
    echo "r$r $t exit=$rc load1_before=$l $(echo "$o" | grep -E '^ +Tests ' | tr -s ' ') |$(echo "$o" | grep -E '^ +Duration' | tr -s ' ')" >> $O/n8.txt
  done
done
echo "end $(date -u +%FT%TZ) $(uptime)" >> $O/n8.txt
