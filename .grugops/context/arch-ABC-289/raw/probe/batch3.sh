# Batch 3: reports (information, never a gate) for the forms named in $3 (space-separated): firing at the 100 ms node budget,
# ratio and SEE calls at depth 6, d7 nodes, d8 report roots, reach at 20 000, mate d4 -> d5, chooseMove mate d6 -> d6, the
# quiescence audit. Run as: flock <host-test.lock> timeout 1800 bash batch3.sh <root> <out> "<forms>".
here="$(cd "$(dirname "$0")" && pwd)"
{ for f in $3; do printf '%s\n' "$f fire100 N=47000" "$f fire D=6" "$f nodes D=7" "$f nodes POS=position-4,position-5,startpos" "$f reach N=20000" "$f mate REC=search D=4 PLUS=1" "$f mate REC=choose D=6 PLUS=0" "$f qaudit D=6 AUD=50"; done; } \
  | xargs -P 1 -L 1 bash "$here/job.sh" "$1" "$2"
