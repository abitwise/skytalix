#!/usr/bin/env bash
# qe-ABC-283 S' (run under ONE flock: the whole match alone; information only). usage: run-r.sh <qe-dir> <worktree> <tools.env> <outname>
Q=$1; W=$2; . "$3"; N=$4
echo "start $(date -u +%FT%TZ) $(uptime)" > $Q/$N.times
cd $W && node tools/rating/rating.ts r ab0a37b6 $Q/$N --elo 1810 --budget-ms 500 --rounds 5 --concurrency 1 > $Q/$N.console 2>&1
echo "rc=$?" >> $Q/$N.times; echo "end $(date -u +%FT%TZ) $(uptime)" >> $Q/$N.times
