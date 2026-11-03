# Batch C (arch-ABC-270): reports, as pre-registered; then the addendum's matediag (…3f24d8a0). Serial.
# Run as: flock <host-test.lock> timeout 1500 bash batchC.sh <scratch k3 dir> <out> <game-1 pgn>
k3=$1 out=$2 pgn=$3
cd "$k3/base"
j() { local tag=$1 mode=$2 form=$3; shift 3; env "$@" timeout 600 node k3probe.ts $mode $form > "$out/C-$tag.out" 2>&1; echo "C-$tag exit $?" >> "$out/exits.txt"; }
for f in BASE QX; do j $f-reach reach $f N=47000; done
j QX-drift drift QX D=5
for f in BASE QX; do j $f-fut fut $f; done
for f in BASE QX; do j $f-game1 game1 $f PGN=$pgn; done
for f in X QX; do j $f-matediag matediag $f; done
