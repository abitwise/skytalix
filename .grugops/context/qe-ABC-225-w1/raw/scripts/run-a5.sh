#!/usr/bin/env bash
# qe-ABC-225-w1 A5 session: host precheck, then `rating.ts rpair 02fa9556 baf99a7c <out> --rounds 10 --concurrency 1`,
# with a thermal watcher (every 60 s; >= 30 samples and Tctl median > 85 C -> SIGTERM, THERMAL STOP).
# Tool paths come from tools.env one directory up (never written to a record).  usage: run-a5.sh <checkout> <out> <log>
set -u
here=$(cd "$(dirname "$0")" && pwd)
co=$1; out=$2; log=$3
set -a; . "$here/../tools.env"; set +a
tctl() { for h in /sys/class/hwmon/hwmon*; do [ "$(cat $h/name)" = k10temp ] && awk '{printf "%.1f", $1/1000}' $h/temp1_input && return; done; echo "?"; }
pre() { echo "$1 at=$(date -u +%FT%TZ) load1=$(cut -d' ' -f1 /proc/loadavg) tctl=$(tctl) cutechess=$(pgrep -x cutechess-cli | wc -l) stockfish=$(pgrep -x stockfish | wc -l) vitest=$(pgrep -f '[/]vitest' | wc -l)" >> "$log"; }
pre precheck
t0=$(date -u +%s)
echo "start at=$(date -u +%FT%TZ)" >> "$log"
cd "$co" || exit 2
node tools/rating/rating.ts rpair 02fa9556 baf99a7c "$out" --rounds 10 --concurrency 1 > "$log.stdout" 2>&1 &
pid=$!
echo "harness pid=$pid" >> "$log"
stopped=0
while kill -0 "$pid" 2>/dev/null; do
  sleep 60
  [ -f "$out/thermal.log" ] || continue
  read -r n med mx < <(sed -n 's/.* tctl=\([0-9.]*\) .*/\1/p' "$out/thermal.log" | sort -n | awk '{v[NR]=$1} END{if(NR==0){print 0, 0, 0}else if(NR%2){print NR, v[(NR+1)/2], v[NR]}else{print NR, (v[NR/2]+v[NR/2+1])/2, v[NR]}}')
  g=$(grep -c ' end ' "$out/schedule.log" 2>/dev/null); pg=$(cat "$out"/*/b01/r.pgn 2>/dev/null | grep -c '^\[Result ')
  echo "watch at=$(date -u +%FT%TZ) samples=$n tctl_median=$med tctl_max=$mx load1=$(cut -d' ' -f1 /proc/loadavg) games=$pg blocks_ended=$g cutechess=$(pgrep -x cutechess-cli | wc -l) vitest=$(pgrep -f '[/]vitest' | wc -l)" >> "$log"
  if [ "$n" -ge 30 ] && awk -v m="$med" 'BEGIN{exit !(m>85)}'; then
    echo "THERMAL STOP at=$(date -u +%FT%TZ) median=$med over $n samples" >> "$log"
    kill -TERM "$pid"; pkill -TERM -x cutechess-cli
    stopped=1
    break
  fi
done
wait "$pid"; rc=$?
echo "end at=$(date -u +%FT%TZ) rc=$rc wall_s=$(( $(date -u +%s) - t0 )) thermal_stop=$stopped summary=$([ -f "$out/summary.txt" ] && echo yes || echo no)" >> "$log"
pre post
exit "$rc"
