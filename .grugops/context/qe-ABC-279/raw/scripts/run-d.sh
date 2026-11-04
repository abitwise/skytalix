#!/usr/bin/env bash
# qe-ABC-279 C2' (run under ONE flock). usage: run-d.sh <scratch-qe-dir> <worktree> <tools.env>
Q=$1; W=$2; . "$3"
echo "start $(date -u +%FT%TZ) $(uptime)" > $Q/c2.times
cd $W && node tools/rating/rating.ts d 1feb7560 00e99db8 $Q/c2 --budget-ms 100 --rounds 50 --concurrency 1 > $Q/c2.console 2>&1
echo "rc=$?" >> $Q/c2.times; echo "end $(date -u +%FT%TZ) $(uptime)" >> $Q/c2.times
