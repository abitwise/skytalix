#!/bin/bash
# sweep.sh <prefix> <mutant>... : per mutant, apply it, run the whole default lane (lane.sh), restore.
S="${SCRATCH:?set SCRATCH to <scratch>/arch302}"
LOCK="<scratch>/host-test.lock"
prefix=$1; shift
for m in "$@"; do
  python3 -I $S/scripts/mut.py $S/tree $S/orig $m > /dev/null || { echo "APPLY FAIL $m"; continue; }
  t0=$(date +%s)
  flock $LOCK $S/scripts/lane.sh $prefix-$m > /dev/null
  echo "$m $(head -1 $S/out/$prefix-$m.sum) $(tail -1 $S/out/$prefix-$m.log) $(( $(date +%s) - t0 ))s"
done
python3 -I $S/scripts/mut.py $S/tree $S/orig restore > /dev/null
