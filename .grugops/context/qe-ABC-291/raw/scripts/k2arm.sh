#!/bin/bash
# qe-ABC-291: K2's arm T, and the base arm's count. usage: k2arm.sh <qe-scratch> <lock> <worktree> <base sha> <candidate sha>
# B = a full tree of the merge-base; T = B with the tip's production and tool files. The lane on each, one hold, one core. Both are deleted after.
Q=$1 L=$2 W=$3 BS=$4 C=$5 O=$Q/out/k2; mkdir -p "$O"; A=$Q/k2arm; rm -rf "$A"; mkdir -p "$A"
git -C "$W" archive "$BS" | tar -x -C "$A"; ln -s "$(readlink -f "$W/node_modules")" "$A/node_modules"
lane() { n=$1; st=$(date +%s); (cd "$A" && flock "$L" taskset -c 0 npm test > "$O/$n.log" 2>&1); echo -e "$n\texit=$?\tsecs=$(( $(date +%s)-st ))\t$(sed 's/\x1b\[[0-9;]*m//g' "$O/$n.log" | grep -E '^ +(Tests|Test Files) ' | sed 's/  */ /g' | tr '\n' ' ')" >> "$O/exits.tsv"; cp "$A/.test-results/last-run.json" "$O/$n.json"; }
: > "$O/exits.tsv"; lane B
for f in src/evaluate.ts src/evaluate-params.ts src/search.ts src/engine.ts src/quiescence.ts tools/tune/tracer.ts tools/tune/tune.ts; do git -C "$W" show "$C:$f" > "$A/$f"; done
lane T
rm -rf "$A"; echo "DONE arm deleted $(date -u +%FT%TZ)" >> "$O/exits.tsv"
