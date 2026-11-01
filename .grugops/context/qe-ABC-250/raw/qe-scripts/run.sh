#!/bin/bash
# qe-ABC-250: the whole timing read (A4 perft, then A5 search) under D3-V2, run INSIDE `flock host-test.lock` (the caller
# wraps this script; the lock is held from the first wait to the last run). Built from qe-ABC-254-a4v2's run.sh.
# usage: flock <lock> bash run.sh <scratchDir> <rawDir> <scriptsDir>
set -u
S=$1; R=$2; Q=$3
mkdir -p "$R/a4" "$R/a5"
t() { echo "$1 $(date -u +%FT%TZ)" >> "$R/times.txt"; }
t lock-acquired
export CLEAR_DEADLINE=$(date -u -d '+45 min' +%FT%TZ)
echo "clear-deadline $CLEAR_DEADLINE" >> "$R/times.txt"
sched() { # dir kind boards
  local d=$1 k=$2 boards=$3 owed rc
  t "$k-main-start"
  node "$Q/ab.mjs" "$S/trees" "$R/$d/$d.jsonl" "$boards" main "$k"; rc=$?
  t "$k-main-end rc=$rc"
  [ $rc -ne 0 ] && return $rc
  node "$Q/analyse.mjs" "$R/$d/$d.jsonl" > "$R/$d/analysis-main.jsonl"
  owed=$(node "$Q/grade.mjs" "$k" "$R/$d/analysis-main.jsonl" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s).owed.join(",")))')
  echo "$k-rerun-owed [$owed]" >> "$R/times.txt"
  if [ -n "$owed" ]; then
    t "$k-rerun-start"
    node "$Q/ab.mjs" "$S/trees" "$R/$d/$d-rerun.jsonl" "$owed" rerun "$k"; rc=$?
    t "$k-rerun-end rc=$rc"
    [ $rc -ne 0 ] && return $rc
    node "$Q/analyse.mjs" "$R/$d/$d-rerun.jsonl" > "$R/$d/analysis-rerun.jsonl"
    node "$Q/grade.mjs" "$k" "$R/$d/analysis-main.jsonl" "$R/$d/analysis-rerun.jsonl" > "$R/$d/grade.json"
  else
    node "$Q/grade.mjs" "$k" "$R/$d/analysis-main.jsonl" > "$R/$d/grade.json"
  fi
}
sched a4 perft kiwipete,position-6,start,position-3,position-4,position-5 || { t "a4-stopped rc=$?"; exit 4; }
sched a5 search kiwipete,position-6,start || { t "a5-stopped rc=$?"; exit 4; }
node "$Q/g56.mjs" "$R/a5/a5.jsonl" "$R/a5/a5-rerun.jsonl" > "$R/a5/g56.json"
t done
