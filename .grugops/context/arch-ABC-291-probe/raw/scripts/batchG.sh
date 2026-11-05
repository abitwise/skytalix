# Batch G (arch-ABC-291-probe): PR11. The default lane on `main` and on `cand`, whose shipped entries are ON. One worker.
# Run as: flock <host-test.lock> timeout 1300 bash batchG.sh <scratch dir>
S=$1; out=$S/out
echo "G start $(date -u +%FT%TZ)" >> "$out/holds.txt"
for d in main cand; do ( cd "$S/$d" && VITEST_MAX_WORKERS=1 NODE_OPTIONS=--max-old-space-size=128 timeout 600 npx vitest run --reporter=json --outputFile="$out/G-$d.json" > "$out/G-$d.log" 2>&1; echo "G-$d exit $?" >> "$out/exits.txt" ); done
echo "G end $(date -u +%FT%TZ)" >> "$out/holds.txt"
