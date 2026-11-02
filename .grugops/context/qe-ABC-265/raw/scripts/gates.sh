#!/usr/bin/env bash
# qe-ABC-265 batch 1 (qe-ABC-264's gates.sh, each command under its own flock): mandatory gates, G8 + npm test x3
# (b h h b b h), skips, integrity, lane inventory, G9. usage: gates.sh <scratch> <worktree> <outDir> <lock>
set -uo pipefail
S=$1; W=$2; O=$3; L=$4; mkdir -p $O/g8
ts() { date -u +%FT%TZ; }
echo "start $(ts) load1=$(cut -d' ' -f1 /proc/loadavg)" > $O/times.txt
cd $W
for g in lint typecheck build; do flock $L npm run $g > $O/$g.txt 2>&1; echo "$g rc=$? $(ts)" | tee -a $O/times.txt; done
rm -rf "${W:?}/dist"
i=0
for t in b h h b b h; do
  i=$((i+1)); dir=$S/base; [ $t = h ] && dir=$W
  anc=" $(a=$$; while [ "$a" -gt 1 ]; do printf '%s ' $a; a=$(ps -o ppid= -p $a | tr -d ' '); done)"
  for p in $(pgrep -f "[/]vitest"); do case "$anc" in *" $p "*) continue;; esac; echo "wait foreign vitest $p $(ts)" >> $O/g8/wait.log; while kill -0 $p 2>/dev/null; do sleep 5; done; done
  while awk '{exit !($1>8)}' /proc/loadavg; do sleep 15; done
  # the wall is timed inside the lock, so a wait for the lock is not counted
  flock $L bash -c 'l0=$(cut -d" " -f1 /proc/loadavg); t0=$(date +%s.%N); (cd "$1" && npm test) > "$2" 2>&1; rc=$?; t1=$(date +%s.%N); l1=$(cut -d" " -f1 /proc/loadavg); echo "$rc $(echo "$t1 - $t0" | bc) $l0 $l1"' _ "$dir" $O/g8/g8-$i-$t.txt > $O/g8/.r
  read rc wall l0 l1 < $O/g8/.r
  printf 'run=%s tree=%s rc=%s wall=%.2fs load1=%s/%s %s | %s\n' $i $t $rc $wall $l0 $l1 \
    "$(grep -E '^ +Tests ' $O/g8/g8-$i-$t.txt | tr -s ' ' | head -1)" "$(grep -E '^ +Duration' $O/g8/g8-$i-$t.txt | tr -s ' ' | head -1)" | tee -a $O/g8/g8.txt
done
rm -f $O/g8/.r
echo "g8 done $(ts)" >> $O/times.txt
sk=$(flock $L bash -c 'NODE_OPTIONS=--max-old-space-size=128 ./node_modules/.bin/vitest run --reporter=json 2>/dev/null' | jq '.numPendingTests + .numTodoTests'); echo "skip-count=$sk" | tee $O/skip-count.txt
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count "${sk:-UNKNOWN}" > $O/skip-integrity.txt 2>&1; echo "skip-integrity rc=$?" >> $O/skip-integrity.txt
node tools/grugops/lane-inventory.js > $O/lane-inventory.txt 2>&1; echo "lane-inventory rc=$?" >> $O/lane-inventory.txt
git diff 94be445f e5694864 -- src/levels.ts > $O/g9.txt; echo "g9 bytes=$(wc -c < $O/g9.txt)" | tee -a $O/g9.txt
git diff --name-only 94be445f e5694864 -- '*.test.ts' > $O/tests-touched.txt
git diff --name-only e5694864 HEAD -- src > $O/src-tip-vs-code.txt; echo "src tip vs code bytes=$(wc -c < $O/src-tip-vs-code.txt)" >> $O/src-tip-vs-code.txt
echo "end $(ts)" >> $O/times.txt
