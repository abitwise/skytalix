#!/usr/bin/env bash
# Waits until the host is clear for an ALONE run: no foreign vitest (pgrep -f "[/]vitest"), 0 cutechess-cli,
# load1 < 2.0 and Tctl < 60 C, three checks in a row 20 s apart. Logs each check. Gives up after $2 s.
# usage: wait-clear.sh <log> <max-seconds>
log=$1; max=$2; t0=$(date +%s); ok=0
tctl() { for h in /sys/class/hwmon/hwmon*; do [ "$(cat $h/name)" = k10temp ] && awk '{printf "%.1f", $1/1000}' $h/temp1_input && return; done; echo "?"; }
while :; do
  vt=$(pgrep -f "[/]vitest" | wc -l); cc=$(pgrep -x cutechess-cli | wc -l)
  l1=$(cut -d' ' -f1 /proc/loadavg); t=$(tctl)
  echo "check at=$(date -u +%FT%TZ) load1=$l1 tctl=$t vitest=$vt cutechess=$cc" >> "$log"
  if [ "$vt" -eq 0 ] && [ "$cc" -eq 0 ] && awk -v l="$l1" -v t="$t" 'BEGIN{exit !(l<2.0 && t<60)}'; then ok=$((ok+1)); else ok=0; fi
  [ "$ok" -ge 3 ] && { echo "clear at=$(date -u +%FT%TZ)" >> "$log"; exit 0; }
  [ $(( $(date +%s) - t0 )) -ge "$max" ] && { echo "gave up at=$(date -u +%FT%TZ)" >> "$log"; exit 1; }
  sleep 20
done
