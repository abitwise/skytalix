#!/bin/bash
# se-ABC-262 gates (under flock host-test.lock): base npm test in a git-archive copy of HEAD~0's parent tree (src == main),
# lint, typecheck, build, three head runs of npm test (load1 + foreign vitest logged), skip-integrity, lane inventory.
set -uo pipefail
W=/home/olger/projects/public/skytalix/.claude/worktrees/se-ABC-262
S=/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/se-262
O=$S/raw/gates; rm -rf "$O" "$S/base"; mkdir -p "$O" "$S/base"
( cd "$W" && git archive HEAD | tar -x -C "$S/base" ); ln -s "$W/node_modules" "$S/base/node_modules"
( cd "$S/base" && npm test ) > "$O/base-npm-test.txt" 2>&1; echo "base rc=$? :: $(grep -E '^ +Tests ' "$O/base-npm-test.txt" | tr -s ' ')" | tee "$O/summary.txt"
cd "$W"
npm run lint > "$O/lint.txt" 2>&1; echo "lint rc=$?" | tee -a "$O/summary.txt"
npm run typecheck > "$O/typecheck.txt" 2>&1; echo "typecheck rc=$?" | tee -a "$O/summary.txt"
npm run build > "$O/build.txt" 2>&1; echo "build rc=$?" | tee -a "$O/summary.txt"
git status --porcelain > "$O/status-after-build.txt"
for i in 1 2 3; do
  f=$(pgrep -af "[/]vitest" | grep -v "$W" | tr '\n' ';')
  l0=$(cut -d' ' -f1 /proc/loadavg); t0=$(date +%s.%N)
  npm test > "$O/head-$i.txt" 2>&1; rc=$?
  t1=$(date +%s.%N); l1=$(cut -d' ' -f1 /proc/loadavg)
  cp .test-results/last-run.json "$O/head-$i.last-run.json"
  printf 'head run=%s rc=%s wall=%.2fs load1=%s/%s foreign=[%s] %s | %s\n' $i $rc "$(echo "$t1 - $t0" | bc)" $l0 $l1 "$f" \
    "$(grep -E '^ +Tests ' "$O/head-$i.txt" | tr -s ' ' | head -1)" "$(grep -E '^ +Duration' "$O/head-$i.txt" | tr -s ' ' | head -1)" | tee -a "$O/summary.txt"
done
N=$(node -e 'const j=require(process.argv[1]);console.log(j.numPendingTests+j.numTodoTests)' "$O/head-1.last-run.json")
echo "skip count=$N" | tee -a "$O/summary.txt"
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count "$N" > "$O/skip.txt" 2>&1; echo "skip-integrity rc=$? :: $(cat "$O/skip.txt" | tr '\n' ' ')" | tee -a "$O/summary.txt"
NODE_OPTIONS=--max-old-space-size=128 node tools/grugops/lane-inventory.js > "$O/lane.txt" 2>&1; echo "lane rc=$? :: $(cat "$O/lane.txt" | tr '\n' ' ')" | tee -a "$O/summary.txt"
