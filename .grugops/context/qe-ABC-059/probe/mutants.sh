#!/bin/bash
# mutants.sh <commit> <label>  — one git-archive tree, AGENTS.md/package.json reset from pristine per mutant
set -u
REPO=<repo>
SP=$(cd "$(dirname "$0")" && pwd)
C=$1; L=$2; T=$SP/trees/$L; OUTF=$SP/mutants-$L.out.tsv
rm -rf "$T"; mkdir -p "$T"; git -C "$REPO" archive "$C" | tar -x -C "$T"; ln -s "$REPO/node_modules" "$T/node_modules"
cp "$T/AGENTS.md" "$SP/pristine-$L.AGENTS.md"; cp "$T/package.json" "$SP/pristine-$L.package.json"
: > "$OUTF"
for m in ${MUTANTS}; do
  node "$SP/mutate.mjs" "$T" "$m" "$SP/pristine-$L.AGENTS.md" "$SP/pristine-$L.package.json" "$SP" 2>>"$SP/mutate-$L.log" || { printf '%s\t%s\tMUTATE-FAILED\n' "$L" "$m" >> "$OUTF"; continue; }
  LD=$(sysctl -n vm.loadavg | awk '{print $2}')
  OUT=$(cd "$T" && npx vitest run src/cli.test.ts 2>&1 | sed 's/\x1b\[[0-9;]*m//g')
  RC=${PIPESTATUS[0]}
  SUM=$(echo "$OUT" | grep -E '^ +Tests ' | tr -s ' ')
  FAILED=$(echo "$OUT" | grep -E '^ *(×|FAIL) ' | grep -v 'FAIL *src/cli.test.ts *$' | sed 's/^ *//' | cut -c1-110 | sort -u | head -4 | tr '\n' '|')
  printf '%s\t%s\tload1=%s\t%s\t%s\n' "$L" "$m" "$LD" "$SUM" "$FAILED" >> "$OUTF"
done
cat "$OUTF"
