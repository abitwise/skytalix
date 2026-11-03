# One probe job. Usage: bash job.sh <scratch root> <out dir> <id> <mode> [ENV=VAL ...]. id "HEAD" (door = DOOR).
declare -A F
F[DOOR]='{"on":0}'
F[A25]='{"on":1,"from":5,"delta":25,"grow":2,"cap":400}'
F[A50]='{"on":1,"from":5,"delta":50,"grow":2,"cap":400}'
F[A100]='{"on":1,"from":5,"delta":100,"grow":2,"cap":400}'
F[A50F]='{"on":1,"from":5,"delta":50,"oneStep":1}'
root=$1 out=$2 id=$3 mode=$4; shift 4
tag=$mode; for kv in "$@"; do export "$kv"; tag="$tag-${kv//=/}"; done
cd "$root" && timeout 600 node probe.ts "$mode" "${F[$id]}" "${F[DOOR]}" > "$out/$id-$tag.out" 2>&1
echo "$id $tag exit $?" >> "$out/exits.txt"
