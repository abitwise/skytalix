#!/bin/bash
# wall.sh <base-tree> <head-tree>: se-ABC-302 raw/wall.sh, unchanged: interleaved npm test pairs, pair 0 a warm-up.
B="$1"; H="$2"; echo -e "pair\tarm\tload1\twall_s\trc"
for i in 0 1 2 3 4 5 6; do
  if (( i % 2 )); then order="H B"; else order="B H"; fi
  for arm in $order; do
    [ $arm = B ] && d="$B" || d="$H"
    l=$(cut -d' ' -f1 /proc/loadavg); t0=$(date +%s.%N)
    (cd "$d" && npm test >/dev/null 2>&1); rc=$?
    t1=$(date +%s.%N); echo -e "$i\t$arm\t$l\t$(echo "$t1 - $t0" | bc | xargs printf '%.2f')\t$rc"
  done
done
