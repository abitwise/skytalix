#!/bin/bash
# qe-ABC-303-b4: rows.sh's r() and fl() unchanged, its modes cut to B4's rows (S1-S7, P2-P5). krk, fire, audit are table 3: not read here.
# usage: b4-rows.sh <b4 dir> <raw-scripts> <lock> <mode...>. Appends to exits.tsv, so a read in two calls keeps one record.
Q=$1 R=$2 L=$3 O=$Q/out/rows; shift 3; mkdir -p "$O"
fl() { ps -eo pid=,pcpu=,comm= | awk -v me=$$ '$3 ~ /^(node|node-MainThread|vitest|npm)/ && $2+0 >= 25 {n++} END {print n+0}'; }
r() { n=$1; shift; a=$(date -u +%FT%TZ); l0=$(cut -d' ' -f1 /proc/loadavg); f0=$(fl); st=$(date +%s)
  flock "$L" taskset -c 0 env NODE_OPTIONS=--max-old-space-size=400 timeout 1500 "$@" > "$O/$n.jsonl" 2> "$O/$n.err"; rc=$?
  echo -e "$n\texit=$rc\tsecs=$(( $(date +%s)-st ))\tbytes=$(wc -c < "$O/$n.jsonl")\terrbytes=$(wc -c < "$O/$n.err")\tstart=$a\tload1=$l0->$(cut -d' ' -f1 /proc/loadavg)\tbusy_node_before=$f0\tbusy_node_after=$(fl)" >> "$O/exits.tsv"; }
for m in "$@"; do
  case $m in
    s1|s2) r $m node "$R/drv.ts" $m "$Q/H" "$Q/B";;
    forms2) r forms2 node "$R/forms2.ts" "$Q/H";;
    *) r $m node "$R/drv.ts" $m "$Q/H";;
  esac
done
echo "DONE $(date -u +%FT%TZ)" >> "$O/exits.tsv"
