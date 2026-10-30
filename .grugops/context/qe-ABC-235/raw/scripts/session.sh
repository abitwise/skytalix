#!/usr/bin/env bash
# qe-ABC-235 timing session, one run, one process at a time. usage: session.sh <outDir>
# Order: G2 (warm, binding) -> G2 cold (INFO) -> G6 -> A3 -> per-cut A3 (INFO).
set -uo pipefail
S=$(dirname "$(readlink -f "$0")"); T=$(readlink -f "$S/../trees"); O=$1; mkdir -p "$O"
H="$O/host.jsonl"
gate() { "$S/wait-clear.sh" "$H" || { echo "{\"unresolved\":\"$1\",\"at\":\"$(date -u +%FT%TZ)\"}" | tee -a "$O/session.log"; exit 4; }; }
cc() { if pgrep -x cutechess-cli >/dev/null; then echo "{\"abort\":\"cutechess-cli\",\"at\":\"$(date -u +%FT%TZ)\"}" >> "$O/session.log"; return 1; fi; }
echo "{\"session_start\":\"$(date -u +%FT%TZ)\"}" >> "$O/session.log"
# G2 warm (the instrument as it stands): base, tip, tip, base
for t in base tip tip base; do gate g2; node "$S/g2.mjs" "$T/$t" >> "$O/g2.jsonl"; done
# G2 cold (INFO): base, tip, tip, base
for t in base tip tip base; do gate g2cold; node "$S/g2cold.mjs" "$T/$t" >> "$O/g2cold.jsonl"; done
# pairs(reading, A, B, boards...): 5 rounds; odd rounds A first, even rounds B first; precondition before every pair
pairs() {
  local reading=$1 a=$2 b=$3; shift 3
  for r in 1 2 3 4 5; do
    for board in "$@"; do
      gate "$reading"
      if (( r % 2 )); then order="$a $b"; else order="$b $a"; fi
      for t in $order; do
        until cc; do sleep 15; done
        node "$S/timed.mjs" "$T/$t" "$board" "$reading" "$r" >> "$O/$reading.jsonl"
      done
    done
  done
}
pairs g6 base tip kiwipete position-6
pairs a3 base tip kiwipete position-6 start
pairs cut1 base cut1 kiwipete position-6 start
pairs cut3 cut1 cut3 kiwipete position-6 start
pairs cut5 cut3 tip kiwipete position-6 start
echo "{\"session_end\":\"$(date -u +%FT%TZ)\"}" >> "$O/session.log"
