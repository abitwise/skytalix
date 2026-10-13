#!/bin/bash
# qe2-ABC-101: the N8-LANE reading for ABC-101's A11 commit under ONE overall WAIT budget of 30 minutes (brief qe2-ABC-101,
# 2026-10-13), counted from this script's start, which precedes the first gate sample. A copy of qe-ABC-101/probe/master-n8.sh
# (sha256 08144087...0e7e), unchanged in logic, with these changes only, fixed in qe2-ABC-101/probe/preregistration.txt
# before window 1:
#   (M1) P is this hop's probe; the readout is this probe's readout-n8.py (byte-identical to qe-ABC-101's, sha256 8b18f27e...c5215);
#   (M2) SP is this hop's scratchpad arms directory (qe2101);
#   (M3) ONE set: S1 src/render.test.ts (F provisional 16 %), read in the readout's R4 "changed" mode (A11 adds 3 its, so the
#        head count differs). Arms: B = git archive 081c3715, T = cp -R of B, H = git archive d22a709f;
#   (M4) budget 1800 s, not 2700 s (the brief's 30 min);
#   (M5) the before/after snapshot line also logs cli_procs and their PIDs (the three idle `node src/cli.ts` leftovers,
#        logged, decides nothing).
# No gate starts after the deadline and a gate never waits past it; a window whose gate passed runs to its end.
# Order: S1 w1 [w2 only if void/inadmissible/not opened]. One re-attempt, never a third.
P=/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-qe2-ABC-101/.grugops/context/qe2-ABC-101/probe
RD=/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-qe2-ABC-101/.grugops/context/qe2-ABC-101/probe/readout-n8.py
SP=/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/8527bcf0-376e-4738-b2d4-7789ea9bdd71/scratchpad/qe2101
OUT=${OUT:-$P/windows}; mkdir -p "$OUT"
DEADLINE=$(( $(date +%s) + 1800 ))
LOG="$OUT/master.log"; echo "master_start $(date -u +%FT%TZ) deadline $(date -u -r $DEADLINE +%FT%TZ)" >> "$LOG"
rem() { echo $(( (DEADLINE - $(date +%s)) / 60 )); }
snap() { echo "$1 $(date -u +%FT%TZ) load1 $(sysctl -n vm.loadavg | tr -d '{}' | awk '{print $1}') thermal $(notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}') power '$(pmset -g batt | sed -n "s/.*'\(.*\)'.*/\1/p")' runner_procs $(ps -Ao command | grep -c '[v]itest') platform_procs $(ps -Ao command | grep -c '[o]eselg-labs/platform') book_absent_copies $(ls -d "$(node -p 'require("os").tmpdir()')"/abc095-book-absent-* 2>/dev/null | wc -l | tr -d ' ') cli_procs $(ps -Ao command | grep -c '^node src/[c]li[.]ts') cli_pids $(ps -Ao pid,command | grep '[n]ode src/cli[.]ts' | awk '{print $1}' | paste -sd, -)" >> "$LOG"; }
n8() { local w=$1 set=$2 own=$3 f=$4 arms=$5 mode=$6; local m=$(rem); [ "$m" -ge 1 ] || { echo "$w NOT STARTED (budget spent) $(date -u +%FT%TZ)" >> "$LOG"; return 9; }
  snap "$w before"
  ARMS=$arms SET=$set OWN=$own TAG=$w GMAX=$m bash $P/window-n8.sh "$OUT/$w"
  snap "$w after"
  if grep -q gate_pass "$OUT/$w/window-once.txt"; then python3 -I $RD "$OUT/$w" "$w" "$f" $mode > "$OUT/$w/readout.out.txt" 2>&1; else echo "WINDOW STATE: NOT OPENED (gate timeout)" > "$OUT/$w/readout.out.txt"; fi
  echo "$w done $(date -u +%FT%TZ): $(grep -E 'WINDOW STATE|STATE at|ADMISSIBLE' "$OUT/$w/readout.out.txt" | tr '\n' ' ')" >> "$LOG"
  ! grep -qE 'WINDOW STATE|INADMISSIBLE|ROUND-0 COUNTS' "$OUT/$w/readout.out.txt"; }
n8 n8-render-w1 src/render.test.ts 'src/render[.]test[.]ts' 16pct $SP/arms changed || { [ $? -eq 9 ] || n8 n8-render-w2 src/render.test.ts 'src/render[.]test[.]ts' 16pct $SP/arms changed; }
echo "master_end $(date -u +%FT%TZ)" >> "$LOG"
