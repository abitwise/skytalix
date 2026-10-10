#!/bin/bash
# ABC-127 probe: one PUZZLE_DEEP lane run, raw output + load + UTC. Waits (<= WAITMAX s) for load1 < LMAX.
# Usage (worktree root): run-deep.sh <tag> [PUZZLE_DEEP value, default 1]
TAG=$1; MODE=${2:-1}; LMAX=${LMAX:-8}; WAITMAX=${WAITMAX:-600}
P=.grugops/context/ticket-to-pr-ABC-127/probe
load1() { sysctl -n vm.loadavg | awk '{print $2}'; }
w=0; while [ "$(echo "$(load1) >= $LMAX" | bc)" = 1 ] && [ $w -lt $WAITMAX ]; do sleep 10; w=$((w+10)); done
OUT=$P/raw-$TAG.txt
{ echo "UTC start $(date -u +%Y-%m-%dT%H:%M:%SZ) load $(sysctl -n vm.loadavg) waited ${w}s head $(git rev-parse --short HEAD) PUZZLE_DEEP=$MODE"
  /usr/bin/time -p env PUZZLE_DEEP=$MODE npx vitest run src/puzzle-suite.test.ts 2>&1; echo "exit $?"
  echo "UTC end $(date -u +%Y-%m-%dT%H:%M:%SZ) load $(sysctl -n vm.loadavg)"; } > $OUT 2>&1
grep -E "^(SOLVED|MISSED)" $OUT > $P/raw-$TAG.rows.txt
grep -E "UTC|PUZZLES|ORACLE|Tests |Duration|^real|^exit" $OUT
