# One probe job (arch-post-268's job.sh, plus history forms and an optional door: id "HEAD" or "HEAD@DOOR").
# Usage: bash job.sh <scratch root> <out dir> <id> <mode> [ENV=VAL ...]. Each job runs under timeout 300.
declare -A F
F[DOOR]='{}'
F[H1]='{"hh":1,"hhIndex":"cft","hhMalus":1}'
F[H0]='{"hh":1,"hhIndex":"ft","hhMalus":1}'
F[H2]='{"hh":1,"hhIndex":"cft","hhMalus":0}'
F[H3]='{"hh":1,"hhIndex":"pt","hhMalus":1}'
F[H1nr]='{"hh":1,"hhIndex":"cft","hhMalus":1,"hhRoot":0}'
F[R0]='{"lmr":"log","base":1.0,"div":2.0,"killerLess":0,"maxR":2}'
root=$1 out=$2 id=$3 mode=$4; shift 4
head=${id%@*}; door=DOOR; [[ $id == *@* ]] && door=${id#*@}
hj=${F[$head]}
# "P1x" = ADR-0060 decision 1 (R0) over history form x
if [[ $head == P1* ]]; then hx=${head#P1}; hj=$(python3 -c "import json,sys; a=json.loads(sys.argv[1]); a.update(json.loads(sys.argv[2])); print(json.dumps(a))" "${F[$hx]}" "${F[R0]}"); fi
tag=$mode; for kv in "$@"; do export "$kv"; tag="$tag-${kv//=/}"; done
cd "$root" && timeout 300 node probe.ts "$mode" "$hj" "${F[$door]}" > "$out/${id//@/_over_}-$tag.out" 2>&1
echo "$id $tag exit $?" >> "$out/exits.txt"
