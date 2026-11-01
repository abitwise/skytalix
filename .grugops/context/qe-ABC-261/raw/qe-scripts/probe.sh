#!/bin/bash
# qe-ABC-261: probe counts in C0, QX1, QX2, PL3a, PL1 plant trees; then the full default lane (npm test) in PL1, QX1, QX2, QB. Under flock.
set -u
S=/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/qe-261
P=$S/plants; O=$S/raw/plants
for n in C0-control QX1 QX2 PL3a PL1; do
  cp "$S/qe-probe.test.ts" "$P/$n/src/qe-probe.test.ts"
  ( cd "$P/$n" && NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run src/qe-probe.test.ts > "$O/$n.probe.txt" 2>&1; echo "$n probe rc=$?"; grep -o 'QEPROBE .*' "$O/$n.probe.txt" )
  rm "$P/$n/src/qe-probe.test.ts"
done
for n in PL1 QX1 QX2 QB; do
  ( cd "$P/$n" && rm -f .test-results/last-run.json; npm test > "$O/$n.npm-test.txt" 2>&1; echo "$n npm test rc=$? :: $(grep -E '^\s+(Tests|Test Files) ' "$O/$n.npm-test.txt" | tr -s ' ' | tr '\n' ' ')"; grep -E '^\s+×' "$O/$n.npm-test.txt" | head -12 )
done
