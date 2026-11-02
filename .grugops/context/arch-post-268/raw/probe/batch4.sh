# Batch 4 (added AFTER batch 2's zugzwang.004 miss; a diagnostic report, not pre-registered, cannot change the verdict):
# decision 1's move on zugzwang.004 at depths 10-13 (`zugd`), head and door.
# Run as: flock <host-test.lock> timeout 300 bash batch4.sh <root> <out>.
here="$(cd "$(dirname "$0")" && pwd)"
printf '%s\n' "R0 zugd DS=10,11,12,13" "DOOR zugd DS=10,11,12,13" | xargs -P 2 -L 1 bash "$here/job.sh" "$1" "$2"
