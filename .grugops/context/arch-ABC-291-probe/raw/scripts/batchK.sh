# Batch K (arch-ABC-291-probe): not a d10 row. The default lane on `lane2`, which is `cand` with K2's list applied, to show
# the list is whole. One worker. Run as: flock <host-test.lock> timeout 700 bash batchK.sh <scratch dir>
S=$1; out=$S/out
echo "K start $(date -u +%FT%TZ)" >> "$out/holds.txt"
( cd "$S/lane2" && VITEST_MAX_WORKERS=1 NODE_OPTIONS=--max-old-space-size=128 timeout 600 npx vitest run --reporter=json --outputFile="$out/K-lane2.json" > "$out/K-lane2.log" 2>&1; echo "K-lane2 exit $?" >> "$out/exits.txt" )
echo "K end $(date -u +%FT%TZ)" >> "$out/holds.txt"
