#!/usr/bin/env bash
# usage: run-id.sh  (from the scratch dir holding base/ and head/)
set -euo pipefail
S=$(dirname "$(readlink -f "$0")")
cd "$S"
for part in corpus choose choose-empty clock0 doors-prior level level-empty nonvac; do
  node id.mjs "$S/base" "$part" > "out-base-$part.jsonl" &
  b=$!
  node id.mjs "$S/head" "$part" > "out-head-$part.jsonl" &
  h=$!
  wait $b; wait $h
  hb=$(sha256sum < "out-base-$part.jsonl" | cut -c1-16)
  hh=$(sha256sum < "out-head-$part.jsonl" | cut -c1-16)
  n=$(wc -l < "out-head-$part.jsonl")
  if [ "$hb" = "$hh" ]; then v=EQUAL; else v=DIFFER; fi
  echo "$part rows=$n base=$hb head=$hh $v"
done
