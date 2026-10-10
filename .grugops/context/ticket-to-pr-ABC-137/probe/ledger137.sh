#!/bin/bash
# SE port (ABC-137) of QE's qe-ABC-136/probe/ledger.sh: same per-build steps and output columns,
# planter = plant137.mjs (port of plantqe136.py/plantqe057.py). usage: ledger137.sh <repo> <sha> <scratch> <build...>
REPO=$1; SHA=$2; SP=$3; shift 3
mkdir -p "$SP/trees" "$SP/out"
for B in "$@"; do
  T=$SP/trees/$SHA-$B; rm -rf "$T"; mkdir -p "$T"
  git -C "$REPO" archive "$SHA" | tar -x -C "$T"; ln -s "$REPO/node_modules" "$T/node_modules"
  L1=$(sysctl -n vm.loadavg | awk '{print $2}')
  node "$SP/bin/plant137.mjs" "$T" "$B" > "$SP/out/$SHA-$B.plant.txt" 2>&1 || { printf "%s\t%s\tload1=%s\tPLANT-FAILED\n" "${SHA:0:8}" "$B" "$L1"; continue; }
  O=$SP/out/$SHA-$B.txt
  (cd "$T" && node node_modules/vitest/vitest.mjs run src/history-pane.nfr.test.ts > "$O" 2>&1); RC=$?
  (cd "$T" && node node_modules/@biomejs/biome/bin/biome check src > "$SP/out/$SHA-$B.lint.txt" 2>&1); LRC=$?
  LW=$(grep -Eo 'Found [0-9]+ (warning|error)s?' "$SP/out/$SHA-$B.lint.txt" | tr '\n' ' ')
  F=$(grep -E '^ +(×|FAIL) ' "$O" | sed -E 's/ [0-9]+ms$//; s/^ +(×|FAIL) +//; s/.*> //' | sort -u | tr '\n' '|')
  printf "%s\t%s\tload1=%s\texit=%s\t%s\tlint=%s %s\tFAILED:%s\n" "${SHA:0:8}" "$B" "$L1" "$RC" "$(grep -E '^ +Tests ' "$O" | tr -s ' ')" "$LRC" "$LW" "$F"
done
