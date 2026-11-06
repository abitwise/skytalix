#!/bin/bash
# se-ABC-291: every deep lane that reads search or evaluation, one lock hold each. bash lanes.sh <tree> <out> <lock> [env:file ...]
T=$1 O=$2 L=$3; shift 3; cd "$T"; mkdir -p "$O"
run() { e=$1; f=$2; b=$(basename "$f" .test.ts)-$e; st=$(date +%s)
  flock "$L" env $e=1 NODE_OPTIONS=--max-old-space-size=400 timeout 1500 npx vitest run "$f" --reporter=default --reporter=json --outputFile.json="$O/$b.json" > "$O/$b.txt" 2>&1; rc=$?
  echo "$e $f exit=$rc seconds=$(( $(date +%s)-st )) $(sed 's/\x1b\[[0-9;]*m//g' "$O/$b.txt" | grep -E '^ +Tests ')" >> "$O/lanes.txt"; }
for pair in "$@"; do run "${pair%%:*}" "${pair#*:}"; done
echo ALLDONE >> "$O/lanes.txt"
