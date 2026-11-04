#!/usr/bin/env bash
# qe-ABC-279 lanes on the candidate tree, one at a time (run under ONE flock). usage: lanes.sh <worktree> <outdir>
cd "$1"; o=$2; mkdir -p "$o"; : > "$o/exits.txt"
echo "head=$(git rev-parse --short HEAD) src=$(git rev-parse --short HEAD:src) dirty=$(git status --porcelain -- src | wc -l) start $(date -u +%FT%TZ)" >> "$o/exits.txt"
lane() { tag=$1; env=$2; file=$3; s=$(date +%s); env $env NODE_OPTIONS=--max-old-space-size=400 timeout 1500 npx vitest run $file > "$o/$tag.out" 2>&1; echo "$tag exit $? $(( $(date +%s) - s ))s $(grep -E '^ +Tests ' "$o/$tag.out" | tr -s ' ')" >> "$o/exits.txt"; }
lane see-default X=0 src/see.test.ts
lane see-deep SEARCH_DEEP=1 src/see.test.ts
lane quiescence-deep SEARCH_DEEP=1 src/quiescence.test.ts
lane puzzle PUZZLE_DEEP=1 src/puzzle-suite.test.ts
lane nullmove-deep SEARCH_DEEP=1 src/search.null-move.test.ts
lane futility-deep SEARCH_DEEP=1 src/search.futility.test.ts
lane engine-deep ENGINE_DEEP=1 src/engine.test.ts
s=$(date +%s); npm run lint > "$o/lint.out" 2>&1; echo "lint exit $? $(( $(date +%s) - s ))s" >> "$o/exits.txt"
s=$(date +%s); npm run typecheck > "$o/typecheck.out" 2>&1; echo "typecheck exit $? $(( $(date +%s) - s ))s" >> "$o/exits.txt"
echo "end $(date -u +%FT%TZ)" >> "$o/exits.txt"
