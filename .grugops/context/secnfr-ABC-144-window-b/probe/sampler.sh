#!/bin/bash
# secnfr-ABC-144-window-b: supplementary 15 s heat/power/load sampler over the whole window (as Window A's raw-sampler.sh.txt).
# Usage: bash sampler.sh <outdir>; stops when <outdir>/STOP exists or after 120 min.
W="$1"; OUT="$W/winb.thermal.tsv"
printf 'utc\tload1\tthermalpressurelevel\tcpu_speed_limit\tpower\trunner_procs_incl_this_window\n' > "$OUT"
end=$(( $(date +%s) + 7200 ))
while [ ! -e "$W/STOP" ] && [ "$(date +%s)" -lt "$end" ]; do
  l=$(sysctl -n vm.loadavg | tr -d '{}' | awk '{print $1}')
  tp=$(notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}')
  sl=$(pmset -g therm | sed -n 's/.*CPU_Speed_Limit[[:space:]]*=[[:space:]]*\([0-9]*\).*/\1/p'); [ -z "$sl" ] && sl=none
  pw=$(pmset -g batt | sed -n "s/.*'\(.*\)'.*/\1/p")
  fv=$(ps -Ao command | grep -c '[v]itest')
  printf '%s\t%s\t%s\t%s\t%s\t%s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$l" "$tp" "$sl" "$pw" "$fv" >> "$OUT"
  sleep 15
done
