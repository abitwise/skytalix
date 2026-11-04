# Deep lanes, one at a time, each under timeout 1500. Usage: bash lanes.sh <worktree> <outdir>
cd "$1"; o=$2; mkdir -p "$o"; : > "$o/exits.txt"
lane() { tag=$1; env=$2; file=$3; s=$(date +%s); env $env NODE_OPTIONS=--max-old-space-size=400 timeout 1500 npx vitest run $file > "$o/$tag.out" 2>&1; echo "$tag exit $? $(( $(date +%s) - s ))s" >> "$o/exits.txt"; }
lane search SEARCH_DEEP=1 src/search.test.ts
lane quiescence SEARCH_DEEP=1 src/quiescence.test.ts
lane futility SEARCH_DEEP=1 src/search.futility.test.ts
lane nullmove SEARCH_DEEP=1 src/search.null-move.test.ts
lane pvslmr SEARCH_DEEP=1 src/search.pvs-lmr.test.ts
lane taper SEARCH_DEEP=1 src/evaluate.taper.test.ts
lane tt-search SEARCH_DEEP=1 src/transposition.test.ts
lane tt-engine ENGINE_DEEP=1 src/transposition.test.ts
lane engine ENGINE_DEEP=1 src/engine.test.ts
lane puzzle PUZZLE_DEEP=1 src/puzzle-suite.test.ts
