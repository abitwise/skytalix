#!/bin/bash
# arch-ABC-292-probe, STAGE B: PR10's lane read on QE's stage loop (qe-ABC-291's n8.sh form, grugops/qe-ABC-291 66ca8de0).
# lane-stage.sh is that loop's stage.inc.sh with one line changed: a run is scored when its exit equals exit_of (0 for an
# arm whose stage-A count has no failure, else 1), not only on exit 0, because H's lane carries the K2 re-pins as reds.
# fsample.sh is QE's, unchanged. Usage: lane.sh <arms dir holding B B2 H> <out dir> <main json> <cand json>
A=$1; O=$2; mkdir -p $O/runs
HERE=$(cd "$(dirname "$0")" && pwd)
counts() { node -e 'const j=require(process.argv[1]);console.log([j.testResults.length,j.numPassedTests,j.numPendingTests+(j.numTodoTests||0),j.numFailedTests].join("\t"))' "$1"; }
EXP_B=$(counts "$3"); EXP_H=$(counts "$4")
echo "expected B, B2: $EXP_B; H: $EXP_H"
exp_of() { if [ "$1" = H ]; then printf "%s" "$EXP_H"; else printf "%s" "$EXP_B"; fi; }
exit_of() { if [ "$(exp_of $1 | cut -f4)" = 0 ]; then echo 0; else echo 1; fi; }
ARMS="B B2 H"; ORD0="B B2 H"; ORD1="B2 H B"; ORD2="H B B2"; TAG=lane
. "$HERE/lane-stage.sh"
