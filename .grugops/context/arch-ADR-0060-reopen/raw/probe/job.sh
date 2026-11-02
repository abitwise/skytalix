# One probe job. Usage: bash job.sh <scratch root> <out dir> <form id> <mode> [ENV=VAL ...]
# Each job runs under timeout 300; the batch that calls it holds flock <host-test.lock> timeout 300.
source "$(dirname "$0")/forms.sh"
root=$1 out=$2 id=$3 mode=$4; shift 4
tag=$mode; for kv in "$@"; do export "$kv"; tag="$tag-${kv//=/}"; done
cd "$root" && timeout 300 node probe.ts "$mode" "${F[$id]}" > "$out/$id-$tag.out" 2>&1
