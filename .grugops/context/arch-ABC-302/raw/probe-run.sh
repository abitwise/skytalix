#!/bin/bash
S="${SCRATCH:?set SCRATCH to <scratch>/arch302}"
cd $S/tree
for f in search.null-move search.futility zobrist engine levels engine.capacity uci-session cli; do
  PROBE_OUT=$S/out/probe-$f.tsv NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/$f.test.ts -t PROBE302 > $S/out/probe-$f.log 2>&1
  echo "$f exit $? $(grep -E 'Tests ' $S/out/probe-$f.log)"
done
