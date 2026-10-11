#!/bin/bash
# secnfr-ABC-152-window step 3b: re-run of step 3 (RISK-ABC152-PUZZLE-SPY) with the amended puzzle152.sh
# (--reporter=verbose on both arms), behind the same step-0 gate (level 0, load1 <= 4.0, no runner process).
# Usage: bash step3b.sh <w152 dir>
D="$1"; P="$(cd "$(dirname "$0")" && pwd)"; GMAX="${GMAX:-240}"
ts() { date -u +%Y-%m-%dT%H:%M:%SZ; }
l1() { sysctl -n vm.loadavg | tr -d '{}' | awk '{print $1}'; }
th() { notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}'; }
bt() { pmset -g batt | tr '\t' ' ' | tr -s ' ' | sed -n '1s/.*from //p;2s/.*) //p' | tr '\n' ' '; }
rm -f "$D/STOP" "$D/DONE"; bash "$P/sampler.sh.append" "$D" & echo $! > "$D/sampler.pid"
gs=$(ts); bash "$P/gate.sh" "$D" gate-puzzle-3b 4.0 1 "$GMAX" || { echo "gate-puzzle-3b GATE_TIMEOUT $(ts)" > "$D/ABORT"; touch "$D/STOP"; exit 3; }
gp=$(ts); printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' 3b gate-puzzle-3b "$gs" "$gp" "$(ts)" "$(bt)" "$(l1)" "$(th)" >> "$D/sequences.tsv"
bash "$P/puzzle152.sh" "$D" 5 > "$D/abc152-puzzle.console.txt" 2>&1
echo "step3b_end $(ts)" >> "$D/window-once.txt"
touch "$D/STOP"; echo DONE > "$D/DONE"
