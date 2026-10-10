#!/bin/bash
# Usage: run-mutants.sh <scratch-root> <tree: base|tip> <files...> -- <mutant ids...>
# For each id: plant in <tree>/src/turn-loop.ts, run vitest on <files>, record failures, restore + cmp.
SP=$1; T=$2; shift 2
FILES=(); while [ "$1" != "--" ]; do FILES+=("$1"); shift; done; shift
TREE=$SP/$T; OUT=$SP/out; mkdir -p $OUT
cp $TREE/src/turn-loop.ts $SP/pristine-$T-turn-loop.ts
for id in "$@"; do
  if [ "$id" != "NONE" ]; then node $SP/tools/mut.mjs $TREE/src/turn-loop.ts $id || exit 2; fi
  J=$OUT/$T-$id.json
  (cd $TREE && npx vitest run "${FILES[@]}" --reporter=json --outputFile=$J >/dev/null 2>&1); rc=$?
  node -e '
    const r = require(process.argv[1]);
    const f = r.testResults.flatMap(t => t.assertionResults.filter(a => a.status === "failed").map(a => `  FAIL ${a.fullName}\n       ${(a.failureMessages[0]||"").split("\n")[0]}`));
    console.log(`${process.argv[2]} ${process.argv[3]} exit=${process.argv[4]} files=${r.numTotalTestSuites===undefined?"?":r.testResults.length} tests=${r.numTotalTests} passed=${r.numPassedTests} failed=${r.numFailedTests} skipped=${r.numPendingTests+r.numTodoTests}`);
    for (const l of f) console.log(l);
  ' $J $T $id $rc
  cp $SP/pristine-$T-turn-loop.ts $TREE/src/turn-loop.ts
  cmp -s $TREE/src/turn-loop.ts $SP/pristine-$T-turn-loop.ts || { echo "RESTORE FAILED"; exit 3; }
done
