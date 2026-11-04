#!/bin/bash
S="${SCRATCH:?set SCRATCH to <scratch>/arch302}"
cd $S/tree
for m in restore REP0 M8d; do
  python3 -I $S/scripts/mut.py $S/tree $S/orig $m >/dev/null
  NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci-session.test.ts --reporter=json --outputFile=$S/out/r8real-$m.json > /dev/null 2>&1
  python3 -I -c "
import json,sys
d=json.load(open('$S/out/r8real-$m.json'))
print('$m', 'total', d['numTotalTests'], 'failed', d['numFailedTests'])
for f in d['testResults']:
  for a in f['assertionResults']:
    if '[deep, ENGINE_DEEP=1]' in a['fullName']: print('   ', a['status'], a['fullName'][:110])
"
done
python3 -I $S/scripts/mut.py $S/tree $S/orig restore >/dev/null
