#!/bin/bash
# se-ABC-289: gates' deep lanes, one lock hold each, Levels left to QE's read. bash lanes.sh <tree> <out> <lock>
T=$1 O=$2 L=$3; cd "$T"; mkdir -p "$O"
run() { e=$1; f=$2; b=$(basename "$f" .test.ts)-$e; st=$(date +%s)
  flock "$L" env $e=1 NODE_OPTIONS=--max-old-space-size=400 timeout 1500 npx vitest run "$f" --reporter=default --reporter=json --outputFile.json="$O/$b.json" > "$O/$b.txt" 2>&1; rc=$?
  echo "$e $f exit=$rc seconds=$(( $(date +%s)-st )) bytes=$(wc -c < "$O/$b.txt") $(sed 's/\x1b\[[0-9;]*m//g' "$O/$b.txt" | grep -E '^ +Tests ')" >> "$O/lanes.txt"; }
for f in quiescence see search.bundle search search.ordering search.pvs-lmr search.null-move search.futility transposition evaluate.taper evaluate.passer; do run SEARCH_DEEP src/$f.test.ts; done
run PUZZLE_DEEP src/puzzle-suite.test.ts
for f in engine engine.capacity transposition uci-session; do run ENGINE_DEEP src/$f.test.ts; done
run UCI_DEEP src/uci.real-engine.test.ts
run CLI_DEEP src/cli.real-engine.test.ts
