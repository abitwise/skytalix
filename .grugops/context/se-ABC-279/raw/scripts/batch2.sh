# Re-runs after the B0 re-point and the deep rows. Usage: bash batch2.sh <worktree> <outdir>
cd "$1"; o=$2; mkdir -p "$o"; : > "$o/exits.txt"
lane() { tag=$1; env=$2; file=$3; s=$(date +%s); env $env NODE_OPTIONS=--max-old-space-size=400 timeout 1500 npx vitest run $file > "$o/$tag.out" 2>&1; echo "$tag exit $? $(( $(date +%s) - s ))s" >> "$o/exits.txt"; }
s=$(date +%s); timeout 600 node "$(dirname "$0")/bars.ts" g1 > "$o/g1.out" 2>&1; echo "g1 exit $? $(( $(date +%s) - s ))s" >> "$o/exits.txt"
lane see-deep SEARCH_DEEP=1 src/see.test.ts
lane taper SEARCH_DEEP=1 src/evaluate.taper.test.ts
lane tt-search SEARCH_DEEP=1 src/transposition.test.ts
lane tt-engine ENGINE_DEEP=1 src/transposition.test.ts
s=$(date +%s); timeout 600 npm test > "$o/npmtest.out" 2>&1; echo "npmtest exit $? $(( $(date +%s) - s ))s" >> "$o/exits.txt"
