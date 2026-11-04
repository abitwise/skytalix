# Batch A (arch-ABC-271): counts (I1 + P0). Serial. Run as: flock <host-test.lock> timeout 1500 bash batchA.sh <scratch dir>
S=$1; out=$S/out
run() { local tag=$1 dir=$2 script=$3 form=$4; shift 4; ( cd "$S/$dir" && env "$@" timeout 600 node $script nodes $form > "$out/A-$tag.out" 2>&1; echo "A-$tag exit $?" >> "$out/exits.txt" ); }
run MAIN-kiwi main mainnodes.ts - REC=choose POS=kiwipete DS=8,9
run MAIN-pos6 main mainnodes.ts - REC=choose POS=position-6 DS=8,9,10
run MAIN-search8 main mainnodes.ts - REC=search POS=kiwipete,position-6 DS=8
for f in BASE H; do
  run $f-kiwi base e4aprobe.ts $f REC=choose POS=kiwipete DS=8,9
  run $f-pos6 base e4aprobe.ts $f REC=choose POS=position-6 DS=8,9,10
  run $f-search8 base e4aprobe.ts $f REC=search POS=kiwipete,position-6 DS=8
done
