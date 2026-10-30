#!/usr/bin/env bash
# One precondition sample: load1, cutechess-cli count, foreign node.*vitest count. Exit 0 iff all clear.
l1=$(cut -d' ' -f1 /proc/loadavg)
cc=$(pgrep -x cutechess-cli | wc -l)
vt=$(ps -eo comm=,args= | awk '$1=="node" && /vitest/' | wc -l)
echo "{\"at\":\"$(date -u +%FT%TZ)\",\"load1\":$l1,\"cutechess\":$cc,\"vitest\":$vt}"
awk -v l="$l1" 'BEGIN{exit !(l<=8)}' && [ "$cc" -eq 0 ] && [ "$vt" -eq 0 ]
