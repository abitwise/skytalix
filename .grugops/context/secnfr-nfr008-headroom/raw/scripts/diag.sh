#!/bin/bash
W=<worktree>; S=$1; cd $W
for i in 0 1 2 3; do l1=$(cut -d' ' -f1 /proc/loadavg); DIAG_OUT=$S/n8h/D-diag-$i.json NODE_OPTIONS=--max-old-space-size=128 /usr/bin/time -f "%e %U %S" -o $S/n8h/D-time-$i.txt npx vitest run --reporter=default --reporter=$S/n8h/diag-reporter.mjs > $S/n8h/D-out-$i.txt 2>&1; echo "D $i load1=$l1 exit=$? $(cat $S/n8h/D-time-$i.txt)"; done
