#!/bin/bash
# usage: ledger054.sh <sha> <build...>; one fresh git-archive copy per build; load1 logged per build.
SP=<scratchpad>/ABC-054; REPO=<repo>
SHA=$1; shift
for B in "$@"; do
  T=$SP/trees/$SHA-$B; rm -rf "$T"; mkdir -p "$T"
  git -C $REPO archive "$SHA" | tar -x -C "$T"
  ln -s $REPO/node_modules "$T/node_modules"
  python3 -I $SP/bin/plant054.py "$T" "$B" || { printf "%s\t%s\tPLANT-FAILED\n" "$SHA" "$B"; continue; }
  L=$(sysctl -n vm.loadavg | awk '{print $2}')
  O=$SP/out/$SHA-$B.txt
  (cd "$T" && node node_modules/vitest/vitest.mjs run src/history-pane.nfr.test.ts src/render-seam.test.ts > "$O" 2>&1); RC=$?
  FAILED=$(grep -E '^ +× ' "$O" | sed -E 's/^ +× //; s/ [0-9]+ms$//' | tr '\n' '|')
  printf "%s\t%s\texit=%s\tload1=%s\t%s\tFAILED:%s\n" "$SHA" "$B" "$RC" "$L" "$(grep -E '^ +Tests ' "$O" | tr -s ' ')" "$FAILED"
  grep -h A4-LIST "$O" | sort -u | sed 's/^/    /'
done
