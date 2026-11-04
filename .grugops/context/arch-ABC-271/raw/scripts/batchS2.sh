# Batch S2 (arch-ABC-271): ONLY if H fails an eligibility row in E4-E6 (choice rule 3). The six subsets. Serial.
# Run as: flock <host-test.lock> timeout 1800 bash batchS2.sh <scratch dir>
S=$1; out=$S/out; cd "$S/base"
j() { local tag=$1 mode=$2 form=$3; shift 3; env "$@" timeout 900 node e4aprobe.ts $mode $form > "$out/S2-$tag.out" 2>&1; echo "S2-$tag exit $?" >> "$out/exits.txt"; }
for f in KF KU FU KD FP UN; do
  j $f-static static $f; j $f-rel rel $f; j $f-mate45 mate $f D=4 PLUS=1; j $f-mate55 mate $f D=5 PLUS=0; j $f-zug zug $f; j $f-g1 g1 $f
done
