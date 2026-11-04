#!/usr/bin/env bash
# qe-ABC-283 Levels deep lane on the candidate's tree, the out-of-tree head arm (run under ONE flock). usage: run-levels.sh <qe-dir>
Q=$1; cd $Q/arms/H; mkdir -p $Q/out/levels
echo "start $(date -u +%FT%TZ) $(uptime)" > $Q/out/levels/levels.times
ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 timeout 1800 npx vitest run src/levels.test.ts --reporter=verbose > $Q/out/levels/levels.txt 2>&1
echo "exit=$?" >> $Q/out/levels/levels.times; echo "end $(date -u +%FT%TZ) $(uptime)" >> $Q/out/levels/levels.times
