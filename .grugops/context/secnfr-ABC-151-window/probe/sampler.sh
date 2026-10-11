#!/bin/bash
# secnfr-ABC-151-window: a copy of secnfr-ABC-144-window-b/probe/sampler.sh. TWO changes: the cap is 300 min, not 120 (this window runs the lanes too), and the output file is w151.thermal.tsv. The run used this logic; only this comment line was corrected after the run.
# Usage: bash sampler.sh <outdir>; stops when <outdir>/STOP exists or after 300 min.
W="$1"; OUT="$W/w151.thermal.tsv"
printf 'utc\tload1\tthermalpressurelevel\tcpu_speed_limit\tpower\trunner_procs_incl_this_window\n' > "$OUT"
end=$(( $(date +%s) + 18000 ))
while [ ! -e "$W/STOP" ] && [ "$(date +%s)" -lt "$end" ]; do
  l=$(sysctl -n vm.loadavg | tr -d '{}' | awk '{print $1}')
  tp=$(notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}')
  sl=$(pmset -g therm | sed -n 's/.*CPU_Speed_Limit[[:space:]]*=[[:space:]]*\([0-9]*\).*/\1/p'); [ -z "$sl" ] && sl=none
  pw=$(pmset -g batt | sed -n "s/.*'\(.*\)'.*/\1/p")
  fv=$(ps -Ao command | grep -c '[v]itest')
  printf '%s\t%s\t%s\t%s\t%s\t%s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$l" "$tp" "$sl" "$pw" "$fv" >> "$OUT"
  sleep 15
done
