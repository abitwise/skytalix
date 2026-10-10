#!/bin/bash
# usage: ledger.sh <sha> <build...>   — one fresh out-of-tree copy per build
SP=<scratchpad>/ABC-053
REPO=<repo>
SHA=$1; shift
for B in "$@"; do
  T=$SP/trees/$B; rm -rf "$T"; mkdir -p "$T"
  git -C $REPO archive "$SHA" | tar -x -C "$T"
  ln -s $REPO/node_modules "$T/node_modules"
  python3 $SP/bin/mutate.py "$T" "$B" || { echo "$B MUTATE-FAILED"; continue; }
  L=$(sysctl -n vm.loadavg | awk '{print $2}')
  (cd "$T" && npx vitest run src/history-pane.nfr.test.ts src/render-seam.test.ts > $SP/out/$B.txt 2>&1); RC=$?
  FAILS=$(grep -E "(Assertion)?Error: " $SP/out/$B.txt | sed -E 's/^ *//; s/(: expected .{0,60}).*/\1/' | sort -u | tr '\n' '|')
  printf "%s\texit=%s\tload1=%s\t%s\t%s\n" "$B" "$RC" "$L" "$(grep -E '^ +Tests ' $SP/out/$B.txt | tr -s ' ')" "$FAILS"
done
