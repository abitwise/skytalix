# Batch A (arch-ABC-291-probe): PR1 and P0. Serial, one core. Run as: flock <host-test.lock> timeout 1200 bash batchA.sh <scratch dir>
S=$1; out=$S/out
echo "A start $(date -u +%FT%TZ)" >> "$out/holds.txt"
run() { local tag=$1 dir=$2 script=$3 form=$4; shift 4; ( cd "$S/$dir" && env "$@" timeout 500 node $script nodes $form > "$out/A-$tag.out" 2>&1; echo "A-$tag exit $?" >> "$out/exits.txt" ); }
run MAIN-kiwi main mainnodes.ts - REC=choose POS=kiwipete DS=8,9
run MAIN-pos6 main mainnodes.ts - REC=choose POS=position-6 DS=8,9,10
run MAIN-search8 main mainnodes.ts - REC=search POS=kiwipete,position-6 DS=8
for f in OFF ON; do
  run $f-kiwi cand e4bprobe.ts $f REC=choose POS=kiwipete DS=8,9
  run $f-pos6 cand e4bprobe.ts $f REC=choose POS=position-6 DS=8,9,10
  run $f-search8 cand e4bprobe.ts $f REC=search POS=kiwipete,position-6 DS=8
done
echo "A end $(date -u +%FT%TZ)" >> "$out/holds.txt"
