#!/bin/bash
# qe-ABC-254-a4v2: the whole timing read under D3-V2, run INSIDE `flock host-test.lock` (the caller wraps this script;
# the lock is held from the first wait to the last run). usage: flock <lock> bash run.sh <scratchDir> <rawDir> <scriptsDir>
# Built from qe-ABC-254-a4's run.sh: a4v2.mjs in place of a4.mjs; the re-run list is grade.mjs's `owed`.
set -u
S=$1; R=$2; Q=$3
t() { echo "$1 $(date -u +%FT%TZ)" >> "$R/a4/times.txt"; }
t lock-acquired
export CLEAR_DEADLINE=$(date -u -d '+45 min' +%FT%TZ)
echo "clear-deadline $CLEAR_DEADLINE" >> "$R/a4/times.txt"
t main-start
node "$Q/a4v2.mjs" "$S/trees" "$R/a4/a4.jsonl" kiwipete,position-6,start,position-4 main; rc=$?
t "main-end rc=$rc"
[ $rc -ne 0 ] && exit $rc
node "$Q/analyse.mjs" "$R/a4/a4.jsonl" > "$R/a4/analysis-main.jsonl"
owed=$(node "$Q/grade.mjs" "$R/a4/analysis-main.jsonl" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s).owed.join(",")))')
echo "rerun-owed [$owed]" >> "$R/a4/times.txt"
if [ -n "$owed" ]; then
  t rerun-start
  node "$Q/a4v2.mjs" "$S/trees" "$R/a4/a4-rerun.jsonl" "$owed" rerun; rc=$?
  t "rerun-end rc=$rc"
  [ $rc -ne 0 ] && exit $rc
  node "$Q/analyse.mjs" "$R/a4/a4-rerun.jsonl" > "$R/a4/analysis-rerun.jsonl"
  node "$Q/grade.mjs" "$R/a4/analysis-main.jsonl" "$R/a4/analysis-rerun.jsonl" > "$R/a4/grade.json"
else
  node "$Q/grade.mjs" "$R/a4/analysis-main.jsonl" > "$R/a4/grade.json"
fi
t done
