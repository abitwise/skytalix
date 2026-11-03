# Batch 1: instrument checks (SEE rows; door counts inside `nodes`), the pay gate (d8 nodes, both recursions; reach at
# 47 000) for QS, QSc, QSM, and the premise counters (`fire` D=6). One job at a time.
# Run as: flock <host-test.lock> timeout 1800 bash batch1.sh <root> <out>. Deterministic counts only.
here="$(cd "$(dirname "$0")" && pwd)"
printf '%s\n' "DOOR seecheck" "QS nodes" "QSc nodes" "QSM nodes" \
  "QS reach N=47000" "QSc reach N=47000" "QSM reach N=47000" "QSM fire D=6" \
  | xargs -P 1 -L 1 bash "$here/job.sh" "$1" "$2"
