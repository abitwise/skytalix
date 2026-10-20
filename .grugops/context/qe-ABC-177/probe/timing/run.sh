#!/bin/bash
# qe-ABC-177-timing stage driver. Usage: run.sh n8|full
# Order per preregistration.txt: P1 (AC) -> foreground window.mjs 180 s (0 foreign polls) -> P1 again + load1 -> sampler beside lane174 -> readouts + powercheck (P2).
# Instruments are invoked as registered; none is edited. A failed window retries (max 6 attempts); no window => exit 4 (OWED).
STAGE=$1
S=/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/c759514b-0b67-4176-b897-647bcb7478de/scratchpad/t177
P=/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/.grugops/context/qe-ABC-177/probe
D=$S/$STAGE
st() { echo "$1 power '$(pmset -g batt | grep -o "'[^']*'" | tr -d "'")' load1 $(sysctl -n vm.loadavg | awk '{print $2}') user_procs $(ps -axo uid= | awk -v u=$(id -u) '$1==u' | wc -l | tr -d ' ') $(date -u +%FT%TZ)"; }
ac() { pmset -g batt | grep -q "'AC Power'"; }
ok=0
for a in 1 2 3 4 5 6; do
  st "attempt $a pre-window"
  if ! ac; then echo "P1 FAIL: not AC before window; OWED"; exit 3; fi
  node $P/window.mjs 180 > $D/window$a.out; rc=$?
  echo "window $a rc $rc foreignPolls $(grep -o '"foreignPolls": [0-9]*' $D/window$a.out)"
  if [ $rc -eq 0 ]; then ok=1; break; fi
done
[ $ok -eq 1 ] || { echo "NO ADMISSIBLE WINDOW after 6 attempts; OWED"; exit 4; }
st "post-window"
if ! ac; then echo "P1 FAIL after window; OWED"; exit 3; fi
node $P/sampler174.mjs $D/sampler.tsv $$ & SP=$!
if [ "$STAGE" = n8 ]; then
  ARMS=$D/arms CONDS=B,T,H BASE=B TWIN=T ROUNDS=9 GAP=0 TAG=n8-lane \
    CMD="env NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci-session.test.ts --reporter=default --reporter=json --outputFile.json=.test-results/last-run.json" \
    node $P/lane174.mjs > $D/lane.log 2>&1
  TAGS=n8-lane
else
  ARMS=$D/arms CONDS=B,T,H,H2 BASE=B TWIN=T ROUNDS=9 GAP=0 TAG=nfr008-full node $P/lane174.mjs > $D/lane.log 2>&1
  TAGS=nfr008-full
fi
echo "lane rc $?"
sleep 6; kill -TERM $SP
st "post-lane"
if [ "$STAGE" = n8 ]; then
  python3 -I $P/readout174.py $D n8-lane 16pct > $D/readout-n8-lane.out 2>&1
  python3 -I $P/powercheck.py $D/n8-lane.tsv > $D/powercheck.out 2>&1
else
  # readout-nfr008-174.py is a two-arm (H, H2) readout: fed the H/H2 rows of the same TSV, verbatim, header kept.
  awk -F'\t' 'NR==1 || $2=="H" || $2=="H2"' $D/nfr008-full.tsv > $D/nfr008-full-HH2.tsv
  python3 -I $P/readout-nfr008-174.py $D nfr008-full-HH2 > $D/readout-nfr008-full.out 2>&1
  python3 -I $P/powercheck.py $D/nfr008-full.tsv > $D/powercheck.out 2>&1
fi
echo "done $STAGE"
