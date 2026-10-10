#!/bin/bash
# qe-ABC-127: one PUZZLE_DEEP run, raw output + load + UTC + exit; rows extracted for cmp.
# Usage (worktree root): bash .grugops/context/qe-ABC-127/probe/run-deep.sh <tag> [PUZZLE_DEEP value, default 1]
TAG=$1; MODE=${2:-1}; P=.grugops/context/qe-ABC-127/probe; OUT=$P/raw-$TAG.txt
{ echo "UTC start $(date -u +%Y-%m-%dT%H:%M:%SZ) load $(sysctl -n vm.loadavg) head $(git rev-parse --short HEAD) PUZZLE_DEEP=$MODE"
  /usr/bin/time -p env PUZZLE_DEEP=$MODE npx vitest run src/puzzle-suite.test.ts 2>&1; echo "exit $?"
  echo "UTC end $(date -u +%Y-%m-%dT%H:%M:%SZ) load $(sysctl -n vm.loadavg)"; } > $OUT 2>&1
grep -E "^(SOLVED|MISSED)" $OUT > $P/raw-$TAG.rows.txt
