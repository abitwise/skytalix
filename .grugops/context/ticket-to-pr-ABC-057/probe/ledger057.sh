#!/bin/bash
# usage: ledger057.sh <sha> <lane: file|src> <build...>; one fresh git-archive copy per build; load1 per build.
SP=<scratchpad>/ABC-057
REPO=<repo>
QE=$REPO/.grugops/context/qe-ABC-053/probe/plant.py
SHA=$1; LANE=$2; shift 2
for B in "$@"; do
  T=$SP/trees/$SHA-$B; rm -rf "$T"; mkdir -p "$T"
  git -C $REPO archive "$SHA" | tar -x -C "$T"
  ln -s $REPO/node_modules "$T/node_modules"
  python3 -I $SP/bin/plant057.py "$T" "$B" "$QE" || { printf "%s\t%s\tPLANT-FAILED\n" "$SHA" "$B"; continue; }
  L=$(sysctl -n vm.loadavg | awk '{print $2}')
  O=$SP/out/$SHA-$LANE-$B.txt
  if [ "$LANE" = src ]; then ARGS="--dir src"; else ARGS="src/history-pane.nfr.test.ts"; fi
  (cd "$T" && node node_modules/vitest/vitest.mjs run $ARGS > "$O" 2>&1); RC=$?
  FAILED=$(grep -E '^ +(×|FAIL) ' "$O" | sed -E 's/ [0-9]+ms$//' | sort -u | tr '\n' '|')
  printf "%s\t%s\t%s\texit=%s\tload1=%s\t%s\t%s\tFAILED:%s\n" "$SHA" "$LANE" "$B" "$RC" "$L" "$(grep -E '^ +Test Files ' "$O" | tr -s ' ')" "$(grep -E '^ +Tests ' "$O" | tr -s ' ')" "$FAILED"
  grep -h "AssertionError" "$O" | sort -u | head -3 | sed 's/^/    /'
done
