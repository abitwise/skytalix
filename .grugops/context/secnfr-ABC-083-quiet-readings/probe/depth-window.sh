#!/bin/bash
# secnfr-ABC-083-quiet-readings: A9 plain-node depth, fresh process per run, rounds alternate base/branch order
# (odd rounds base first, even rounds branch first), per position. load1 + thermalpressurelevel + foreign node/vitest
# processes read immediately before and after every run. Usage: depth-window.sh <first-round> <last-round> <out.tsv>
P=$(cd "$(dirname "$0")" && pwd); A="$P/../arms"; R0=$1; R1=$2; OUT=$3
[ -f "$OUT" ] || printf 'round\tlabel\tposition\tbudget_ms\tdepth\tnodes\telapsed_ms\tnps\tload1_before\tload1_after\tthermal_before\tthermal_after\tforeign_before\tutc\n' > "$OUT"
l1() { sysctl -n vm.loadavg | awk '{print $2}'; }
tp() { notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}'; }
fg() { ps -Ao command | grep -E '[v]itest|node .*src/(cli|engine)' | grep -v one.mjs | wc -l | tr -d ' '; }
for ((r=R0; r<=R1; r++)); do
  if (( r % 2 == 1 )); then ORDER=(base branch); else ORDER=(branch base); fi
  for pos in kiwipete position-6; do
    for c in "${ORDER[@]}"; do
      lb=$(l1); tb=$(tp); fb=$(fg); utc=$(date -u +%Y-%m-%dT%H:%M:%SZ)
      line=$(node "$P/one.mjs" "$A/$c" "$c" "$pos" "$r")
      la=$(l1); ta=$(tp)
      printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\n' "$line" "$lb" "$la" "$tb" "$ta" "$fb" "$utc" | tee -a "$OUT"
    done
  done
done
