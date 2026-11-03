# Batch B (arch-ABC-270): the eligibility rows for QX and X; static for all four forms. Serial.
# Run as: flock <host-test.lock> timeout 1500 bash batchB.sh <scratch k3 dir> <out>
k3=$1 out=$2
cd "$k3/base"
j() { local tag=$1 mode=$2 form=$3; shift 3; env "$@" timeout 600 node k3probe.ts $mode $form > "$out/B-$tag.out" 2>&1; echo "B-$tag exit $?" >> "$out/exits.txt"; }
for f in BASE X Q QX; do j $f-static static $f; done
for f in QX X; do
  j $f-mate45 mate $f D=4 PLUS=1
  j $f-mate55 mate $f D=5 PLUS=0
  j $f-zug zug $f
  j $f-g1 g1 $f
done
