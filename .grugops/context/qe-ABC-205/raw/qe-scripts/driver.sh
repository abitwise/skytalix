#!/bin/bash
# usage: driver.sh <scratch> <reading-dir> <harness mode+args without out-dir...>
# ABC-204 QE driver.sh with its AC gate removed (owner word …10e61802: power is logged, a battery switch never stops a reading).
# Waits for load1 <= 8 and no node.*vitest (common.sh wait_pre), then runs the harness with out=<reading-dir>/out,
# sampling the host every 10 s and timestamping game events.
set -u
SCR=$1; DIR=$2; shift 2
WT=<worktree>
. $SCR/scripts/common.sh
MON=$DIR/mon; OUT=$DIR/out
mkdir -p "$MON"
wait_pre "$MON/wait.log" || exit 3
sampler "$MON/sampler.log" & SAMPLER=$!
( while [ ! -f "$OUT/d.out" ]; do sleep 2; done
  tail -n +1 -F "$OUT/d.out" 2>/dev/null | grep --line-buffered -E '^(Started|Finished) game' | \
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
