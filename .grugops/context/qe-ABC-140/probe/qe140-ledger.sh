#!/bin/bash
# QE ABC-140 — QE's OWN runner. usage: qe140-ledger.sh <repo> <rev> <scratch> <file|suite> <build...>
# One fresh `git archive <rev>` tree per build, node_modules linked; spec with a `Q-` component -> qe140-plant.mjs,
# otherwise the Architect's plant.mjs (unchanged copy). vitest JSON reporter; biome check src + tsc --noEmit per build.
REPO=$1; REV=$2; SP=$3; SCOPE=$4; shift 4
H=$(cd "$(dirname "$0")" && pwd)
mkdir -p "$SP/trees" "$SP/out"
for B in "$@"; do
  case "$B" in *Q-*) PL=qe140-plant.mjs;; *) PL=plant.mjs;; esac
  T=$SP/trees/${REV:0:8}-$SCOPE-$B; rm -rf "$T"; mkdir -p "$T"
  git -C "$REPO" archive "$REV" | tar -x -C "$T"; ln -s "$REPO/node_modules" "$T/node_modules"
  L1=$(sysctl -n vm.loadavg | awk '{print $2}')
  O=$SP/out/${REV:0:8}-$SCOPE-$B
  node "$H/$PL" "$T" "$B" > "$O.plant.txt" 2>&1 || { printf "%s\t%s\t%s\t%s\tload1=%s\tPLANT-FAILED\t%s\n" "${REV:0:8}" "$SCOPE" "$B" "$PL" "$L1" "$(tr '\n' ' ' < "$O.plant.txt")"; rm -rf "$T"; continue; }
  if [ "$SCOPE" = file ]; then TGT=src/history-pane.nfr.test.ts; else TGT=; fi
  (cd "$T" && node node_modules/vitest/vitest.mjs run $TGT --reporter=json --outputFile="$O.json" > "$O.txt" 2>&1); RC=$?
  (cd "$T" && node node_modules/@biomejs/biome/bin/biome check src > "$O.lint.txt" 2>&1); LRC=$?
  (cd "$T" && node node_modules/typescript/bin/tsc --noEmit > "$O.tsc.txt" 2>&1); TRC=$?
  R=$(node -e '
    const j = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
    const a = j.testResults.flatMap((f) => f.assertionResults);
    const bad = a.filter((t) => t.status !== "passed");
    const why = bad.map((t) => t.title.slice(0, 44) + " <" + ((t.failureMessages[0] || "").match(/AssertionError: ([^:\n]*)/) || [, "?"])[1] + ">");
    console.log(`files=${j.numTotalTestSuites === undefined ? "?" : j.testResults.length}\ttotal=${a.length}\tpassed=${a.length - bad.length}\tfailed=${bad.length}\tFAILED:${why.join(" | ")}`);
  ' "$O.json" 2>/dev/null || echo "json-unreadable")
  printf "%s\t%s\t%s\t%s\tload1=%s\texit=%s\t%s\tlint=%s\ttsc=%s\n" "${REV:0:8}" "$SCOPE" "$B" "$PL" "$L1" "$RC" "$R" "$LRC" "$TRC"
  rm -rf "$T"
done
