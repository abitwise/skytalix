#!/usr/bin/env bash
# se-ABC-298-repoint: one hold of the freeze's deep.sh (frozen, unchanged) over the named lanes; 59 min guard.
#   flock <lock> taskset -c 0 bash deep-hold.sh <frozenScripts> <worktree> <outDir> <lane>...
set -u
Q=$1; W=$2; O=$3; shift 3
timeout 3540 bash "$Q/deep.sh" "$W" "$O" "$@"; echo "hold exit $?" >> "$O/exits.txt"
