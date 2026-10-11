#!/bin/bash
# secnfr-ABC-151-window: ADR-0040 addendum 2's FIXED step order, steps 0-3 (step 4 cooled is conditional, step 5 lanes
# is lanes151.sh). Harness: secnfr-ABC-144-window-b/probe/lane144b.mjs, used IN PLACE and unchanged.
#   0  settle: the gate with load1 <= 4.0 and no runner process (this window's own pre-condition, not the ticket's)
#   1  warm paired: B (base, k = 3), H (head, k = 2), T (twin of base); rotated, ROUNDS=9, round 0 discarded, GAP=0
#   2  gate (4 x 15 s at level 0), then A5 k = 2: 27 back-to-back runs of H only
#   3  gate, then A5 k = 3: 27 back-to-back runs of B only (the base tree; never H with VITEST_MAX_THREADS=3)
# sequences.tsv logs per step: previous run's end, gate start/pass, first-run start, battery, load1, level.
# Usage (cwd anywhere): bash window151.sh <w151 dir>. Leaves the sampler running for steps 4-5.
D="$1"; P="$(cd "$(dirname "$0")" && pwd)"; LANE="$P/../../secnfr-ABC-144-window-b/probe/lane144b.mjs"
ts() { date -u +%Y-%m-%dT%H:%M:%SZ; }
l1() { sysctl -n vm.loadavg | tr -d '{}' | awk '{print $1}'; }
th() { notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}'; }
bt() { pmset -g batt | tr '\t' ' ' | tr -s ' ' | sed -n '1s/.*from //p;2s/.*) //p' | tr '\n' ' '; }
S="$D/sequences.tsv"
printf 'step\tlabel\tprev_end_utc\tgate_start_utc\tgate_pass_utc\tlaunch_utc\tbattery\tload1\tthermal\n' > "$S"
{
  echo "utc_start $(ts)"
  for a in B T H; do echo "$a $(git -C "$D/arms/$a" rev-parse HEAD)"; done
  pmset -g | grep -i lowpowermode; echo "node $(node --version)"
  echo "runner $(node -p 'require("'"$D"'/arms/B/node_modules/vitest/package.json").version')"
  echo "hw $(sysctl -n hw.model) $(sysctl -n machdep.cpu.brand_string) perf=$(sysctl -n hw.perflevel0.logicalcpu) eff=$(sysctl -n hw.perflevel1.logicalcpu)"
  echo "os $(uname -sr)"
  echo "pmset -g therm:"; pmset -g therm; echo "pmset -g batt:"; pmset -g batt
  notifyutil -g com.apple.system.thermalpressurelevel; echo "load: $(sysctl -n vm.loadavg)"
} > "$D/window-once.txt" 2>&1
rm -f "$D/STOP" "$D/ABORT" "$D/STEPS_DONE"; bash "$P/sampler.sh" "$D" & echo $! > "$D/sampler.pid"
export ARMS="$D/arms"
step() { # step label gateargs... ; then the harness with the env already exported by the caller
  n="$1"; lab="$2"; prev="$3"; shift 3
  gs=$(ts); bash "$P/gate.sh" "$D" "$lab" "$@" || { echo "$lab GATE_TIMEOUT $(ts)" > "$D/ABORT"; touch "$D/STOP"; exit 3; }
  gp=$(ts); printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' "$n" "$lab" "$prev" "$gs" "$gp" "$(ts)" "$(bt)" "$(l1)" "$(th)" >> "$S"
  node "$LANE" > "$D/$TAG.console.txt" 2>&1
}
CONDS=B,H,T BASE=B TWIN=T ROUNDS=9 GAP=0 TAG=abc151-warm step 1 settle-then-warm none 4.0 1 90
e1=$(ts)
CONDS=H BASE=H TWIN=T ROUNDS=27 GAP=0 TAG=abc151-heat-k2 step 2 gate-k2 "$e1" "" 0 90
e2=$(ts)
CONDS=B BASE=B TWIN=T ROUNDS=27 GAP=0 TAG=abc151-heat-k3 step 3 gate-k3 "$e2" "" 0 90
echo "steps_0_3_end $(ts)" >> "$D/window-once.txt"
echo STEPS_DONE > "$D/STEPS_DONE"
