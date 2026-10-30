#!/usr/bin/env bash
# The SE's run-a1.sh, unchanged in its file layout (corpus, lists, choose, then search/doors/unpruned in 6 shards,
# concatenated in name order), but ONE PROCESS AT A TIME (QE runs alone). usage: run-a1-seq.sh <treeDir> <outFile>
set -euo pipefail
S=$(dirname "$(readlink -f "$0")"); tree=$1; outf=$2; n=6
tmp=$(mktemp -d "$S/a1tmp.XXXX")
node "$S/a1.mjs" "$tree" corpus > "$tmp/0-corpus" 2>>"$tmp/err"
node "$S/a1.mjs" "$tree" lists > "$tmp/1-lists" 2>>"$tmp/err"
node "$S/a1.mjs" "$tree" choose > "$tmp/2-choose" 2>>"$tmp/err"
for part in search doors unpruned; do
  for ((i=0;i<n;i++)); do node "$S/a1.mjs" "$tree" $part $i/$n > "$tmp/3-$part-$(printf %02d $i)" 2>>"$tmp/err"; done
done
cat $(ls "$tmp"/[0-9]-* | sort) > "$outf"
cat "$tmp/err" >&2; rm -rf "$tmp"
wc -l "$outf"; sha256sum "$outf"
