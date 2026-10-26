#!/bin/bash
# qe-ABC-207 moved-row audit (qe-ABC-215 cross.sh, ABC-207's five test files): X1 = head src + base's test files; X2 = base src + head's test files. Default lane on the 6 changed
# test files, SEARCH_DEEP on the 4 search files, ENGINE_DEEP engine with real-clock rows excluded by name.
set -u
SCR=$1; T=$SCR/trees; OUT=$SCR/cross; mkdir -p $OUT
FILES="src/evaluate.king-mobility.test.ts src/quiescence.test.ts src/search.ordering.test.ts src/search.pvs-lmr.test.ts src/transposition.test.ts"
for x in X1 X2; do
  rm -rf $T/$x; mkdir -p $T/$x
  if [ $x = X1 ]; then src=head; tst=base; else src=base; tst=head; fi
  (cd $T/$src && tar -cf - --exclude node_modules --exclude plans --exclude memory-bank --exclude .grugops .) | (cd $T/$x && tar -xf -)
  for f in $FILES; do cp $T/$tst/$f $T/$x/$f; done
  ln -s $(readlink $T/head/node_modules) $T/$x/node_modules
  cd $T/$x
  NODE_OPTIONS=--max-old-space-size=128 npx vitest run $FILES --reporter=json --outputFile=$OUT/$x-default.json > /dev/null 2>&1; echo "$x default rc=$?"
  for f in src/quiescence.test.ts src/search.ordering.test.ts src/search.pvs-lmr.test.ts src/transposition.test.ts; do
    n=$(basename $f .test.ts)
    SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run $f --reporter=json --outputFile=$OUT/$x-SD-$n.json > /dev/null 2>&1; echo "$x SEARCH_DEEP $n rc=$?"
  done
  for f in src/transposition.test.ts src/search.pvs-lmr.test.ts; do
    n=$(basename $f .test.ts)
    ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run $f -t '^(?!.*(real clock|REAL clock|wall clock|NFR-005))' --reporter=json --outputFile=$OUT/$x-ED-$n.json > /dev/null 2>&1; echo "$x ENGINE_DEEP $n rc=$?"
  done
done
python3 -I - "$OUT" <<'PY'
import json, glob, sys, os
out = sys.argv[1]
for x in ("X1", "X2"):
    seen = {}
    for p in sorted(glob.glob(f"{out}/{x}-*.json")):
        j = json.load(open(p)); lane = os.path.basename(p)[3:-5]
        for f in j["testResults"]:
            for a in f["assertionResults"]:
                if a["status"] == "failed":
                    key = f'{f["name"].split("/src/")[1]} > {a["fullName"]}'
                    seen.setdefault(key, []).append(lane + " :: " + (a["failureMessages"][0] if a["failureMessages"] else "").split("\n")[0][:120])
        print(x, lane, "passed", j["numPassedTests"], "failed", j["numFailedTests"], "total", j["numTotalTests"])
    print(f"== {x}: {len(seen)} distinct red rows")
    for k, v in sorted(seen.items()): print("  ", k, "||", v[0], f"(lanes {len(v)})")
PY
