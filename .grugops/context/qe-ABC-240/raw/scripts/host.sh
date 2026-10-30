#!/usr/bin/env bash
# One host sample (qe-ABC-240). Prints one JSON line. Exit 0 iff clear:
# 0 cutechess-cli (pgrep -x), 0 vitest (pgrep -f "[/]vitest"), load1 <= 8, Tctl <= 85 C (when sensors reads it).
l1=$(cut -d' ' -f1 /proc/loadavg)
cc=$(pgrep -x cutechess-cli | wc -l)
vt=$(pgrep -f "[/]vitest" | wc -l)
tc=$(sensors 2>/dev/null | awk '/^Tctl:/{gsub(/[+°C]/,"",$2); print $2; exit}')
echo "{\"at\":\"$(date -u +%FT%TZ)\",\"load1\":$l1,\"cutechess\":$cc,\"vitest\":$vt,\"tctl\":\"${tc:-NA}\"}"
awk -v l="$l1" -v t="${tc:-0}" 'BEGIN{exit !(l<=8 && t<=85)}' && [ "$cc" -eq 0 ] && [ "$vt" -eq 0 ]
