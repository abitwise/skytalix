# One probe job (arch-ABC-233's job.sh shape; SEE forms). Usage: bash job.sh <scratch root> <out dir> <id> <mode> [ENV=VAL ...].
# id "HEAD" or "HEAD@DOOR". Each job runs under timeout 600.
declare -A F
F[DOOR]='{}'
F[S1]='{"see":1,"seeMargin":0}'
F[S2]='{"see":2,"seeMargin":0}'
F[S1m]='{"see":1,"seeMargin":50}'
root=$1 out=$2 id=$3 mode=$4; shift 4
head=${id%@*}; door=DOOR; [[ $id == *@* ]] && door=${id#*@}
tag=$mode; for kv in "$@"; do export "$kv"; tag="$tag-${kv//=/}"; done
cd "$root" && timeout 600 node probe.ts "$mode" "${F[$head]}" "${F[$door]}" > "$out/${id//@/_over_}-$tag.out" 2>&1
echo "$id $tag exit $?" >> "$out/exits.txt"
