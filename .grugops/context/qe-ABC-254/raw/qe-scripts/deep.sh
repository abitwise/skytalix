#!/usr/bin/env bash
# qe-ABC-254 deep lanes at H (worktree), one file at a time, AGENTS.md's one-file form via ./node_modules/.bin/vitest.
# usage (under flock): deep.sh <worktree> <outDir>
set -uo pipefail
W=$1; O=$2; mkdir -p "$O"; cd "$W"
lanes=(
  "ENGINE_DEEP legal" "ENGINE_DEEP engine" "ENGINE_DEEP transposition" "ENGINE_DEEP gameend" "ENGINE_DEEP gameend.nfr"
  "ENGINE_DEEP moves" "ENGINE_DEEP search.pvs-lmr" "SEARCH_DEEP search" "SEARCH_DEEP search.pvs-lmr" "SEARCH_DEEP search.null-move"
  "SEARCH_DEEP search.ordering" "SEARCH_DEEP quiescence" "SEARCH_DEEP transposition" "PERFT_DEEP perft" "PUZZLE_DEEP puzzle-suite"
  "ENGINE_DEEP levels"
)
for l in "${lanes[@]}"; do
  set -- $l; var=$1; f=$2; t0=$(date +%s.%N)
  env "$var=1" NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run "src/$f.test.ts" > "$O/$var-$f.txt" 2>&1; rc=$?
  t1=$(date +%s.%N)
  printf '%s %s rc=%s wall=%.1fs load1=%s %s\n' "$var" "$f" "$rc" "$(echo "$t1 - $t0" | bc)" "$(cut -d' ' -f1 /proc/loadavg)" \
    "$(grep -E '^ +Tests ' "$O/$var-$f.txt" | tr -s ' ' | head -1)" | tee -a "$O/summary.txt"
done
