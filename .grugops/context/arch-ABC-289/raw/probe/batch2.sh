# Batch 2: the safety gate for every form: drift d5 both recursions, mate floor d5 -> d5 both recursions, zugzwang, G1;
# door zugzwang and G1. Run as: flock <host-test.lock> timeout 1800 bash batch2.sh <root> <out>.
here="$(cd "$(dirname "$0")" && pwd)"
{ for f in D300 D200 D100 D200c D200e D200b; do printf '%s\n' "$f drift REC=search" "$f drift REC=choose" "$f mate REC=search D=5 PLUS=0" "$f mate REC=choose D=5 PLUS=0" "$f zug" "$f g1"; done
  printf '%s\n' "DOOR zug" "DOOR g1"; } | xargs -P 1 -L 1 bash "$here/job.sh" "$1" "$2"
