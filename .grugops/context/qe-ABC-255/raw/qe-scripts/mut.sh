#!/usr/bin/env bash
# run every mutant of mut.py in a scratch clone of the QE HEAD; pair-check each; restore after each.
set -u
SP=<scratch>/qe-255
W=<worktree>
R=$1; mkdir -p "$R"; M=$SP/mutclone
rm -rf $M; git clone -q --shared $W $M
set -a; . $SP/tools.env; set +a
cp $M/tools/rating/rating.ts $SP/rating.orig.ts
(cd $M && node --test tools/rating/pair-check.ts) > $R/M0.txt 2>&1; echo "M0 (unmutated) rc=$? $(grep -E '^# (pass|fail|skipped|todo)' $R/M0.txt | tr '\n' ' ')" | tee $R/summary.txt
for m in M1 M2 M3 M4 M5 M6 M7 M8; do
  python3 -I $SP/scripts/mut.py $SP/rating.orig.ts $M/tools/rating/rating.ts $m || { echo "$m APPLY FAILED" | tee -a $R/summary.txt; continue; }
  (cd $M && node --test tools/rating/pair-check.ts) > $R/$m.txt 2>&1; rc=$?
  echo "$m rc=$rc $(grep -E '^# (pass|fail)' $R/$m.txt | tr '\n' ' ') $([ $rc -ne 0 ] && echo KILLED || echo SURVIVED)" | tee -a $R/summary.txt
  cp $SP/rating.orig.ts $M/tools/rating/rating.ts
done
cmp $M/tools/rating/rating.ts $W/tools/rating/rating.ts && echo "restored == worktree" | tee -a $R/summary.txt
git -C $W diff --quiet HEAD -- tools && echo "worktree tools/ untouched" | tee -a $R/summary.txt
rm -rf $M $SP/rating.orig.ts
