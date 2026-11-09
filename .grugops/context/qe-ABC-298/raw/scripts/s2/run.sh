#!/bin/bash
# qe-ABC-298 SG3 (ADR-0077 d7): the whole read under D3-V2, run INSIDE the session's one hold of the host lock (session.sh).
# qe-ABC-254-a4v2's run.sh with the lines marked 298: s2.mjs in place of a4v2.mjs, the three boards, and the start cap at
# lock acquisition + 15 min (a cap reached stops the read unread; s2.mjs exits 5).
# usage: bash run.sh <treesDir holding B and H> <outDir> <s2 scripts dir>
set -u
S=$1; R=$2; Q=$3
mkdir -p "$R"
t() { echo "$1 $(date -u +%FT%TZ)" >> "$R/times.txt"; }
t sg3-start
export CLEAR_DEADLINE=$(date -u -d '+15 min' +%FT%TZ) # 298
echo "clear-deadline $CLEAR_DEADLINE" >> "$R/times.txt"
t main-start
node "$Q/s2.mjs" "$S" "$R/s2.jsonl" kiwipete,position-6,start main; rc=$? # 298
t "main-end rc=$rc"
[ $rc -ne 0 ] && exit $rc
node "$Q/analyse.mjs" "$R/s2.jsonl" > "$R/analysis-main.jsonl"
owed=$(node "$Q/grade.mjs" "$R/analysis-main.jsonl" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s).owed.join(",")))')
echo "rerun-owed [$owed]" >> "$R/times.txt"
if [ -n "$owed" ]; then
  export CLEAR_DEADLINE=$(date -u -d '+15 min' +%FT%TZ) # 298
  t rerun-start
  node "$Q/s2.mjs" "$S" "$R/s2-rerun.jsonl" "$owed" rerun; rc=$?
  t "rerun-end rc=$rc"
  [ $rc -ne 0 ] && exit $rc
  node "$Q/analyse.mjs" "$R/s2-rerun.jsonl" > "$R/analysis-rerun.jsonl"
  node "$Q/grade.mjs" "$R/analysis-main.jsonl" "$R/analysis-rerun.jsonl" > "$R/grade.json"
else
  node "$Q/grade.mjs" "$R/analysis-main.jsonl" > "$R/grade.json"
fi
t sg3-done
