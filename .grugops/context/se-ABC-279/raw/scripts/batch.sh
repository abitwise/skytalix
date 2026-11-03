# One job at a time, each under timeout 600. Usage: bash batch.sh <outdir>
cd "$(dirname "$0")"
o=$1; mkdir -p "$o"; : > "$o/exits.txt"
run() { tag=$1; mode=$2; shift 2; env "$@" timeout 600 node bars.ts "$mode" > "$o/$tag.out" 2>&1; echo "$tag exit $?" >> "$o/exits.txt"; }
run nodes nodes
run zug zug
run mate mate
run drift-search drift REC=search
run drift-choose drift REC=choose
run reach reach N=47000
