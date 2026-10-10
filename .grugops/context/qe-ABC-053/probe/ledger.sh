#!/bin/bash
# QE ABC-053 — usage: ledger.sh <sha> <node-binary> <build...>
# One fresh `git archive` copy per build; never touches the worktree. load1 logged per build.
SP=<scratchpad>/qe-ABC-053
REPO=<repo>
SHA=$1; NODE=$2; shift 2
TAG=$(basename "$(dirname "$NODE")")-$("$NODE" --version)
for B in "$@"; do
  T=$SP/trees/$B; rm -rf "$T"; mkdir -p "$T"
  git -C $REPO archive "$SHA" | tar -x -C "$T"
  ln -s $REPO/node_modules "$T/node_modules"
  python3 -I $SP/bin/plant.py "$T" "$B" || { printf "%s\tPLANT-FAILED\n" "$B"; continue; }
  L=$(sysctl -n vm.loadavg | awk '{print $2}')
  O=$SP/out/$B.$TAG.txt
  (cd "$T" && "$NODE" node_modules/vitest/vitest.mjs run src/history-pane.nfr.test.ts src/render-seam.test.ts > "$O" 2>&1); RC=$?
  FAILS=$(grep -E "^ *(AssertionError|Error|TypeError): " "$O" | sed -E 's/^ *//; s/(: expected .{0,70}).*/\1/' | sort -u | tr '\n' '|')
  printf "%s\t%s\texit=%s\tload1=%s\t%s\t%s\n" "$B" "$TAG" "$RC" "$L" "$(grep -E '^ +Tests ' "$O" | tr -s ' ')" "$FAILS"
done
