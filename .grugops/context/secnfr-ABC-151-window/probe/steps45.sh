#!/bin/bash
# secnfr-ABC-151-window, steps 4-5 (ADR-0040 addendum 2's fixed order), launched after window151.sh because step 4 is
# conditional: A3 read warm H median + twin wall R = 9.265 s > 9.0 s, so the cooled state is owed (ABC-151 A3).
#   4  gate (thermal 0 on 4 x 15 s), then cooled: B,H,T rotated, ROUNDS=9, GAP=90 (90 s idle before EVERY run)
#   5  lanes151.sh: every A6 lane at head; then ENGINE_DEEP at base (addendum 2's projected k = 2 vs k = 3 wall)
# Then stops the sampler. Usage: bash steps45.sh <w151 dir>
D="$1"; P="$(cd "$(dirname "$0")" && pwd)"; LANE="$P/../../secnfr-ABC-144-window-b/probe/lane144b.mjs"
ts() { date -u +%Y-%m-%dT%H:%M:%SZ; }
l1() { sysctl -n vm.loadavg | tr -d '{}' | awk '{print $1}'; }
th() { notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}'; }
bt() { pmset -g batt | tr '\t' ' ' | tr -s ' ' | sed -n '1s/.*from //p;2s/.*) //p' | tr '\n' ' '; }
prev=$(awk -F'\t' 'END{print $18}' "$D/abc151-heat-k3.tsv")
gs=$(ts); bash "$P/gate.sh" "$D" gate-cooled "" 0 90 || { echo "gate-cooled GATE_TIMEOUT $(ts)" > "$D/ABORT"; touch "$D/STOP"; exit 3; }
printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' 4 gate-cooled "last-k3-run-start:$prev" "$gs" "$(ts)" "$(ts)" "$(bt)" "$(l1)" "$(th)" >> "$D/sequences.tsv"
ARMS="$D/arms" CONDS=B,H,T BASE=B TWIN=T ROUNDS=9 GAP=90 TAG=abc151-cooled node "$LANE" > "$D/abc151-cooled.console.txt" 2>&1
printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' 5 lanes "$(ts)" - - "$(ts)" "$(bt)" "$(l1)" "$(th)" >> "$D/sequences.tsv"
TREES=H bash "$P/lanes151.sh" "$D"
TREES=B LANES=ENGINE_DEEP bash "$P/lanes151.sh" "$D"
touch "$D/STOP"; echo "utc_end $(ts)" >> "$D/window-once.txt"; echo STEPS45_DONE > "$D/STEPS45_DONE"
