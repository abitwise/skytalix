# Batch 4 (DIAGNOSTIC, added AFTER batch 1's pay-gate miss; not pre-registered; cannot change the verdict):
# (i) depth-10 nodes for H1 and H2 (is the history's pay depth-gated?); (ii) ADR-0060 decision 1 (R0, unchanged) over
# H1 as door ("P1H1@H1"): d8 nodes, drift d5 search(), zugzwang, reach 47 000; and over main ("P1H1@DOOR"): d8 nodes.
# Run as: flock <host-test.lock> timeout 300 bash batch4.sh <root> <out>.
here="$(cd "$(dirname "$0")" && pwd)"
printf '%s\n' "H1 nodes D=10" "H2 nodes D=10" "P1H1@H1 nodes" "P1H1@H1 drift REC=search" "P1H1@H1 drift REC=choose" "P1H1@H1 zug" \
  "P1H1@H1 reach ALL=1 N=47000" "P1H1@DOOR nodes" "P1H1@H1 mate D=4 PLUS=1" | xargs -P 9 -L 1 bash "$here/job.sh" "$1" "$2"
