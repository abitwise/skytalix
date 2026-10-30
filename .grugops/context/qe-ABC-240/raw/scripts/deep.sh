#!/usr/bin/env bash
# Deep lanes, ONE FILE AT A TIME, in the QE worktree, heap 400 (one-file runs). usage: deep.sh <outDir>
# Host paths in the output are replaced by <worktree> / <home> before anything is kept.
set -uo pipefail
W=${QE_WORKTREE:?set QE_WORKTREE}; O=$(readlink -f "$1"); mkdir -p "$O"; cd "$W"
run() { local env=$1 f=$2; local t0; t0=$(date +%s.%N)
  env "$env" NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run "src/$f.test.ts" > "$O/.raw" 2>&1; local rc=$?
  local t1; t1=$(date +%s.%N)
  sed -e "s#$W#<worktree>#g" -e "s#$HOME#<home>#g" "$O/.raw" > "$O/${env%%=*}-$f.txt"; rm -f "$O/.raw"
  echo "$env $f rc=$rc wall=$(echo "$t1 - $t0" | bc)s $(grep -E '^ +Tests ' "$O/${env%%=*}-$f.txt" | tr -s ' ')" | tee -a "$O/summary.txt"; }
for f in legal moves gameend gameend.nfr evaluate.pawns transposition engine levels search.pvs-lmr search.ordering quiescence; do run ENGINE_DEEP=1 $f; done
for f in search search.null-move search.ordering quiescence search.pvs-lmr transposition; do run SEARCH_DEEP=1 $f; done
run PERFT_DEEP=1 perft
run PUZZLE_DEEP=1 puzzle-suite
run ZOBRIST_DEEP=1 zobrist
run CLI_DEEP=1 cli.real-engine
run UCI_DEEP=1 uci.real-engine
