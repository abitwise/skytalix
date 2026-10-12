#!/bin/bash
# qe-ABC-095 A2 (cold) + R3 (warm miss) window. Usage: GMAX=<min> bash window-timing.sh <window dir>
# Gate: secnfr-ABC-152-window/probe/gate.sh IN PLACE (thermal 0, NO vitest runner process, 4 x 15 s; load1 logged, not gated).
# Then, from the tip tree H (git archive 2307fc11, outside the repository):
#   10 x node time-strict.ts H   (QE's instrument, GRADED for A2)
#   10 x node wire-ABC-095/probe/time.ts H cold-hit   (the SE's instrument, REPORTED beside, not graded)
#    3 x node wire-ABC-095/probe/time.ts H warm-miss  (R3, GRADED)
# Sampler every 2 s throughout (any vitest = foreign; this window runs none). before/after logs around the readings.
D="$1"; mkdir -p "$D"
CTX=/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-qe-ABC-095/.grugops/context
GATE=$CTX/secnfr-ABC-152-window/probe/gate.sh
SE=$CTX/wire-ABC-095/probe/time.ts
QE=$CTX/qe-ABC-095/probe/time-strict.ts
H=/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/8527bcf0-376e-4738-b2d4-7789ea9bdd71/scratchpad/qe095/lane/arms/H
GMAX="${GMAX:-30}"
ts() { date -u +%Y-%m-%dT%H:%M:%S.%3NZ 2>/dev/null || date -u +%Y-%m-%dT%H:%M:%SZ; }
log() { echo "--- $1 $(date -u +%FT%TZ)"; echo "load: $(sysctl -n vm.loadavg)"; echo "thermal: $(notifyutil -g com.apple.system.thermalpressurelevel)"; echo "therm: $(pmset -g therm 2>/dev/null | grep -v '^$' | tr '\n' ' ')"; echo "power: $(pmset -g batt | head -1)"; echo "vitest: $(pgrep -fl '[v]itest' | cut -c1-160 | tr '\n' '|')"; }
{ echo "QE sha256 $(shasum -a 256 "$QE" | cut -d' ' -f1)"; echo "SE sha256 $(shasum -a 256 "$SE" | cut -d' ' -f1)"; echo "gate sha256 $(shasum -a 256 "$GATE" | cut -d' ' -f1)"; echo "node $(node --version); hw $(sysctl -n hw.model)"; echo "H book.json sha256 $(shasum -a 256 $H/data/opening-book/book.json | cut -d' ' -f1)"; } > "$D/timing-once.txt"
rm -f "$D/STOP"
( printf 'utc\tload1\tthermal\tpower\tvitest\n' > "$D/sampler.tsv"
  while [ ! -e "$D/STOP" ]; do
    printf '%s\t%s\t%s\t%s\t%s\n' "$(date -u +%FT%TZ)" "$(sysctl -n vm.loadavg | tr -d '{}' | awk '{print $1}')" "$(notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}')" "$(pmset -g batt | sed -n "s/.*'\(.*\)'.*/\1/p")" "$(ps -Ao command | grep -c '[v]itest')" >> "$D/sampler.tsv"
    sleep 2
  done ) &
echo "gate_start $(date -u +%FT%TZ) GMAX=$GMAX" >> "$D/timing-once.txt"
if ! bash "$GATE" "$D" settle "" 1 "$GMAX"; then echo "GATE_TIMEOUT $(date -u +%FT%TZ)" >> "$D/timing-once.txt"; touch "$D/STOP"; exit 3; fi
echo "gate_pass $(date -u +%FT%TZ)" >> "$D/timing-once.txt"
{
  log before
  echo "=== strict-cold-hit (QE, graded)"; for i in 1 2 3 4 5 6 7 8 9 10; do (cd "$H" && node "$QE" "$H"); done
  echo "=== se-cold-hit (SE, reported)"; for i in 1 2 3 4 5 6 7 8 9 10; do (cd "$H" && node "$SE" "$H" cold-hit); done
  echo "=== warm-miss (R3, graded)"; for i in 1 2 3; do (cd "$H" && node "$SE" "$H" warm-miss); done
  log after
} > "$D/readings.txt" 2>&1
sleep 3; touch "$D/STOP"; echo "utc_end $(date -u +%FT%TZ)" >> "$D/timing-once.txt"
