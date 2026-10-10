#!/bin/bash
# SE (ABC-140) own loop around the Architect's plant.mjs (copied unchanged). Same per-build steps as BA/PM's
# bapm-r5d-qe139a ledger: one fresh `git archive <rev>` per build, node_modules symlinked, biome check src,
# tsc --noEmit, vitest JSON reporter. usage: ledger140.sh <repo> <scratch> <rev> <out.tsv> <file|suite> <build>...
set -u
REPO=$1; S=$2; rev=$3; out=$4; scope=$5; shift 5
for b in "$@"; do
  t=$S/trees/$rev-$(echo "$b" | tr '+' '_')-$scope; rm -rf "$t"; mkdir -p "$t"
  git -C "$REPO" archive "$rev" | tar -x -C "$t"; ln -s "$REPO/node_modules" "$t/node_modules"
  start=$(date -u +%H:%M:%SZ)
  if ! node "$S/bin/plant.mjs" "$t" "$b" 2>"$t/plant.err"; then printf "%s\t%s\tPLANT-FAILED\t%s\n" "$b" "$scope" "$(cat "$t/plant.err")" >>"$out"; continue; fi
  (cd "$t" && node node_modules/@biomejs/biome/bin/biome check src >"$t/lint.txt" 2>&1); lint=$?
  (cd "$t" && node node_modules/typescript/bin/tsc --noEmit >"$t/tsc.txt" 2>&1); tsc=$?
  if [ "$scope" = file ]; then target=src/history-pane.nfr.test.ts; else target=""; fi
  (cd "$t" && node node_modules/vitest/vitest.mjs run $target --reporter=json --outputFile="$t/v.json" >"$t/v.log" 2>&1); vx=$?
  sum=$(node -e '
    const r=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"));
    const fails=r.testResults.flatMap(f=>f.assertionResults.filter(a=>a.status==="failed").map(a=>a.title.slice(0,60)+" :: "+(a.failureMessages[0]||"").split("\n")[0].replace(/\x1b\[[0-9;]*m/g,"").slice(0,110)));
    console.log(`${r.testResults.length} files\t${r.numPassedTests}/${r.numTotalTests}\t${fails.join(" || ")||"-"}`);' "$t/v.json" 2>/dev/null || echo "no-json")
  printf "%s\t%s\t%s..%s\tlint=%s\ttsc=%s\tvitest=%s\t%s\tload1=%s\n" "$b" "$scope" "$start" "$(date -u +%H:%M:%SZ)" "$lint" "$tsc" "$vx" "$sum" "$(sysctl -n vm.loadavg | awk '{print $2}')" >>"$out"
  rm -rf "$t"
done
