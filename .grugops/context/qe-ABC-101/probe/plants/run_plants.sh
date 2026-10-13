#!/bin/bash
# qe-ABC-101 plants: one scratch copy of 98ea0a84 per plant OUTSIDE the repository, full vitest suite + tsc, then removed by
# the exact path this script created. Usage: bash run_plants.sh <out file> <plant>...
T=/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/8527bcf0-376e-4738-b2d4-7789ea9bdd71/scratchpad/qe101tools
PL=/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/8527bcf0-376e-4738-b2d4-7789ea9bdd71/scratchpad/qe101plants
WT=/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-qe-ABC-101
NM=/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/node_modules
OUT=$1; shift
mkdir -p "$PL"
cnt() { ls -A "$PL" | wc -l | tr -d ' '; }
bac() { ls -d "$(node -p 'require("os").tmpdir()')"/abc095-book-absent-* 2>/dev/null | wc -l | tr -d ' '; }
for name in "$@"; do
  echo "=== $name  $(date -u +%FT%TZ)  plant dirs before: $(cnt)  abc095-book-absent-* before: $(bac)" >> "$OUT"
  D="$PL/$name"
  mkdir "$D" && git -C "$WT" archive 98ea0a84 | tar -x -C "$D" && ln -s "$NM" "$D/node_modules"
  python3 -I "$T/plant_edits.py" "$name" "$D" >> "$OUT" 2>&1 || { echo "EDIT FAILED" >> "$OUT"; rm -rf "$D"; continue; }
  ( for f in src/cli.ts src/cli-options.ts src/level-seam.ts src/levels.ts AGENTS.md; do git -C "$WT" show 98ea0a84:$f | diff -u --label "a/$f" --label "b/$f" - "$D/$f"; done ) >> "$OUT" 2>&1
  ( cd "$D" && env -u CLI_DEEP -u SEARCH_DEEP -u ENGINE_DEEP npx vitest run --reporter=json --outputFile.json="$D/.plant.json" >/dev/null 2>&1; echo "vitest exit $?" ) >> "$OUT"
  node -e '
    const j = require(process.argv[1]);
    console.log(`files ${j.testResults.length} tests ${j.numTotalTests} passed ${j.numPassedTests} failed ${j.numFailedTests} pending ${j.numPendingTests}`);
    for (const f of j.testResults) for (const a of f.assertionResults) if (a.status === "failed")
      console.log(`RED ${f.name.replace(/.*\/src\//, "src/").replace(/.*\/tools\//, "tools/")} :: ${a.fullName} :: ${(a.failureMessages[0] || "").split("\n")[0].slice(0, 220)}`);
    for (const f of j.testResults) if (f.status === "failed" && f.assertionResults.length === 0) console.log(`RED-FILE ${f.name} :: ${(f.message||"").split("\n")[0].slice(0,220)}`);
  ' "$D/.plant.json" >> "$OUT" 2>&1
  ( cd "$D" && npx tsc --noEmit > "$D/.tsc.txt" 2>&1; echo "tsc exit $? $(grep -c 'error TS' "$D/.tsc.txt") errors: $(grep 'error TS' "$D/.tsc.txt" | head -3 | tr '\n' ' ' | cut -c1-300)" ) >> "$OUT"
  rm -rf "$D"
  echo "removed $D; plant dirs after: $(cnt)  abc095-book-absent-* after: $(bac)" >> "$OUT"
done
