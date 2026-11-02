# One probe job (arch-ABC-233's job.sh, with composed forms). Usage: bash job2.sh <root> <out> <id>[@<door>] <mode> [ENV=VAL ...]
# Forms are JSON merges of components, left to right. Each job runs under timeout 300.
declare -A C
C[H1]='{"hh":1,"hhIndex":"cft","hhMalus":1}'
C[R0]='{"lmr":"log","base":1.0,"div":2.0,"killerLess":0,"maxR":2}'
C[t1]='{"hT":1,"hLess":1,"hMore":0}'
C[t2]='{"hT":1,"hLess":1,"hMore":1}'
C[t3]='{"hT":1,"hLess":1,"hMore":1,"hNegCap":3}'
C[t4]='{"hT":1,"hZero":1,"hMore":0}'
declare -A F
F[DOOR]=""; F[H1]="H1"; F[P1H1]="H1 R0"; F[J1]="H1 R0 t1"; F[J2]="H1 R0 t2"; F[J3]="H1 R0 t3"; F[J4]="H1 R0 t4"
compose() { local js=(); for c in ${F[$1]}; do js+=("${C[$c]}"); done
  python3 -c "import json,sys; a={}; [a.update(json.loads(x)) for x in sys.argv[1:]]; print(json.dumps(a))" "${js[@]}"; }
root=$1 out=$2 id=$3 mode=$4; shift 4
head=${id%@*}; door=DOOR; [[ $id == *@* ]] && door=${id#*@}
hj=$(compose "$head"); dj=$(compose "$door")
tag=$mode; for kv in "$@"; do export "$kv"; tag="$tag-${kv//=/}"; done
cd "$root" && timeout 300 node probe.ts "$mode" "$hj" "$dj" > "$out/${id//@/_over_}-$tag.out" 2>&1
echo "$id $tag exit $?" >> "$out/exits.txt"
