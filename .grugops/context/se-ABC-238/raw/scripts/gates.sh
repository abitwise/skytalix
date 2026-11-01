#!/usr/bin/env bash
# ABC-238 gates, one locked session. usage: gates.sh <head worktree> <base worktree> <outDir>
set -uo pipefail
W=$1; B=$2; O=$3; mkdir -p "$O"; : > "$O/gates.txt"
log() { echo "$*" | tee -a "$O/gates.txt"; }
cd "$W"
log "host: $(uptime)"; log "foreign: $(ps -eo pid,etime,args | grep -E '[v]itest' | grep -v "$W" | cut -c1-120 | tr '\n' ';')"
npm run lint > "$O/lint.txt" 2>&1; log "lint rc=$? $(tail -2 "$O/lint.txt" | tr '\n' ' ')"
npm run typecheck > "$O/typecheck.txt" 2>&1; log "typecheck rc=$?"
npm run build > "$O/build.txt" 2>&1; log "build rc=$?"
N=$(NODE_OPTIONS=--max-old-space-size=128 node ./node_modules/vitest/vitest.mjs run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'); log "skip count (local binary, heap 128): ${N:-UNKNOWN}"
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count "${N:-x}" > "$O/skip-integrity.txt" 2>&1; log "skip-integrity rc=$? $(tr '\n' ' ' < "$O/skip-integrity.txt")"
node tools/grugops/lane-inventory.js > "$O/lane-inventory.txt" 2>&1; log "lane-inventory rc=$? $(tail -1 "$O/lane-inventory.txt")"
for r in 1 2 3; do
  order="base head"; [ $((r % 2)) -eq 0 ] && order="head base"
  for side in $order; do
    T=$W; [ $side = base ] && T=$B
    cd "$T"; l=$(cut -d' ' -f1 /proc/loadavg)
    npm test > "$O/npmtest-$side-$r.txt" 2>&1; rc=$?
    log "G8 round $r $side rc=$rc load1=$l $(grep -E 'Tests |Duration' "$O/npmtest-$side-$r.txt" | tr -s ' ' | tr '\n' ' ')"
  done
done
log "temp: $(sensors 2>/dev/null | grep -i tctl | tr -s ' ')"
