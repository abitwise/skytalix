#!/bin/bash
# qe-n8-ABC-095: the N8-LANE re-read for ABC-095 under ONE overall WAIT budget of 45 minutes (brief qe-n8-ABC-095,
# 2026-10-12), counted from this script's start, which precedes the first gate sample (the budget is never longer than
# 45 minutes from the first gate sample). No gate starts after the deadline and a gate never waits past it; a window whose
# gate passed runs to its end. Shape: qe-ABC-095/probe/master.sh (n8 part), unchanged in logic; A2/R3 are not re-read.
# Order: S1 src/cli.test.ts w1 [w2 only if void/inadmissible/not opened] -> S2 src/cli.real-engine.test.ts w1 [w2]
#        -> S3 src/book-engine.test.ts (ADDED file, placeholder base) w1 [w2]. One re-attempt per set, never a third.
# Before and after every window: one line of load1, thermal, power, foreign runner processes and platform processes.
P=/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-qe-n8-ABC-095/.grugops/context/qe-n8-ABC-095/probe
SP=/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/8527bcf0-376e-4738-b2d4-7789ea9bdd71/scratchpad/qen8095
OUT=${OUT:-$P/windows}; mkdir -p "$OUT"
DEADLINE=$(( $(date +%s) + 2700 ))
LOG="$OUT/master.log"; echo "master_start $(date -u +%FT%TZ) deadline $(date -u -r $DEADLINE +%FT%TZ)" >> "$LOG"
rem() { echo $(( (DEADLINE - $(date +%s)) / 60 )); }
snap() { echo "$1 $(date -u +%FT%TZ) load1 $(sysctl -n vm.loadavg | tr -d '{}' | awk '{print $1}') thermal $(notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}') power '$(pmset -g batt | sed -n "s/.*'\(.*\)'.*/\1/p")' runner_procs $(ps -Ao command | grep -c '[v]itest') platform_procs $(ps -Ao command | grep -c '[o]eselg-labs/platform')" >> "$LOG"; }
n8() { local w=$1 set=$2 own=$3 f=$4 arms=$5 mode=$6; local m=$(rem); [ "$m" -ge 1 ] || { echo "$w NOT STARTED (budget spent) $(date -u +%FT%TZ)" >> "$LOG"; return 9; }
  snap "$w before"
  ARMS=$arms SET=$set OWN=$own TAG=$w GMAX=$m bash $P/window-n8r.sh "$OUT/$w"
  snap "$w after"
  if grep -q gate_pass "$OUT/$w/window-once.txt"; then python3 -I $P/readout-n8r.py "$OUT/$w" "$w" "$f" $mode > "$OUT/$w/readout.out.txt" 2>&1; else echo "WINDOW STATE: NOT OPENED (gate timeout)" > "$OUT/$w/readout.out.txt"; fi
  echo "$w done $(date -u +%FT%TZ): $(grep -E 'WINDOW STATE|STATE at|ADMISSIBLE' "$OUT/$w/readout.out.txt" | tr '\n' ' ')" >> "$LOG"
  ! grep -qE 'WINDOW STATE|INADMISSIBLE|ROUND-0 COUNTS' "$OUT/$w/readout.out.txt"; }
n8 n8r-cli-w1 src/cli.test.ts 'src/cli[.]test[.]ts' 0.100 $SP/arms || { [ $? -eq 9 ] || n8 n8r-cli-w2 src/cli.test.ts 'src/cli[.]test[.]ts' 0.100 $SP/arms; }
n8 n8r-real-w1 src/cli.real-engine.test.ts 'src/cli[.]real-engine[.]test[.]ts' 16pct $SP/arms || { [ $? -eq 9 ] || n8 n8r-real-w2 src/cli.real-engine.test.ts 'src/cli[.]real-engine[.]test[.]ts' 16pct $SP/arms; }
n8 n8r-be-w1 src/book-engine.test.ts 'src/book-engine[.]test[.]ts' 16pct $SP/arms3 added || { [ $? -eq 9 ] || n8 n8r-be-w2 src/book-engine.test.ts 'src/book-engine[.]test[.]ts' 16pct $SP/arms3 added; }
echo "master_end $(date -u +%FT%TZ)" >> "$LOG"
