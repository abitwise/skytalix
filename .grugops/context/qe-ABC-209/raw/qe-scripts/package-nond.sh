#!/bin/bash
# qe-ABC-209 (qe-ABC-208 package-nond.sh, plus probes, the plant logs and the PREREG): copy the non-D raw outputs into the
# context folder, redacted (ADR-0049 d4; red() in redact.sh), *.log renamed *.log.txt (.gitignore drops *.log).
# usage: package-nond.sh <scratch> <dest-raw>
set -eu
SCR=$1; DEST=$2; WTDIR=${WTDIR:?}; REPO=${REPO:?}
. "$SCR/scripts/redact.sh"
for d in gates deep pre g6 rc probes plant/out; do
  t=$DEST/$(echo $d | sed 's#plant/out#plants/json#'); mkdir -p $t
  for f in $(cd $SCR/$d && ls -p | grep -v / | grep -v 'procs-scratch-only'); do
    o=$(echo $f | sed -E 's/\.log$/.log.txt/'); red "$SCR/$d/$f" > "$t/$o"
  done
done
for f in $(cd $SCR/plant && ls -p | grep -v / ); do red "$SCR/plant/$f" > "$DEST/plants/$f"; done
gzip -9 -n -f $DEST/plants/json/*.json
red "$SCR/PREREG.txt" > "$DEST/PREREG.txt"; red "$SCR/pool.txt" > "$DEST/pool.txt"
mkdir -p $DEST/qe-scripts; for f in $(cd $SCR/scripts && ls); do red "$SCR/scripts/$f" > "$DEST/qe-scripts/$f"; done
gzip -9 -n -f $DEST/gates/last-run.json
