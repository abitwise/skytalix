# Batch E (arch-ABC-291-probe): PR9. Run as: flock <host-test.lock> timeout 400 bash batchE.sh <scratch dir>
S=$1; out=$S/out; export PGNS="$S/main/.grugops/context/qe-ABC-269/raw/out/b8/d.pgn,$S/main/.grugops/context/qe-ABC-279/raw/out/c2/d.pgn"
echo "E start $(date -u +%FT%TZ)" >> "$out/holds.txt"
cd "$S/cand"; timeout 300 node e4bprobe.ts fire ON > "$out/E-PR9-fire.out" 2>&1; echo "E-PR9-fire exit $?" >> "$out/exits.txt"
echo "E end $(date -u +%FT%TZ)" >> "$out/holds.txt"
