#!/bin/bash
# qe-ABC-303: the count rows, each mode in its own process and its own host-lock hold, one at a time.
# usage: rows.sh <qe-scratch> <raw-scripts> <lock>. Foreign load: load1 and a count of busy foreign test runners before and
# after each hold, by process name and working directory, never an argv (ABC-277).
Q=$1 R=$2 L=$3 O=$Q/out/rows; mkdir -p "$O"
fl() { ps -eo pid=,pcpu=,comm= | awk -v me=$$ '$3 ~ /^(node|node-MainThread|vitest|npm)/ && $2+0 >= 25 {n++} END {print n+0}'; }
r() { n=$1; shift; a=$(date -u +%FT%TZ); l0=$(cut -d' ' -f1 /proc/loadavg); f0=$(fl); st=$(date +%s)
  flock "$L" taskset -c 0 env NODE_OPTIONS=--max-old-space-size=400 timeout 1500 "$@" > "$O/$n.jsonl" 2> "$O/$n.err"; rc=$?
  echo -e "$n\texit=$rc\tsecs=$(( $(date +%s)-st ))\tbytes=$(wc -c < "$O/$n.jsonl")\terrbytes=$(wc -c < "$O/$n.err")\tstart=$a\tload1=$l0->$(cut -d' ' -f1 /proc/loadavg)\tbusy_node_before=$f0\tbusy_node_after=$(fl)" >> "$O/exits.tsv"; }
: > "$O/exits.tsv"
r s1 node "$R/drv.ts" s1 "$Q/H" "$Q/B"
r nodes node "$R/drv.ts" nodes "$Q/H"
r reach node "$R/drv.ts" reach "$Q/H"
r drift node "$R/drv.ts" drift "$Q/H"
r bytes node "$R/drv.ts" bytes "$Q/H"
r forms node "$R/drv.ts" forms "$Q/H"
r floor node "$R/drv.ts" floor "$Q/H"
r zug node "$R/drv.ts" zug "$Q/H"
r g1 node "$R/drv.ts" g1 "$Q/H"
r krk node "$R/drv.ts" krk "$Q/H"
r s2 node "$R/drv.ts" s2 "$Q/H" "$Q/B"
r fire node "$R/audit.ts" fire "$Q/A"
r audit node "$R/audit.ts" audit "$Q/A"
echo "DONE $(date -u +%FT%TZ)" >> "$O/exits.tsv"
