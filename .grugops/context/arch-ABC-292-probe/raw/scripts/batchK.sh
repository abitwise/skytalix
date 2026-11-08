# Batch K (arch-ABC-292-probe), addendum 1: rule 2's defect check on PR7's seed-1700 row. Not a d13 row; it decides only
# defect or real. Run as: flock <host-test.lock> timeout 600 bash batchK.sh <scratch dir>
S=$1; out=$S/out
echo "K start $(date -u +%FT%TZ)" >> "$out/holds.txt"
( cd "$S/cand" && grep -n "evaluate[A-Za-z]*(" src/search.ts src/engine.ts src/quiescence.ts | grep -v "^\S*:[0-9]*: *\*\|^\S*:[0-9]*: *//" > "$out/K-callsites.txt"; echo "K-callsites exit $?" >> "$out/exits.txt" )
( cd "$S/cand" && timeout 120 node defect.ts det > "$out/K-det.out" 2>&1; echo "K-det exit $?" >> "$out/exits.txt" )
( cd "$S/cand" && timeout 300 node defect.ts tree > "$out/K-tree.out" 2>&1; echo "K-tree exit $?" >> "$out/exits.txt" )
echo "K end $(date -u +%FT%TZ)" >> "$out/holds.txt"
