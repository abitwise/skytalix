#!/usr/bin/env bash
# se-ABC-253 informal probe: base src vs halves scratch copy, interleaved, fresh processes, 4 s.
set -euo pipefail
S="$1"; BASE="$2"; PROBE="$3"; OUT="$S/ab"; mkdir -p "$OUT"
for r in ${ROUNDS:-1 2 3}; do for b in ${BOARDS:-kiwipete position-6}; do for v in base probe; do
  src=$BASE; [ $v = probe ] && src=$PROBE
  t=$(sensors 2>/dev/null | awk '/Tctl/{print $2; exit}')
  echo -n "$(date -u +%H:%M:%S) r$r $b $v load1 $(cut -d' ' -f1 /proc/loadavg) Tctl ${t:-NA} cc $(pgrep -xc cutechess-cli || true) | "
  node "$S/run.mts" "$src" "$b" "$OUT/$b-$v-$r.json"
done; done; done
