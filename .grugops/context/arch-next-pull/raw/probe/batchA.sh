# Batch A: instrument check (P1H1 over H1) + A4 (a) against H1 and main + A4 (b) reach at 47 000, J1-J4.
# Run as: flock <host-test.lock> timeout 300 bash batchA.sh <root> <out>. Deterministic counts only.
here="$(cd "$(dirname "$0")" && pwd)"
{ printf '%s\n' "P1H1@H1 nodes" "P1H1@H1 reach ALL=1 N=47000"
  for f in J1 J2 J3 J4; do printf '%s\n' "$f@H1 nodes" "$f@DOOR nodes" "$f@H1 reach ALL=1 N=47000"; done; } \
  | xargs -P 14 -L 1 bash "$here/job2.sh" "$1" "$2"
