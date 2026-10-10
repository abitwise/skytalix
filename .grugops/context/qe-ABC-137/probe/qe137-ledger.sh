#!/bin/bash
# QE ABC-137 — QE's OWN independent runner. usage: qe137-ledger.sh <repo> <sha> <scratch> <build...>
# One fresh git-archive per build, node_modules linked; vitest JSON reporter (not stdout grep); biome + tsc per build.
REPO=$1; SHA=$2; SP=$3; shift 3
H=$(cd "$(dirname "$0")" && pwd)
mkdir -p "$SP/trees" "$SP/out"
for B in "$@"; do
  T=$SP/trees/${SHA:0:8}-$B; rm -rf "$T"; mkdir -p "$T"
  git -C "$REPO" archive "$SHA" | tar -x -C "$T"; ln -s "$REPO/node_modules" "$T/node_modules"
  L1=$(sysctl -n vm.loadavg | awk '{print $2}')
  O=$SP/out/${SHA:0:8}-$B
  node "$H/qe137-plant.mjs" "$T" "$B" > "$O.plant.txt" 2>&1 || { printf "%s\t%s\tload1=%s\tPLANT-FAILED\t%s\n" "${SHA:0:8}" "$B" "$L1" "$(tr '\n' ' ' < "$O.plant.txt")"; continue; }
  (cd "$T" && node node_modules/vitest/vitest.mjs run src/history-pane.nfr.test.ts --reporter=json --outputFile="$O.json" > "$O.txt" 2>&1); RC=$?
  (cd "$T" && node node_modules/@biomejs/biome/bin/biome check src > "$O.lint.txt" 2>&1); LRC=$?
  (cd "$T" && node node_modules/typescript/bin/tsc --noEmit > "$O.tsc.txt" 2>&1); TRC=$?
  R=$(node -e '
    const j = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
    const a = j.testResults.flatMap((f) => f.assertionResults);
    const bad = a.filter((t) => t.status !== "passed");
    const why = bad.map((t) => t.title.slice(0, 40) + " <" + ((t.failureMessages[0] || "").match(/AssertionError: ([^:\n]*)/) || [, "?"])[1] + ">");
    console.log(`total=${a.length}\tpassed=${a.length - bad.length}\tfailed=${bad.length}\tFAILED:${why.join(" | ")}`);
  ' "$O.json" 2>/dev/null || echo "json-unreadable")
  printf "%s\t%s\tload1=%s\texit=%s\t%s\tlint=%s\ttsc=%s\n" "${SHA:0:8}" "$B" "$L1" "$RC" "$R" "$LRC" "$TRC"
done
