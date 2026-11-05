#!/bin/bash
# lane.sh <tree> <tag> : the whole default lane in a scratch tree, one worker, JSON to out/<tag>.json. The caller holds the lock and the core.
S="${SCRATCH:?set SCRATCH to <scratch>/arch307}"
cd "$S/$1" || exit 2
tag=$2
rm -f "$S/out/$tag.json"
VITEST_MAX_WORKERS=1 NO_COLOR=1 NODE_OPTIONS=--max-old-space-size=128 node tools/grugops/run-bounded.js 120000 npx vitest run --reporter=json --outputFile="$S/out/$tag.json" > "$S/out/$tag.log" 2>&1
echo "exit $?" >> "$S/out/$tag.log"
python3 -I "$S/scripts/summ.py" "$S/out/$tag.json" > "$S/out/$tag.sum"
