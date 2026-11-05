#!/bin/bash
# qe-ABC-301-s0 batch 5: does d5's second check (the gate at non-zero values) see H5 and H6? On M, under ONE host-lock hold.
S=$1; O=$S/out; cd $S/M; : > $O/gate-h5.txt
for m in CLEAN H5 H6; do
  cp $S/evaluate.clean.ts src/evaluate.ts
  [ $m != CLEAN ] && python3 $S/mut301.py $S/evaluate.clean.ts src/evaluate.ts $m
  r=$(node --max-old-space-size=1000 $S/tracerdirect.ts $S/M 0.05 2>&1 | python3 -c "
import json,sys
d=json.loads(sys.stdin.read()); print(d['positions'],{k:{'gateMiss':v['gateMiss'],'seamMiss':v['seamMiss']} for k,v in d['sets'].items()})")
  echo "$m $r" >> $O/gate-h5.txt
done
cp $S/evaluate.clean.ts src/evaluate.ts; cmp src/evaluate.ts $S/evaluate.clean.ts && echo "M restored" >> $O/gate-h5.txt
