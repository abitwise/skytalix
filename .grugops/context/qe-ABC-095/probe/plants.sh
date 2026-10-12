#!/bin/bash
# qe-ABC-095: run every plant in its own copy (outside the repository) through the default lane and CLI_DEEP.
# Usage: bash plants.sh <out dir> <plant>...   Records: failed test titles per lane, exit codes, $TMPDIR abc095 census.
P=/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-qe-ABC-095/.grugops/context/qe-ABC-095/probe
S=/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/8527bcf0-376e-4738-b2d4-7789ea9bdd71/scratchpad/qe095/plants
OUT="$1"; shift; mkdir -p "$OUT" "$S"
TMP=$(node -p 'require("os").tmpdir()')
census() { ls -d "$TMP"/abc095-book-absent-* 2>/dev/null | wc -l | tr -d ' '; }
sumj() { jq -r '"files \(.testResults|length) tests \(.numTotalTests) passed \(.numPassedTests) failed \(.numFailedTests) suites-failed \(.numFailedTestSuites)", (.testResults[] | select(.status!="passed") | "  FILE-FAIL \(.name|sub(".*/src/";"src/")|sub(".*/tools/";"tools/")) \(.message|.[0:160]|gsub("\n";" "))"), (.testResults[] | .name as $n | .assertionResults[] | select(.status=="failed") | "  FAIL \($n|sub(".*/src/";"src/")|sub(".*/tools/";"tools/")) :: \(.fullName|.[0:150]) :: \((.failureMessages[0]//"")|split("\n")[0]|.[0:140])")' "$1" 2>/dev/null || echo "  (no json result)"; }
for name in "$@"; do
  d="$S/$name"; rm -rf "$d"; mkdir -p "$d"
  git -C /Users/olgeroeselg/Projects/hacks/grugops-examples/wt-qe-ABC-095 archive 2307fc11 | tar -x -C "$d"
  ln -s /Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/node_modules "$d/node_modules"
  { echo "=== $name $(date -u +%FT%TZ)"; python3 -I $P/plants.py "$d" "$name" || { echo "PLANT FAILED TO APPLY"; continue; }
    echo "census before: $(census)"
    (cd "$d" && env -u CLI_DEEP npx vitest run --reporter=dot --reporter=json --outputFile.json="$OUT/$name.default.json" >/dev/null 2>&1); echo "default lane exit $?"; sumj "$OUT/$name.default.json"
    echo "census after default: $(census)"
    (cd "$d" && CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts --reporter=default --reporter=json --outputFile.json="$OUT/$name.deep.json" >"$OUT/$name.deep.console.txt" 2>&1); echo "CLI_DEEP exit $?"; sumj "$OUT/$name.deep.json"
    grep -o 'wall [0-9]* ms, exit [0-9a-z]*' "$OUT/$name.deep.console.txt" | tr '\n' ';' ; echo
    echo "census after CLI_DEEP: $(census)"
  } 2>&1 | tee -a "$OUT/plants.out.txt"
done
