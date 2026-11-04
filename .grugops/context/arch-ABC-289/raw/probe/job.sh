# One probe job (arch-Q1-see-pruning's job.sh shape; Q2 forms). Usage: bash job.sh <scratch root> <out dir> <id> <mode> [ENV=VAL ...].
# Each job runs under timeout 600.
declare -A F
F[DOOR]='{}'
F[D300]='{"d":1,"dMargin":300}'
F[D200]='{"d":1,"dMargin":200}'
F[D100]='{"d":1,"dMargin":100}'
F[D200c]='{"d":1,"dMargin":200,"dCheck":true}'
F[D200e]='{"d":1,"dMargin":200,"dPhase":6}'
F[D200b]='{"d":1,"dMargin":200,"dBound":true}'
root=$1 out=$2 id=$3 mode=$4; shift 4
tag=$mode; for kv in "$@"; do export "$kv"; tag="$tag-${kv//=/}"; done
cd "$root" && timeout 600 node probe.ts "$mode" "${F[$id]}" "${F[DOOR]}" > "$out/$id-$tag.out" 2>&1
echo "$id $tag exit $?" >> "$out/exits.txt"
