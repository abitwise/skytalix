#!/bin/sh
# Re-run from the repository root: sh .grugops/context/ruling-timing-protocol/probe/run.sh <dir holding the two ABC-127 TSVs>
# The ABC-127 files live on grugops/ABC-127-harder-puzzles only:
#   git show grugops/ABC-127-harder-puzzles:.grugops/context/secnfr-ABC-127/probe/n8-lane.tsv  > "$1/abc127-n8-lane.tsv"
#   git show grugops/ABC-127-harder-puzzles:.grugops/context/secnfr-ABC-127/probe/onefile.tsv > "$1/abc127-onefile.tsv"
C=.grugops/context
node $C/ruling-timing-protocol/probe/floors.mjs \
 "ABC-110 2026-09-19 @2c96dbd|$C/ruling-abc110-level-15s/notes/raw-a6-interleaved-a-n.tsv|full-lane|N-A|-" \
 "ABC-079 2026-09-25|$C/secnfr-ABC-079/notes/raw-out-lane.tsv.txt|full-lane|N-A|A-B" \
 "ABC-122 2026-09-25|$C/secnfr-ABC-122/notes/raw-out-lane.tsv.txt|full-lane|N-A|A-B" \
 "ABC-082 2026-10-09 (2 sessions)|$C/secnfr-ABC-082/notes/raw-out-lane.tsv.txt|full-lane|N-A|A-B" \
 "ABC-084 run1 2026-10-09|$C/secnfr-ABC-084/notes/raw-out-lane-run1.tsv.txt|full-lane|N-A|A-B" \
 "ABC-084 run2 2026-10-09|$C/secnfr-ABC-084/notes/raw-out-lane-run2.tsv.txt|full-lane|N-A|A-B" \
 "ABC-084 run3 2026-10-09|$C/secnfr-ABC-084/notes/raw-out-lane-run3.tsv.txt|full-lane|N-A|A-B" \
 "ABC-128 Engineer 2026-10-10|$C/ticket-to-pr-ABC-128/notes/raw-out-n8-lane-full.tsv|full-lane|N-A|B-A" \
 "ABC-127 Security/NFR 2026-10-10|$1/abc127-n8-lane.tsv|full-lane|N-A|A-B" \
 "ABC-119 QE set A 2026-10-10|$C/qe-ABC-119/probe/a2ii-setA-runs.txt|full-lane|twin-base|head-base" \
 "ABC-119 QE set B 2026-10-10|$C/qe-ABC-119/probe/a2ii-setB-runs.txt|full-lane|twin-base|head-base" \
 "ABC-128 Engineer 2026-10-10|$C/ticket-to-pr-ABC-128/notes/raw-out-n8-lane-turn-loop-file.tsv|one-file|N-A|B-A" \
 "ABC-127 Security/NFR 2026-10-10|$1/abc127-onefile.tsv|one-file|N-A|A-B" \
 "ABC-084 2026-10-09 P=suite file, E=one-assertion empty file|$C/secnfr-ABC-084/notes/raw-out-onefile.tsv.txt|one-file|-|P-E"
