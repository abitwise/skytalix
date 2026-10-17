#!/bin/bash
# secnfr-ABC-096 gate: secnfr-ABC-152-window/probe/gate.sh's thermal + no-runner rule, plus the brief's second clause:
# no `oeselg-labs/platform` process. Pass on 4 consecutive 15 s samples with thermalpressurelevel 0, 0 vitest
# processes and 0 platform processes. load1 and power are logged, never gated. Every sample is logged.
# Usage: bash gate096.sh <outdir> <label> <MAXMIN>. Exit 0 = pass, 3 = timeout.
D="$1"; L="$2"; MAX="${3:-30}"; O="$D/gate.tsv"
[ -e "$O" ] || printf 'label\tutc\tload1\tthermal\tvitest\tplatform\tpower\tok\tstreak\n' > "$O"
streak=0; end=$(( $(date +%s) + MAX * 60 ))
while :; do
  l=$(sysctl -n vm.loadavg | tr -d '{}' | awk '{print $1}')
  tp=$(notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}')
  fv=$(ps -Ao command | grep -c '[v]itest')
  fp=$(ps -Ao command | grep -c '[o]eselg-labs/platform')
  pw=$(pmset -g batt | sed -n "s/.*'\(.*\)'.*/\1/p")
  ok=1; [ "$tp" = "0" ] || ok=0; [ "$fv" -gt 0 ] && ok=0; [ "$fp" -gt 0 ] && ok=0
  if [ "$ok" = "1" ]; then streak=$((streak + 1)); else streak=0; fi
  printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' "$L" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$l" "$tp" "$fv" "$fp" "$pw" "$ok" "$streak" >> "$O"
  [ "$streak" -ge 4 ] && exit 0
  [ "$(date +%s)" -ge "$end" ] && exit 3
  sleep 15
done
