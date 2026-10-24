#!/bin/bash
# usage: window.sh <name> <cmd...>   — waits for preconditions, runs cmd with a 1 s monitor, reports overlap.
Q=<scratchpad>/qe206
source $Q/scripts/host2.sh
name=$1; shift; log=$Q/raw/$name-host.txt; mon=$Q/raw/$name-monitor.txt; : > $log; : > $mon
waitok $log || { echo "UNRESOLVED $name"; exit 3; }
( while true; do echo "$(hostline)" >> $mon; sleep 1; done ) & MON=$!
start=$(date +%s); bash -c "$*"; rc=$?; end=$(date +%s)
kill $MON 2>/dev/null
bad=$( { grep -E 'ac=BATT|vitest=[1-9]' $mon; awk '{split($3,a,"=");if(a[2]>8)print}' $mon; } | head -3)
echo "WINDOW $name rc=$rc wall=$((end-start))s samples=$(wc -l < $mon) overlap=${bad:-none}" | tee -a $log
