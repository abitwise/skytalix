#!/bin/bash
# qe-ABC-101: the N8-LANE reading for ABC-101 under ONE overall WAIT budget of 45 minutes (brief qe-ABC-101, 2026-10-12), counted
# from this script's start, which precedes the first gate sample. A copy of qe-n8-ABC-095/probe/master-n8r.sh (sha256
# e814e6da...b64b1), unchanged in logic, with these changes only, fixed in qe-ABC-101/probe/preregistration.txt before window 1:
#   (M1) P is this hop's probe; the readout is this probe's readout-n8.py (= qe-n8-ABC-095's readout-n8r.py + R4 "changed");
#   (M2) SP is this hop's scratchpad arms directory (qen8101);
#   (M3) the three sets are this ticket's changed test files: S1 src/cli.test.ts (F 0.100 s recorded), S2
#        src/cli.real-engine.test.ts default lane (F provisional 16 %), S3 src/engine.test.ts (F provisional 16 %). All three
#        are on ONE arms set (B = git archive 3ea3e352, T = cp -R of B, H = git archive 98ea0a84); no placeholder, no "added".
#        S1 is read in the readout's R4 "changed" mode (its head count differs); S2 and S3 in the original equal-count mode.
#   (M4) the before/after snapshot line also logs the abc095-book-absent-* count in os.tmpdir() (logged, decides nothing).
# No gate starts after the deadline and a gate never waits past it; a window whose gate passed runs to its end.
# Order: S1 w1 [w2 only if void/inadmissible/not opened] -> S2 w1 [w2] -> S3 w1 [w2]. One re-attempt per set, never a third.
# Before and after every window: one line of load1, thermal, power, foreign runner processes and platform processes.
P=/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-qe-ABC-101/.grugops/context/qe-ABC-101/probe
RD=/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-qe-ABC-101/.grugops/context/qe-ABC-101/probe/readout-n8.py
SP=/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/8527bcf0-376e-4738-b2d4-7789ea9bdd71/scratchpad/qen8101
OUT=${OUT:-$P/windows}; mkdir -p "$OUT"
DEADLINE=$(( $(date +%s) + 2700 ))
LOG="$OUT/master.log"; echo "master_start $(date -u +%FT%TZ) deadline $(date -u -r $DEADLINE +%FT%TZ)" >> "$LOG"
rem() { echo $(( (DEADLINE - $(date +%s)) / 60 )); }
snap() { echo "$1 $(date -u +%FT%TZ) load1 $(sysctl -n vm.loadavg | tr -d '{}' | awk '{print $1}') thermal $(notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}') power '$(pmset -g batt | sed -n "s/.*'\(.*\)'.*/\1/p")' runner_procs $(ps -Ao command | grep -c '[v]itest') platform_procs $(ps -Ao command | grep -c '[o]eselg-labs/platform') book_absent_copies $(ls -d "$(node -p 'require("os").tmpdir()')"/abc095-book-absent-* 2>/dev/null | wc -l | tr -d ' ')" >> "$LOG"; }
n8() { local w=$1 set=$2 own=$3 f=$4 arms=$5 mode=$6; local m=$(rem); [ "$m" -ge 1 ] || { echo "$w NOT STARTED (budget spent) $(date -u +%FT%TZ)" >> "$LOG"; return 9; }
  snap "$w before"
  ARMS=$arms SET=$set OWN=$own TAG=$w GMAX=$m bash $P/window-n8.sh "$OUT/$w"
  snap "$w after"
  if grep -q gate_pass "$OUT/$w/window-once.txt"; then python3 -I $RD "$OUT/$w" "$w" "$f" $mode > "$OUT/$w/readout.out.txt" 2>&1; else echo "WINDOW STATE: NOT OPENED (gate timeout)" > "$OUT/$w/readout.out.txt"; fi
  echo "$w done $(date -u +%FT%TZ): $(grep -E 'WINDOW STATE|STATE at|ADMISSIBLE' "$OUT/$w/readout.out.txt" | tr '\n' ' ')" >> "$LOG"
  ! grep -qE 'WINDOW STATE|INADMISSIBLE|ROUND-0 COUNTS' "$OUT/$w/readout.out.txt"; }
n8 n8-cli-w1 src/cli.test.ts 'src/cli[.]test[.]ts' 0.100 $SP/arms changed || { [ $? -eq 9 ] || n8 n8-cli-w2 src/cli.test.ts 'src/cli[.]test[.]ts' 0.100 $SP/arms changed; }
n8 n8-real-w1 src/cli.real-engine.test.ts 'src/cli[.]real-engine[.]test[.]ts' 16pct $SP/arms || { [ $? -eq 9 ] || n8 n8-real-w2 src/cli.real-engine.test.ts 'src/cli[.]real-engine[.]test[.]ts' 16pct $SP/arms; }
n8 n8-eng-w1 src/engine.test.ts 'src/engine[.]test[.]ts' 16pct $SP/arms || { [ $? -eq 9 ] || n8 n8-eng-w2 src/engine.test.ts 'src/engine[.]test[.]ts' 16pct $SP/arms; }
echo "master_end $(date -u +%FT%TZ)" >> "$LOG"
