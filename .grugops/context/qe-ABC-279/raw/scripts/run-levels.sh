#!/usr/bin/env bash
# qe-ABC-279 Levels deep lane on the candidate tree (run under ONE flock). usage: run-levels.sh <scratch-qe-dir> <worktree>
Q=$1; W=$2
cd $W; echo "start $(date -u +%FT%TZ) $(uptime) head=$(git rev-parse --short HEAD) src=$(git rev-parse --short HEAD:src) dirty=$(git status --porcelain -- src | wc -l)" > $Q/levels.times
ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 timeout 1800 npx vitest run src/levels.test.ts --reporter=verbose > $Q/levels.txt 2>&1
echo "exit=$?" >> $Q/levels.times; echo "end $(date -u +%FT%TZ) $(uptime)" >> $Q/levels.times
