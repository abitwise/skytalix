#!/bin/bash
# qe-ABC-178 stage driver. Usage: run178.sh n8|full <runid>
# Derivative of qe-ABC-177/probe/timing2/run-amended.sh (6f44786ba6c9). Changes, nothing else:
#  C1. Paths: instruments are byte copies in $S/inst; stage dirs are $S/<stage>.
#  C2. Window admission adds foreignPolls == 0 (ABC-178 page B8: "window.mjs, 180 s foreground, 0 foreign polls"; brief:
#      no other vitest running). Not admitted -> exit 4 (the gate may try again before its deadline).
#  C3. full: after the strict (174) and 174a readouts, readout-nfr008-174b.py runs too (the Orchestrator's ruling 5aaf7cec:
#      "thermal kept and flagged" for ABC-178's B8 reading only). n8 (B7) readouts are unchanged (174, 174a).
#  C4. n8: both readouts get their registered 4th argument `changed` (R4: R1 moves the one file's row count, B = T = 126,
#      H = 127), so H's rounds are read against H's own round-0 count. No other readout argument changes.
# Arms, sampler (ROOT = $$), lane174 CMD/CONDS/ROUNDS/GAP/TAG, powercheck, perrun and the H/H2 extract are run-amended.sh's.
STAGE=$1; RUNID=$2
S=/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/q178/t178
P=$S/inst
A=$S/inst
D=$S/$STAGE
[ -n "$RUNID" ] && [ ! -e "$D/$RUNID" ] || { echo "runid missing or exists"; exit 2; }
st() { echo "$1 power '$(pmset -g batt | grep -o "'[^']*'" | tr -d "'")' load1 $(sysctl -n vm.loadavg | awk '{print $2}') user_procs $(ps -axo uid= | awk -v u=$(id -u) '$1==u' | wc -l | tr -d ' ') thermal $(notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}') $(date -u +%FT%TZ)"; }
ac() { pmset -g batt | grep -q "'AC Power'"; }
st "pre-window"
if ! ac; then echo "P1 FAIL: not AC before window; OWED"; exit 3; fi
( end=$(( $(date +%s) + 182 )); while [ $(date +%s) -lt $end ]; do echo "$(date -u +%FT%TZ)	$(pmset -g batt | grep -o "'[^']*'" | head -1 | tr -d "'")	$(sysctl -n vm.loadavg | awk '{print $2}')"; sleep 5; done ) > $D/window-power.tsv & WP=$!
node $P/window.mjs 180 > $D/window.out; rc=$?
wait $WP
fp=$(grep -o '"foreignPolls": [0-9]*' $D/window.out | grep -o '[0-9]*$')
echo "window rc $rc foreignPolls $fp"
np=$(wc -l < $D/window-power.tsv | tr -d ' '); nac=$(grep -c "	AC Power	" $D/window-power.tsv); lmax=$(awk -F'\t' 'BEGIN{m=0} $3>m{m=$3} END{print m}' $D/window-power.tsv)
echo "window power polls $np AC $nac load1_max $lmax"
if [ "$np" -lt 30 ] || [ "$np" != "$nac" ] || awk -v m=$lmax 'BEGIN{exit !(m>8)}' || [ "$fp" != "0" ]; then echo "WINDOW NOT ADMITTED (AC/load1/foreign); not run"; mkdir -p $D/$RUNID; mv $D/window.out $D/window-power.tsv $D/$RUNID/; exit 4; fi
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
  python3 -I $P/readout174.py $D n8-lane 16pct changed > $D/readout-n8-lane.out 2>&1
  python3 -I $A/readout174a.py $D n8-lane 16pct changed > $D/readout-n8-lane-a.out 2>&1
  python3 -I $P/powercheck.py $D/n8-lane.tsv > $D/powercheck.out 2>&1
else
  awk -F'\t' 'NR==1 || $2=="H" || $2=="H2"' $D/nfr008-full.tsv > $D/nfr008-full-HH2.tsv
  python3 -I $P/readout-nfr008-174.py $D nfr008-full-HH2 > $D/readout-nfr008-full.out 2>&1
  python3 -I $A/readout-nfr008-174a.py $D nfr008-full-HH2 > $D/readout-nfr008-full-a.out 2>&1
  python3 -I $A/readout-nfr008-174b.py $D nfr008-full-HH2 > $D/readout-nfr008-full-b.out 2>&1
  python3 -I $P/powercheck.py $D/nfr008-full.tsv > $D/powercheck.out 2>&1
fi
python3 -I $A/perrun.py $D/$TAGS.tsv $D/sampler.tsv > $D/perrun.out 2>&1
mkdir -p $D/$RUNID; for f in $D/*; do [ -f "$f" ] && mv "$f" $D/$RUNID/; done
echo "done $STAGE $RUNID"
