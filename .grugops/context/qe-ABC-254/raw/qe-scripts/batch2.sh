#!/usr/bin/env bash
# qe-ABC-254 batch 2 (under flock): PQ2 against the deep A1 rows (informative, qualifies the lane survivor), then the deep lanes.
set -uo pipefail
Q=$1; W=$2; S=$Q/scripts; O=$Q/out/b2; mkdir -p $O; P=$Q/FP
echo "start $(date -u +%FT%TZ)" > $O/times.txt
cp $P/src/legal.ts $O/legal.ts.orig; python3 $S/plant.py $P/src/legal.ts PQ2 > $O/PQ2.plant.txt
(cd $P && ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run src/legal.test.ts -t "ABC-254 A1") > $O/PQ2.deep-A1.txt 2>&1; echo "PQ2 ENGINE_DEEP A1 rc=$?" >> $O/times.txt
cp $O/legal.ts.orig $P/src/legal.ts; cmp $P/src/legal.ts $W/src/legal.ts && echo "FP restored" >> $O/times.txt
echo "deep start $(date -u +%FT%TZ)" >> $O/times.txt
$S/deep.sh $W $O/deep
echo "end $(date -u +%FT%TZ)" >> $O/times.txt
