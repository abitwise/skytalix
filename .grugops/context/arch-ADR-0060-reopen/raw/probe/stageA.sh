# Stage A: d8 nodes (A4 a) and d5 drift both recursions (A3). $1 = scratch root, $2 = out dir.
# Run as: flock <host-test.lock> timeout 300 bash stageA.sh <root> <out>. Deterministic counts only.
here="$(cd "$(dirname "$0")" && pwd)"
for id in R0 C1 C2 C3 C4 C5 C6 C7 C8; do
  echo "$id nodes"; echo "$id drift REC=search"; echo "$id drift REC=choose"
done | xargs -P 12 -L 1 bash "$here/job.sh" "$1" "$2"
