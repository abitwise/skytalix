#!/usr/bin/env bash
# ABC-227: 5 fresh-process CPU profiles + 5 fresh-process heap-sampling profiles of chooseMove at
# 3 000 ms on each fixed board. Runs only when no process NAMED cutechess* exists (name, not argv:
# a shell whose command text mentions the word must not match); waits otherwise.
# Usage: profile.sh <workDir> [firstRun] [lastRun] [boards...]
# Profiles land in <workDir> unredacted; redact.mts copies them, host paths removed, into raw/profiles/.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
WORK="$1"
FIRST="${2:-1}"
LAST="${3:-5}"
shift $(( $# > 3 ? 3 : $# ))
BOARDS=("$@")
[ ${#BOARDS[@]} -eq 0 ] && BOARDS=(kiwipete position-6 start)
mkdir -p "$WORK"

wait_quiet() {
  while pgrep -i cutechess >/dev/null; do
    echo "cutechess running; waiting 60 s" >&2
    sleep 60
  done
}

for run in $(seq "$FIRST" "$LAST"); do
  for board in "${BOARDS[@]}"; do
    wait_quiet
    node --cpu-prof --cpu-prof-dir="$WORK" --cpu-prof-name="$board-cpu-$run.cpuprofile" \
      --cpu-prof-interval=200 "$HERE/run.mts" "$board" cpu "$WORK" "$run"
    wait_quiet
    node "$HERE/run.mts" "$board" heap "$WORK" "$run"
  done
done
