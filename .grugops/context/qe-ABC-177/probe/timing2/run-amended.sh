#!/bin/bash
# qe-ABC-177-timing-2 amended stage driver. Usage: run-amended.sh n8|full <runid>
# A copy of ../timing/run.sh (sha256 da435e75...) with the owner amendment b87c35b6 applied; ONLY these changes:
#  A1. Window: ONE foreground window.mjs 180 s (registered instrument, unchanged) with a pmset/load1 poll every 5 s beside it.
#      Admitted when P1 (AC) holds before and after, every poll reads 'AC Power', and every poll's load1 <= 8.
#      Foreign polls are RECORDED (windowN.out), never gating. Not admitted -> exit 4 (OWED); no retry loop here.
#  A2. All stage outputs move to $D/<runid>/ at the end, so a re-run never overwrites a reading.
#  A3. The registered readouts run UNCHANGED (strict view), then the amended copies (foreign/sampler logged, not discarded)
#      on the same TSVs, then perrun.py (per-run power/load1/foreign record; decides nothing).
# Arms, sampler (ROOT = $$), lane174 CMD/CONDS/ROUNDS/GAP/TAG, powercheck and the H/H2 extract are run.sh's, byte for byte.
STAGE=$1; RUNID=$2
S=/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/c759514b-0b67-4176-b897-647bcb7478de/scratchpad/t177
P=/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/.grugops/context/qe-ABC-177/probe
A=$P/timing2
D=$S/$STAGE
[ -n "$RUNID" ] && [ ! -e "$D/$RUNID" ] || { echo "runid missing or exists"; exit 2; }
st() { echo "$1 power '$(pmset -g batt | grep -o "'[^']*'" | tr -d "'")' load1 $(sysctl -n vm.loadavg | awk '{print $2}') user_procs $(ps -axo uid= | awk -v u=$(id -u) '$1==u' | wc -l | tr -d ' ') $(date -u +%FT%TZ)"; }
ac() { pmset -g batt | grep -q "'AC Power'"; }
st "pre-window"
if ! ac; then echo "P1 FAIL: not AC before window; OWED"; exit 3; fi
( end=$(( $(date +%s) + 182 )); while [ $(date +%s) -lt $end ]; do echo "$(date -u +%FT%TZ)	$(pmset -g batt | grep -o "'[^']*'" | head -1 | tr -d "'")	$(sysctl -n vm.loadavg | awk '{print $2}')"; sleep 5; done ) > $D/window-power.tsv & WP=$!
node $P/window.mjs 180 > $D/window.out; rc=$?
wait $WP
echo "window rc $rc foreignPolls $(grep -o '"foreignPolls": [0-9]*' $D/window.out) (recorded, not gating)"
np=$(wc -l < $D/window-power.tsv | tr -d ' '); nac=$(grep -c "	AC Power	" $D/window-power.tsv); lmax=$(awk -F'\t' 'BEGIN{m=0} $3>m{m=$3} END{print m}' $D/window-power.tsv)
echo "window power polls $np AC $nac load1_max $lmax"
if [ "$np" -lt 30 ] || [ "$np" != "$nac" ] || awk -v m=$lmax 'BEGIN{exit !(m>8)}'; then echo "WINDOW NOT ADMITTED (AC/load1); OWED"; mkdir -p $D/$RUNID; mv $D/window.out $D/window-power.tsv $D/$RUNID/; exit 4; fi
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
  python3 -I $A/readout174a.py $D n8-lane 16pct > $D/readout-n8-lane-a.out 2>&1
  python3 -I $P/powercheck.py $D/n8-lane.tsv > $D/powercheck.out 2>&1
else
  awk -F'\t' 'NR==1 || $2=="H" || $2=="H2"' $D/nfr008-full.tsv > $D/nfr008-full-HH2.tsv
  python3 -I $P/readout-nfr008-174.py $D nfr008-full-HH2 > $D/readout-nfr008-full.out 2>&1
  python3 -I $A/readout-nfr008-174a.py $D nfr008-full-HH2 > $D/readout-nfr008-full-a.out 2>&1
  python3 -I $P/powercheck.py $D/nfr008-full.tsv > $D/powercheck.out 2>&1
fi
python3 -I $A/perrun.py $D/$TAGS.tsv $D/sampler.tsv > $D/perrun.out 2>&1
mkdir -p $D/$RUNID; for f in $D/*; do [ -f "$f" ] && mv "$f" $D/$RUNID/; done
echo "done $STAGE $RUNID"
