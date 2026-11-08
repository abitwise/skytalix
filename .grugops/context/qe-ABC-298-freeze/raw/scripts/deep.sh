#!/usr/bin/env bash
# qe-ABC-298-freeze: the default lane and every deep lane on main, one file at a time, one worker, one core.
# Form from the brief: `<VAR>=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run <file>` (here the same binary,
# ./node_modules/.bin/vitest, with --maxWorkers=1). "No tests" is a failure: summarise.mjs reads 0 tests as FAIL.
# LADDER_DEEP is not run: its deep lanes play games (src/ladder.test.ts), and this hop plays none.
# Run as: flock <scratch>/host-test.lock taskset -c 0 bash deep.sh <worktree> <outDir> [lane ...]
#   lane: "default" (the whole default lane) or "<VAR>[=<value>]:<file stem>" (value 1 if none); with none given,
#   every lane below. The default lane runs at --max-old-space-size=128, as AGENTS.md spells it (tools/grugops/heap-guard.js
#   refuses a whole-suite run above its SUITE row). INPUT_DEEP carries --expose-gc in the same NODE_OPTIONS (memory-bank/90-agents-md-command-log.md).
set -u
W=$1; O=$2; shift 2; mkdir -p "$O/vitest"; cd "$W" || exit 2
LANES=(
  default
  ENGINE_DEEP:legal ENGINE_DEEP:moves ENGINE_DEEP:engine ENGINE_DEEP:engine.capacity ENGINE_DEEP:transposition
  ENGINE_DEEP:gameend ENGINE_DEEP:book ENGINE_DEEP:evaluate.pawns ENGINE_DEEP:quiescence ENGINE_DEEP:search.ordering
  ENGINE_DEEP:search.pvs-lmr ENGINE_DEEP:uci-session ENGINE_DEEP:levels
  SEARCH_DEEP:search SEARCH_DEEP:search.bundle SEARCH_DEEP:search.null-move SEARCH_DEEP:search.pvs-lmr
  SEARCH_DEEP:search.ordering SEARCH_DEEP:search.futility SEARCH_DEEP:quiescence SEARCH_DEEP:transposition
  SEARCH_DEEP:see SEARCH_DEEP:evaluate.taper SEARCH_DEEP:evaluate.passer
  PUZZLE_DEEP:puzzle-suite PUZZLE_DEEP=weakened:puzzle-suite ZOBRIST_DEEP:zobrist INPUT_DEEP:line-input CLI_DEEP:cli.real-engine UCI_DEEP:uci.real-engine
)
[ $# -gt 0 ] && LANES=("$@")
for lane in "${LANES[@]}"; do
  echo "deep $lane start $(date -u +%FT%TZ)" >> "$O/holds.txt"
  if [ "$lane" = default ]; then
    NODE_OPTIONS=--max-old-space-size=128 ./node_modules/.bin/vitest run --maxWorkers=1 \
      --reporter=default --reporter=json --outputFile.json="$O/vitest/default.json" > "$O/vitest/default.txt" 2>&1
  else
    var=${lane%%:*}; f=${lane#*:}; [ "${var#*=}" = "$var" ] && var="$var=1"; tag=${var%=1}; tag=${tag/=/-}
    nodeopts=--max-old-space-size=400; [ "${var%%=*}" = INPUT_DEEP ] && nodeopts="$nodeopts --expose-gc"
    env "$var" NODE_OPTIONS="$nodeopts" ./node_modules/.bin/vitest run "src/$f.test.ts" --maxWorkers=1 \
      --reporter=default --reporter=json --outputFile.json="$O/vitest/$tag-$f.json" > "$O/vitest/$tag-$f.txt" 2>&1
  fi
  echo "deep $lane exit $?" >> "$O/exits.txt"
  echo "deep $lane end $(date -u +%FT%TZ)" >> "$O/holds.txt"
done
