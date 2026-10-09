#!/bin/bash
# QE lane runner (qe-ABC-082): deep lanes ONE AT A TIME, load and UTC recorded per lane.
# Usage: bash lanes.sh <worktree> <base-scratch-tree> <tip-scratch-tree> <no-tip-scratch-tree> <probe-dir>
W=$1; BASE=$2; TIP=$3; NOTIP=$4; P=$5
lane() { # label, cwd, env, file, [filter]
  local label=$1 cwd=$2 env=$3 file=$4 filter=$5
  local t0=$(date +%s) start=$(date -u +%FT%TZ) l0=$(sysctl -n vm.loadavg | awk '{print $2}')
  if [ -n "$filter" ]; then out=$(cd "$cwd" && env $env npx vitest run "$file" -t "$filter" 2>&1); else out=$(cd "$cwd" && env $env npx vitest run "$file" 2>&1); fi
  local ec=$? t1=$(date +%s) l1=$(sysctl -n vm.loadavg | awk '{print $2}')
  echo "### $label | $start | exit $ec | wall $((t1-t0)) s | load1 $l0 -> $l1"
  echo "$out" | grep -E "Tests +[0-9]|Test Files|A1 depth 3|ABC-081 A2|ABC-081 A3|drift|FAIL|AssertionError|×" | head -20
}
lane "SEARCH_DEEP quiescence (tip)" "$W" SEARCH_DEEP=1 src/quiescence.test.ts
lane "SEARCH_DEEP transposition (tip)" "$W" SEARCH_DEEP=1 src/transposition.test.ts
lane "SEARCH_DEEP transposition A2 only (720b92d, no tip)" "$NOTIP" SEARCH_DEEP=1 src/transposition.test.ts A2
lane "ENGINE_DEEP transposition (tip)" "$W" ENGINE_DEEP=1 src/transposition.test.ts
lane "SEARCH_DEEP search (tip)" "$W" SEARCH_DEEP=1 src/search.test.ts
lane "SEARCH_DEEP search.ordering (tip)" "$W" SEARCH_DEEP=1 src/search.ordering.test.ts
lane "ENGINE_DEEP engine (tip)" "$W" ENGINE_DEEP=1 src/engine.test.ts
echo "### oracle position-6 (tip) | $(date -u +%FT%TZ) | load1 $(sysctl -n vm.loadavg | awk '{print $2}')"
node "$P/oracle.ts" "$TIP" position-6
echo "### oracle kiwipete (tip) | $(date -u +%FT%TZ) | load1 $(sysctl -n vm.loadavg | awk '{print $2}')"
node "$P/oracle.ts" "$TIP" kiwipete
lane "SEARCH_DEEP search.pvs-lmr (tip)" "$W" SEARCH_DEEP=1 src/search.pvs-lmr.test.ts
echo "### done | $(date -u +%FT%TZ)"
