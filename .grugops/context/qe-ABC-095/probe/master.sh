#!/bin/bash
# qe-ABC-095: the hop's whole timing sequence under ONE global budget of 30 minutes of window time (gates included),
# counted from this script's start. No gate starts after the deadline; a window whose gate passed runs to its end.
# Order: A2/R3 w1 [w2 if void] -> N8 src/cli.test.ts w1 [w2 if void/inadmissible] -> N8 src/cli.real-engine.test.ts w1 [w2].
P=/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-qe-ABC-095/.grugops/context/qe-ABC-095/probe
OUT=${OUT:-$P/windows}; mkdir -p "$OUT"
DEADLINE=$(( $(date +%s) + 1800 ))
LOG="$OUT/master.log"; echo "master_start $(date -u +%FT%TZ) deadline $(date -u -r $DEADLINE +%FT%TZ)" >> "$LOG"
rem() { echo $(( (DEADLINE - $(date +%s)) / 60 )); }
timing() { local w=$1; local m=$(rem); [ "$m" -ge 1 ] || { echo "$w NOT STARTED (budget spent) $(date -u +%FT%TZ)" >> "$LOG"; return 9; }
  GMAX=$m bash $P/window-timing.sh "$OUT/$w"; python3 -I $P/readout-timing.py "$OUT/$w" > "$OUT/$w/readout.out.txt" 2>&1
  echo "$w done $(date -u +%FT%TZ): $(grep -E 'WINDOW|A2 strict|R3 \(graded' "$OUT/$w/readout.out.txt" | tr '\n' ' ')" >> "$LOG"
  ! grep -qE 'WINDOW STATE: VOID|NOT OPENED' "$OUT/$w/readout.out.txt"; }
n8() { local w=$1 set=$2 own=$3 f=$4; local m=$(rem); [ "$m" -ge 1 ] || { echo "$w NOT STARTED (budget spent) $(date -u +%FT%TZ)" >> "$LOG"; return 9; }
  SET=$set OWN=$own TAG=$w GMAX=$m bash $P/window-n8.sh "$OUT/$w"
  if grep -q gate_pass "$OUT/$w/window-once.txt"; then python3 -I $P/readout-n8.py "$OUT/$w" "$w" "$f" > "$OUT/$w/readout.out.txt" 2>&1; else echo "WINDOW STATE: NOT OPENED (gate timeout)" > "$OUT/$w/readout.out.txt"; fi
  echo "$w done $(date -u +%FT%TZ): $(grep -E 'WINDOW STATE|STATE at|ADMISSIBLE' "$OUT/$w/readout.out.txt" | tr '\n' ' ')" >> "$LOG"
  ! grep -qE 'WINDOW STATE|INADMISSIBLE|ROUND-0 COUNTS' "$OUT/$w/readout.out.txt"; }
timing t-w1 || { [ $? -eq 9 ] || timing t-w2; }
n8 n8-cli-w1 src/cli.test.ts 'src/cli[.]test[.]ts' 0.100 || { [ $? -eq 9 ] || n8 n8-cli-w2 src/cli.test.ts 'src/cli[.]test[.]ts' 0.100; }
n8 n8-real-w1 src/cli.real-engine.test.ts 'src/cli[.]real-engine[.]test[.]ts' 16pct || { [ $? -eq 9 ] || n8 n8-real-w2 src/cli.real-engine.test.ts 'src/cli[.]real-engine[.]test[.]ts' 16pct; }
echo "master_end $(date -u +%FT%TZ)" >> "$LOG"
