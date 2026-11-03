# Batch 3: reports (information): d7 nodes, d8 report roots, reach at 20 000, mate d4 -> d5, the quiescence audit (AUD=50)
# per form, the main-rule audit (AUD=10) for QSM, QS fire. Run as: flock <host-test.lock> timeout 1800 bash batch3.sh <root> <out>.
here="$(cd "$(dirname "$0")" && pwd)"
{ for f in QS QSc QSM; do printf '%s\n' "$f nodes D=7" "$f nodes POS=position-4,position-5,startpos" "$f reach N=20000" "$f mate D=4 PLUS=1" "$f qaudit D=6 AUD=50"; done
  printf '%s\n' "QSM maudit D=6 AUD=10" "QS fire D=6"; } | xargs -P 1 -L 1 bash "$here/job.sh" "$1" "$2"
