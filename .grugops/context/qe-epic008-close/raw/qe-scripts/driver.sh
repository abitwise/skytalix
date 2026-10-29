#!/bin/bash
# qe-epic008-close R driver (qe-ABC-204 driver.sh, ported to Linux; the AC gate is the brief's battery STOP before game 1).
# usage: driver.sh <scratch> <reading-dir> <sha>
# Waits for the preconditions (common.sh wait_pre), then runs, from the worktree:
#   node tools/rating/rating.ts r <sha> <reading-dir>/out --elo 1910 --rounds 100
# sampling the host every 10 s and timestamping game events. Never stops a reading once started.
set -u
SCR=$1; DIR=$2; SHA=$3
WT=${WTDIR:?set WTDIR}
: "${CUTECHESS_CLI:?}" "${STOCKFISH:?}"
. "$SCR/scripts/common.sh"
MON=$DIR/mon; OUT=$DIR/out
mkdir -p "$MON"
wait_pre "$MON/wait.log"; pre=$?; [ $pre = 0 ] || exit $pre
sampler "$MON/sampler.log" "$OUT/" & SAMPLER=$!
( while [ ! -f "$OUT/r.out" ]; do sleep 2; done
  tail -n +1 -F "$OUT/r.out" 2>/dev/null | grep --line-buffered -E '^(Started|Finished) game' | \
    while IFS= read -r line; do echo "$(ts) $line"; done >> "$MON/games.log" ) &
TAILER=$!
cd "$WT"
echo "$(ts) harness start: r $SHA <out> --elo 1910 --rounds 100" >> "$MON/wait.log"
node tools/rating/rating.ts r "$SHA" "$OUT" --elo 1910 --rounds 100 > "$MON/harness.stdout" 2>&1 &
HPID=$!
# the brief's pin gate: both tool lines must print "= pin"; DIFFERS -> STOP before game 1 (the builds run first)
while kill -0 $HPID 2>/dev/null && [ ! -s "$OUT/machine.txt" ]; do sleep 1; done
if [ -s "$OUT/machine.txt" ] && [ "$(grep -cE '^(cutechess-cli|stockfish): .* = pin$' "$OUT/machine.txt")" != 2 ]; then
  if [ ! -f "$OUT/r.out" ]; then kill -TERM $HPID 2>/dev/null; echo "$(ts) PIN-DIFFERS: STOP before game 1" >> "$MON/wait.log"
  else echo "$(ts) PIN-DIFFERS seen after cutechess started (reported, the reading is not stopped)" >> "$MON/wait.log"; fi
else echo "$(ts) pins: both = pin" >> "$MON/wait.log"; fi
wait $HPID
rc=$?
echo "$(ts) harness end rc=$rc" >> "$MON/wait.log"
sleep 3
kill $SAMPLER 2>/dev/null
pkill -P $TAILER 2>/dev/null; kill $TAILER 2>/dev/null
pkill -f "tail -n \+1 -F $OUT" 2>/dev/null
exit $rc
