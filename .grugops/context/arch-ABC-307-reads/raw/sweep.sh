#!/bin/bash
# sweep.sh <mutant>... : per mutant, base lane, tip lane and the listed rows' -t lines, one lock hold each, restored and compared after.
S="${SCRATCH:?set SCRATCH to <scratch>/arch307}"
L="${LOCK:?set LOCK to <scratch>/host-test.lock}"
declare -A ROWS=( [ML1]="L1" [M6]="L1 C1" [M7]="L1" [S241M2]="L2 L3" [QMATCH1]="L2" [S241M1]="L3" [S241M4]="L3" [F230]="L3" [M2s]="L3" [M4]="L3 B1"
  [QSEAMRAW]="L3" [QPRIOROFF]="L3" [QMATCH3]="L3" [QTRIM1]="L3" [MC1]="C1" [MC2h]="C2" [P2a]="C2" [P2b]="C2" [MB1]="B1" [M4z]="B1" )
for m in "$@"; do
  for t in base tip; do
    python3 -I "$S/scripts/mut.py" "$S/$t" "$S/orig" "$m" > /dev/null || { echo "APPLY FAIL $t $m"; exit 3; }
    t0=$(date +%s)
    flock "$L" taskset -c 0 "$S/scripts/lane.sh" "$t" "$t-$m"
    echo "$t $m $(head -1 "$S/out/$t-$m.sum") $(tail -1 "$S/out/$t-$m.log") $(( $(date +%s) - t0 ))s"
    if [ "$t" = tip ]; then
      flock "$L" taskset -c 0 "$S/scripts/tlines.sh" "$m" ${ROWS[$m]} | tee -a "$S/out/tlines-mutated.tsv"
    fi
    python3 -I "$S/scripts/mut.py" "$S/$t" "$S/orig" restore > /dev/null
  done
done
