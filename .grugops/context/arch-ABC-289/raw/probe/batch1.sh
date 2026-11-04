# Batch 1: instrument checks (door counts, the Q1 door pair) and the premise counters on the door, then the pay gate for
# every form. Run as: flock <host-test.lock> timeout 1800 bash batch1.sh <root> <out>. Deterministic counts only.
here="$(cd "$(dirname "$0")" && pwd)"
{ printf '%s\n' "D200 doors" "D300 premise D=6" "D200 premise D=6" "D100 premise D=6"
  for f in D300 D200 D100 D200c D200e D200b; do printf '%s\n' "$f nodes" "$f reach N=47000"; done; } \
  | xargs -P 1 -L 1 bash "$here/job.sh" "$1" "$2"
