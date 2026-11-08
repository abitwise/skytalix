#!/usr/bin/env bash
# se-ABC-298: one lane per call, under the host lock taken by the caller, one core, one worker.
#   bash lanes.sh <worktree> <outDir> <lane>...   lane: default | <VAR>:<file stem>
set -u
W=$1; O=$2; shift 2; mkdir -p "$O"; cd "$W" || exit 2
for lane in "$@"; do
  s=$(date -u +%FT%TZ); t0=$(date +%s.%N)
  if [ "$lane" = default ]; then
    NODE_OPTIONS=--max-old-space-size=128 ./node_modules/.bin/vitest run --maxWorkers=1 \
      --reporter=default --reporter=json --outputFile.json="$O/default.json" > "$O/default.txt" 2>&1
  else
    var=${lane%%:*}; f=${lane#*:}
    env "$var=1" NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run "src/$f.test.ts" --maxWorkers=1 \
      --reporter=default --reporter=json --outputFile.json="$O/$var-$f.json" > "$O/$var-$f.txt" 2>&1
  fi
  rc=$?; t1=$(date +%s.%N); e=$(date -u +%FT%TZ)
  echo "$lane exit=$rc start=$s end=$e wall=$(echo "$t1 - $t0" | bc)" >> "$O/lanes.txt"
done
