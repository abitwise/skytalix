# Batch 3: reports + the cut audit (information): d7 nodes (the ticket's A3 depth), d8 report roots, reach at 20 000,
# premise counters for S2 and S1m, the SEE audit (AUD=10). Run as: flock <host-test.lock> timeout 3000 bash batch3.sh <root> <out>.
here="$(cd "$(dirname "$0")" && pwd)"
{ for f in S1 S2 S1m; do printf '%s\n' "$f nodes D=7" "$f nodes POS=position-4,position-5,startpos" "$f reach ALL=1 N=20000" "$f audit D=6 AUD=10"; done
  printf '%s\n' "S2 fire D=6" "S1m fire D=6"; } | xargs -P 1 -L 1 bash "$here/job.sh" "$1" "$2"
