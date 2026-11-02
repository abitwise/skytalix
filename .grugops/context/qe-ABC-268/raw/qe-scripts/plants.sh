#!/usr/bin/env bash
# qe-ABC-268 plants (run under flock). usage: plants.sh <scratch> <outDir>
set -uo pipefail
S=$1; O=$2; mkdir -p $O; R=$S/plant
ts() { date -u +%FT%TZ; }
restore() { cp $S/head/src/search.ts $S/head/src/engine.ts $R/src/; }
for qp in QP1 QP2 QP3 QP4 QP5 QP6 QP7 QP8; do
  restore
  python3 $S/scripts/qe-plant.py $R $qp > $O/$qp.plant.txt 2>&1 || { echo "$qp PLANT-FAILED" | tee -a $O/summary.txt; continue; }
  (cd $R && diff -u $S/head/src/search.ts src/search.ts; diff -u $S/head/src/engine.ts src/engine.ts) >> $O/$qp.plant.txt
  (cd $R && NODE_OPTIONS=--max-old-space-size=128 ./node_modules/.bin/vitest run src/search.futility.test.ts src/search.test.ts src/engine.test.ts src/search.null-move.test.ts src/quiescence.test.ts) > $O/$qp.default.txt 2>&1; rc=$?
  line="$qp default rc=$rc $(grep -E '^ +Tests ' $O/$qp.default.txt | tr -s ' ' | head -1)"
  if [ $rc = 0 ]; then
    (cd $R && SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run src/search.futility.test.ts) > $O/$qp.deep.txt 2>&1; rc2=$?
    line="$line | deep futility rc=$rc2 $(grep -E '^ +Tests ' $O/$qp.deep.txt | tr -s ' ' | head -1)"
    if [ $qp = QP5 ]; then node $S/scripts/qe-a1.mjs $S/base $R history > $O/$qp.a1history.txt 2>&1; line="$line | qe-a1 history: $(grep -c '"diff":0' $O/$qp.a1history.txt) pair(s) diff 0; $(tail -1 $O/$qp.a1history.txt)"; fi
  fi
  grep -E '(FAIL|×|✗) ' $O/$qp.default.txt | head -8 > $O/$qp.failed.txt
  [ -f $O/$qp.deep.txt ] && grep -E '(FAIL|×|✗) ' $O/$qp.deep.txt | head -8 >> $O/$qp.failed.txt
  echo "$line $(ts)" | tee -a $O/summary.txt
done
restore
diff -r $S/head/src $R/src > /dev/null && echo "plant copy src == head src: yes" | tee -a $O/summary.txt || echo "plant copy src == head src: NO" | tee -a $O/summary.txt
