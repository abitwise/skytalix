#!/bin/bash
# security-nfr-timing-2026-10-23 part (2): ABC-201 A1-A3 driver. Usage: run201.sh <attempt id> <deadline epoch>
# Order (registered): clone -> A1 install -> start gate (60 s of OK polls) -> A3 series (child 1 = the FIRST launch after the
# install) -> A2 piped smoke run. Every step's preconditions are logged by st(). Exit 0 = ran to the end; 4 = deadline before A3.
ATT=$1; DL=$2
P2=/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/sectime/p2
REPO=/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example
SHA=c91445e30c38f26566593b6131122c34fbf32798
A=$P2/$ATT; [ ! -e $A ] || { echo "attempt exists"; exit 2; }
mkdir -p $A/a3 $A/npm-cache; : > $A/empty-npmrc
export npm_config_cache=$A/npm-cache npm_config_userconfig=$A/empty-npmrc
unset NODE_OPTIONS
st() { echo "$1	$(date -u +%FT%TZ)	power '$(pmset -g batt | grep -o "'[^']*'" | head -1 | tr -d "'")'	load1 $(sysctl -n vm.loadavg | awk '{print $2}')	thermal $(notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}')	vitest_procs $(pgrep -f '[v]itest' | wc -l | tr -d ' ')" | tee -a $A/st.tsv; }
st pre-clone
git clone -q $REPO $A/clone && git -C $A/clone -c advice.detachedHead=false checkout -q --detach $SHA
echo "clone HEAD $(git -C $A/clone rev-parse HEAD); origin main $(git -C $A/clone rev-parse origin/main); remote $(git -C $A/clone remote -v | head -1)" | tee $A/clone.txt
git -C $A/clone status --porcelain > $A/status-before-install.txt; echo "status lines before install: $(wc -l < $A/status-before-install.txt | tr -d ' ')" | tee -a $A/clone.txt
echo "cache entries before install: $(ls -A $A/npm-cache | wc -l | tr -d ' '); userconfig bytes: $(wc -c < $A/empty-npmrc | tr -d ' ')" | tee -a $A/clone.txt
st pre-install
( cd $A/clone && /usr/bin/time -p npm install > $A/a1-install.out 2> $A/a1-install.err; echo "A1 npm install rc $?" > $A/a1-rc.txt )
cat $A/a1-rc.txt; grep -E '^(real|user|sys) ' $A/a1-install.err; grep -E 'added [0-9]+ packages' $A/a1-install.out
git -C $A/clone status --porcelain > $A/status-after-install.txt; echo "status lines after install: $(wc -l < $A/status-after-install.txt | tr -d ' ')"
st post-install
# start gate: OK = AC, load1 <= 8, 0 [v]itest; thermal recorded; 60 s of OK opens it
since=0; echo -e "utc\tthermal\tpower\tload1\tvitest\tok\tspan" > $A/gate.tsv
while :; do
  now=$(date +%s); [ $now -ge $DL ] && { st deadline; echo "DEADLINE before A3"; exit 4; }
  th=$(notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}'); pw=$(pmset -g batt | grep -o "'[^']*'" | head -1 | tr -d "'")
  l1=$(sysctl -n vm.loadavg | awk '{print $2}'); vl=$(ps -axo command= | grep -c 'vites[t]')
  ok=0; if [ "$vl" = 0 ] && [ "$pw" = "AC Power" ] && awk -v m=$l1 'BEGIN{exit !(m<=8)}'; then ok=1; fi
  if [ $ok = 1 ]; then [ $since = 0 ] && since=$now; span=$((now-since)); else since=0; span=0; fi
  echo -e "$(date -u +%FT%TZ)\t$th\t$pw\t$l1\t$vl\t$ok\t$span" >> $A/gate.tsv
  [ $ok = 1 ] && [ $span -ge 60 ] && break
  sleep 5
done
st pre-a3
for i in 1 2 3 4 5 6 7 8 9 10; do
  st "a3-child-$i" > /dev/null
  node $P2/inst/nfr007-201.mjs $A/clone $A/a3 $i >> $A/a3/a3.jsonl
done
st post-a3
( cd $A/clone && printf 'e4\n' | npm run --silent chess -- --colour white --difficulty 5 > $A/a2.stdout 2> $A/a2.stderr; echo "A2 exit $?" > $A/a2-rc.txt )
cat $A/a2-rc.txt; echo "A2 stderr bytes $(wc -c < $A/a2.stderr | tr -d ' ')"
st post-a2
git -C $A/clone status --porcelain > $A/status-end.txt; echo "status lines at end: $(wc -l < $A/status-end.txt | tr -d ' ')"
echo "done $ATT"
