# Batch C (arch-ABC-291-probe): PR5, PR6, PR7. Serial. Run as: flock <host-test.lock> timeout 1500 bash batchC.sh <scratch dir>
S=$1; out=$S/out; cd "$S/cand"
echo "C start $(date -u +%FT%TZ)" >> "$out/holds.txt"
j() { local tag=$1 mode=$2; shift 2; env "$@" timeout 600 node e4bprobe.ts $mode ON > "$out/C-$tag.out" 2>&1; echo "C-$tag exit $?" >> "$out/exits.txt"; }
j PR5-mate45 mate D=4 PLUS=1
j PR5-mate55 mate D=5 PLUS=0
j PR6-zug zug
j PR7-g1 g1
echo "C end $(date -u +%FT%TZ)" >> "$out/holds.txt"
