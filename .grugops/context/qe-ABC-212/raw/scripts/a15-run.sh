#!/bin/bash
S=<scratch>
W=<worktree>
out=$S/raw/a15-readings.jsonl; : > $out
for pos in kiwipete position-6; do for lvl in 5 6 7; do
  $S/scripts/waitclear.sh $S/raw/a15-precheck.txt || { echo UNRESOLVED; exit 4; }
  (cd $S/scripts && node a15.ts $W $pos $lvl) >> $out 2>>$S/raw/a15.err; $S/scripts/precheck.sh >> $S/raw/a15-postcheck.txt; echo "after $pos L$lvl" >> $S/raw/a15-postcheck.txt
done; done
cat $out
