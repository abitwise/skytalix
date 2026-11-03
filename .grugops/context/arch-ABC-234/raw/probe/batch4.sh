# Batch 4 (DIAGNOSTIC, written AFTER batch 1's pay-gate miss; not pre-registered; cannot change the verdict).
# (i) is S1m's pay depth-gated? d10 nodes; (ii) Q1 for information (EPIC-011's stub): quiescence skips losing captures
# out of check, alone and over S1m: d8 nodes, zugzwang, drift d5 search(), mate floor d4->d5, G1.
# Run as: flock <host-test.lock> timeout 3000 bash batch4.sh <root2> <out>. One job at a time.
here="$(cd "$(dirname "$0")" && pwd)"
printf '%s\n' "S1m nodes D=10" "Q1 nodes" "Q1S1m nodes" "Q1 zug" "Q1 drift REC=search" "Q1 mate D=4 PLUS=1" "Q1 g1" "Q1 reach ALL=1 N=47000" \
  | xargs -P 1 -L 1 bash "$here/job_diag.sh" "$1" "$2"
