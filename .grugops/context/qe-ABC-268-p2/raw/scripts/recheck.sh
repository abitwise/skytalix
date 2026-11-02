#!/usr/bin/env bash
# qe-ABC-268-p2 step 1: head + QE plants QP2-QP6 on QE's five-file default lane (run under flock). usage: recheck.sh <scratch> <outDir>
set -uo pipefail
S=$1; O=$2; mkdir -p $O; R=$S/plant
ts() { date -u +%FT%TZ; }
LANE="src/search.futility.test.ts src/search.test.ts src/engine.test.ts src/search.null-move.test.ts src/quiescence.test.ts"
restore() { cp $S/head/src/search.ts $S/head/src/engine.ts $R/src/; }
restore
(cd $R && NODE_OPTIONS=--max-old-space-size=128 ./node_modules/.bin/vitest run $LANE) > $O/head.lane.txt 2>&1; rc=$?
echo "head rc=$rc $(grep -E '^ +Tests ' $O/head.lane.txt | tr -s ' ' | head -1) $(ts)" | tee -a $O/summary.txt
for qp in QP2 QP3 QP4 QP5 QP6; do
  restore
  python3 $S/scripts/qe-plant.py $R $qp > $O/$qp.plant.txt 2>&1 || { echo "$qp PLANT-FAILED" | tee -a $O/summary.txt; continue; }
  (cd $R && diff -u $S/head/src/search.ts src/search.ts; diff -u $S/head/src/engine.ts src/engine.ts) >> $O/$qp.plant.txt
  (cd $R && NODE_OPTIONS=--max-old-space-size=128 ./node_modules/.bin/vitest run $LANE) > $O/$qp.lane.txt 2>&1; rc=$?
  grep -E '(FAIL|×|✗) ' $O/$qp.lane.txt | head -20 > $O/$qp.failed.txt
  echo "$qp rc=$rc $(grep -E '^ +Tests ' $O/$qp.lane.txt | tr -s ' ' | head -1) failing-rows=$(grep -cE '^ +(×|✗|FAIL) ' $O/$qp.lane.txt) $(ts)" | tee -a $O/summary.txt
done
restore
diff -r $S/head/src $R/src > /dev/null && echo "plant copy src == head src: yes" | tee -a $O/summary.txt || echo "plant copy src == head src: NO" | tee -a $O/summary.txt
