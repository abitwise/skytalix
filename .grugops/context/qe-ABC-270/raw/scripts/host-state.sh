#!/bin/bash
# qe-ABC-270: one host-state line block: date, uptime, Tctl, top five CPU users (recorded, never touched).
t=""; for h in /sys/class/hwmon/*; do [ "$(cat $h/name)" = k10temp ] && t=$(awk '{printf "%.1f", $1/1000}' $h/temp1_input); done
echo "$1 $(date -u +%FT%TZ) tctl=$t uptime: $(uptime)"
ps -eo pid,pcpu,etime,comm --sort=-pcpu | head -6 | sed "s/^/  $1 top: /"
