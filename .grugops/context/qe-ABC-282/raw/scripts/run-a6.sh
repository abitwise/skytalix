#!/usr/bin/env bash
# qe-ABC-282 A6 (run under ONE flock: the whole match alone). usage: run-a6.sh <qe-dir> <worktree> <toolpaths file>
Q=$1; W=$2; . "$3"; export CUTECHESS_CLI STOCKFISH
echo "start $(date -u +%FT%TZ) $(uptime)" > $Q/a6.times
cd $W && node tools/rating/rating.ts d 04ebeb7e 22931005 $Q/a6 --tc 40/8 --rounds 50 --concurrency 1 > $Q/a6.console 2>&1
echo "rc=$?" >> $Q/a6.times; echo "end $(date -u +%FT%TZ) $(uptime)" >> $Q/a6.times
