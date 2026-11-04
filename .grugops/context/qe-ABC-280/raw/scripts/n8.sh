#!/bin/bash
# qe-ABC-280 NFR-008 read (reported, not graded by ABC-280): npm test wall, main vs tip, 3 interleaved rounds,
# each run under the host lock, load1 logged before each. usage: n8.sh <lock> <worktree> <clone> <out> [rounds, default 3]
set -u
LOCK="$1"; W="$2"; C="$3"; O="$4"; N="${5:-3}"; mkdir -p "$O"
( cd "$C" && git checkout -q "$(git -C "$W" rev-parse main)" )
for r in $(seq 1 "$N"); do
  for side in main tip; do
    d="$W"; [ "$side" = main ] && d="$C"
    # the wall is timed inside the lock, so a wait for a foreign holder is not counted
    res=$(flock "$LOCK" bash -c 'cd "$1"; l=$(cut -d" " -f1 /proc/loadavg); s=$(date +%s.%N); npm test > "$2" 2>&1; rc=$?; e=$(date +%s.%N); echo "load1=$l rc=$rc wall $(echo "$e - $s" | bc)"' _ "$d" "$O/n8-$side-$r.txt")
    echo "round $r $side $res $(grep -E '^ +Tests ' "$O/n8-$side-$r.txt" | tr -s ' ') $(grep -E 'Duration' "$O/n8-$side-$r.txt" | awk '{print $2}')" | tee -a "$O/n8.log"
  done
done
( cd "$C" && git checkout -q edb9fddd )
