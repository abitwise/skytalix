set -u
cd /home/olger/projects/public/skytalix && git show main:src/gameend.nfr.test.ts > $SCRATCH/qe-250/FP/src/gameend.nfr.test.ts
(cd $SCRATCH/qe-250/FP && NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run src/gameend.nfr.test.ts --reporter=verbose) > $SCRATCH/qe-250/out/qe261c-main-test-on-head.txt 2>&1; echo "qe261c rc=$? $(date -u +%FT%TZ)"
cp $SCRATCH/qe-250/trees/H/src/gameend.nfr.test.ts $SCRATCH/qe-250/FP/src/gameend.nfr.test.ts; diff -r $SCRATCH/qe-250/FP/src /home/olger/projects/public/skytalix/.claude/worktrees/qe-ABC-250/src >/dev/null && echo "FP restored"
echo "g4 start $(date -u +%FT%TZ) load1 $(cut -d' ' -f1 /proc/loadavg) tctl"
bash $SCRATCH/qe-250/scripts/run-g4.sh $SCRATCH/qe-250/out/g4 > $SCRATCH/qe-250/out/g4-summary.txt 2>&1; echo "g4 rc=$? $(date -u +%FT%TZ)"
