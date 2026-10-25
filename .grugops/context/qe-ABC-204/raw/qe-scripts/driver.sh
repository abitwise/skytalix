#!/bin/bash
# usage: driver.sh <reading-dir> <harness mode+args without out-dir...>
# Waits for the preconditions (AC, load1 <= 8, no node vitest) up to 60 min, then runs the
# harness with out=<reading-dir>/out, sampling the host every 10 s and timestamping game events.
set -u
DIR=$1; shift
WT=<worktree>
MON=$DIR/mon; OUT=$DIR/out
mkdir -p "$MON"
ts() { date -u +%Y-%m-%dT%H:%M:%SZ; }
load1() { sysctl -n vm.loadavg | awk '{print $2}'; }
power() { pmset -g ps | head -1 | sed -E "s/.*'(.*)'.*/\1/" | tr ' ' _; }
thermal() { notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}'; }
vitest() { pgrep -f 'node.*vitest' | wc -l | tr -d ' '; }
ok=0
for i in $(seq 1 240); do
  l=$(load1); p=$(power); v=$(vitest); t=$(thermal)
  echo "$(ts) wait poll=$i load1=$l power=$p vitest=$v thermal=$t" >> "$MON/wait.log"
  if [ "$p" = "AC_Power" ] && [ "$v" = "0" ] && awk -v l="$l" 'BEGIN{exit !(l<=8)}'; then ok=1; break; fi
  sleep 15
done
if [ $ok = 0 ]; then echo "$(ts) PRECONDITION-NOT-MET after 60 min" >> "$MON/wait.log"; exit 3; fi
echo "$(ts) PRECONDITIONS-MET start" >> "$MON/wait.log"
# sampler
( while true; do
    p=$(power)
    echo "$(ts) load1=$(load1) power=$p thermal=$(thermal) vitest=$(vitest)" >> "$MON/sampler.log"
    if [ "$p" != "AC_Power" ]; then
      echo "$(ts) BATTERY-STOP power=$p" >> "$MON/sampler.log"
      pkill -TERM -f "cutechess-cli.*$OUT/" ; exit 0
    fi
    sleep 10
  done ) &
SAMPLER=$!
# game event tailer (the .out appears once the builds finish)
( while [ ! -f "$OUT/d.out" ] && [ ! -f "$OUT/r.out" ]; do sleep 2; done
  f=$(ls "$OUT"/[dr].out | head -1)
  tail -n +1 -F "$f" 2>/dev/null | grep --line-buffered -E '^(Started|Finished) game' | \
    while IFS= read -r line; do echo "$(ts) $line"; done >> "$MON/games.log" ) &
TAILER=$!
cd "$WT"
echo "$(ts) harness start: $*" >> "$MON/wait.log"
node tools/rating/rating.ts "$@" "$OUT" > "$MON/harness.stdout" 2>&1
rc=$?
echo "$(ts) harness end rc=$rc" >> "$MON/wait.log"
sleep 3
kill $SAMPLER 2>/dev/null
pkill -P $TAILER 2>/dev/null; kill $TAILER 2>/dev/null
pkill -f "tail -n \+1 -F $OUT" 2>/dev/null
exit $rc
