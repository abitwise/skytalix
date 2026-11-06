#!/bin/bash
# qe-ABC-291: the count rows, each mode in its own process and its own host-lock hold, one at a time, on one core.
# usage: rows.sh <qe-scratch> <raw-scripts> <lock> [modes...]. Foreign load: load1 and a count of busy node-class processes before and
# after each hold, by process name, never an argv.
Q=$1 R=$2 L=$3 O=$Q/out/rows; shift 3; mkdir -p "$O"
fl() { ps -eo pid=,pcpu=,comm= | awk '$3 ~ /^(node|node-MainThread|vitest|npm)/ && $2+0 >= 25 {n++} END {print n+0}'; }
r() { n=$1; shift; a=$(date -u +%FT%TZ); l0=$(cut -d' ' -f1 /proc/loadavg); f0=$(fl); st=$(date +%s)
  flock "$L" taskset -c 0 env NODE_OPTIONS=--max-old-space-size=400 timeout 1500 "$@" > "$O/$n.jsonl" 2> "$O/$n.err"; rc=$?
  echo -e "$n\texit=$rc\tsecs=$(( $(date +%s)-st ))\tbytes=$(wc -c < "$O/$n.jsonl")\terrbytes=$(wc -c < "$O/$n.err")\tstart=$a\tload1=$l0->$(cut -d' ' -f1 /proc/loadavg)\tbusy_node_before=$f0\tbusy_node_after=$(fl)" >> "$O/exits.tsv"; }
for m in k0a k0c k0b floor zug g1 reach; do
  case $m in k0a|k0b) r $m node "$R/drv291.ts" $m "$Q/H" "$Q/B";; *) r $m node "$R/drv291.ts" $m "$Q/H";; esac
done
r row1632 node "$Q/H/row1632.ts" "$Q/H"
cd "$Q/H"
export PGNS="$PGNS"
r PR2-mirror node e4bprobe.ts mirror ON
r PR3-arith node e4bprobe.ts arith ON
r PR4-memo node e4bprobe.ts memo ON
r drift node e4bprobe.ts drift ON
r k1-run node "$R/../../../qe-ABC-291-k1/raw/k1-run.ts" "$Q/H/src"
echo "DONE $(date -u +%FT%TZ)" >> "$O/exits.tsv"
