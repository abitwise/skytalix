# Batch G (arch-ABC-292-probe): PR11. The default lane on `main` and on `cand`, whose shipped entries are ON; then, with -t,
# ABC-282 A0 in src/uci-session.test.ts and src/engine.test.ts (ENGINE_DEEP) and ABC-303's depth-8 counts in
# src/search.bundle.test.ts (SEARCH_DEEP), on both copies. One worker. A deep run with no test counts as a failure.
# Run as: flock <host-test.lock> timeout 2400 bash batchG.sh <scratch dir>
S=$1; out=$S/out; export FIX="$S/main/.grugops/context/qe-ABC-292-freeze/raw/fixtures.json" PRE="$S/main/.grugops/context/qe-ABC-292-freeze/raw/pre-ticket.json"
echo "G start $(date -u +%FT%TZ)" >> "$out/holds.txt"
for d in main cand; do ( cd "$S/$d" && VITEST_MAX_WORKERS=1 NODE_OPTIONS=--max-old-space-size=128 timeout 900 npx vitest run --reporter=json --outputFile="$out/G-$d.json" > "$out/G-$d.log" 2>&1; echo "G-$d exit $?" >> "$out/exits.txt" ); done
deep() { local tag=$1 envv=$2 file=$3 pat=$4; for d in main cand; do ( cd "$S/$d" && env $envv=1 VITEST_MAX_WORKERS=1 NODE_OPTIONS=--max-old-space-size=400 timeout 600 npx vitest run "$file" -t "$pat" --reporter=json --outputFile="$out/G-deep-$tag-$d.json" > "$out/G-deep-$tag-$d.log" 2>&1; echo "G-deep-$tag-$d exit $?" >> "$out/exits.txt" ); done; }
deep uci ENGINE_DEEP src/uci-session.test.ts "ABC-282 A0"
deep engine ENGINE_DEEP src/engine.test.ts "ABC-282 A0"
deep bundle SEARCH_DEEP src/search.bundle.test.ts "ABC-303 — the bundle's own counts at depth 8"
echo "G end $(date -u +%FT%TZ)" >> "$out/holds.txt"
