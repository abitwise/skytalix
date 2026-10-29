#!/bin/bash
# qe-epic008-close mandatory gates on the close sha (qe-ABC-208 gates.sh, Linux probes). G8 = the npm test wall here.
# usage: gates.sh <scratch> <worktree>
S=$1; W=$2; G=$S/gates; mkdir -p $G; cd $W
. $S/scripts/common.sh
wait_pre $G/wait.log; pre=$?; [ $pre = 0 ] || exit $pre
ln1() { echo "$(ts) $1 load1=$(load1) power=$(power) thermal=$(thermal) vitest=$(vitest)" >> $G/host.txt; }
ln1 lint; npm run lint > $G/lint.txt 2>&1; echo "lint rc=$?" >> $G/rc.txt
ln1 typecheck; npm run typecheck > $G/typecheck.txt 2>&1; echo "typecheck rc=$?" >> $G/rc.txt
ln1 build; rm -rf dist; npm run build > $G/build.txt 2>&1; echo "build rc=$? dist_files=$(find dist -type f | wc -l | tr -d ' ') from_tools=$(find dist -path '*tools*' -type f | wc -l | tr -d ' ')" >> $G/rc.txt
wait_pre $G/wait-npm-test.log; echo "npm-test preconditions rc=$?" >> $G/rc.txt
ln1 npm-test-start; /usr/bin/time -p npm test > $G/npm-test.txt 2> $G/npm-test.time; echo "npm-test rc=$?" >> $G/rc.txt; ln1 npm-test-end
cp .test-results/last-run.json $G/last-run.json
ln1 skips; NODE_OPTIONS=--max-old-space-size=128 npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests' > $G/skips.txt; echo "skipcount rc=$?" >> $G/rc.txt
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count $(cat $G/skips.txt) > $G/skip-integrity.txt 2>&1; echo "skip-integrity rc=$?" >> $G/rc.txt
git diff --stat 3497aad21fd089f29fe1791d42f81c47ac7ca522 HEAD -- src/levels.ts > $G/g9-levels-diff.txt; echo "g9 diff rc=$? bytes=$(wc -c < $G/g9-levels-diff.txt)" >> $G/rc.txt
echo DONE >> $G/rc.txt
