#!/usr/bin/env bash
# usage (run under flock): nps.sh <base> <head> <runs> <out.jsonl>. Interleaved base,head per board; load1, Tctl, foreign node procs per run.
set -uo pipefail
S=$(dirname "$(readlink -f "$0")"); a=$1; b=$2; runs=$3; out=$4
tctl() { sensors 2>/dev/null | awk '/^Tctl:/{gsub(/[+°C]/,"",$2); print $2; exit}'; }
foreign() { ps -eo pid,pcpu,comm --sort=-pcpu | awk 'NR>1 && $2>20 {printf "%s:%s:%s ", $1,$3,$2}'; }
echo "{\"at\":\"$(date -u +%FT%TZ)\",\"load1\":$(cut -d' ' -f1 /proc/loadavg),\"tctl\":\"$(tctl)\",\"busy\":\"$(foreign)\"}" >> "$out"
for board in kiwipete position-6 start position-4; do
  for ((r=0;r<runs;r++)); do
    for t in base head; do
      dir=$a; [ "$t" = head ] && dir=$b
      line=$(node "$S/nps.mjs" "$dir" "$t" "$board")
      echo "${line%\}},\"tctl\":\"$(tctl)\",\"busy\":\"$(foreign)\"}" >> "$out"
    done
  done
done
echo "{\"done\":\"$(date -u +%FT%TZ)\",\"load1\":$(cut -d' ' -f1 /proc/loadavg),\"tctl\":\"$(tctl)\"}" >> "$out"
