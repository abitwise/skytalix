# Batch C: the pre-registered zugd report (zugzwang.004 at depths 10-13) for J1-J4, which all lose .004; plus one
# DIAGNOSTIC (added after batch B, not pre-registered, no verdict): diag.ts on the 69 cp drift row.
# Run as: flock <host-test.lock> timeout 300 bash batchC.sh <root> <out>.
here="$(cd "$(dirname "$0")" && pwd)"
printf '%s\n' "J1 zugd" "J2 zugd" "J3 zugd" "J4 zugd" "P1H1 zugd" | xargs -P 5 -L 1 bash "$here/job2.sh" "$1" "$2" &
(cd "$1" && timeout 300 node diag.ts > "$2/diag-f3h4.out" 2>&1; echo "diag exit $?" >> "$2/exits.txt")
wait
