#!/bin/bash
# lane.sh <tag> : whole default lane in the scratch tree, JSON to out/<tag>.json, summary to out/<tag>.sum
S="${SCRATCH:?set SCRATCH to <scratch>/arch302}"
cd $S/tree || exit 2
tag=$1
NODE_OPTIONS=--max-old-space-size=128 node tools/grugops/run-bounded.js 120000 npx vitest run --reporter=json --outputFile=$S/out/$tag.json > $S/out/$tag.log 2>&1
echo "exit $?" >> $S/out/$tag.log
python3 -I $S/scripts/summ.py $S/out/$tag.json > $S/out/$tag.sum
tail -1 $S/out/$tag.log; cat $S/out/$tag.sum | head -40
