#!/usr/bin/env bash
# qe-ABC-268-p2 Levels deep lane (under flock). usage: run-levels.sh <scratch>
S=$1; W=<home>/projects/public/skytalix/.claude/worktrees/qe-ABC-268-p2
echo "start $(date -u +%FT%TZ) load1=$(cut -d' ' -f1 /proc/loadavg) head=$(git -C $W rev-parse --short HEAD) src-equal-to-1169c024=$(git -C $W diff --quiet 1169c024 -- src && echo yes || echo NO)" > $S/levels.times
cd $W && ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run src/levels.test.ts --reporter=verbose > $S/levels.txt 2>&1
echo "rc=$?" >> $S/levels.times; echo "end $(date -u +%FT%TZ) load1=$(cut -d' ' -f1 /proc/loadavg)" >> $S/levels.times
