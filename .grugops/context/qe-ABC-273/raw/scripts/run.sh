#!/usr/bin/env bash
# qe-ABC-273 R1 driver, run as: flock <host-test.lock> bash run.sh <out> <sha>
# Launches the sealed command once, samples the host every 10 s, and stops ONLY its own processes on:
#   THERMAL: median of the last 30 Tctl samples > 85 C;  RUNAWAY: 90 min wall since launch.
# Either stop makes the reading VOID (no re-run). Never touches a foreign process.
set -u
OUT=$1; SHA=$2; LOG=$OUT.sampler.log; REPO=/home/olger/projects/public/skytalix/.claude/worktrees/qe-ABC-273
: "${CUTECHESS_CLI:?}"; : "${STOCKFISH:?}"
tctl() { for h in /sys/class/hwmon/hwmon*; do [ "$(cat $h/name)" = k10temp ] && { awk '{printf "%.1f", $1/1000}' $h/temp1_input; return; }; done; echo "?"; }
echo "start $(date -u +%FT%TZ) $(uptime)" > "$LOG"
cd "$REPO"
node tools/rating/rating.ts r "$SHA" "$OUT" --elo 1810 --budget-ms 100 --rounds 100 --concurrency 1 > "$OUT.run.txt" 2>&1 &
TOOL=$!; T0=$(date +%s); STOP=""; temps=()
while kill -0 $TOOL 2>/dev/null; do
  sleep 10
  t=$(tctl); temps+=("$t"); [ ${#temps[@]} -gt 30 ] && temps=("${temps[@]: -30}")
  mine=$(pgrep -P $TOOL | tr '\n' ',')
  fv=$(pgrep -f '/vitest' | wc -l); fc=$(pgrep -x cutechess-cli | grep -vxF -f <(pgrep -P $TOOL) | wc -l)
  g=$(grep -c '^Finished game' "$OUT/r.out" 2>/dev/null || echo 0)
  el=$(( $(date +%s) - T0 ))
  echo "$(date -u +%FT%TZ) el=${el}s games=$g load1=$(cut -d' ' -f1 /proc/loadavg) tctl=$t foreign_vitest=$fv foreign_cutechess=$fc" >> "$LOG"
  med=$(printf '%s\n' "${temps[@]}" | grep -v '?' | sort -n | awk '{a[NR]=$1} END{if(NR) print a[int((NR+1)/2)]; else print 0}')
  if [ ${#temps[@]} -ge 30 ] && awk "BEGIN{exit !($med > 85)}"; then STOP="THERMAL median30=$med"; fi
  if [ $el -ge 5400 ]; then STOP="RUNAWAY 90 min"; fi
  if [ -n "$STOP" ]; then echo "$(date -u +%FT%TZ) STOP $STOP: SIGTERM own pids $TOOL,$mine" >> "$LOG"; pkill -TERM -P $TOOL; kill -TERM $TOOL; break; fi
done
wait $TOOL; RC=$?
echo "end $(date -u +%FT%TZ) tool_exit=$RC stop=${STOP:-none} $(uptime)" >> "$LOG"
