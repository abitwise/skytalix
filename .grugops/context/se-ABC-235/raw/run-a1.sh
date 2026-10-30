#!/usr/bin/env bash
# usage: run-a1.sh <treeDir> <outFile> [shards]
set -euo pipefail
S=$(dirname "$(readlink -f "$0")")
tree=$1; outf=$2; n=${3:-6}
tmp=$(mktemp -d "$S/a1tmp.XXXX")
node "$S/a1.mjs" "$tree" corpus > "$tmp/0-corpus" 2>/dev/null
node "$S/a1.mjs" "$tree" lists > "$tmp/1-lists" 2>/dev/null
node "$S/a1.mjs" "$tree" choose > "$tmp/2-choose" 2>/dev/null
pids=()
for part in search doors unpruned; do
  for ((i=0;i<n;i++)); do
    node "$S/a1.mjs" "$tree" $part $i/$n > "$tmp/3-$part-$(printf %02d $i)" 2>>"$tmp/err" & pids+=($!)
  done
  for p in "${pids[@]}"; do wait $p; done; pids=()
done
cat $(ls "$tmp"/[0-9]-* | sort) > "$outf"
cat "$tmp/err" >&2
rm -rf "$tmp"
wc -l "$outf"; sha256sum "$outf"
