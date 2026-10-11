#!/usr/bin/env bash
# QE ABC-094 mutant runner. Usage: mutants.sh <worktree> <scratch dir outside the repo>
# Copies the worktree to <scratch>/tree (no .git, plans, memory-bank, .grugops, .claude), then for each row of
# mutants.tsv: restores the delivered src/book.ts, applies the perl substitution(s), checks the file changed,
# runs the engineer's suite (npx vitest run src/book.test.ts, JSON) and QE's harness (qe-harness.ts).
# Prints one TSV row per mutant; never touches the worktree.
set -u
PROBE="$(cd "$(dirname "$0")" && pwd)"
WT="$1"; T="$2/tree"
rm -rf "$T"; mkdir -p "$T"
rsync -a --exclude .git --exclude node_modules --exclude .grugops --exclude plans --exclude memory-bank --exclude .claude "$WT/" "$T/"
ln -s "$(cd "$WT/node_modules" && pwd -P)" "$T/node_modules"
ORIG="$2/book.ts.orig"; cp "$WT/src/book.ts" "$ORIG"
printf 'id\tload1\tsuite_failed\tsuite_total\tharness_fails\tharness_failing_tags\tdesc\n'
while IFS=$'\t' read -r id desc expr; do
  [ -z "$id" ] && continue
  cp "$ORIG" "$T/src/book.ts"
  perl -0pi -e "$expr" "$T/src/book.ts"   # one perl program; multi-part rows are separate statements
  if cmp -s "$ORIG" "$T/src/book.ts"; then printf '%s\t-\tNOT-APPLIED\t-\t-\t-\t%s\n' "$id" "$desc"; continue; fi
  load1=$(sysctl -n vm.loadavg | awk '{print $2}')
  (cd "$T" && npx vitest run src/book.test.ts --reporter=json --outputFile="$2/$id.json" >/dev/null 2>&1)
  sf=$(jq '.numFailedTests' "$2/$id.json" 2>/dev/null || echo ERR); st=$(jq '.numTotalTests' "$2/$id.json" 2>/dev/null || echo ERR)
  node "$PROBE/qe-harness.ts" "$T" > "$2/$id.harness.txt" 2>&1
  hf=$(grep -c '^FAIL' "$2/$id.harness.txt"); tags=$(grep '^FAIL' "$2/$id.harness.txt" | awk '{print $2}' | sort | uniq -c | awk '{printf "%s%s×%s", (NR>1?",":""), $2, $1}')
  printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\n' "$id" "$load1" "$sf" "$st" "$hf" "${tags:--}" "$desc"
done < "$PROBE/mutants.tsv"
cp "$ORIG" "$T/src/book.ts"; cmp "$ORIG" "$WT/src/book.ts" && echo "worktree src/book.ts unchanged (cmp 0)"
