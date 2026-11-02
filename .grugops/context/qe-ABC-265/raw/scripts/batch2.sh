#!/usr/bin/env bash
# qe-ABC-265 batch 2 (each command under its own flock): deep lanes + G1, G7, A3 (QE sample, full), plants.
# usage: batch2.sh <scratch> <worktree> <outDir> <lock>
set -uo pipefail
S=$1; W=$2; O=$3; L=$4; mkdir -p $O/deep $O/g7 $O/a3 $O/plants
ts() { date -u +%FT%TZ; }
echo "batch2 start $(ts) load1=$(cut -d' ' -f1 /proc/loadavg)" >> $O/times.txt
cd $W
lane() { local tag=$1 var=$2 f=$3; shift 3; local t0=$(date +%s)
  flock $L env "$var=1" NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run "src/$f.test.ts" "$@" > $O/deep/$tag.txt 2>&1; local rc=$?
  echo "$tag rc=$rc secs=$(( $(date +%s)-t0 )) load1=$(cut -d' ' -f1 /proc/loadavg) $(grep -E '^ +Tests ' $O/deep/$tag.txt | tr -s ' ' | head -1)" | tee -a $O/deep/summary.txt; }
lane SEARCH_DEEP-transposition SEARCH_DEEP transposition --reporter=verbose
lane ENGINE_DEEP-transposition ENGINE_DEEP transposition --reporter=verbose
lane SEARCH_DEEP-search.null-move SEARCH_DEEP search.null-move --reporter=verbose
lane SEARCH_DEEP-search.pvs-lmr SEARCH_DEEP search.pvs-lmr
lane SEARCH_DEEP-search SEARCH_DEEP search
lane PUZZLE_DEEP-puzzle-suite PUZZLE_DEEP puzzle-suite --reporter=verbose
lane ENGINE_DEEP-engine ENGINE_DEEP engine --reporter=verbose
echo "deep done $(ts)" >> $O/times.txt
for pos in kiwipete position-6; do for t in base head; do
  flock $L node --expose-gc $S/scripts/g7.mjs $S/$t $pos >> $O/g7/g7.jsonl 2>> $O/g7/err.txt
done; done
echo "g7 done $(ts)" >> $O/times.txt
t0=$(date +%s); flock $L node $S/scripts/a3q.mjs $S/base $S/head > $O/a3/a3.txt 2>&1; echo "rc=$? secs=$(( $(date +%s)-t0 ))" >> $O/a3/a3.txt
echo "a3 done $(ts)" >> $O/times.txt
bash $S/scripts/plants.sh $S $O/plants $L > /dev/null 2>&1
echo "plants done $(ts) load1=$(cut -d' ' -f1 /proc/loadavg)" >> $O/times.txt
