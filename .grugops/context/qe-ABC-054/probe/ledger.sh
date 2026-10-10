#!/bin/bash
# QE ABC-054 ledger: one fresh git-archive copy per build; load1 per build. Usage: ledger.sh <sha> <build...>
# CHECKS=1 also runs tsc --noEmit and biome check src in the copy.
SP=<scratchpad>/qe-ABC-054
REPO=<repo>
export QE053_PLANT=$REPO/.claude/worktrees/ABC-054-consumers/.grugops/context/qe-ABC-053/probe/plant.py
SHA=$1; shift
for B in "$@"; do
  T=$SP/trees/$SHA-$B; rm -rf "$T"; mkdir -p "$T"
  git -C $REPO archive "$SHA" | tar -x -C "$T"
  ln -s $REPO/node_modules "$T/node_modules"
  python3 -I $SP/bin/plantqe.py "$T" "$B" > $SP/out/$SHA-$B.plant 2>&1 || { printf "%s\t%s\tPLANT-FAILED %s\n" "$SHA" "$B" "$(tail -1 $SP/out/$SHA-$B.plant)"; continue; }
  if [ -n "$AUTOFIX" ]; then
    (cd "$T" && node node_modules/@biomejs/biome/bin/biome check --write src > $SP/out/$SHA-$B.autofix 2>&1)
    B="$B+AUTOFIX"
  fi
  L=$(sysctl -n vm.loadavg | awk '{print $2}')
  O=$SP/out/$SHA-$B.txt
  (cd "$T" && node node_modules/vitest/vitest.mjs run src/history-pane.nfr.test.ts src/render-seam.test.ts > "$O" 2>&1); RC=$?
  FAILED=$(grep -E '^ +× ' "$O" | sed -E 's/^ +× //; s/ [0-9]+ms$//' | tr '\n' '|')
  EXTRA=""
  if [ -n "$CHECKS" ]; then
    (cd "$T" && node node_modules/typescript/bin/tsc --noEmit -p . > $SP/out/$SHA-$B.tsc 2>&1); TRC=$?
    (cd "$T" && node node_modules/@biomejs/biome/bin/biome check src > $SP/out/$SHA-$B.biome 2>&1); BRC=$?
    EXTRA="tsc=$TRC biome=$BRC"
  fi
  printf "%s\t%s\texit=%s\tload1=%s\t%s\t%s\tFAILED:%s\n" "$SHA" "$B" "$RC" "$L" "$(grep -E '^ +Tests ' "$O" | tr -s ' ')" "$EXTRA" "$FAILED"
  node $SP/bin/consumers.cjs "$T" 2>/dev/null | sed 's/^/    /'
  [ -n "$SHOWIMPORTS" ] && { echo "    -- $SHOWIMPORTS import lines:"; awk '/^(import|\/\*|\*\/)/,/;$|\*\//' "$T/src/$SHOWIMPORTS" | sed 's/^/      | /'; }
done
