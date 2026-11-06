#!/bin/bash
# a7.sh control | mc1 | sweep : A7's reads on the scratch trees, each run under the host lock on its own, core 0, one worker.
S="${SCRATCH:?}"; L="${LOCK:?}"
M="python3 -I $S/scripts/mutq.py"
T=$S/out/mc1.tsv
case $1 in
control)
  for t in base tip; do
    $M "$S/$t" "$S/orig" restore > /dev/null
    flock "$L" taskset -c 0 "$S/scripts/lane.sh" "$t" "$t-control"; echo "$t control $(head -1 "$S/out/$t-control.sum") $(tail -1 "$S/out/$t-control.log")"
    flock "$L" taskset -c 0 "$S/scripts/mc1lines.sh" "$t" "$t-control" | tee -a "$T"
  done
  flock "$L" taskset -c 0 "$S/scripts/tlines.sh" control C1 | tee -a "$T"
  ;;
mc1)
  for m in MC1p0 MC1p1; do for t in base tip; do
    $M "$S/$t" "$S/orig" "$m" > /dev/null || { echo "APPLY FAIL $t $m"; exit 3; }
    flock "$L" taskset -c 0 "$S/scripts/lane.sh" "$t" "$t-$m"; echo "$t $m $(head -1 "$S/out/$t-$m.sum") $(tail -1 "$S/out/$t-$m.log")"
    flock "$L" taskset -c 0 "$S/scripts/mc1lines.sh" "$t" "$t-$m" | tee -a "$T"
    [ "$t" = tip ] && flock "$L" taskset -c 0 "$S/scripts/tlines.sh" "$m" C1 | tee -a "$T"
    $M "$S/$t" "$S/orig" restore > /dev/null
  done; done
  ;;
sweep)
  "$S/scripts/sweep.sh" ML1 M6 M7 S241M2 QMATCH1 S241M1 S241M4 F230 M2s M4 QSEAMRAW QPRIOROFF QMATCH3 QTRIM1 MC1 MC2h P2a P2b MB1 M4z
  ;;
esac
for f in "$S"/orig/*; do n=$(basename "$f" | sed 's#__#/#g'); cmp "$f" "$S/base/$n" && cmp "$f" "$S/tip/$n" || echo "NOT RESTORED $n"; done
echo "a7 $1 done $(date -u +%FT%TZ)"
