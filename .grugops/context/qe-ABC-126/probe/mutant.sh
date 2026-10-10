#!/bin/bash
# mutant.sh <name> <file> <json> <vitest args...>   fresh archive copy of efcda60d, one plant, one run.
set -u
SP=/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/e0dd4cf5-83f1-4fb6-bb33-18c0c2394948/scratchpad/qe-ABC-126
WT=/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/.claude/worktrees/ABC-126-corpus-repairs
name=$1; file=$2; json=$3; shift 3
D=$SP/mutants/$name; rm -rf "$D"; mkdir -p "$D"
git -C "$WT" archive efcda60d | tar -x -C "$D"
ln -s /Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/node_modules "$D/node_modules"
node "$SP/scripts/plant.mjs" "$D" "$file" "$json" || exit 2
if [ -n "${PLANT2_FILE:-}" ]; then node "$SP/scripts/plant.mjs" "$D" "$PLANT2_FILE" "$PLANT2_JSON" || exit 2; fi
O=$SP/out/mutant-$name.txt
{ echo "MUTANT $name  $(date -u +%FT%TZ) load1 $(uptime | sed 's/.*load averages*: //')"; (cd "$D" && env "$@" 2>&1); echo "EXIT $?"; } > "$O" 2>&1
echo "== $name: $(grep -E '^EXIT' $O) | $(grep -E '^ +Tests ' $O | head -1 | xargs)"; grep -E "AssertionError|^ +FAIL |✗|×" "$O" | head -6
