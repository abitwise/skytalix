#!/usr/bin/env bash
# qe-ABC-255 A7 gates at the QE worktree HEAD, then the mutation set. Run inside flock.
set -u
SP=<scratch>/qe-255
W=<worktree>
R=$SP/run/gates; mkdir -p $R; L=$R/gates.txt
log() { echo "== $(date -u +%FT%TZ) load1=$(cut -d' ' -f1 /proc/loadavg) $*" | tee -a $L; }
cd $W
log "acquired HEAD=$(git rev-parse --short HEAD)"
[ -d node_modules ] || { npm ci > $R/npm-ci.txt 2>&1; log "npm ci rc=$?"; }
npm run lint > $R/lint.txt 2>&1; log "lint rc=$?"
npm run typecheck > $R/typecheck.txt 2>&1; log "typecheck rc=$?"
npm run build > $R/build.txt 2>&1; log "build rc=$?"
s=$(date +%s.%N); npm test > $R/test.txt 2>&1; rc=$?; log "test rc=$rc wall=$(echo "$(date +%s.%N) - $s" | bc)"
grep -E "Test Files|Tests " $R/test.txt | tee -a $L
sk=$(NODE_OPTIONS=--max-old-space-size=128 npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'); log "skip-count=$sk"
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count ${sk:-UNKNOWN} > $R/skip.txt 2>&1; log "skip-integrity rc=$? $(tail -1 $R/skip.txt)"
node tools/grugops/lane-inventory.js > $R/lane.txt 2>&1; log "lane-inventory rc=$? $(tail -1 $R/lane.txt)"
set -a; . $SP/tools.env; set +a
node --test tools/rating/pair-check.ts > $R/pair-check.txt 2>&1; log "pair-check rc=$? $(grep -E '^# (tests|pass|fail|skipped|todo)' $R/pair-check.txt | tr '\n' ' ')"
git status --short | grep -v '^??' | tee -a $L
log "gates done; mutations next"
$SP/scripts/mut.sh $SP/run/mut
log "released"
