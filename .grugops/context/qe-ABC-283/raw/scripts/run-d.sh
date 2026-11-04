#!/usr/bin/env bash
# qe-ABC-283 C2' (run under ONE flock: the whole match alone). usage: run-d.sh <qe-dir> <worktree> <tools.env>
Q=$1; W=$2; . "$3"
echo "start $(date -u +%FT%TZ) $(uptime)" > $Q/c2.times
cd $W && node tools/rating/rating.ts d ab0a37b6 09694a4e $Q/c2 --budget-ms 100 --rounds 50 --concurrency 1 > $Q/c2.console 2>&1
echo "rc=$?" >> $Q/c2.times; echo "end $(date -u +%FT%TZ) $(uptime)" >> $Q/c2.times
