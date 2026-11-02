#!/usr/bin/env bash
# qe-ABC-268-p2 step 1 gates (under flock): lint, typecheck, build, npm test once. usage: gates.sh <worktree> <outDir>
set -uo pipefail
W=$1; O=$2; cd $W
ts() { date -u +%FT%TZ; }
echo "start $(ts) load1=$(cut -d' ' -f1 /proc/loadavg)" > $O/times.txt
for g in lint typecheck build test; do npm run $g > $O/$g.txt 2>&1; echo "$g rc=$? $(ts)" | tee -a $O/times.txt; done
rm -rf "${W:?}/dist"
grep -E '^ +(Test Files|Tests|Duration) ' $O/test.txt | tr -s ' ' | tee -a $O/times.txt
