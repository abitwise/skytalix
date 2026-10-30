#!/bin/bash
# qe-ABC-230 smoke driver (from qe-epic008-q4c driver.sh), D or R, width 1, with the pre-registered THERMAL STOP.
# usage: driver.sh <scratch> <reading-dir> d <cand> <base>      -> rating.ts d <cand> <base> <out> --budget-ms 1500 --rounds 5 --concurrency 1
#        driver.sh <scratch> <reading-dir> r <cand>             -> rating.ts r <cand> <out> --elo 1910 --rounds 5 --concurrency 1
# Needs WTDIR, CUTECHESS_CLI, STOCKFISH in the environment.
# Thermal stop: from the 6th sample of the run on, if the median Tctl of all the run's samples is > 85.0 C, SIGTERM
# cutechess-cli and the harness, and log THERMAL-STOP. A smoke so stopped is NOT READ.
set -u
SCR=$1; DIR=$2; MODE=$3; CAND=$4; BASE=${5:-}
WT=${WTDIR:?set WTDIR}
: "${CUTECHESS_CLI:?}" "${STOCKFISH:?}"
. "$SCR/scripts/common.sh"
MON=$DIR/mon; OUT=$DIR/out
mkdir -p "$MON"
wait_pre "$MON/wait.log"; pre=$?; [ $pre = 0 ] || exit $pre
: > "$MON/sampler.log"
sampler "$MON/sampler.log" & SAMPLER=$!
( while [ ! -f "$OUT/$MODE.out" ]; do sleep 2; done
  tail -n +1 -F "$OUT/$MODE.out" 2>/dev/null | grep --line-buffered -E '^(Started|Finished) game' | \
    while IFS= read -r line; do echo "$(ts) $line"; done >> "$MON/games.log" ) &
TAILER=$!
cd "$WT"
if [ "$MODE" = d ]; then
  ARGS=(d "$CAND" "$BASE" "$OUT" --budget-ms 1500 --rounds 5 --concurrency 1)
else
  ARGS=(r "$CAND" "$OUT" --elo 1910 --rounds 5 --concurrency 1)
fi
echo "$(ts) harness start: ${ARGS[*]}" | sed "s#$OUT#<out>#" >> "$MON/wait.log"
node tools/rating/rating.ts "${ARGS[@]}" > "$MON/harness.stdout" 2>&1 &
HPID=$!
# thermal watcher
( while kill -0 $HPID 2>/dev/null; do
    sleep 10
    med=$(awk '{for(i=1;i<=NF;i++) if($i ~ /^tctl=/){sub("tctl=","",$i); print $i}}' "$MON/sampler.log" | sort -n | \
          awk '{a[NR]=$1} END{ if (NR<6) {print "n/a " NR; exit} m=(NR%2)?a[(NR+1)/2]:(a[NR/2]+a[NR/2+1])/2; print m " " NR}')
    echo "$(ts) running-median $med" >> "$MON/thermal-watch.log"
    set -- $med
    if [ "$1" != "n/a" ] && awk -v m="$1" 'BEGIN{exit !(m>85.0)}'; then
      echo "$(ts) THERMAL-STOP median=$1 samples=$2" >> "$MON/thermal-watch.log"
      echo "$(ts) THERMAL-STOP median=$1 samples=$2" >> "$MON/wait.log"
      pkill -TERM -x cutechess-cli; kill -TERM $HPID 2>/dev/null
      break
    fi
  done ) & WATCH=$!
while kill -0 $HPID 2>/dev/null && [ ! -s "$OUT/machine.txt" ]; do sleep 1; done
sleep 1
if [ -s "$OUT/machine.txt" ]; then
  echo "$(ts) pins: $(grep -cE '^(cutechess-cli|stockfish): .* = pin$' "$OUT/machine.txt") of 2 = pin; $(grep '^concurrency' "$OUT/machine.txt")" >> "$MON/wait.log"
fi
wait $HPID
rc=$?
echo "$(ts) harness end rc=$rc" >> "$MON/wait.log"
sleep 3
kill $WATCH 2>/dev/null
kill $SAMPLER 2>/dev/null
pkill -P $TAILER 2>/dev/null; kill $TAILER 2>/dev/null
echo "$(ts) after: cutechess=$(cutechess_all) stockfish=$(pgrep -x stockfish | wc -l | tr -d ' ')" >> "$MON/wait.log"
exit $rc
