#!/usr/bin/env bash
# usage: run-speed.sh <kind> <runs> <out.jsonl> boards...   (interleaved: B,H / H,B alternating)
set -u
S=$(dirname "$(readlink -f "$0")"); B=/home/olger/projects/public/skytalix; H=$B/.claude/worktrees/se-ABC-250
kind=$1; runs=$2; out=$3; shift 3
for board in "$@"; do
  for ((r=0;r<runs;r++)); do
    if (( r % 2 == 0 )); then order="B H"; else order="H B"; fi
    for t in $order; do
      tree=$B; [ $t = H ] && tree=$H
      echo "{\"foreign\":\"$(ps -eo pcpu,comm --sort=-pcpu | awk 'NR>1 && $1>20 {printf "%s:%s ",$2,$1}')\",\"vitest\":$(pgrep -c -f '[v]itest' || true),\"cutechess\":$(pgrep -c -x cutechess-cli || true)}" >> "$out"
      node "$S/probe.mjs" "$tree" "$t" "$kind" "$board" >> "$out"
    done
  done
done
