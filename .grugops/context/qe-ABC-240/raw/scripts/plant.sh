#!/usr/bin/env bash
# QE's own plant (A2), in a SCRATCH COPY of the tip, never in the repository: orderMoves returns ONE SHARED module
# array instead of a fresh one (a C4 violation; the SE planted C1, C2 and C3 faults, not this one).
# usage: plant.sh <copyDir> <outDir>   (copyDir = git archive of the tip, with node_modules linked to the worktree's)
set -uo pipefail
C=$(readlink -f "$1"); O=$(readlink -f "$2"); mkdir -p "$O"; cd "$C"
f=src/search.ts
grep -c "const out = moves.slice();" "$f" | grep -qx 1 || { echo "plant site not found"; exit 2; }
sed -i -e 's#^const ORDER_KEYS = new Float64Array(ORDER_SCRATCH_LENGTH);#const PLANT_OUT: Move[] = [];\n&#' \
  -e 's#^  const out = moves.slice();#  const out = PLANT_OUT; out.length = count; for (let k = 0; k < count; k++) out[k] = moves[k] as Move;#' "$f"
diff <(git -C "${QE_WORKTREE:?}" show 220ab978:src/search.ts) "$f" > "$O/plant.diff"
cat "$O/plant.diff"
NODE_OPTIONS=--max-old-space-size=128 ./node_modules/.bin/vitest run src/search.ordering.test.ts src/search.test.ts src/engine.test.ts > "$O/.raw" 2>&1; rc=$?
sed -e "s#$C#<copy>#g" -e "s#$HOME#<home>#g" "$O/.raw" > "$O/plant-run.txt"; rm -f "$O/.raw"
echo "planted run rc=$rc"; grep -E "^ +(Test Files|Tests) " "$O/plant-run.txt"; grep -E "^ +(×|✗|FAIL)" "$O/plant-run.txt" | head -40
