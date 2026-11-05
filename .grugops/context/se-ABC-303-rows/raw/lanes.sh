#!/bin/bash
# se-ABC-303-rows: the deep lanes the list owes, one lock hold each. bash lanes.sh <tree> <out> <lock>
T=$1 O=$2 L=$3; cd "$T"
run() { e=$1; f=$2; b=$(basename "$f" .test.ts)-$e; st=$(date +%s)
  flock "$L" env $e=1 NODE_OPTIONS=--max-old-space-size=400 timeout 1500 npx vitest run "$f" --reporter=default --reporter=json --outputFile.json="$O/$b.json" > "$O/$b.txt" 2>&1; rc=$?
  echo "$e $f exit=$rc seconds=$(( $(date +%s)-st )) $(sed 's/\x1b\[[0-9;]*m//g' "$O/$b.txt" | grep -E '^ +Tests ')" >> "$O/lanes.txt"; }
run ENGINE_DEEP src/engine.test.ts
run SEARCH_DEEP src/engine.test.ts
run ENGINE_DEEP src/uci-session.test.ts
