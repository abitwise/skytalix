#!/usr/bin/env bash
# qe-ABC-264 batch 2 (under flock): A1 cross-build + export diff, independent A3/A4, deep lanes, plants.
set -uo pipefail
S=$1; W=$2; O=$S/out; mkdir -p $O/a1 $O/a34 $O/deep
ts() { date -u +%FT%TZ; }
echo "batch2 start $(ts) load1=$(cut -d' ' -f1 /proc/loadavg)" >> $O/times.txt
t0=$(date +%s); node $S/scripts/a1.mjs $S/base $S/head > $O/a1/a1.txt 2>&1; echo "rc=$? secs=$(( $(date +%s)-t0 ))" >> $O/a1/a1.txt
node $S/scripts/exports.mjs $S/base $S/head > $O/a1/exports.txt 2>&1
echo "a1 done $(ts)" >> $O/times.txt
t0=$(date +%s); node $S/scripts/a34.mjs $S/base $S/head all > $O/a34/a34.jsonl 2> $O/a34/err.txt; echo "rc=$? secs=$(( $(date +%s)-t0 ))" >> $O/a34/err.txt
echo "a34 done $(ts)" >> $O/times.txt
cd $W
lane() { local tag=$1 var=$2 f=$3; shift 3; local t0=$(date +%s)
  env "$var=1" NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run "src/$f.test.ts" "$@" > $O/deep/$tag.txt 2>&1; local rc=$?
  echo "$tag rc=$rc secs=$(( $(date +%s)-t0 )) load1=$(cut -d' ' -f1 /proc/loadavg) $(grep -E '^ +Tests ' $O/deep/$tag.txt | tr -s ' ' | head -1)" | tee -a $O/deep/summary.txt; }
lane SEARCH_DEEP-search.reverse-futility SEARCH_DEEP search.reverse-futility --reporter=verbose
lane SEARCH_DEEP-search.null-move SEARCH_DEEP search.null-move --reporter=verbose
lane SEARCH_DEEP-search SEARCH_DEEP search
lane SEARCH_DEEP-quiescence SEARCH_DEEP quiescence
lane PUZZLE_DEEP-puzzle-suite PUZZLE_DEEP puzzle-suite --reporter=verbose
lane ENGINE_DEEP-engine ENGINE_DEEP engine --reporter=verbose
lane SEARCH_DEEP-search.pvs-lmr SEARCH_DEEP search.pvs-lmr
echo "deep done $(ts)" >> $O/times.txt
$S/scripts/plants.sh $S $O/plants > /dev/null 2>&1
echo "plants done $(ts) load1=$(cut -d' ' -f1 /proc/loadavg)" >> $O/times.txt
