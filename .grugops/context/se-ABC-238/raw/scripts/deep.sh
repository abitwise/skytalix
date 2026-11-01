#!/usr/bin/env bash
# ABC-238 deep lanes, one file at a time, local vitest binary at heap 400 (se-ABC-228/229 precedent; not npx).
# usage: deep.sh <worktree> <outDir> [ENV=1:file ...]   (the caller wraps the whole script in flock)
set -uo pipefail
W=$1; O=$2; shift 2; mkdir -p "$O"; cd "$W" || exit 2
run() { local env=$1 f=$2; local t0 t1 rc
  t0=$(date +%s.%N)
  env "$env" NODE_OPTIONS=--max-old-space-size=400 node ./node_modules/vitest/vitest.mjs run "src/$f.test.ts" --reporter=default --silent=false > "$O/.raw" 2>&1; rc=$?
  t1=$(date +%s.%N)
  sed -e "s#$W#<worktree>#g" -e "s#$HOME#<home>#g" "$O/.raw" > "$O/${env%%=*}-$f.txt"; rm -f "$O/.raw"
  echo "$env $f rc=$rc wall=$(echo "$t1 - $t0" | bc)s load1=$(cut -d' ' -f1 /proc/loadavg) $(grep -E '^ +Tests ' "$O/${env%%=*}-$f.txt" | tr -s ' ')" >> "$O/summary.txt"; }
for spec in "$@"; do run "${spec%%:*}" "${spec#*:}"; done
echo done >> "$O/summary.txt"
