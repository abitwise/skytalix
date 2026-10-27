#!/bin/bash
# qe-ABC-210 mandatory gates at the merge (qe-ABC-209 gates.sh + a precondition wait: the npm test wall is the G8 reading). usage: gates.sh <scratch> <worktree>
S=$1; W=$2; G=$S/gates; mkdir -p $G; cd $W
. $S/scripts/common.sh
ln1() { echo "$(ts) $1 load1=$(load1) power=$(power) batt=$(batt) thermal=$(thermal) vitest=$(pgrep -f '[n]ode.*vitest' | wc -l | tr -d ' ')" >> $G/host.txt; }
wait_pre $G/wait.log || exit 3
ln1 lint; npm run lint > $G/lint.txt 2>&1; echo "lint rc=$?" >> $G/rc.txt
ln1 typecheck; npm run typecheck > $G/typecheck.txt 2>&1; echo "typecheck rc=$?" >> $G/rc.txt
ln1 build; rm -rf dist; npm run build > $G/build.txt 2>&1; echo "build rc=$? dist_files=$(find dist -type f | wc -l | tr -d ' ') from_tools=$(find dist -path '*tools*' -type f | wc -l | tr -d ' ')" >> $G/rc.txt
ln1 npm-test-start; s=$(date +%s.%N 2>/dev/null || date +%s); /usr/bin/time -p npm test > $G/npm-test.txt 2> $G/npm-test.time; echo "npm-test rc=$?" >> $G/rc.txt; ln1 npm-test-end
cp .test-results/last-run.json $G/last-run.json
ln1 skips; NODE_OPTIONS=--max-old-space-size=128 npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests' > $G/skips.txt; echo "skipcount rc=$?" >> $G/rc.txt
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count $(cat $G/skips.txt) > $G/skip-integrity.txt 2>&1; echo "skip-integrity rc=$?" >> $G/rc.txt
node tools/grugops/lane-inventory.js > $G/lane-inventory.txt 2>&1; echo "lane-inventory rc=$?" >> $G/rc.txt
echo DONE >> $G/rc.txt
