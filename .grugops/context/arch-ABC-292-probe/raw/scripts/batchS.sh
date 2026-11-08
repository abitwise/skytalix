# Batch S (arch-ABC-292-probe), before the PREREG: one tsc type-check of `cand` and `cut` (reads no value) and d13's one
# load-only smoke (the start position with the term on reads 0, by symmetry). Run as: flock <host-test.lock> timeout 600 bash batchS.sh <scratch dir>
S=$1; out=$S/out; export FIX="$S/main/.grugops/context/qe-ABC-292-freeze/raw/fixtures.json"
echo "S start $(date -u +%FT%TZ)" >> "$out/holds.txt"
for d in cand cut; do ( cd "$S/$d" && timeout 300 npx tsc --noEmit -p tsconfig.json > "$out/S-tsc-$d.txt" 2>&1; echo "S-tsc-$d exit $?" >> "$out/exits.txt" ); done
( cd "$S/cand" && timeout 60 node e5probe.ts load ON > "$out/S-load.out" 2>&1; echo "S-load exit $?" >> "$out/exits.txt" )
echo "S end $(date -u +%FT%TZ)" >> "$out/holds.txt"
