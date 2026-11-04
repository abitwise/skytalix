# Batch C (arch-ABC-271): reports, decide nothing. Serial. Run as: flock <host-test.lock> timeout 1500 bash batchC.sh <scratch dir>
S=$1; out=$S/out
j() { local tag=$1 dir=$2 mode=$3 form=$4; shift 4; ( cd "$S/$dir" && env "$@" timeout 900 node e4aprobe.ts $mode $form > "$out/C-$tag.out" 2>&1; echo "C-$tag exit $?" >> "$out/exits.txt" ); }
for f in KD FP UN; do j $f-zz001 base zz001 $f; done
j CAND-zz001 cand zz001 BASE
j CANDH-zz001 cand zz001 H
for f in BASE H; do j $f-reach base reach $f N=47000; done
j H-drift base drift H D=5
