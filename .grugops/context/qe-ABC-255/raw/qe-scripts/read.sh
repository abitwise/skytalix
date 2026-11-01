#!/usr/bin/env bash
# qe-ABC-255 one real read: usage read.sh <label> <rating.ts args...>   (run inside flock)
set -u
Q=<scratch>/qe-255
W=<worktree>
label=$1; shift
set -a; . $Q/tools.env; set +a
echo "$(date -u +%FT%TZ) lock acquired $label" >> $Q/run/$label.lock.txt
CAP_MIN=60 node $Q/scripts/block.mjs $label $Q/run/$label-block $W -- node tools/rating/rating.ts "$@"
rc=$?
echo "$(date -u +%FT%TZ) released $label rc=$rc" >> $Q/run/$label.lock.txt
exit $rc
