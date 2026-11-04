# Batch B (arch-ABC-271): stage-1 eligibility rows for H, with BASE references. Serial.
# Run as: flock <host-test.lock> timeout 1500 bash batchB.sh <scratch dir>
S=$1; out=$S/out; cd "$S/base"
j() { local tag=$1 mode=$2 form=$3; shift 3; env "$@" timeout 900 node e4aprobe.ts $mode $form > "$out/B-$tag.out" 2>&1; echo "B-$tag exit $?" >> "$out/exits.txt"; }
j BASE-static static BASE
j BASE-rel rel BASE
j BASE-zz001 zz001 BASE
j H-static static H
j H-rel rel H
j H-zz001 zz001 H
j H-mate45 mate H D=4 PLUS=1
j H-mate55 mate H D=5 PLUS=0
j H-zug zug H
j H-g1 g1 H
