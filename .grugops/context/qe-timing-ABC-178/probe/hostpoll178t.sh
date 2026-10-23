#!/bin/bash
# qe-timing-ABC-178 host poller (decides nothing; logs only). Derivative of qe-ABC-178/probe/timing/hostpoll.sh (2aeeabda).
# One change: a [v]itest process is attributed by its working directory as own = under this hop's scratch qe178t, else other.
# Every 30 s until the deadline epoch ($1), or until killed. SEC-177-1: counts only; no command line is written.
DL=$1; OUT=$2
[ -s $OUT ] || echo -e "utc\tpower\tload1\tthermal\tvit_total\tvit_own\tvit_other" > $OUT
while [ $(date +%s) -lt $DL ]; do
  t=0; q=0; o=0
  for p in $(pgrep -f '[v]itest'); do
    c=$(lsof -a -p $p -d cwd -Fn 2>/dev/null | sed -n 's/^n//p')
    [ -z "$c" ] && continue
    t=$((t+1)); case "$c" in *scratchpad/qe178t*) q=$((q+1));; *) o=$((o+1));; esac
  done
  echo -e "$(date -u +%FT%TZ)\t$(pmset -g batt | grep -o "'[^']*'" | head -1 | tr -d "'")\t$(sysctl -n vm.loadavg | awk '{print $2}')\t$(notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}')\t$t\t$q\t$o" >> $OUT
  sleep 30
done
