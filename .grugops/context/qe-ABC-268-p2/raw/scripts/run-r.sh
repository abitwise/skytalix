#!/usr/bin/env bash
# qe-ABC-268-p2 smoke (under flock). usage: run-r.sh <scratch>
S=$1; W=<home>/projects/public/skytalix/.claude/worktrees/qe-ABC-268-p2
. <scratch>/tools.env
echo "start $(date -u +%FT%TZ) load1=$(cut -d' ' -f1 /proc/loadavg)" > $S/r.times
cd $W && node tools/rating/rating.ts r 1169c024 $S/smoke --budget-ms 500 --rounds 5 --concurrency 1 > $S/r.console 2>&1
echo "rc=$?" >> $S/r.times; echo "end $(date -u +%FT%TZ) load1=$(cut -d' ' -f1 /proc/loadavg)" >> $S/r.times
