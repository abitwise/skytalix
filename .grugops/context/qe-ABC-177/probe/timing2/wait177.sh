#!/bin/bash
# cool-down watcher before the one permitted full re-run (r2): polls every 10 s; launches r2 once thermal pressure has read 0
# for 6 consecutive polls on AC; gives up at the deadline (epoch $1) so r2 still ends inside the 60 min bound.
DL=$1; SP=/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/c759514b-0b67-4176-b897-647bcb7478de/scratchpad
L=$SP/t177/cooldown.tsv; echo "utc	thermal	power	load1	foreign_vitest_procs" > $L
ok=0
while [ $(date +%s) -lt $DL ]; do
  th=$(notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}')
  pw=$(pmset -g batt | grep -o "'[^']*'" | head -1 | tr -d "'")
  echo "$(date -u +%FT%TZ)	$th	$pw	$(sysctl -n vm.loadavg | awk '{print $2}')	$(ps -axo command | grep -c '[v]itest')" >> $L
  if [ "$pw" != "AC Power" ]; then echo "POWER OFF AC; OWED"; exit 3; fi
  if [ "$th" = "0" ]; then ok=$((ok+1)); else ok=0; fi
  if [ $ok -ge 6 ]; then echo "cool at $(date -u +%FT%TZ); launching r2"; exec bash $SP/go177.sh amd full r2; fi
  sleep 10
done
echo "NO COOL-DOWN before deadline $(date -u -r $DL +%FT%TZ); r2 not run"; exit 5
