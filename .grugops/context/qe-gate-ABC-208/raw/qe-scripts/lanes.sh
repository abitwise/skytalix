#!/bin/bash
# QE qe-gate-ABC-208: deterministic deep lanes, real-clock rows filtered by name.
W=$1; OUT=$2; cd "$W" || exit 2
F='^(?!.*(real clock|REAL clock|wall clock|NFR-005|between a 1 s and a 3 s search)).*$'
run() { # env file
  local tag="$1_$(basename $2 .test.ts)"
  local t0=$(date +%s)
  env $1=$3 NODE_OPTIONS=--max-old-space-size=400 npx vitest run "$2" -t "$F" > "$OUT/lane-$tag.txt" 2>&1
  local rc=$?
  echo "$tag exit $rc $(( $(date +%s) - t0 ))s :: $(grep -E '^ +Tests ' "$OUT/lane-$tag.txt" | tr -s ' ')" >> "$OUT/lanes-summary.txt"
}
: > "$OUT/lanes-summary.txt"
for f in src/search.null-move.test.ts src/search.test.ts src/search.ordering.test.ts src/transposition.test.ts src/quiescence.test.ts src/search.pvs-lmr.test.ts; do run SEARCH_DEEP $f 1; done
for f in src/engine.test.ts src/levels.test.ts src/transposition.test.ts; do run ENGINE_DEEP $f 1; done
run PUZZLE_DEEP src/puzzle-suite.test.ts 1
echo DONE >> "$OUT/lanes-summary.txt"
