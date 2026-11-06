#!/bin/bash
# qe-ABC-303: P1 and P8 at the worktree (src equal to the candidate's), one lock hold each. usage: gates.sh <worktree> <out> <lock>
W=$1 O=$2 L=$3; mkdir -p "$O"; cd "$W" || exit 2; : > "$O/exits.tsv"
H="NODE_OPTIONS=--max-old-space-size=400"
g() { t=$1; shift; st=$(date +%s); flock "$L" taskset -c 0 "$@" > "$O/$t.log" 2>&1; rc=$?; echo -e "$t\texit=$rc\tsecs=$(( $(date +%s)-st ))\tbytes=$(wc -c < "$O/$t.log")\t$(sed 's/\x1b\[[0-9;]*m//g' "$O/$t.log" | grep -E '^ +Tests ' | tail -1 | sed 's/  */ /g')" >> "$O/exits.tsv"; }
g typecheck npm run typecheck
g lint npm run lint
g build npm run build
g npmtest npm test
sk=$(flock "$L" taskset -c 0 bash -c "NODE_OPTIONS=--max-old-space-size=128 npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'"); echo -e "skip-count\t${sk:-UNKNOWN}" >> "$O/exits.tsv"
g integrity node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count "${sk:-x}"
g inventory node tools/grugops/lane-inventory.js
g bundle-default npx vitest run src/search.bundle.test.ts --reporter=verbose
g bundle-deep env SEARCH_DEEP=1 $H npx vitest run src/search.bundle.test.ts --reporter=verbose
while IFS=$'\t' read -r id want var file pat; do
  [ -z "$id" ] && continue
  g "t-$id" env $var=1 $H timeout 900 npx vitest run "$file" -t "$pat"
  echo -e "t-$id\twant=$want" >> "$O/exits.tsv"
done < "$(dirname "$(readlink -f "$0")")/lines.tsv"
echo "DONE $(date -u +%FT%TZ)" >> "$O/exits.tsv"
