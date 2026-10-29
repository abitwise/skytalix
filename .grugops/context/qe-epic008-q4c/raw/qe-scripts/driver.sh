#!/bin/bash
# qe-epic008-q4c D driver (from qe-epic008-close driver.sh, R -> D mode).
# usage: driver.sh <scratch> <reading-dir> <candidate-sha> <base-sha>
# Waits for the preconditions, then runs, from the worktree:
#   node tools/rating/rating.ts d <cand> <base> <reading-dir>/out --budget-ms 1500 --rounds 50 --concurrency 1
# sampling the host every ~10 s and timestamping game events. Never stops a reading once started (no heat stop).
set -u
SCR=$1; DIR=$2; CAND=$3; BASE=$4
WT=${WTDIR:?set WTDIR}
: "${CUTECHESS_CLI:?}" "${STOCKFISH:?}"
. "$SCR/scripts/common.sh"
MON=$DIR/mon; OUT=$DIR/out
mkdir -p "$MON"
for c in $CPUS; do echo "$(basename $c) max=$(( $(cat $c/cpufreq/cpuinfo_max_freq) / 1000 )) min=$(( $(cat $c/cpufreq/cpuinfo_min_freq) / 1000 ))"; done > "$MON/cpus.txt"
wait_pre "$MON/wait.log"; pre=$?; [ $pre = 0 ] || exit $pre
sampler "$MON/sampler.log" "$OUT/" & SAMPLER=$!
( while [ ! -f "$OUT/d.out" ]; do sleep 2; done
  tail -n +1 -F "$OUT/d.out" 2>/dev/null | grep --line-buffered -E '^(Started|Finished) game' | \
    while IFS= read -r line; do echo "$(ts) $line"; done >> "$MON/games.log" ) &
TAILER=$!
cd "$WT"
echo "$(ts) harness start: d $CAND $BASE <out> --budget-ms 1500 --rounds 50 --concurrency 1" >> "$MON/wait.log"
node tools/rating/rating.ts d "$CAND" "$BASE" "$OUT" --budget-ms 1500 --rounds 50 --concurrency 1 > "$MON/harness.stdout" 2>&1 &
HPID=$!
while kill -0 $HPID 2>/dev/null && [ ! -s "$OUT/machine.txt" ]; do sleep 1; done
sleep 1
if [ -s "$OUT/machine.txt" ] && [ "$(grep -cE '^(cutechess-cli|stockfish): .* = pin$' "$OUT/machine.txt")" != 2 ]; then
  if [ ! -f "$OUT/d.out" ]; then kill -TERM $HPID 2>/dev/null; echo "$(ts) PIN-DIFFERS: STOP before game 1" >> "$MON/wait.log"
  else echo "$(ts) PIN-DIFFERS seen after cutechess started (reported, the reading is not stopped)" >> "$MON/wait.log"; fi
else echo "$(ts) pins: both = pin" >> "$MON/wait.log"; fi
if [ -s "$OUT/machine.txt" ] && ! grep -qE '^concurrency: 1 \(default 3\)$' "$OUT/machine.txt"; then
  if [ ! -f "$OUT/d.out" ]; then kill -TERM $HPID 2>/dev/null; echo "$(ts) WIDTH-NOT-1: STOP before game 1" >> "$MON/wait.log"; fi
else echo "$(ts) width: machine.txt shows concurrency 1" >> "$MON/wait.log"; fi
wait $HPID
rc=$?
echo "$(ts) harness end rc=$rc" >> "$MON/wait.log"
sleep 3
kill $SAMPLER 2>/dev/null
pkill -P $TAILER 2>/dev/null; kill $TAILER 2>/dev/null
pkill -f "tail -n \+1 -F $OUT" 2>/dev/null
exit $rc
