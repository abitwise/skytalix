#!/usr/bin/env bash
# qe-ABC-223 (copied from qe-ABC-222, itself copied byte-for-byte in logic from qe-ABC-225-w1) wait-clear: snapshot pids of foreign vitest and any cutechess-cli once, poll `kill -0` on each until
# gone; then Tctl < 55 C and load1 < 1.5 on 3 checks 20 s apart. Gives up after $2 s.  usage: wait-clear.sh <log> <max-s>
log=$1; max=$2; t0=$(date +%s)
tctl() { for h in /sys/class/hwmon/hwmon*; do [ "$(cat $h/name)" = k10temp ] && awk '{printf "%.1f", $1/1000}' $h/temp1_input && return; done; echo "?"; }
pids="$(pgrep -f '[/]vitest') $(pgrep -x cutechess-cli)"
echo "snapshot at=$(date -u +%FT%TZ) pids=[${pids// /,}]" >> "$log"
for p in $pids; do
  while kill -0 "$p" 2>/dev/null; do
    [ $(( $(date +%s) - t0 )) -ge "$max" ] && { echo "gave up at=$(date -u +%FT%TZ) waiting on pid $p" >> "$log"; exit 1; }
    sleep 20
  done
  echo "gone pid=$p at=$(date -u +%FT%TZ)" >> "$log"
done
ok=0
while :; do
  l1=$(cut -d' ' -f1 /proc/loadavg); t=$(tctl)
  echo "check at=$(date -u +%FT%TZ) load1=$l1 tctl=$t" >> "$log"
  if awk -v l="$l1" -v t="$t" 'BEGIN{exit !(l<1.5 && t<55)}'; then ok=$((ok+1)); else ok=0; fi
  [ "$ok" -ge 3 ] && { echo "clear at=$(date -u +%FT%TZ)" >> "$log"; exit 0; }
  [ $(( $(date +%s) - t0 )) -ge "$max" ] && { echo "gave up at=$(date -u +%FT%TZ)" >> "$log"; exit 1; }
  sleep 20
done
