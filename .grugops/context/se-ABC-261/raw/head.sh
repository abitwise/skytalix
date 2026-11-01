#!/usr/bin/env bash
# se-ABC-261: three head runs of `npm test` as spelled, load1 and foreign vitest logged. usage (under flock): head.sh <worktree> <outDir>
set -uo pipefail
W=$1; O=$2; mkdir -p "$O"
for i in 1 2 3; do
  f=$(pgrep -af "[/]vitest" | tr '\n' ';')
  l0=$(cut -d' ' -f1 /proc/loadavg); t0=$(date +%s.%N)
  (cd "$W" && npm test) > "$O/head-$i.txt" 2>&1; rc=$?
  t1=$(date +%s.%N); l1=$(cut -d' ' -f1 /proc/loadavg)
  cp "$W/.test-results/last-run.json" "$O/head-$i.last-run.json"
  printf 'run=%s rc=%s wall=%.2fs load1=%s/%s foreign=[%s] %s | %s\n' $i $rc "$(echo "$t1 - $t0" | bc)" $l0 $l1 "$f" \
    "$(grep -E '^ +Tests ' "$O/head-$i.txt" | tr -s ' ' | head -1)" "$(grep -E '^ +Duration' "$O/head-$i.txt" | tr -s ' ' | head -1)" | tee -a "$O/head.txt"
done
