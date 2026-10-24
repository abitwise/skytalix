#!/bin/bash
# Owner preconditions for a timed window: AC power, load1 <= 8, no foreign vitest.
# usage: precheck.sh [own-pid-to-exclude...]  -> one line; exit 0 when all hold.
ac=$(pmset -g batt | head -1 | grep -c "AC Power")
load1=$(sysctl -n vm.loadavg | awk '{print $2}')
own=" $* "
foreign=""
while read -r pid rest; do
  [ -z "$pid" ] && continue
  # exclude own tree: any listed pid or a descendant of one
  p=$pid; mine=0
  while [ -n "$p" ] && [ "$p" != "1" ] && [ "$p" != "0" ]; do
    case "$own" in *" $p "*) mine=1; break;; esac
    p=$(ps -o ppid= -p "$p" 2>/dev/null | tr -d ' ')
  done
  [ $mine -eq 0 ] && foreign="$foreign $pid"
done < <(pgrep -fl 'node.*vitest')
ok=1; [ "$ac" = "1" ] || ok=0
awk -v l="$load1" 'BEGIN{exit !(l<=8)}' || ok=0
[ -z "$foreign" ] || ok=0
echo "$(date -u +%FT%TZ) AC=$ac load1=$load1 foreign_vitest=[${foreign# }] ok=$ok"
[ $ok -eq 1 ]
