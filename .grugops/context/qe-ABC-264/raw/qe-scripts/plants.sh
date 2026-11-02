#!/usr/bin/env bash
# qe-ABC-264 plants (run under flock). Each plant on P (scratch copy of head), default lane of the 5 touched files; if green,
# SEARCH_DEEP=1 search.reverse-futility. Restored from head after each. QF: the ABC-086 A6 row at 3 ms (ENGINE_DEEP -t).
set -uo pipefail
S=$1; O=$2; P=$S/P; mkdir -p $O
FILES="src/search.reverse-futility.test.ts src/search.test.ts src/engine.test.ts src/quiescence.test.ts src/search.null-move.test.ts"
restore() { cp $S/head/src/search.ts $S/head/src/engine.ts $S/head/src/engine.test.ts $P/src/; }
cd $P
for id in QP1 QP2 QP3 QP4 QP5 QP6 QP7 QP8; do
  restore; python3 $S/scripts/plant.py $P/src $id > $O/$id.plant.txt 2>&1 || { echo "$id plant-error" | tee -a $O/summary.txt; continue; }
  NODE_OPTIONS=--max-old-space-size=128 ./node_modules/.bin/vitest run $FILES > $O/$id.default.txt 2>&1; r1=$?
  line="$id default rc=$r1 ($(grep -E '^ +Tests ' $O/$id.default.txt | tr -s ' ')) red: $(grep -E '^ +(×|✗|FAIL)' $O/$id.default.txt | head -4 | tr -s ' ' | cut -c1-160 | tr '\n' ';')"
  if [ $r1 -eq 0 ]; then
    SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run src/search.reverse-futility.test.ts > $O/$id.deep.txt 2>&1; r2=$?
    line="$line | deep rc=$r2 ($(grep -E '^ +Tests ' $O/$id.deep.txt | tr -s ' '))"
  fi
  echo "$line" | tee -a $O/summary.txt
done
restore; python3 $S/scripts/plant.py $P/src QF > $O/QF.plant.txt 2>&1
ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run src/engine.test.ts -t "ABC-086 A6" > $O/QF.txt 2>&1; r=$?
echo "QF (A6 row at 3 ms) rc=$r ($(grep -E '^ +Tests ' $O/QF.txt | tr -s ' '))" | tee -a $O/summary.txt
restore
ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run src/engine.test.ts -t "ABC-086 A6" > $O/QF-control.txt 2>&1; r=$?
echo "QF-control (A6 row at 5 ms, head) rc=$r ($(grep -E '^ +Tests ' $O/QF-control.txt | tr -s ' '))" | tee -a $O/summary.txt
diff -r $P/src $S/head/src > /dev/null && echo "P src restored == head src" | tee -a $O/summary.txt
