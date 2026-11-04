# Batch E (arch-ABC-271): report. The default vitest lane on a copy with H on by default (lane) and on the main copy
# (environment reds). One worker. Run as: flock <host-test.lock> timeout 1500 bash batchE.sh <scratch dir>
S=$1; out=$S/out
for d in main lane; do ( cd "$S/$d" && VITEST_MAX_WORKERS=1 NODE_OPTIONS=--max-old-space-size=128 timeout 900 npx vitest run --reporter=json --outputFile="$out/E-$d.json" > "$out/E-$d.log" 2>&1; echo "E-$d exit $?" >> "$out/exits.txt" ); done
