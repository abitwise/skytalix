#!/bin/bash
# usage: monitor.sh <logfile> <own-pid> ; samples every 20 s until own pid exits
log=$1; own=$2; d=$(dirname "$0")
while kill -0 "$own" 2>/dev/null; do "$d/precheck.sh" "$own" >> "$log"; sleep 20; done
"$d/precheck.sh" >> "$log"
