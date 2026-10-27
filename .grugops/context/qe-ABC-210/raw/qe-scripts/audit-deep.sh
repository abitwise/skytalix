#!/bin/bash
# qe-ABC-210 moved-row audit, deep lanes: base's test files against a tree (hb = head src + base tests). Real-clock rows
# filtered by name on ENGINE_DEEP (the build's filter). usage: audit-deep.sh <scratch> <tree> <tag>
S=$1; T=$2; TAG=$3; A=$S/audit; cd $T
F="^(?!.*(real clock|REAL clock|wall clock|real-clock|NFR-005|between a 1 s and a 3 s search)).*$"
for f in search.null-move search search.ordering transposition quiescence search.pvs-lmr; do
  SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/$f.test.ts --reporter=json --outputFile=$A/$TAG-SEARCH_DEEP-$f.json > /dev/null 2>&1
done
for f in engine levels transposition search.pvs-lmr legal gameend; do
  ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/$f.test.ts -t "$F" --reporter=json --outputFile=$A/$TAG-ENGINE_DEEP-$f.json > /dev/null 2>&1
done
PUZZLE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/puzzle-suite.test.ts --reporter=json --outputFile=$A/$TAG-PUZZLE_DEEP-puzzle-suite.json > /dev/null 2>&1
python3 -I - $A $TAG <<'PY'
import json, glob, sys
A, tag = sys.argv[1], sys.argv[2]
for p in sorted(glob.glob(f"{A}/{tag}-*_DEEP-*.json")):
    r = json.load(open(p)); n = p.rsplit("/", 1)[1]
    print(f"{n}: {r['numFailedTests']} red / {r['numTotalTests']} (skipped {r['numPendingTests']})")
    for f in r["testResults"]:
        if f["status"] == "failed" and not f["assertionResults"]: print("   SUITE FAILED", f["message"][:200])
        for a in f["assertionResults"]:
            if a["status"] == "failed": print("   RED", a["fullName"][:220])
PY
