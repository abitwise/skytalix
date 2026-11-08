# Batch B (arch-ABC-292-probe): PR2, PR3, PR4. Serial. Run as: flock <host-test.lock> timeout 900 bash batchB.sh <scratch dir>
S=$1; out=$S/out; export FIX="$S/main/.grugops/context/qe-ABC-292-freeze/raw/fixtures.json" PRE="$S/main/.grugops/context/qe-ABC-292-freeze/raw/pre-ticket.json"; export PGNS="$S/main/.grugops/context/qe-ABC-269/raw/out/b8/d.pgn,$S/main/.grugops/context/qe-ABC-279/raw/out/c2/d.pgn"
echo "B start $(date -u +%FT%TZ)" >> "$out/holds.txt"
cd "$S/cand"
j() { local tag=$1 mode=$2; timeout 400 node e5probe.ts $mode ON > "$out/B-$tag.out" 2>&1; echo "B-$tag exit $?" >> "$out/exits.txt"; }
j PR2-mirror mirror
j PR3-arith arith
j PR4-memo memo
timeout 400 node "$S/scripts/pr4c.ts" "$S" > "$out/B-PR4-cross.out" 2>&1; echo "B-PR4-cross exit $?" >> "$out/exits.txt"
echo "B end $(date -u +%FT%TZ)" >> "$out/holds.txt"
