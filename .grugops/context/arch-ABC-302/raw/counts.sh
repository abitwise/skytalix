#!/bin/bash
S="${SCRATCH:?set SCRATCH to <scratch>/arch302}"
cd $S/tree
for spec in "SEARCH_DEEP search.null-move" "SEARCH_DEEP search.futility" "ZOBRIST_DEEP zobrist" "ENGINE_DEEP engine" "ENGINE_DEEP levels" "ENGINE_DEEP uci-session" "ENGINE_DEEP engine.capacity" "NONE cli"; do
  set -- $spec
  for flag in "" "$1=1"; do
    out=$(env $flag NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/$2.test.ts -t "NO_SUCH_ROW_302" 2>&1 | grep -E '^\s+Tests ' | sed 's/  */ /g')
    echo "$2 ${flag:-default}: $out"
  done
done
