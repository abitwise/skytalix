#!/usr/bin/env bash
# qe-ABC-265 plants (each command under its own flock). Each plant on P (scratch copy of head e5694864): the default
# lane of the eight table-adjacent files; if green, SEARCH_DEEP=1 transposition, then a3q.mjs plant mode (base vs P).
# Restored from head after each. usage: plants.sh <scratch> <outDir> <lock>
set -uo pipefail
S=$1; O=$2; L=$3; P=$S/P; mkdir -p $O
FILES="src/transposition.shared.test.ts src/transposition.test.ts src/engine.capacity.test.ts src/search.capacity.test.ts src/search.null-move.test.ts src/search.pvs-lmr.test.ts src/search.test.ts src/engine.test.ts"
restore() { cp $S/head/src/transposition.ts $P/src/; }
cd $P
for id in QP1 QP2 QP3 QP4 QP5 QP6 QP7 QP8 QP9 QP10; do
  restore; python3 $S/scripts/plant.py $P/src $id > $O/$id.plant.txt 2>&1 || { echo "$id plant-error" | tee -a $O/summary.txt; continue; }
  flock $L env NODE_OPTIONS=--max-old-space-size=128 ./node_modules/.bin/vitest run $FILES > $O/$id.default.txt 2>&1; r1=$?
  line="$id default rc=$r1 ($(grep -E '^ +Tests ' $O/$id.default.txt | tr -s ' ')) red: $(grep -E '^ +(×|✗|FAIL)' $O/$id.default.txt | head -5 | tr -s ' ' | cut -c1-170 | tr '\n' ';')"
  if [ $r1 -eq 0 ]; then
    flock $L env SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run src/transposition.test.ts > $O/$id.deep.txt 2>&1; r2=$?
    line="$line | deep transposition rc=$r2 ($(grep -E '^ +Tests ' $O/$id.deep.txt | tr -s ' '))"
    flock $L node $S/scripts/a3q.mjs $S/base $P plant > $O/$id.a3.txt 2>&1
    line="$line | a3 quick: $(grep -c MISMATCH $O/$id.a3.txt) mismatch lines; $(tail -1 $O/$id.a3.txt)"
  fi
  echo "$line" | tee -a $O/summary.txt
done
restore
diff -r $P/src $S/head/src > /dev/null && echo "P src restored == head src" | tee -a $O/summary.txt
