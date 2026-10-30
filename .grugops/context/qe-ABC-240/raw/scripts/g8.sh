#!/usr/bin/env bash
# G8 and test integrity, in the QE worktree: host check, one `npm test` timed, then the skip count and the integrity check.
# usage (from the worktree root): g8.sh <outDir>
set -uo pipefail
S=$(dirname "$(readlink -f "$0")"); O=$(readlink -f "$1"); mkdir -p "$O"; W=$(pwd)
"$S/wait-clear.sh" "$O/g8-host.jsonl" || { echo "host never clear"; exit 4; }
t0=$(date +%s.%N)
npm test > "$O/.raw" 2>&1; rc=$?
t1=$(date +%s.%N)
sed -e "s#$W#<worktree>#g" -e "s#$HOME#<home>#g" "$O/.raw" > "$O/npm-test.txt"; rm -f "$O/.raw"
"$S/host.sh" >> "$O/g8-host.jsonl"
skips=$(node -e 'const r=JSON.parse(require("fs").readFileSync(".test-results/last-run.json","utf8"));console.log(r.numPendingTests+r.numTodoTests, r.numPassedTests, r.numTotalTests, r.numFailedTests)')
{
  echo "npm test rc=$rc wall=$(echo "$t1 - $t0" | bc)s"
  grep -E "^ +(Test Files|Tests|Duration) " "$O/npm-test.txt"
  echo "last-run.json: skips(pending+todo) passed total failed = $skips"
  node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count "${skips%% *}"; echo "integrity rc=$?"
} | tee "$O/g8-and-skips.txt"
