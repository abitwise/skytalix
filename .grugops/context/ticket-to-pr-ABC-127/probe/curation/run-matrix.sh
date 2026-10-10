#!/bin/bash
# run-matrix.sh <rows.jsonl> <outdir>: all 17 weakenings + shipped (step 1) + shipped4 (step 0.25), 4 at a time
SP=$(cd "$(dirname "$0")/.." && pwd)
ROWS=$1; OUT=$2; mkdir -p $OUT
one() { id=$1; st=$2; v=$id; [ $id = shipped4 ] && v=shipped; node $SP/tools/matrix.mjs $SP/variants/$v $ROWS 25 $st $OUT/$id.jsonl; }
n=0
for spec in shipped:1 shipped4:0.25 W1:1 W1b:1 W2:1 W3:1 W4:1 W5:1 W6:1 W7:1 W8:1 W9:1 W10:1 W11:1 W12:1 W13:1 W14:1 W15:1 W16:1; do
  one ${spec%%:*} ${spec##*:} &
  n=$((n+1)); if [ $((n % 4)) -eq 0 ]; then wait; fi
done
wait
