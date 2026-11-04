#!/bin/bash
cd <worktree>
t(){ local s=$(date +%s%N); "$@" >/dev/null 2>&1 </dev/null; local e=$(date +%s%N); echo "$(( (e-s)/1000000 )) ms  $*"; }
for i in 1 2 3; do
t node src/cli.ts --colour purple
t node src/cli.ts --colour white --unicode
t npm run chess
t node -e "process.stdout.write(String(require('node:v8').getHeapStatistics().heap_size_limit))"
done
