#!/usr/bin/env bash
# The unpruned doors at depth 5 on the six endgame families and position-3 (qe-ABC-235's sample), in the SE's 8-shard
# layout (se-ABC-240/raw/sample.sh), ONE PROCESS AT A TIME. Harness: qe-ABC-235/raw/scripts/a1-sample.mjs, unchanged.
# usage: sample-seq.sh <treeDir> <outFile> <workDir>
set -euo pipefail
S=$(dirname "$(readlink -f "$0")"); H="$S/../../../qe-ABC-235/raw/scripts/a1-sample.mjs"
tree=$1; outf=$2; tmp=$(mktemp -d "$3/smp.XXXX"); n=8
export A1_UNPRUNED_DEPTH=5
export A1_FAMILIES=kq-corner,kr-corner,kqk-h8,kp-vs-k,krk-a-file,pawn-race,position-3
for ((i=0;i<n;i++)); do node "$H" "$tree" unpruned "$i/$n" > "$tmp/$(printf %02d $i)" 2>>"$tmp/err"; done
cat "$tmp"/[0-9]* > "$outf"
cat "$tmp/err" >&2; rm -rf "$tmp"
wc -l < "$outf"; sha256sum < "$outf"
