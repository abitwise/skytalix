#!/bin/bash
# secnfr-ABC-151-window: the thermal gate of ADR-0040 addendum 2 / ABC-151 A5: pass when
# `com.apple.system.thermalpressurelevel` reads 0 on 4 consecutive 15 s samples. Every sample is logged.
# Optional extra conditions (used ONLY for the pre-window settle, step 0): load1 <= MAXLOAD and no runner process.
# Usage: bash gate.sh <outdir> <label> [MAXLOAD|""] [NOFOREIGN 0|1] [MAXMIN]. Exit 0 = pass, 3 = timeout.
D="$1"; L="$2"; ML="${3:-}"; NF="${4:-0}"; MAX="${5:-60}"; O="$D/gate.tsv"
[ -e "$O" ] || printf 'label\tutc\tload1\tthermalpressurelevel\trunner_procs\tpower\tok\tstreak\n' > "$O"
streak=0; end=$(( $(date +%s) + MAX * 60 ))
while :; do
  l=$(sysctl -n vm.loadavg | tr -d '{}' | awk '{print $1}')
  tp=$(notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}')
  fv=$(ps -Ao command | grep -c '[v]itest')
  pw=$(pmset -g batt | sed -n "s/.*'\(.*\)'.*/\1/p")
  ok=1; [ "$tp" = "0" ] || ok=0
  if [ -n "$ML" ]; then awk -v a="$l" -v b="$ML" 'BEGIN{exit !(a<=b)}' || ok=0; fi
  if [ "$NF" = "1" ] && [ "$fv" -gt 0 ]; then ok=0; fi
  if [ "$ok" = "1" ]; then streak=$((streak + 1)); else streak=0; fi
  printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' "$L" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$l" "$tp" "$fv" "$pw" "$ok" "$streak" >> "$O"
  [ "$streak" -ge 4 ] && exit 0
  [ "$(date +%s)" -ge "$end" ] && exit 3
  sleep 15
done
