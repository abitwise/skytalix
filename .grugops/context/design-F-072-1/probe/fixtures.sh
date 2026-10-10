#!/bin/bash
# F-072-1: the 7 recorded pairs (ABC-072 A3/A5 + Security/NFR's) plus baselines at f76e041 and the current
# wave tip, x 3 limbs, through BOTH instruments. Prints one summary line per (pair, limb, instrument).
# usage, from the repository root: fixtures.sh <old clause-b.mjs> <new clause-b.mjs> <tip>
OLD=$1; NEW=$2; TIP=$3
sum() { grep -E '^  \(b1\)|^  \(b2\)|unresolved, listed|^  baseline|^  limb' <<<"$1" \
  | sed -E 's/^ +//; s/\(b1\) capability lines added or changed: /b1=/; s/\(b2\) new runtime import edges: ([0-9]+); reaching a holder of this limb at <head>: /edges=\1 b2=/; s/unresolved, listed \(a dispute -> the fail-safe\): /unresolved=/; s/baseline at <head>, STATE \(recorded, not a trigger\): //' \
  | grep -vE '^ +|^src/' | paste -sd'|' -; }
for pair in "dbaf972f^ dbaf972f" "34c9c026^ 34c9c026" "4c33b72b^1 4c33b72b" "460b9f58^1 460b9f58" \
            "088e48db~1 088e48db" "6bfc7b29 5f48753f" "f76e041 f76e041" "$TIP $TIP"; do
  set -- $pair
  for l in 1 2 3; do
    o=$(node "$OLD" $1 $2 $l); n=$(node "$NEW" $1 $2 $l)
    printf '%-22s L%s OLD %s\n' "$1..$2" $l "$(sum "$o")"
    printf '%-22s L%s NEW %s\n' "$1..$2" $l "$(sum "$n")"
  done
done
