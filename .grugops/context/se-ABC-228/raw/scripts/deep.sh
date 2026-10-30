#!/usr/bin/env bash
# ABC-228 deep lanes, one file at a time, through `npm run test:watch -- run <file>` (no bare npx).
# usage: deep.sh <worktree> <outDir> [ENV=1:file ...]
set -uo pipefail
W=$1; O=$2; shift 2; mkdir -p "$O"; cd "$W" || exit 2
run() { local env=$1 f=$2; local t0 t1 rc
  t0=$(date +%s.%N)
  env "$env" npm run test:watch -- run "src/$f.test.ts" > "$O/.raw" 2>&1; rc=$?
  t1=$(date +%s.%N)
  sed -e "s#$W#<worktree>#g" -e "s#$HOME#<home>#g" "$O/.raw" > "$O/${env%%=*}-$f.txt"; rm -f "$O/.raw"
  echo "$env $f rc=$rc wall=$(echo "$t1 - $t0" | bc)s $(grep -E '^ +Tests ' "$O/${env%%=*}-$f.txt" | tr -s ' ')" >> "$O/summary.txt"; }
for spec in "$@"; do run "${spec%%:*}" "${spec#*:}"; done
echo done >> "$O/summary.txt"
