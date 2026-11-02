# Batch B: safety for J1-J4: drift d5 both recursions against H1 (bar) and against main (stricter addition), mate
# floor H1 d4 -> head d5 (+ same-depth d5 report), zugzwang 7 rows, G1. Run as: flock <host-test.lock> timeout 300 bash batchB.sh <root> <out>.
here="$(cd "$(dirname "$0")" && pwd)"
{ for f in J1 J2 J3 J4; do printf '%s\n' "$f@H1 drift REC=search" "$f@H1 drift REC=choose" "$f@DOOR drift REC=search" "$f@DOOR drift REC=choose" \
    "$f@H1 mate D=4 PLUS=1" "$f@H1 mate D=5 PLUS=0" "$f zug" "$f g1"; done; } | xargs -P 16 -L 1 bash "$here/job2.sh" "$1" "$2"
