#!/bin/bash
# security-nfr-timing-2026-10-23 host poller (logs only, decides nothing). Derivative of qe-timing-ABC-178/probe/hostpoll178t.sh
# (b10cbfd2f33b); one change: "own" = a [v]itest process whose cwd is under this hop's scratch sectime. Every 30 s.
DL=$1; OUT=$2
[ -s $OUT ] || echo -e "utc\tpower\tload1\tthermal\tvit_total\tvit_own\tvit_other" > $OUT
while [ $(date +%s) -lt $DL ]; do
  t=0; q=0; o=0
  for p in $(pgrep -f '[v]itest'); do
    c=$(lsof -a -p $p -d cwd -Fn 2>/dev/null | sed -n 's/^n//p')
    [ -z "$c" ] && continue
    t=$((t+1)); case "$c" in *scratchpad/sectime*) q=$((q+1));; *) o=$((o+1));; esac
  done
  echo -e "$(date -u +%FT%TZ)\t$(pmset -g batt | grep -o "'[^']*'" | head -1 | tr -d "'")\t$(sysctl -n vm.loadavg | awk '{print $2}')\t$(notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}')\t$t\t$q\t$o" >> $OUT
  sleep 30
done
