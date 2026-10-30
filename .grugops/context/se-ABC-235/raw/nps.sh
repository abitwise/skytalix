#!/usr/bin/env bash
# usage: nps.sh <treeA> <treeB> <runs> <out.jsonl>   interleaved A,B per board, single process at a time
set -uo pipefail
S=$(dirname "$(readlink -f "$0")")
a=$1; b=$2; runs=$3; out=$4
for board in kiwipete position-6 start; do
  for ((r=0;r<runs;r++)); do
    for t in "$a" "$b"; do
      if pgrep -x cutechess-cli >/dev/null; then echo "{\"abort\":\"cutechess-cli running\"}" >> "$out"; exit 3; fi
      node "$S/nps.mjs" "$t" "$board" >> "$out"
    done
  done
done
