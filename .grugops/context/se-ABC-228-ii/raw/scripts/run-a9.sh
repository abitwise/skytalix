#!/usr/bin/env bash
# A9 real-clock half, ALONE. Pre-declared: the A9 reading is round 1's base read per board (A8's form: one
# real-clock chooseMove per board at 3 000 ms); rounds 2-3 and every head read at 4 000 ms are INFO.
# Before EVERY run: wait for 0 cutechess-cli, 0 vitest, load1 <= 2.0, Tctl <= 60.0 C (QE's G6 rule).
S="$(cd "$(dirname "$0")" && pwd)"
OUT="$S/raw/a9-real.jsonl"; WAIT="$S/raw/a9-wait.log"
: > "$OUT"; : > "$WAIT"
clear() {
  l1=$(cut -d' ' -f1 /proc/loadavg); cc=$(pgrep -x cutechess-cli | wc -l); vt=$(pgrep -f "[/]vitest" | wc -l)
  tc=$(sensors 2>/dev/null | awk '/^Tctl:/{gsub(/[+°C]/,"",$2); print $2; exit}')
  echo "{\"at\":\"$(date -u +%FT%TZ)\",\"load1\":$l1,\"cutechess\":$cc,\"vitest\":$vt,\"tctl\":\"${tc:-NA}\"}" >> "$WAIT"
  awk -v l="$l1" -v t="${tc:-99}" 'BEGIN{exit !(l<=2.0 && t<=60.0)}' && [ "$cc" -eq 0 ] && [ "$vt" -eq 0 ]
}
run() { until clear; do sleep 15; done; node "$S/timed.mjs" "$S/$1" "$2" a9 "$3" "$4" >> "$OUT"; tail -1 "$WAIT"; tail -1 "$OUT"; }
for r in 1 2 3; do
  run base kiwipete $r 3000; run base position-6 $r 3000
  run head kiwipete $r 4000; run head position-6 $r 4000
done
clear; tail -1 "$WAIT"; echo DONE
