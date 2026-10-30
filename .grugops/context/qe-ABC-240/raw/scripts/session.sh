#!/usr/bin/env bash
# qe-ABC-240 timing session: one run, one search process at a time. usage: session.sh <treesDir> <outDir>
# Order: G6 -> A3 -> per-item INFO (item1 vs base, tip vs item1).
# Every pair: wait-clear first (host.sh); a 0.5 s sampler runs beside it; a post-check follows it.
# A cutechess-cli or vitest seen before, during or after the pair VOIDS the pair: its rows go to voided.jsonl and the
# same pair is run again after a wait-clear. 10 voids of one pair = UNRESOLVED (exit 4).
set -uo pipefail
S=$(dirname "$(readlink -f "$0")"); T=$(readlink -f "$1"); O=$2; mkdir -p "$O"
H="$O/host.jsonl"; L="$O/session.log"
tctl() { sensors 2>/dev/null | awk '/^Tctl:/{gsub(/[+°C]/,"",$2); print $2; exit}'; }
now() { date -u +%FT%TZ; }
foreign() { pgrep -x cutechess-cli >/dev/null || pgrep -f "[/]vitest" >/dev/null; }
gate() { "$S/wait-clear.sh" "$H" || { echo "{\"unresolved\":\"$1\",\"at\":\"$(now)\"}" >> "$L"; exit 4; }; }
# one_pair reading round board first second -> 0 clean (rows appended), 1 voided
one_pair() {
  local reading=$1 r=$2 board=$3 first=$4 second=$5 tmp="$O/.pair.jsonl" hits="$O/.hits"
  : > "$tmp"; : > "$hits"
  "$S/sampler.sh" "$hits" & local sp=$!
  for t in $first $second; do
    local t0; t0=$(tctl)
    local line; line=$(node "$S/timed.mjs" "$T/$t" "$board" "$reading" "$r")
    echo "${line%\}},\"tctl0\":\"${t0:-NA}\",\"tctl1\":\"$(tctl)\"}" >> "$tmp"
  done
  kill "$sp" 2>/dev/null; wait "$sp" 2>/dev/null
  "$S/host.sh" >> "$H"
  if [ -s "$hits" ] || foreign; then
    sed 's/^{/{"voided":true,/' "$tmp" >> "$O/voided.jsonl"
    echo "{\"void\":\"$reading r$r $board\",\"at\":\"$(now)\",\"hits\":$(wc -l < "$hits")}" >> "$L"
    return 1
  fi
  cat "$tmp" >> "$O/$reading.jsonl"
}
# pairs reading A B boards...: 5 rounds; odd rounds A first, even rounds B first
pairs() {
  local reading=$1 a=$2 b=$3; shift 3
  for r in 1 2 3 4 5; do
    for board in "$@"; do
      if (( r % 2 )); then order="$a $b"; else order="$b $a"; fi
      local voids=0
      while :; do
        gate "$reading"
        if one_pair "$reading" "$r" "$board" $order; then break; fi
        voids=$((voids + 1))
        if [ "$voids" -ge 10 ]; then echo "{\"unresolved\":\"$reading r$r $board\",\"at\":\"$(now)\"}" >> "$L"; exit 4; fi
      done
    done
  done
}
echo "{\"session_start\":\"$(now)\",\"load1\":$(cut -d' ' -f1 /proc/loadavg),\"tctl\":\"$(tctl)\"}" >> "$L"
pairs g6 base tip kiwipete position-6
pairs a3 base tip kiwipete position-6 start
pairs item1 base item1 kiwipete position-6 start
pairs item2 item1 tip kiwipete position-6 start
echo "{\"session_end\":\"$(now)\",\"load1\":$(cut -d' ' -f1 /proc/loadavg),\"tctl\":\"$(tctl)\"}" >> "$L"
