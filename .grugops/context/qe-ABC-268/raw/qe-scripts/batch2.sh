#!/usr/bin/env bash
# qe-ABC-268 batch 2 (run under flock): QE A1 + export diff, independent A3/A4 + ABC-229 re-points, cut audit
# (QE hook on head + probe instrument sample on base), deep lanes, plants. usage: batch2.sh <scratch> <worktree>
set -uo pipefail
S=$1; W=$2; O=$S/out; mkdir -p $O/a1 $O/a34 $O/audit $O/deep $O/plants
ts() { date -u +%FT%TZ; }
lt() { echo "$1 $(ts) load1=$(cut -d' ' -f1 /proc/loadavg)" >> $O/times.txt; }
lt "batch2 start"
t0=$(date +%s); node $S/scripts/qe-a1.mjs $S/base $S/head all > $O/a1/a1.txt 2>&1; echo "rc=$? secs=$(( $(date +%s)-t0 ))" >> $O/a1/a1.txt
node $S/scripts/exports.mjs $S/base $S/head > $O/a1/exports.txt 2>&1; lt "a1 done"
t0=$(date +%s); (cd $S/audit-head && node qe-audit.ts fire 6 10) > $O/audit/fire.txt 2>&1; echo "rc=$? secs=$(( $(date +%s)-t0 ))" >> $O/audit/fire.txt
t0=$(date +%s); (cd $S/audit-head && node qe-audit.ts audit 6 10 $O/audit/sample-head.txt) > $O/audit/audit.txt 2>&1; echo "rc=$? secs=$(( $(date +%s)-t0 ))" >> $O/audit/audit.txt
t0=$(date +%s); (cd $S/probe-base && node probe-sample.ts $O/audit/sample-probe.txt) > $O/audit/probe-sample.txt 2>&1; echo "rc=$? secs=$(( $(date +%s)-t0 ))" >> $O/audit/probe-sample.txt
cmp $O/audit/sample-head.txt $O/audit/sample-probe.txt > $O/audit/cmp.txt 2>&1; echo "cmp rc=$?" >> $O/audit/cmp.txt; lt "audit done"
t0=$(date +%s); node $S/scripts/qe-a34.mjs $S/base $S/head all > $O/a34/a34.jsonl 2> $O/a34/err.txt; echo "rc=$? secs=$(( $(date +%s)-t0 ))" >> $O/a34/err.txt; lt "a34 done"
cd $W
lane() { local tag=$1 var=$2 f=$3; shift 3; local t0=$(date +%s)
  env "$var=1" NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run "src/$f.test.ts" "$@" > $O/deep/$tag.txt 2>&1; local rc=$?
  echo "$tag rc=$rc secs=$(( $(date +%s)-t0 )) load1=$(cut -d' ' -f1 /proc/loadavg) $(grep -E '^ +Tests ' $O/deep/$tag.txt | tr -s ' ' | head -1)" | tee -a $O/deep/summary.txt; }
lane SEARCH_DEEP-search.futility SEARCH_DEEP search.futility --reporter=verbose
lane SEARCH_DEEP-search.null-move SEARCH_DEEP search.null-move --reporter=verbose
lane SEARCH_DEEP-search SEARCH_DEEP search
lane SEARCH_DEEP-quiescence SEARCH_DEEP quiescence --reporter=verbose
lane SEARCH_DEEP-search.pvs-lmr SEARCH_DEEP search.pvs-lmr
lane PUZZLE_DEEP-puzzle-suite PUZZLE_DEEP puzzle-suite --reporter=verbose
lane ENGINE_DEEP-engine ENGINE_DEEP engine --reporter=verbose
lt "deep done"
$S/scripts/plants.sh $S $O/plants > /dev/null 2>&1
lt "plants done"
