# Batch 3: reports + the cut audit (information): d7 nodes, d8 report roots, reach at 20 000, firing at d6, history
# audit (AK=hh, AUD=10), A2's table shape. Run as: flock <host-test.lock> timeout 300 bash batch3.sh <root> <out>.
here="$(cd "$(dirname "$0")" && pwd)"
{ for f in H1 H0 H2 H3; do printf '%s\n' "$f nodes D=7" "$f nodes POS=position-4,position-5,startpos" "$f reach ALL=1 N=20000" "$f fire D=6" "$f audit D=6 AUD=10 AK=hh"; done
  printf '%s\n' "H1 table D=5"; } | xargs -P 21 -L 1 bash "$here/job.sh" "$1" "$2"
