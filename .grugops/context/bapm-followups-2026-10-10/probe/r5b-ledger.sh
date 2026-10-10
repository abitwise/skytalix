#!/bin/bash
# ADR-0011 R5b (ABC-136) kill ledger, file lane. usage: r5b-ledger.sh <repo> <sha> <scratch-dir> <build...>
# One fresh git-archive copy per build, node_modules linked; planter is QE's, unchanged:
# .grugops/context/qe-ABC-057/probe/plantqe057.py (copied out of the repo before it runs).
REPO=$1; SHA=$2; SP=$3; shift 3
mkdir -p "$SP/bin" "$SP/trees" "$SP/out"
cp "$REPO/.grugops/context/qe-ABC-057/probe/plantqe057.py" "$SP/bin/"
for B in "$@"; do
  T=$SP/trees/$SHA-$B; rm -rf "$T"; mkdir -p "$T"
  git -C "$REPO" archive "$SHA" | tar -x -C "$T"; ln -s "$REPO/node_modules" "$T/node_modules"
  python3 -I "$SP/bin/plantqe057.py" "$T" "$B" none >/dev/null 2>&1 || { printf "%s\t%s\tPLANT-FAILED\n" "$SHA" "$B"; continue; }
  O=$SP/out/$SHA-$B.txt
  (cd "$T" && node node_modules/vitest/vitest.mjs run src/history-pane.nfr.test.ts > "$O" 2>&1); RC=$?
  F=$(grep -E '^ +(×|FAIL) ' "$O" | sed -E 's/ [0-9]+ms$//; s/^ +(×|FAIL) +//; s/.*> //' | sort -u | tr '\n' '|')
  printf "%s\t%s\texit=%s\t%s\tFAILED:%s\n" "$SHA" "$B" "$RC" "$(grep -E '^ +Tests ' "$O" | tr -s ' ')" "$F"
done
