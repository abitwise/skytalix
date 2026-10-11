#!/bin/bash
# Usage: depth-rounds.sh <rounds> <out> <label=root>...   alternates config order each round.
R=$1; OUT=$2; shift 2; CONF=("$@"); P=$(dirname "$0")
for ((r=1; r<=R; r++)); do
  if (( r % 2 == 1 )); then ORDER=("${CONF[@]}"); else ORDER=(); for ((i=${#CONF[@]}-1; i>=0; i--)); do ORDER+=("${CONF[$i]}"); done; fi
  for name in kiwipete position-6; do
    for c in "${ORDER[@]}"; do node "$P/depth.mjs" "${c#*=}" "${c%%=*}" "$name" "$r" | tee -a "$OUT"; done
  done
done
