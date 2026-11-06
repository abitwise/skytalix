#!/bin/bash
# se-ABC-303: every deep lane but Levels, each in its own lock hold. bash deep.sh <tree> <out> <lock>
# Levels is QE's read, after main is merged in (brief item 4); no lane here plays a rated game.
T=$1 O=$2 LOCK=$3; cd "$T"; mkdir -p "$O"
run() { env=$1; f=$2; b=$(basename "$f" .test.ts)-$env
  st=$(date +%s); flock "$LOCK" env $env=1 NODE_OPTIONS=--max-old-space-size=400 timeout 1500 npx vitest run "$f" > "$O/$b.txt" 2>&1; rc=$?
  echo "$env $f exit=$rc seconds=$(( $(date +%s)-st )) $(grep -E '^ +Tests ' "$O/$b.txt" | sed 's/\x1b\[[0-9;]*m//g')" >> "$O/lanes.txt"; }
for f in search.bundle search.test search.ordering search.pvs-lmr search.null-move search.futility quiescence transposition see evaluate.taper; do [ "$f" = search.test ] && p=src/search.test.ts || p=src/$f.test.ts; run SEARCH_DEEP $p; done
for f in engine engine.capacity transposition uci-session; do run ENGINE_DEEP src/$f.test.ts; done
run PUZZLE_DEEP src/puzzle-suite.test.ts
run UCI_DEEP src/uci.real-engine.test.ts
run CLI_DEEP src/cli.real-engine.test.ts
