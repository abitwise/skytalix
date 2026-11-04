#!/bin/bash
# se-ABC-283-merge: NFR-008 default lane, interleaved pairs, `npm test` as spelled, one fresh process per run.
# Arms: B = git archive main 715beb1c, H = git archive the merge 62151993 (each with node_modules linked).
# Pair 0 is a warm-up and is not scored. Order alternates: even pairs B then H, odd pairs H then B.
# usage: pairs.sh <arms dir holding B H> <outfile> <npairs>  (the caller holds ONE flock over the whole run)
A=$1; O=$2; N=$3; : > $O
for p in $(seq 0 $N); do
  if [ $((p % 2)) = 0 ]; then order="B H"; else order="H B"; fi
  for arm in $order; do
    l1=$(cut -d' ' -f1 /proc/loadavg)
    (cd $A/$arm && /usr/bin/time -f "%e" -o $A/time.txt npm test > $A/out-$arm.txt 2>&1); ex=$?
    echo "pair $p $arm exit $ex wall $(cat $A/time.txt) load1 $l1 $(grep -E '^ +Tests ' $A/out-$arm.txt | tail -1 | sed 's/  */ /g')" >> $O
  done
done
echo "DONE $(date -u +%FT%TZ)" >> $O
