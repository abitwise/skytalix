#!/bin/bash
# QE qe-gate-ABC-208: the 14 moved rows, each tree's code against the other's tests.
M=$1; OUT=$2
for t in bb hh bh hb; do
  cd "$M/$t" || exit 2
  NODE_OPTIONS=--max-old-space-size=128 npx vitest run src/search.test.ts src/engine.test.ts src/search.pvs-lmr.test.ts \
    --reporter=verbose --reporter=json --outputFile.json="$OUT/audit-$t-default.json" > "$OUT/audit-$t-default.txt" 2>&1
  echo "$t default exit $?" >> "$OUT/audit-summary.txt"
  SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/search.pvs-lmr.test.ts \
    --reporter=verbose --reporter=json --outputFile.json="$OUT/audit-$t-deep.json" > "$OUT/audit-$t-deep.txt" 2>&1
  echo "$t deep exit $?" >> "$OUT/audit-summary.txt"
done
echo DONE >> "$OUT/audit-summary.txt"
