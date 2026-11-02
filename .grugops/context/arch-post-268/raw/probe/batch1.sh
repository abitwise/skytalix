# Batch 1: instrument check + A4 (a) (d8 nodes, both recursions) + A3 drift (d5, both recursions).
# Run as: flock <host-test.lock> timeout 300 bash batch1.sh <root> <out>. Deterministic counts only.
here="$(cd "$(dirname "$0")" && pwd)"
printf '%s\n' "R0 nodes" "R0 drift REC=search" "R0 drift REC=choose" | xargs -P 3 -L 1 bash "$here/job.sh" "$1" "$2"
