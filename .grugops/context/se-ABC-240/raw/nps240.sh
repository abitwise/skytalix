#!/usr/bin/env bash
# usage: nps240.sh <treeA> <treeB> <runs> <out.jsonl>
# Wait-clear (max 30 min): no cutechess-cli, no vitest (pgrep -f "[/]vitest"). Then interleave A,B per
# board, one process at a time, re-checking before each run (abort on a foreign process). Tctl per run.
set -uo pipefail
S=$(dirname "$(readlink -f "$0")")
a=$1; b=$2; runs=$3; out=$4
clear() { ! pgrep -x cutechess-cli >/dev/null && ! pgrep -f "[/]vitest" >/dev/null; }
tctl() { sensors 2>/dev/null | awk '/^Tctl:/{gsub(/[+°C]/,"",$2); print $2; exit}'; }
waited=0
until clear; do
  if [ "$waited" -ge 1800 ]; then echo '{"abort":"host not clear after 30 min: not measured"}' >> "$out"; exit 4; fi
  sleep 15; waited=$((waited + 15))
done
echo "{\"clear_after_s\":$waited,\"at\":\"$(date -u +%FT%TZ)\",\"load1\":$(cut -d' ' -f1 /proc/loadavg),\"tctl\":\"$(tctl)\"}" >> "$out"
for board in kiwipete position-6 start; do
  for ((r=0;r<runs;r++)); do
    for t in "$a" "$b"; do
      if ! clear; then echo '{"abort":"foreign cutechess-cli or vitest appeared"}' >> "$out"; exit 3; fi
      line=$(node "$S/h/nps.mjs" "$t" "$board")
      echo "${line%\}},\"tctl\":\"$(tctl)\"}" >> "$out"
    done
  done
done
echo "{\"done\":\"$(date -u +%FT%TZ)\",\"load1\":$(cut -d' ' -f1 /proc/loadavg),\"tctl\":\"$(tctl)\"}" >> "$out"
