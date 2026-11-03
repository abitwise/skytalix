# Batch 1: instrument check (door d8 counts), pay gate (d8, six roots), rates (d7, the 190 + 6), reach at 47 000.
# Run as: flock <host-test.lock> timeout 3000 bash batch1.sh <root> <out>. One job at a time; counts only.
here="$(cd "$(dirname "$0")" && pwd)"
ALL6=POS=startpos,kiwipete,position-3,position-4,position-5,position-6
printf '%s\n' "DOOR nodes D=8 $ALL6" "A25 nodes D=8 $ALL6" "A50 nodes D=8 $ALL6" "A100 nodes D=8 $ALL6" "A50F nodes D=8 $ALL6" \
  "A25 rates D=7" "A50 rates D=7" "A100 rates D=7" "A50F rates D=7" \
  "A25 reach ALL=1 N=47000" "A50 reach ALL=1 N=47000" "A100 reach ALL=1 N=47000" "A50F reach ALL=1 N=47000" \
  | xargs -P 1 -L 1 bash "$here/job.sh" "$1" "$2"
