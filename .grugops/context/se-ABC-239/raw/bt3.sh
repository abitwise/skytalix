#!/bin/bash
# B-T3: extract | fit | emit twice from the base table; compare the emitted file. Caller holds the host lock.
set -u
S="$1"; W="$2"; LI="$S/lichess/lichess_db_standard_rated_2017-03.pgn.zst"
cd "$W"
for k in 1 2; do
  O="$S/bt3-run$k"; rm -rf "$O"; mkdir -p "$O"
  git checkout HEAD -- src/evaluate-params.ts
  echo "run$k start $(date -u +%FT%TZ)" >> "$S/bt3.log"
  /usr/bin/time -v timeout 1800 node --max-old-space-size=3000 tools/tune/tune.ts extract "$O" --lichess "$LI" > "$O/extract.out" 2> "$O/extract.err" || { echo "run$k extract FAIL $?" >> "$S/bt3.log"; exit 1; }
  /usr/bin/time -v timeout 1800 node --max-old-space-size=3000 tools/tune/tune.ts fit "$O" > "$O/fit.out" 2> "$O/fit.err" || { echo "run$k fit FAIL $?" >> "$S/bt3.log"; exit 1; }
  /usr/bin/time -v timeout 1800 node --max-old-space-size=3000 tools/tune/tune.ts emit "$O" > "$O/emit.out" 2> "$O/emit.err" || { echo "run$k emit FAIL $?" >> "$S/bt3.log"; exit 1; }
  cp src/evaluate-params.ts "$O/evaluate-params.ts"
  echo "run$k end $(date -u +%FT%TZ) sha $(sha256sum src/evaluate-params.ts | cut -c1-64)" >> "$S/bt3.log"
done
cmp "$S/bt3-run1/evaluate-params.ts" "$S/bt3-run2/evaluate-params.ts" && echo "B-T3 byte-identical" >> "$S/bt3.log" || echo "B-T3 DIFFER" >> "$S/bt3.log"
