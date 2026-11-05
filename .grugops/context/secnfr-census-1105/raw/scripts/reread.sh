#!/bin/bash
# secnfr-census-1105 re-read launcher. Takes the lock; when five samples 3 s apart name no foreign vitest it runs n8.sh once and
# exits; else it releases the lock and tries again after 60 s, up to the deadline. Exit 0 after the read, 75 on the deadline.
# Usage: reread.sh <lock> <arms dir> <out dir> <max wait s>
L=$1; A=$2; O=$3; MAX=$4; HERE=$(cd "$(dirname "$0")" && pwd); T0=$(date +%s)
while [ $(( $(date +%s) - T0 )) -lt "$MAX" ]; do
  flock "$L" bash -c '
    for i in 1 2 3 4 5; do
      n=$(ps -eo pid=,comm=,args= | grep -E "[v]itest" | awk "\$2 ~ /^(node|npm|npx)/" | wc -l)
      [ "$n" = 0 ] || { echo "try $(date -u +%FT%TZ): $n foreign, released"; exit 75; }
      sleep 3
    done
    echo "clear $(date -u +%FT%TZ)"; bash "$0" "$1" "$2"' "$HERE/n8.sh" "$A" "$O"
  rc=$?
  [ $rc = 75 ] || exit $rc
  sleep 60
done
echo "deadline, not read"; exit 75
