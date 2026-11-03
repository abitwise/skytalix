# Batch 2: safety gate for S1, S2, S1m: drift d5 both recursions, mate floor d4->d5 (+ same-depth d5 report),
# zugzwang 7 rows (+ door), G1 (+ door). Run as: flock <host-test.lock> timeout 3000 bash batch2.sh <root> <out>.
here="$(cd "$(dirname "$0")" && pwd)"
{ for f in S1 S2 S1m; do printf '%s\n' "$f drift REC=search" "$f drift REC=choose" "$f mate D=4 PLUS=1" "$f mate D=5 PLUS=0" "$f zug" "$f g1"; done
  printf '%s\n' "DOOR zug" "DOOR g1"; } | xargs -P 1 -L 1 bash "$here/job.sh" "$1" "$2"
