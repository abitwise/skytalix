#!/usr/bin/env bash
# qe-ABC-268-p2 A6 (under flock). usage: run-d.sh <scratch>
S=$1; W=<home>/projects/public/skytalix/.claude/worktrees/qe-ABC-268-p2
. <scratch>/tools.env
echo "start $(date -u +%FT%TZ) load1=$(cut -d' ' -f1 /proc/loadavg)" > $S/d.times
cd $W && node tools/rating/rating.ts d 1169c024 ca6e8506 $S/a6 --budget-ms 100 --rounds 50 --concurrency 1 > $S/d.console 2>&1
echo "rc=$?" >> $S/d.times; echo "end $(date -u +%FT%TZ) load1=$(cut -d' ' -f1 /proc/loadavg)" >> $S/d.times
