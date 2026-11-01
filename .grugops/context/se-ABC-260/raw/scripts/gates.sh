#!/bin/bash
# se-ABC-260: plants (tip + base), static gates, npm test x3. Run under flock host-test.lock.
set -u
S=/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/se-260
W=/home/olger/projects/public/skytalix/.claude/worktrees/se-ABC-260
B=/home/olger/projects/public/skytalix
O=$S/gates; rm -rf "$O"; mkdir -p "$O"
host() { echo "$(date -u +%FT%TZ) load1=$(cut -d' ' -f1 /proc/loadavg) foreign-vitest=$(ps -eo args | grep -c '[v]itest')" ; }
host | tee "$O/host.txt"
echo "tip $(cd $W && git rev-parse --short HEAD) dirty-src: $(cd $W && git status --porcelain src | tr '\n' ' ')" | tee -a "$O/host.txt"
echo "base $(cd $B && git rev-parse --short HEAD) dirty: $(cd $B && git status --porcelain src | wc -l)" | tee -a "$O/host.txt"
bash $S/plants.sh "$W" "$S/plants-tip"  | sed 's/^/tip  /' | tee "$O/plants.txt"
bash $S/plants.sh "$B" "$S/plants-base" | sed 's/^/base /' | tee -a "$O/plants.txt"
cd "$W"
npm run lint > "$O/lint.txt" 2>&1; echo "lint rc=$?" | tee -a "$O/lint.txt"
npm run typecheck > "$O/typecheck.txt" 2>&1; echo "typecheck rc=$?" | tee -a "$O/typecheck.txt"
npm run build > "$O/build.txt" 2>&1; echo "build rc=$?" | tee -a "$O/build.txt"
node tools/grugops/lane-inventory.js > "$O/lane-inv.txt" 2>&1; echo "lane-inventory rc=$?" | tee -a "$O/lane-inv.txt"
for i in 1 2 3; do
  host >> "$O/host.txt"
  t0=$(date +%s.%N); npm test > "$O/test$i.txt" 2>&1; rc=$?; t1=$(date +%s.%N)
  cp .test-results/last-run.json "$O/test$i.json"
  echo "npm test $i rc=$rc wall=$(echo "$t1 - $t0" | bc)s $(grep -E 'Tests |Duration' "$O/test$i.txt" | tr -s ' ' | tr '\n' ' ')" | tee -a "$O/tests.txt"
done
N=$(NODE_OPTIONS=--max-old-space-size=128 ./node_modules/.bin/vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'); echo "skip-count: ${N:-EMPTY}" | tee "$O/skip-count.txt"
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count "${N:-UNKNOWN}" > "$O/skip-integrity.txt" 2>&1; echo "skip-integrity rc=$?" | tee -a "$O/skip-integrity.txt"
host >> "$O/host.txt"
