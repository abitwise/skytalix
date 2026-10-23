#!/bin/bash
# security-nfr-timing-2026-10-23 stage driver (ABC-200 N8-LANE). Derivative of qe-timing-ABC-178/probe/run178t.sh (d168f2e7e5b4).
# Changes, nothing else:
#  U1. S is this hop's scratch dir (sectime/p1); only the n8 stage exists.
#  U2. The n8 CMD is the ABC-200 narrow set resolved at HEAD 5bf1e3d6 (5 files), with the SUITE heap row
#      NODE_OPTIONS=--max-old-space-size=128 (AGENTS.md: 2+ files use 128; the heap guard refuses 400 there).
#  U3. Readouts get the registered 4th argument "multi" (R5): B = T = B's round-0 counts, H = H's round-0 counts.
#  U4. The grading readout is readout200.py (thermal kept and flagged, the brief); readout174a.py (thermal discards) and
#      readout174.py (strict) run beside it, reported only.
# Window admission (window.mjs 180 s, 0 foreign polls, AC every 5 s poll, load1 <= 8 every poll), the sampler, lane174, powercheck
# and perrun are run178t.sh's.
STAGE=n8; RUNID=$1
S=/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/sectime/p1
P=$S/inst
D=$S/$STAGE
SET="src/cli.real-engine.test.ts src/cli.test.ts src/engine.test.ts src/line-input.test.ts src/startup-questions.test.ts"
[ -n "$RUNID" ] && [ ! -e "$D/$RUNID" ] || { echo "runid missing or exists"; exit 2; }
st() { echo "$1 power '$(pmset -g batt | grep -o "'[^']*'" | tr -d "'")' load1 $(sysctl -n vm.loadavg | awk '{print $2}') user_procs $(ps -axo uid= | awk -v u=$(id -u) '$1==u' | wc -l | tr -d ' ') thermal $(notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}') vitest_procs $(pgrep -f '[v]itest' | wc -l | tr -d ' ') $(date -u +%FT%TZ)"; }
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
ARMS=$D/arms CONDS=B,T,H BASE=B TWIN=T ROUNDS=9 GAP=0 TAG=n8-lane \
  CMD="env NODE_OPTIONS=--max-old-space-size=128 npx vitest run $SET --reporter=default --reporter=json --outputFile.json=.test-results/last-run.json" \
  node $P/lane174.mjs > $D/lane.log 2>&1
echo "lane rc $?"
sleep 6; kill -TERM $SP
st "post-lane"
python3 -I $P/readout200.py $D n8-lane 16pct multi > $D/readout-n8-lane-200.out 2>&1
python3 -I $P/readout174a.py $D n8-lane 16pct multi > $D/readout-n8-lane-a.out 2>&1
python3 -I $P/readout174.py $D n8-lane 16pct multi > $D/readout-n8-lane.out 2>&1
python3 -I $P/powercheck.py $D/n8-lane.tsv > $D/powercheck.out 2>&1
python3 -I $P/perrun.py $D/n8-lane.tsv $D/sampler.tsv > $D/perrun.out 2>&1
mkdir -p $D/$RUNID; for f in $D/*; do [ -f "$f" ] && mv "$f" $D/$RUNID/; done
echo "done $STAGE $RUNID"
