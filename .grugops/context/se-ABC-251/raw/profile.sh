#!/usr/bin/env bash
# se-ABC-251: informal CPU profile, chooseMove 4 s, kiwipete + position-6, 2 runs each, fresh processes.
set -euo pipefail
S="$(cd "$(dirname "$0")" && pwd)"; SRC="$1"; OUT="$2"; mkdir -p "$OUT"
for run in 1 2; do for b in kiwipete position-6; do
  echo "$(date -u +%H:%M:%S) load1 $(cut -d' ' -f1 /proc/loadavg) cutechess $(pgrep -xc cutechess-cli || true) vitest $(pgrep -fc '[v]itest' || true)"
  node --cpu-prof --cpu-prof-dir="$OUT" --cpu-prof-name="$b-$run.cpuprofile" --cpu-prof-interval=200 "$S/run.mts" "$SRC" "$b" "$OUT/$b-$run.json"
done; done
