#!/bin/bash
# qe-ABC-269 step 3, cheap independent checks (run under flock): B0 on the cut build, S1-S3 / D1-D6 report, npm test count, gates.
S=/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/qe-ABC-269
W=/home/olger/projects/public/skytalix/.claude/worktrees/se-ABC-269
O=$S/out/verify; mkdir -p $O
ts() { date -u +%FT%TZ; }
echo "start $(ts) $(uptime)" > $O/times.txt
t0=$(date +%s); node $S/b0.ts $S/H > $O/b0.out 2>&1; echo "b0 rc=$? secs=$(( $(date +%s)-t0 ))" >> $O/times.txt
node $S/kp.ts $S/H > $O/kp.out 2>&1; echo "kp rc=$?" >> $O/times.txt
cd $W
t0=$(date +%s); npm test > $O/npm-test.txt 2>&1; echo "npm test rc=$? secs=$(( $(date +%s)-t0 ))" >> $O/times.txt
npm run typecheck > $O/typecheck.txt 2>&1; echo "typecheck rc=$?" >> $O/times.txt
npm run lint > $O/lint.txt 2>&1; echo "lint rc=$?" >> $O/times.txt
echo "end $(ts) $(uptime)" >> $O/times.txt
