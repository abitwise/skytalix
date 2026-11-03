# One probe job (arch-ABC-234's job.sh shape; Q1 forms). Usage: bash job.sh <scratch root> <out dir> <id> <mode> [ENV=VAL ...].
# id "HEAD" or "HEAD@DOOR". Each job runs under timeout 600.
declare -A F
F[DOOR]='{}'
F[QS]='{"q":1,"qMargin":0}'
F[QSc]='{"q":1,"qMargin":0,"qCheck":true}'
F[QSM]='{"q":1,"qMargin":0,"m":1,"mMul":100,"mMaxDepth":3}'
root=$1 out=$2 id=$3 mode=$4; shift 4
head=${id%@*}; door=DOOR; [[ $id == *@* ]] && door=${id#*@}
tag=$mode; for kv in "$@"; do export "$kv"; tag="$tag-${kv//=/}"; done
cd "$root" && timeout 600 node probe.ts "$mode" "${F[$head]}" "${F[$door]}" > "$out/${id//@/_over_}-$tag.out" 2>&1
echo "$id $tag exit $?" >> "$out/exits.txt"
