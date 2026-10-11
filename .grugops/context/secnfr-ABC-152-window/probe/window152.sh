#!/bin/bash
# secnfr-ABC-152-window: ABC-152 V9-V11 per ADR-0042 addendum ruling 6, plus the RISK-ABC152-PUZZLE-SPY wall reading.
# Harness: secnfr-ABC-144-window-b/probe/lane144b.mjs, used IN PLACE and unchanged (ADR-0035 d2).
# Trees (each its own `npm ci`, no symlink): B = main 91024242 (vitest 3.2.7, k = 2), H = 3c55b965 (4.1.11, runner off),
# T = a second tree of B.
#   0  settle gate: 4 consecutive 15 s samples at level 0, load1 <= 4.0, NO [v]itest process (the ticket's step 0)
#   1  warm paired: B, H, T rotated, ROUNDS=9 (round 0 discarded, n = 8), GAP=0, unprofiled
#   2  ONLY if owed (H warm median + T wall R > 9.0 s; decided by readout152.py --owed): the same gate, then cooled:
#      B, H, T rotated, ROUNDS=9, GAP=90
#   3  the same gate, then RISK-ABC152-PUZZLE-SPY (not a gate): puzzle152.sh, PUZZLE_DEEP=1 on src/puzzle-suite.test.ts,
#      B and H rotated, 5 rounds (round 0 discarded, n = 4), GAP=0. Not lane144b.mjs: the reading is the PRINTED wall
# sequences.tsv logs per step: gate start/pass, launch, battery, load1, level.
# Usage (cwd anywhere): bash window152.sh <w152 dir>. The launching command line must not contain the runner's name
# (the gate counts every process whose command line does).
D="$1"; P="$(cd "$(dirname "$0")" && pwd)"; LANE="$P/../../secnfr-ABC-144-window-b/probe/lane144b.mjs"
GMAX="${GMAX:-240}"
ts() { date -u +%Y-%m-%dT%H:%M:%SZ; }
l1() { sysctl -n vm.loadavg | tr -d '{}' | awk '{print $1}'; }
th() { notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}'; }
bt() { pmset -g batt | tr '\t' ' ' | tr -s ' ' | sed -n '1s/.*from //p;2s/.*) //p' | tr '\n' ' '; }
S="$D/sequences.tsv"
printf 'step\tlabel\tgate_start_utc\tgate_pass_utc\tlaunch_utc\tbattery\tload1\tthermal\n' > "$S"
{
  echo "utc_start $(ts)"
  for a in B T H; do echo "$a $(git -C "$D/arms/$a" rev-parse HEAD) runner $(node -p 'require("'"$D/arms/$a"'/node_modules/vitest/package.json").version')"; done
  echo "harness $(shasum -a 256 "$LANE")"
  pmset -g | grep -i lowpowermode; echo "node $(node --version) npm $(npm --version)"
  echo "hw $(sysctl -n hw.model) $(sysctl -n machdep.cpu.brand_string) perf=$(sysctl -n hw.perflevel0.logicalcpu) eff=$(sysctl -n hw.perflevel1.logicalcpu)"
  echo "os $(uname -sr)"
  echo "pmset -g therm:"; pmset -g therm; echo "pmset -g batt:"; pmset -g batt
  notifyutil -g com.apple.system.thermalpressurelevel; echo "load: $(sysctl -n vm.loadavg)"
  echo "VITEST_ env vars set: $(env | grep -c '^VITEST_')"
} > "$D/window-once.txt" 2>&1
rm -f "$D/STOP" "$D/ABORT" "$D/DONE"; bash "$P/sampler.sh" "$D" & echo $! > "$D/sampler.pid"
export ARMS="$D/arms"
step() { # n label ; the harness env is already exported by the caller
  n="$1"; lab="$2"
  gs=$(ts); bash "$P/gate.sh" "$D" "$lab" 4.0 1 "$GMAX" || { echo "$lab GATE_TIMEOUT $(ts)" > "$D/ABORT"; touch "$D/STOP"; exit 3; }
  gp=$(ts); printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' "$n" "$lab" "$gs" "$gp" "$(ts)" "$(bt)" "$(l1)" "$(th)" >> "$S"
  node "$LANE" > "$D/$TAG.console.txt" 2>&1
}
CONDS=B,H,T BASE=B TWIN=T ROUNDS=9 GAP=0 TAG=abc152-warm step 1 settle-then-warm
if python3 -I "$P/readout152.py" "$D" --owed; then
  echo "cooled owed $(ts)" >> "$D/window-once.txt"
  CONDS=B,H,T BASE=B TWIN=T ROUNDS=9 GAP=90 TAG=abc152-cooled step 2 gate-cooled
else
  echo "cooled NOT owed $(ts)" >> "$D/window-once.txt"
fi
gs=$(ts); bash "$P/gate.sh" "$D" gate-puzzle 4.0 1 "$GMAX" || { echo "gate-puzzle GATE_TIMEOUT $(ts)" > "$D/ABORT"; touch "$D/STOP"; exit 3; }
gp=$(ts); printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' 3 gate-puzzle "$gs" "$gp" "$(ts)" "$(bt)" "$(l1)" "$(th)" >> "$S"
bash "$P/puzzle152.sh" "$D" 5 > "$D/abc152-puzzle.console.txt" 2>&1
echo "utc_end $(ts)" >> "$D/window-once.txt"
touch "$D/STOP"; echo DONE > "$D/DONE"
