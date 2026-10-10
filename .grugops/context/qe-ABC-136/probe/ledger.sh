#!/bin/bash
# QE ABC-136 ledger. usage: ledger.sh <repo> <sha> <scratch> <build...>
# One fresh git-archive per build, node_modules linked; plantqe136.py (delegates non-X tokens to plantqe057.py unchanged).
REPO=$1; SHA=$2; SP=$3; shift 3
for B in "$@"; do
  T=$SP/trees/$SHA-$B; rm -rf "$T"; mkdir -p "$T"
  git -C "$REPO" archive "$SHA" | tar -x -C "$T"; ln -s "$REPO/node_modules" "$T/node_modules"
  L1=$(sysctl -n vm.loadavg | awk '{print $2}')
  python3 -I "$SP/bin/plantqe136.py" "$T" "$B" > "$SP/out/$SHA-$B.plant.txt" 2>&1 || { printf "%s\t%s\tload1=%s\tPLANT-FAILED\n" "${SHA:0:8}" "$B" "$L1"; continue; }
  O=$SP/out/$SHA-$B.txt
  (cd "$T" && node node_modules/vitest/vitest.mjs run src/history-pane.nfr.test.ts > "$O" 2>&1); RC=$?
  (cd "$T" && node node_modules/@biomejs/biome/bin/biome check src > "$SP/out/$SHA-$B.lint.txt" 2>&1); LRC=$?
  LW=$(grep -Eo 'Found [0-9]+ (warning|error)s?' "$SP/out/$SHA-$B.lint.txt" | tr '\n' ' ')
  F=$(grep -E '^ +(×|FAIL) ' "$O" | sed -E 's/ [0-9]+ms$//; s/^ +(×|FAIL) +//; s/.*> //' | sort -u | tr '\n' '|')
  printf "%s\t%s\tload1=%s\texit=%s\t%s\tlint=%s %s\tFAILED:%s\n" "${SHA:0:8}" "$B" "$L1" "$RC" "$(grep -E '^ +Tests ' "$O" | tr -s ' ')" "$LRC" "$LW" "$F"
done
