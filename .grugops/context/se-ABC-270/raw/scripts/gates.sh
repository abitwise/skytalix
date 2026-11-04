#!/bin/bash
# se-ABC-270 gates + reports, each under the host lock. Base = detached main worktree (src 4cb84035); head = the branch worktree.
L=<scratch>/se270/../host-test.lock; O=<scratch>/se270/out/gates; mkdir -p $O; cd <scratch>/se270
flock $L node scripts/old-rows.ts <scratch>/se270/B > $O/old-rows-base.out 2>&1; echo "old-rows-base exit $?" >> $O/exits.txt
flock $L node scripts/old-rows.ts <scratch>/se270/H > $O/old-rows-head.out 2>&1; echo "old-rows-head exit $?" >> $O/exits.txt
for t in base:<scratch>/se270/mainwt head:<worktree>; do n=${t%%:*}; d=${t#*:}; cd $d
  s=$(date +%s.%N); flock $L npm test > $O/npm-test-$n.txt 2>&1; rc=$?; e=$(date +%s.%N)
  echo "npm-test-$n exit $rc wall $(echo "$e - $s" | bc) s; $(grep -E '^ +(Test Files|Tests|Duration) ' $O/npm-test-$n.txt | tr -s ' ' | tr '\n' ';')" >> $O/exits.txt
done
cd <worktree>
flock $L npm run lint > $O/lint.txt 2>&1; echo "lint exit $?" >> $O/exits.txt
flock $L npm run typecheck > $O/typecheck.txt 2>&1; echo "typecheck exit $?" >> $O/exits.txt
flock $L npm run build > $O/build.txt 2>&1; echo "build exit $?" >> $O/exits.txt
echo DONE >> $O/exits.txt
