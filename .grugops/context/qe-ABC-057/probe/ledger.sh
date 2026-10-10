#!/bin/bash
# QE ABC-057. usage: ledger.sh <sha> <lane: file|src> <build...>
# One fresh git-archive copy per build, node_modules linked, load1 logged per build.
# Columns: sha lane build exit load1 files tests FAILED: <failing tests> | lint=<biome check src exit> tsc=<tsc exit>
SP=<scratchpad>/qe-ABC-057
REPO=<repo>
QE053=$REPO/.grugops/context/qe-ABC-053/probe/plant.py
SHA=$1; LANE=$2; shift 2
for B in "$@"; do
  T=$SP/trees/$SHA-$LANE-$B; rm -rf "$T"; mkdir -p "$T"
  git -C $REPO archive "$SHA" | tar -x -C "$T"
  ln -s $REPO/node_modules "$T/node_modules"
  python3 -I $SP/bin/plantqe057.py "$T" "$B" "$QE053" || { printf "%s\t%s\t%s\tPLANT-FAILED\n" "$SHA" "$LANE" "$B"; continue; }
  L=$(sysctl -n vm.loadavg | awk '{print $2}')
  O=$SP/out/$SHA-$LANE-$B.txt
  if [ "$LANE" = src ]; then ARGS="--dir src"; else ARGS="src/history-pane.nfr.test.ts"; fi
  (cd "$T" && node node_modules/vitest/vitest.mjs run $ARGS > "$O" 2>&1); RC=$?
  (cd "$T" && node node_modules/@biomejs/biome/bin/biome check src > "$O.lint" 2>&1); LRC=$?
  (cd "$T" && node node_modules/typescript/bin/tsc --noEmit > "$O.tsc" 2>&1); TRC=$?
  FAILED=$(grep -E '^ +FAIL ' "$O" | sed -E 's/ [0-9]+ms$//; s/^ +FAIL +//' | sort -u | tr '\n' '|')
  printf "%s\t%s\t%s\texit=%s\tload1=%s\t%s\t%s\tlint=%s\ttsc=%s\tFAILED:%s\n" "$SHA" "$LANE" "$B" "$RC" "$L" "$(grep -E '^ +Test Files ' "$O" | tr -s ' ')" "$(grep -E '^ +Tests ' "$O" | tr -s ' ')" "$LRC" "$TRC" "$FAILED"
  grep -h -E "AssertionError|Error:" "$O" | sed -E 's/^ +//' | sort -u | head -3 | cut -c1-220 | sed 's/^/    /'
  rm -rf "$T"
done
