# Batch 1: instrument check + pay gate (d8 nodes, both recursions) + reach at 47 000, five forms.
# Run as: flock <host-test.lock> timeout 300 bash batch1.sh <root> <out>. Deterministic counts only.
here="$(cd "$(dirname "$0")" && pwd)"
printf '%s\n' "H1 nodes" "H0 nodes" "H2 nodes" "H3 nodes" "H1nr nodes" \
  "H1 reach ALL=1 N=47000" "H0 reach ALL=1 N=47000" "H2 reach ALL=1 N=47000" "H3 reach ALL=1 N=47000" "H1nr reach ALL=1 N=47000" \
  | xargs -P 10 -L 1 bash "$here/job.sh" "$1" "$2"
