#!/usr/bin/env bash
# usage: sample.sh <treeName> — unpruned doors at depth 5 on the endgame + position-3 families (QE's ABC-235 sample)
set -uo pipefail
S=$(dirname "$(readlink -f "$0")")
cd "$S"
t=$1; n=8
export A1_UNPRUNED_DEPTH=5
export A1_FAMILIES=kq-corner,kr-corner,kqk-h8,kp-vs-k,krk-a-file,pawn-race,position-3
mkdir -p "smp-$t"
pids=()
start=$(date +%s)
for ((i=0;i<n;i++)); do
  node h/a1-sample.mjs "$S/$t" unpruned "$i/$n" > "smp-$t/$(printf %02d $i)" 2>>"smp-$t/err" & pids+=($!)
done
for p in "${pids[@]}"; do wait "$p"; done
cat "smp-$t"/[0-9]* > "sample-$t.jsonl"
echo "$t wall $(( $(date +%s) - start )) s"; wc -l "sample-$t.jsonl"; sha256sum "sample-$t.jsonl"
