# One probe job. Usage: bash run.sh <root> <outdir> <tag> <mode> <door> <heads> [ENV=VAL ...]
# Run a batch under `flock <scratch>/host-test.lock timeout 1500 bash <batch>`. One core; every job under timeout 900.
root=$1 outdir=$2 tag=$3 mode=$4 door=$5 heads=$6; shift 6
for kv in "$@"; do export "$kv"; done
export NODE_OPTIONS=--max-old-space-size=400
start=$(date +%s)
(cd "$root" && timeout 900 node probe.ts "$mode" "$door" "$heads" "${BASE:-}") > "$outdir/$tag.jsonl" 2>&1
code=$?
echo "$tag $mode door=$door heads=$heads exit=$code seconds=$(( $(date +%s) - start ))" >> "$outdir/exits.txt"
