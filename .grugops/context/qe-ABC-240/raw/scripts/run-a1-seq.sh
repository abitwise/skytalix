#!/usr/bin/env bash
# A1 for one tree: the SE's run-a1.sh layout with 8 shards (corpus, lists, choose, then search/doors/unpruned in 8
# shards, joined in name order), but ONE PROCESS AT A TIME. The harness is se-ABC-235/raw/a1.mjs, unchanged.
# usage: run-a1-seq.sh <treeDir> <outFile> <workDir>
set -euo pipefail
S=$(dirname "$(readlink -f "$0")"); A1="$S/../../../se-ABC-235/raw/a1.mjs"
tree=$1; outf=$2; tmp=$(mktemp -d "$3/a1tmp.XXXX"); n=8
node "$A1" "$tree" corpus > "$tmp/0-corpus" 2>>"$tmp/err"
node "$A1" "$tree" lists > "$tmp/1-lists" 2>>"$tmp/err"
node "$A1" "$tree" choose > "$tmp/2-choose" 2>>"$tmp/err"
for part in search doors unpruned; do
  for ((i=0;i<n;i++)); do node "$A1" "$tree" $part $i/$n > "$tmp/3-$part-$(printf %02d $i)" 2>>"$tmp/err"; done
done
cat $(ls "$tmp"/[0-9]-* | sort) > "$outf"
cat "$tmp/err" >&2; rm -rf "$tmp"
wc -l < "$outf"; sha256sum < "$outf"
