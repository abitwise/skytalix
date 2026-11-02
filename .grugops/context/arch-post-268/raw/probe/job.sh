# One probe job (arch-ADR-0060-reopen's job.sh; ids R0 = decision 1, DOOR = main as shipped).
# Usage: bash job.sh <scratch root> <out dir> <id> <mode> [ENV=VAL ...]. Each job runs under timeout 300.
declare -A F
F[R0]='{"lmr":"log","base":1.0,"div":2.0,"killerLess":0,"maxR":2}'
F[DOOR]='{}'
root=$1 out=$2 id=$3 mode=$4; shift 4
tag=$mode; for kv in "$@"; do export "$kv"; tag="$tag-${kv//=/}"; done
cd "$root" && timeout 300 node probe.ts "$mode" "${F[$id]}" > "$out/$id-$tag.out" 2>&1
echo "$id $tag exit $?" >> "$out/exits.txt"
