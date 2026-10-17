#!/bin/bash
# secnfr-ABC-096 timing window. Usage: GMAX=<min> bash window096.sh <window dir>
# Gate (gate096.sh), then from the arms outside the repository (H = git archive c11bfec8, B = git archive 6edadcf0):
#   T1  6 cases x 10 fresh processes of a4-frame.ts on H (case-major order)
#   T2  10 rounds, each: nfr007-run H hook=1 | nfr007-run H hook=0 | nfr007-run B hook=0 | first-call-replica H
# A 2 s sampler runs throughout. Every process gets a before/after line in runs.tsv.
D="$1"; mkdir -p "$D"
P=/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-ABC-096/.grugops/context/secnfr-ABC-096/probe
ARMS=/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/8527bcf0-376e-4738-b2d4-7789ea9bdd71/scratchpad/secnfr096/arms
H=$ARMS/H; B=$ARMS/B; GMAX="${GMAX:-30}"
snap() { printf '%s\t%s\t%s\t%s\t%s\t%s\t%s' "$(date -u +%FT%TZ)" "$(sysctl -n vm.loadavg | tr -d '{}' | awk '{print $1}')" "$(notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}')" "$(ps -Ao command | grep -c '[v]itest')" "$(ps -Ao command | grep -c '[o]eselg-labs/platform')" "$(pmset -g batt | sed -n "s/.*'\(.*\)'.*/\1/p")" "$(pmset -g | awk '/lowpowermode/{print $2}')"; }
{ for f in a4-frame.ts first-call-hook.mjs nfr007-run.mjs first-call-replica.ts gate096.sh window096.sh; do echo "$f sha256 $(shasum -a 256 $P/$f | cut -d' ' -f1)"; done
  echo "node $(node --version); npm $(npm --version); hw $(sysctl -n hw.model); darwin $(uname -r); macOS $(sw_vers -productVersion)"
  for t in H B; do echo "$t src/cli.ts $(shasum -a 256 $ARMS/$t/src/cli.ts | cut -c1-16) book.ts $(shasum -a 256 $ARMS/$t/src/book.ts | cut -c1-16) render-seam.ts $(shasum -a 256 $ARMS/$t/src/render-seam.ts | cut -c1-16) book.json $(shasum -a 256 $ARMS/$t/data/opening-book/book.json | cut -c1-16)"; done
} > "$D/once.txt"
rm -f "$D/STOP"
( printf 'utc\tload1\tthermal\tvitest\tplatform\tpower\tlowpower\n' > "$D/sampler.tsv"
  while [ ! -e "$D/STOP" ]; do snap >> "$D/sampler.tsv"; echo >> "$D/sampler.tsv"; sleep 2; done ) &
echo "gate_start $(date -u +%FT%TZ) GMAX=$GMAX" >> "$D/once.txt"
if ! bash $P/gate096.sh "$D" gate "$GMAX"; then echo "GATE_TIMEOUT $(date -u +%FT%TZ)" >> "$D/once.txt"; touch "$D/STOP"; exit 3; fi
echo "gate_pass $(date -u +%FT%TZ)" >> "$D/once.txt"
printf 'series\ti\tbefore_utc\tb_load1\tb_thermal\tb_vitest\tb_platform\tb_power\tb_lowpower\tafter_utc\ta_load1\ta_thermal\ta_vitest\ta_platform\ta_power\ta_lowpower\tjson\n' > "$D/runs.tsv"
run() { local s="$1" i="$2"; shift 2; local b; b=$(snap); local j; j=$("$@" 2>&1 | tail -1); printf '%s\t%s\t%s\t%s\t%s\n' "$s" "$i" "$b" "$(snap)" "$j" >> "$D/runs.tsv"; }
for c in a4-ascii a4-unicode a4-astral x-sep x-max x-real; do
  for i in 1 2 3 4 5 6 7 8 9 10; do run "T1-$c" $i node $P/a4-frame.ts $H $c; done
done
for i in 1 2 3 4 5 6 7 8 9 10; do
  run T2-H-hook $i node $P/nfr007-run.mjs $H 1 "$D/first-call.jsonl"
  run T2-H-plain $i node $P/nfr007-run.mjs $H 0 "$D/unused.jsonl"
  run T2-B-plain $i node $P/nfr007-run.mjs $B 0 "$D/unused.jsonl"
  run T2-replica $i node $P/first-call-replica.ts $H
done
echo "readings_end $(date -u +%FT%TZ)" >> "$D/once.txt"
sleep 3; touch "$D/STOP"; echo "utc_end $(date -u +%FT%TZ)" >> "$D/once.txt"
