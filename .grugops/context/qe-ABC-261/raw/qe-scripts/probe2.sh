#!/bin/bash
set -u
S=/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/qe-261
P=$S/plants; O=$S/raw/plants
for n in C0-control QX1 QX2 PL3a PL1; do
  cp "$S/qe-probe.test.ts" "$P/$n/src/qe-probe.test.ts"; rm -f "$O/$n.probe.json"
  ( cd "$P/$n" && QEPROBE_OUT="$O/$n.probe.json" NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run src/qe-probe.test.ts > "$O/$n.probe.txt" 2>&1; echo "$n probe rc=$?" )
  rm "$P/$n/src/qe-probe.test.ts"
done
