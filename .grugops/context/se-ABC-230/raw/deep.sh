#!/usr/bin/env bash
# Deep lanes for ABC-230, one at a time. Run from the worktree root.
V=./node_modules/.bin/vitest
run() {
  local name=$1 var=$2 file=$3
  local start=$(date +%s)
  echo "== $name"
  env "$var=1" NODE_OPTIONS=--max-old-space-size=400 $V run "$file" 2>&1 | grep -E "Test Files|Tests |×" | head -20
  echo "   exit=${PIPESTATUS[0]} secs=$(( $(date +%s) - start )) load=$(cut -d' ' -f1 /proc/loadavg)"
}
run "G4 engine deep" ENGINE_DEEP src/engine.test.ts
run "G7 transposition deep" ENGINE_DEEP src/transposition.test.ts
run "G1 puzzle suite" PUZZLE_DEEP src/puzzle-suite.test.ts
run "G4 pvs-lmr oracle" SEARCH_DEEP src/search.pvs-lmr.test.ts
run "G4 null-move" SEARCH_DEEP src/search.null-move.test.ts
run "UCI real engine" UCI_DEEP src/uci.real-engine.test.ts
run "CLI real engine" CLI_DEEP src/cli.real-engine.test.ts
run "levels deep" ENGINE_DEEP src/levels.test.ts
echo ALL-DONE
