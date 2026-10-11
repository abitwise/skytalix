#!/bin/bash
# Usage: run-mutants.sh <worktree> <scratch> <node_modules> <mutant ids...>
set -u
WT="$1"; SP="$2"; NM="$3"; shift 3
T="$SP/mut/tree"
OUT="$SP/mut/results.tsv"
mkdir -p "$SP/mut"; [ -f "$OUT" ] || echo -e "mutant\texit\tfailed\tpassed\tfailing_tests" > "$OUT"
for id in "$@"; do
  rm -rf "$T"; rsync -a --exclude .git --exclude node_modules --exclude .grugops --exclude plans --exclude memory-bank --exclude .claude "$WT/" "$T/"
  ln -s "$NM" "$T/node_modules"
  if ! node "$SP/harness/mutate.ts" "$T" "$id"; then echo -e "$id\tAPPLY-FAILED" >> "$OUT"; continue; fi
  (cd "$T" && npx vitest run tools/opening-book/book.test.ts --reporter=json --outputFile="$SP/mut/$id.json" >/dev/null 2>&1); ex=$?
  read f p names < <(node -e 'const r=require(process.argv[1]);const fl=r.testResults.flatMap(t=>t.assertionResults).filter(a=>a.status!=="passed").map(a=>a.title.slice(0,40).replace(/\s+/g,"_"));console.log(r.numFailedTests+(r.numFailedTestSuites&&!r.numFailedTests?1:0),r.numPassedTests,fl.join("|")||(r.testResults[0]?.message?"SUITE:"+r.testResults[0].message.slice(0,60).replace(/\s+/g,"_"):"-"))' "$SP/mut/$id.json")
  echo -e "$id\t$ex\t$f\t$p\t$names" | tee -a "$OUT"
done
rm -rf "$T"
