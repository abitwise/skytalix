# Batch A (arch-ABC-270): counts. Serial. Run as: flock <host-test.lock> timeout 1500 bash batchA.sh <scratch k3 dir> <out>
k3=$1 out=$2
run() { local tag=$1 dir=$2 script=$3 form=$4; shift 4; ( cd "$k3/$dir" && env "$@" timeout 600 node $script nodes $form > "$out/A-$tag.out" 2>&1; echo "A-$tag exit $?" >> "$out/exits.txt" ); }
run MAIN-kiwi main mainnodes.ts - REC=choose POS=kiwipete DS=7,8,9
run MAIN-pos6 main mainnodes.ts - REC=choose POS=position-6 DS=7,8,9,10
run MAIN-search8 main mainnodes.ts - REC=search POS=kiwipete,position-6 DS=8
for f in BASE X Q QX; do
  run $f-kiwi base k3probe.ts $f REC=choose POS=kiwipete DS=7,8,9
  run $f-pos6 base k3probe.ts $f REC=choose POS=position-6 DS=7,8,9,10
  run $f-search8 base k3probe.ts $f REC=search POS=kiwipete,position-6 DS=8
done
