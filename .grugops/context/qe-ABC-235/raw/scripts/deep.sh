#!/usr/bin/env bash
# Deep lanes, one file at a time, in the QE worktree. usage: deep.sh <outDir>
set -uo pipefail
W=${QE_WORKTREE:?set QE_WORKTREE}; O=$1; mkdir -p "$O"; cd "$W"
run() { local env=$1 f=$2; local t0=$(date +%s.%N)
  env $env ./node_modules/.bin/vitest run "src/$f.test.ts" > "$O/${env%%=*}-$f.txt" 2>&1; local rc=$?
  local t1=$(date +%s.%N); echo "$env $f rc=$rc wall=$(echo "$t1 - $t0" | bc)s $(grep -E '^ +Tests ' "$O/${env%%=*}-$f.txt" | tr -s ' ')" | tee -a "$O/summary.txt"; }
for f in legal moves gameend gameend.nfr evaluate.pawns transposition engine levels search.pvs-lmr; do run ENGINE_DEEP=1 $f; done
for f in search search.null-move search.ordering quiescence search.pvs-lmr transposition; do run SEARCH_DEEP=1 $f; done
run PERFT_DEEP=1 perft
run PUZZLE_DEEP=1 puzzle-suite
