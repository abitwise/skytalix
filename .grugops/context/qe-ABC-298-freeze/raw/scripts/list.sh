#!/usr/bin/env bash
# qe-ABC-298-freeze: every deep lane on main, COLLECTED and not run (`vitest list`): file and title of every row,
# titles with their interpolated figures. The test files' blobs (raw/test-blobs.txt) pin every literal figure.
# LADDER_DEEP=1 and =verdict are listed too (collection plays no game); they are never run here.
# Run as: flock <scratch>/host-test.lock taskset -c 0 bash list.sh <worktree> <outDir>
set -u
W=$1; O=$2; mkdir -p "$O/list"; cd "$W" || exit 2
LANES=(
  ENGINE_DEEP:legal ENGINE_DEEP:moves ENGINE_DEEP:engine ENGINE_DEEP:engine.capacity ENGINE_DEEP:transposition
  ENGINE_DEEP:gameend ENGINE_DEEP:book ENGINE_DEEP:evaluate.pawns ENGINE_DEEP:quiescence ENGINE_DEEP:search.ordering
  ENGINE_DEEP:search.pvs-lmr ENGINE_DEEP:uci-session ENGINE_DEEP:levels
  SEARCH_DEEP:search SEARCH_DEEP:search.bundle SEARCH_DEEP:search.null-move SEARCH_DEEP:search.pvs-lmr
  SEARCH_DEEP:search.ordering SEARCH_DEEP:search.futility SEARCH_DEEP:quiescence SEARCH_DEEP:transposition
  SEARCH_DEEP:see SEARCH_DEEP:evaluate.taper SEARCH_DEEP:evaluate.passer
  PERFT_DEEP:perft PUZZLE_DEEP:puzzle-suite PUZZLE_DEEP=weakened:puzzle-suite ZOBRIST_DEEP:zobrist INPUT_DEEP:line-input
  CLI_DEEP:cli.real-engine UCI_DEEP:uci.real-engine LADDER_DEEP:ladder LADDER_DEEP=verdict:ladder
)
echo "list start $(date -u +%FT%TZ)" >> "$O/holds.txt"
for lane in "${LANES[@]}"; do
  var=${lane%%:*}; f=${lane#*:}; [ "${var#*=}" = "$var" ] && var="$var=1"; tag=${var%=1}; tag=${tag/=/-}
  nodeopts=--max-old-space-size=400; [ "${var%%=*}" = INPUT_DEEP ] && nodeopts="$nodeopts --expose-gc"
  env "$var" NODE_OPTIONS="$nodeopts" ./node_modules/.bin/vitest list "src/$f.test.ts" --json="$O/list/$tag-$f.json" > "$O/list/$tag-$f.txt" 2>&1
  echo "list $tag $f exit $?" >> "$O/exits.txt"
done
# The default lane's rows, collected the same way, so a deep row is a title absent from it.
NODE_OPTIONS=--max-old-space-size=128 ./node_modules/.bin/vitest list --json="$O/list/default.json" > "$O/list/default.txt" 2>&1
echo "list default exit $?" >> "$O/exits.txt"
echo "list end $(date -u +%FT%TZ)" >> "$O/holds.txt"
