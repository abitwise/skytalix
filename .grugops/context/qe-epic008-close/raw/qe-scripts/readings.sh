#!/bin/bash
# qe-epic008-close: reading 1 (baseline 3497aad2), then reading 2 (the close sha), one run each.
# usage: readings.sh <scratch> <close-sha>. Started detached (setsid nohup); logs to <scratch>/readings.log.
set -u
SCR=$1; CLOSE=$2
. "$SCR/scripts/common.sh"
L=$SCR/readings.log
echo "$(ts) reading 1 start: 3497aad21fd089f29fe1791d42f81c47ac7ca522" >> $L
"$SCR/scripts/driver.sh" "$SCR" "$SCR/r1" 3497aad21fd089f29fe1791d42f81c47ac7ca522; rc1=$?
echo "$(ts) reading 1 end rc=$rc1" >> $L
if [ ! -f "$SCR/r1/out/r.out" ]; then echo "$(ts) STOP: reading 1 played no game (rc=$rc1); reading 2 not started" >> $L; exit 6; fi
echo "$(ts) reading 2 start: $CLOSE" >> $L
"$SCR/scripts/driver.sh" "$SCR" "$SCR/r2" "$CLOSE"; rc2=$?
echo "$(ts) reading 2 end rc=$rc2" >> $L
echo "$(ts) DONE rc1=$rc1 rc2=$rc2" >> $L
