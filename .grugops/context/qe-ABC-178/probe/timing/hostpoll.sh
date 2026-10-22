#!/bin/bash
# qe-ABC-178 host-fitness poller (decides nothing; logs only). Every 30 s until the deadline epoch ($1).
# A vitest process (command line matching [v]itest) is attributed by its working directory: qe196 = wt-qe-ABC-196 or its scratch (scratchpad/qe196; added 14:46Z),
# pubgrugops = Projects/public/grugops, other = anything else. SEC-177-1: counts only; no command line is written.
DL=$1; OUT=$2
[ -s $OUT ] || echo -e "utc\tpower\tload1\tthermal\tvit_total\tvit_qe196\tvit_pubgrugops\tvit_other" > $OUT
while [ $(date +%s) -lt $DL ]; do
  t=0; q=0; g=0; o=0
  for p in $(pgrep -f '[v]itest'); do
    c=$(lsof -a -p $p -d cwd -Fn 2>/dev/null | sed -n 's/^n//p')
    [ -z "$c" ] && continue
    t=$((t+1)); case "$c" in *wt-qe-ABC-196*|*scratchpad/qe196*) q=$((q+1));; *Projects/public/grugops*) g=$((g+1));; *) o=$((o+1));; esac
  done
  echo -e "$(date -u +%FT%TZ)\t$(pmset -g batt | grep -o "'[^']*'" | head -1 | tr -d "'")\t$(sysctl -n vm.loadavg | awk '{print $2}')\t$(notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}')\t$t\t$q\t$g\t$o" >> $OUT
  sleep 30
done
