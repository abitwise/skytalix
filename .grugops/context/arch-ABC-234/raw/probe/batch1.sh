# Batch 1: instrument checks (SEE rows; door counts inside `nodes`), the premise on main (`fire` D=6: door counters),
# the pay gate (d8 nodes, both recursions) and reach at 47 000, three forms. One job at a time (one core).
# Run as: flock <host-test.lock> timeout 3000 bash batch1.sh <root> <out>. Deterministic counts only.
here="$(cd "$(dirname "$0")" && pwd)"
printf '%s\n' "DOOR seecheck" "S1 nodes" "S2 nodes" "S1m nodes" "S1 fire D=6" \
  "S1 reach ALL=1 N=47000" "S2 reach ALL=1 N=47000" "S1m reach ALL=1 N=47000" \
  | xargs -P 1 -L 1 bash "$here/job.sh" "$1" "$2"
