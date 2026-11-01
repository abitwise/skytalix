#!/usr/bin/env bash
# qe-ABC-254 G8: `npm test` as spelled, order b h h b b h; before each run 0 foreign vitest (bracketed pgrep,
# waited by PID) and load1 <= 8. usage (under flock): g8.sh <baseFullTree> <worktree> <outDir>
set -uo pipefail
B=$1; H=$2; O=$3; mkdir -p "$O"; i=0
for t in b h h b b h; do
  i=$((i+1)); dir=$B; [ $t = h ] && dir=$H
  for p in $(pgrep -f "[/]vitest"); do echo "wait foreign vitest $p" >> "$O/wait.log"; while kill -0 $p 2>/dev/null; do sleep 5; done; done
  while awk '{exit !($1>8)}' /proc/loadavg; do sleep 15; done
  l0=$(cut -d' ' -f1 /proc/loadavg); t0=$(date +%s.%N)
  (cd "$dir" && npm test) > "$O/g8-$i-$t.txt" 2>&1; rc=$?
  t1=$(date +%s.%N); l1=$(cut -d' ' -f1 /proc/loadavg)
  cp "$dir/.test-results/last-run.json" "$O/g8-$i-$t.last-run.json"
  printf 'run=%s tree=%s rc=%s wall=%.2fs load1=%s/%s %s | %s\n' $i $t $rc "$(echo "$t1 - $t0" | bc)" $l0 $l1 \
    "$(grep -E '^ +Tests ' "$O/g8-$i-$t.txt" | tr -s ' ' | head -1)" "$(grep -E '^ +Duration' "$O/g8-$i-$t.txt" | tr -s ' ' | head -1)" | tee -a "$O/g8.txt"
done
