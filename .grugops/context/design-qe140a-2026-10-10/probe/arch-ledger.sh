#!/bin/bash
# Architect QE-140-a runner. usage: arch-ledger.sh <repo> <rev> <scratch> <file|suite> <build...>
# Components applied left to right: A-* -> arch-plant.mjs, everything else (Q-*, FMT) -> QE's committed qe140-plant.mjs.
# One fresh `git archive <rev>` tree per build; vitest JSON; biome check src + tsc --noEmit per build.
REPO=$1; REV=$2; SP=$3; SCOPE=$4; shift 4
H=$(cd "$(dirname "$0")" && pwd)
QEPL=$REPO/.grugops/context/qe-ABC-140/probe/qe140-plant.mjs  # committed at bb73aebb; the recorded run read a byte-identical worktree copy
mkdir -p "$SP/trees" "$SP/out"
for B in "$@"; do
  T=$SP/trees/${REV:0:8}-$SCOPE-$B; rm -rf "$T"; mkdir -p "$T"
  git -C "$REPO" archive "$REV" | tar -x -C "$T"; ln -s "$REPO/node_modules" "$T/node_modules"
  O=$SP/out/${REV:0:8}-$SCOPE-$B; : > "$O.plant.txt"; FAIL=
  IFS=+ read -ra PARTS <<< "$B"
  for P in "${PARTS[@]}"; do
    case "$P" in A-*) PL=$H/arch-plant.mjs;; *) PL=$QEPL;; esac
    node "$PL" "$T" "$P" >> "$O.plant.txt" 2>&1 || { FAIL=$P; break; }
  done
  if [ -n "$FAIL" ]; then printf "%s\t%s\t%s\tPLANT-FAILED(%s)\t%s\n" "${REV:0:8}" "$SCOPE" "$B" "$FAIL" "$(tr '\n' ' ' < "$O.plant.txt")"; rm -rf "$T"; continue; fi
  if [ "$SCOPE" = file ]; then TGT=src/history-pane.nfr.test.ts; else TGT=; fi
  (cd "$T" && node node_modules/vitest/vitest.mjs run $TGT --reporter=json --outputFile="$O.json" > "$O.txt" 2>&1); RC=$?
  (cd "$T" && node node_modules/@biomejs/biome/bin/biome check src > "$O.lint.txt" 2>&1); LRC=$?
  (cd "$T" && node node_modules/typescript/bin/tsc --noEmit > "$O.tsc.txt" 2>&1); TRC=$?
  R=$(node -e '
    const j = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
    const a = j.testResults.flatMap((f) => f.assertionResults);
    const bad = a.filter((t) => t.status !== "passed");
    const why = bad.map((t) => t.title.slice(0, 44) + " <" + ((t.failureMessages[0] || "").match(/AssertionError: ([^:\n]*)/) || [, "?"])[1] + ">");
    console.log(`files=${j.testResults.length}\ttotal=${a.length}\tpassed=${a.length - bad.length}\tfailed=${bad.length}\tFAILED:${why.join(" | ")}`);
  ' "$O.json" 2>/dev/null || echo "json-unreadable")
  printf "%s\t%s\t%s\texit=%s\t%s\tlint=%s\ttsc=%s\n" "${REV:0:8}" "$SCOPE" "$B" "$RC" "$R" "$LRC" "$TRC"
  rm -rf "$T"
done
