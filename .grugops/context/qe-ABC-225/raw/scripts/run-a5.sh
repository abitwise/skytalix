#!/usr/bin/env bash
# qe-ABC-225 A5 session: one host precheck, then `rating.ts rpair <base> <cand> <out> --rounds 10`, with a
# thermal watcher. Tool paths come from tools.env beside this script (never written to a record).
# usage: run-a5.sh <checkout> <out-dir> <session-log>
set -u
here=$(cd "$(dirname "$0")" && pwd)
co=$1; out=$2; log=$3
. "$here/tools.env"
export CUTECHESS_CLI STOCKFISH
pre() { echo "$1 at=$(date -u +%FT%TZ) load1=$(cut -d' ' -f1 /proc/loadavg) cutechess=$(pgrep -x cutechess-cli | wc -l) node=$(pgrep -x node | wc -l) vitest=$(pgrep -f "[/]vitest" | wc -l)" >> "$log"; }
pre precheck
t0=$(date -u +%s)
echo "start at=$(date -u +%FT%TZ)" >> "$log"
cd "$co" || exit 2
node tools/rating/rating.ts rpair 02fa9556 baf99a7c "$out" --rounds 10 > "$log.stdout" 2>&1 &
pid=$!
stopped=0
while kill -0 "$pid" 2>/dev/null; do
  sleep 60
  [ -f "$out/thermal.log" ] || continue
  read -r n med < <(sed -n 's/.* tctl=\([0-9.]*\) .*/\1/p' "$out/thermal.log" | sort -n | awk '{v[NR]=$1} END{if(NR==0){print 0, 0}else if(NR%2){print NR, v[(NR+1)/2]}else{print NR, (v[NR/2]+v[NR/2+1])/2}}')
  echo "watch at=$(date -u +%FT%TZ) samples=$n tctl_median=$med load1=$(cut -d' ' -f1 /proc/loadavg) cutechess=$(pgrep -x cutechess-cli | wc -l) vitest=$(pgrep -f "[/]vitest" | wc -l)" >> "$log"
  if [ "$n" -ge 30 ] && awk -v m="$med" 'BEGIN{exit !(m>85)}'; then
    echo "THERMAL STOP at=$(date -u +%FT%TZ) median=$med over $n samples" >> "$log"
    kill -TERM "$pid"; pkill -TERM -x cutechess-cli
    stopped=1
    break
  fi
done
wait "$pid"; rc=$?
echo "end at=$(date -u +%FT%TZ) rc=$rc wall_s=$(( $(date -u +%s) - t0 )) thermal_stop=$stopped" >> "$log"
pre post
exit "$rc"
