#!/bin/bash
# Usage: mutants.sh <commit> <label>  — fresh git-archive tree per mutant; runs src/cli.test.ts only.
set -u
REPO=<repo>
SP=$(cd "$(dirname "$0")/.." && pwd)
COMMIT=$1; LABEL=$2; T=$SP/trees/mut-$LABEL
for m in control q13-head q13-tail q13-posture q13-oneline prose-wrong-cmd; do
  rm -rf "$T"; mkdir -p "$T"; git -C "$REPO" archive "$COMMIT" | tar -x -C "$T"; ln -s "$REPO/node_modules" "$T/node_modules"
  node "$SP/probe/mutate.mjs" "$T" "$m" 2>/dev/null
  L=$(sysctl -n vm.loadavg | awk '{print $2}')
  OUT=$(cd "$T" && npx vitest run src/cli.test.ts 2>&1)
  RC=$?
  SUM=$(echo "$OUT" | grep -E '^ +Tests ' | sed 's/\x1b\[[0-9;]*m//g' | tr -s ' ')
  FAILED=$(echo "$OUT" | sed 's/\x1b\[[0-9;]*m//g' | grep -E '^ *(FAIL|×) ' | grep -v '^ *FAIL  *src/cli.test.ts$' | sed 's/^ *//' | sort -u | head -3 | tr '\n' '|')
  printf '%s\t%s\tload1=%s\texit=%s\t%s\t%s\n' "$LABEL" "$m" "$L" "$RC" "$SUM" "$FAILED"
done
rm -rf "$T"
