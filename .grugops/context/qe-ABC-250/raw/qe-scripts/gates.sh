#!/usr/bin/env bash
# qe-ABC-250 untimed batch (under flock): mandatory gates, G8 (b h h b b h), skips, lane inventory, G9, QE-261-c, G1,
# A1/A2 deep spot, G7 lanes, plants, the ENGINE_DEEP engine lane (G4/G5 instrument). Built from qe-ABC-254's batch1/g8/deep.
# usage: gates.sh <scratchQ> <worktree> <outDir> <scriptsDir>
set -uo pipefail
Q=$1; W=$2; O=$3; S=$4; mkdir -p $O/plants $O/g8 $O/deep
ts() { date -u +%FT%TZ; }
echo "start $(ts)" > $O/times.txt
cd $W
for g in lint typecheck build; do npm run $g > $O/$g.txt 2>&1; echo "$g rc=$? $(ts)" | tee -a $O/times.txt; done
rm -rf $W/dist
# G8: npm test as spelled, b h h b b h; before each run 0 foreign vitest (bracketed pgrep, waited by PID), load1 <= 8.
i=0
for t in b h h b b h; do
  i=$((i+1)); dir=$Q/FB; [ $t = h ] && dir=$W
  for p in $(pgrep -f "[/]vitest"); do echo "wait foreign vitest $p $(ts)" >> $O/g8/wait.log; while kill -0 $p 2>/dev/null; do sleep 5; done; done
  while awk '{exit !($1>8)}' /proc/loadavg; do sleep 15; done
  l0=$(cut -d' ' -f1 /proc/loadavg); t0=$(date +%s.%N)
  (cd "$dir" && npm test) > $O/g8/g8-$i-$t.txt 2>&1; rc=$?
  t1=$(date +%s.%N); l1=$(cut -d' ' -f1 /proc/loadavg)
  cp "$dir/.test-results/last-run.json" $O/g8/g8-$i-$t.last-run.json
  n8=$(node -e 'const j=require(process.argv[1]);let s=0,c=0;for(const f of j.testResults)for(const a of f.assertionResults)if(a.fullName.includes("ABC-250")){s+=a.duration;c++}console.log(`abc250rows=${c} sum=${s.toFixed(1)}ms`)' $O/g8/g8-$i-$t.last-run.json)
  printf 'run=%s tree=%s rc=%s wall=%.2fs load1=%s/%s %s | %s | %s\n' $i $t $rc "$(echo "$t1 - $t0" | bc)" $l0 $l1 \
    "$(grep -E '^ +Tests ' $O/g8/g8-$i-$t.txt | tr -s ' ' | head -1)" "$(grep -E '^ +Duration' $O/g8/g8-$i-$t.txt | tr -s ' ' | head -1)" "$n8" | tee -a $O/g8/g8.txt
done
echo "g8 done $(ts)" >> $O/times.txt
node -e 'const j=require(process.argv[1]); console.log(JSON.stringify({total:j.numTotalTests,passed:j.numPassedTests,failed:j.numFailedTests,pending:j.numPendingTests,todo:j.numTodoTests}))' $W/.test-results/last-run.json > $O/last-run-counts.txt
sk=$(NODE_OPTIONS=--max-old-space-size=128 ./node_modules/.bin/vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'); echo "skip-count=$sk" > $O/skip-count.txt
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count "${sk:-UNKNOWN}" > $O/skip-integrity.txt 2>&1; echo "skip-integrity rc=$?" >> $O/skip-integrity.txt
node tools/grugops/lane-inventory.js > $O/lane-inventory.txt 2>&1; echo "lane-inventory rc=$?" >> $O/lane-inventory.txt
git diff --stat ceb28780 2e04eee5 -- src/levels.ts > $O/g9.txt; echo "g9 bytes=$(wc -c < $O/g9.txt)" >> $O/g9.txt
git diff ceb28780 2e04eee5 -- src/moves.ts | grep -E '^-[^-]|^-$' > $O/qe261c-minus.txt; echo "removed-lines=$(wc -l < $O/qe261c-minus.txt)" >> $O/qe261c-minus.txt
grep -n "ABC-261" $O/g8/g8-6-h.last-run.json | head -0; node -e 'const j=require(process.argv[1]);for(const f of j.testResults)for(const a of f.assertionResults)if(a.fullName.includes("ABC-261"))console.log(a.status, a.fullName)' $O/g8/g8-6-h.last-run.json > $O/qe261c-rows.txt
echo "basic $(ts)" >> $O/times.txt
lane() { # tag dir var file [-t pattern]
  local tag=$1 dir=$2 var=$3 f=$4; shift 4; local t0=$(date +%s.%N)
  (cd $dir && env "$var=1" NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run "src/$f.test.ts" "$@") > $O/deep/$tag.txt 2>&1; local rc=$?
  printf '%s rc=%s wall=%.1fs load1=%s %s\n' "$tag" $rc "$(echo "$(date +%s.%N) - $t0" | bc)" "$(cut -d' ' -f1 /proc/loadavg)" "$(grep -E '^ +Tests ' $O/deep/$tag.txt | tr -s ' ' | head -1)" | tee -a $O/deep/summary.txt
}
lane PUZZLE_DEEP-puzzle-suite $W PUZZLE_DEEP puzzle-suite --reporter=verbose
grep -E "PUZZLES|solved|NEWLY" $O/deep/PUZZLE_DEEP-puzzle-suite.txt | head -5 > $O/deep/puzzle-line.txt
for t in B H; do node $W/.grugops/context/se-ABC-235/raw/g1.mjs $Q/trees/$t > $O/g1-$t.jsonl 2>$O/g1-$t.err; done
cmp $O/g1-B.jsonl $O/g1-H.jsonl > $O/g1-cmp.txt 2>&1 && echo "g1 rows B == H ($(wc -l < $O/g1-H.jsonl) rows)" >> $O/g1-cmp.txt; sha256sum $O/g1-*.jsonl >> $O/g1-cmp.txt
lane PERFT_DEEP-perft $W PERFT_DEEP perft
lane ENGINE_DEEP-legal-ABC-250 $W ENGINE_DEEP legal -t ABC-250
lane ENGINE_DEEP-transposition $W ENGINE_DEEP transposition
lane SEARCH_DEEP-transposition $W SEARCH_DEEP transposition
echo "deep-spot $(ts)" >> $O/times.txt
# plants on FP (full archive of 2e04eee5); each file restored from trees/H after each plant
P=$Q/FP
for id in QP1 QP2 QP3 QP4 QP5 QP6; do
  python3 $S/plant.py $P/src $id > $O/plants/$id.plant.txt 2>&1 || { echo "$id plant-error" >> $O/plants/summary.txt; continue; }
  (cd $P && NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run src/perft.test.ts) > $O/plants/$id.perft.txt 2>&1; r1=$?
  (cd $P && NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run src/legal.test.ts) > $O/plants/$id.legal.txt 2>&1; r2=$?
  line="$id lane perft rc=$r1 ($(grep -E '^ +Tests ' $O/plants/$id.perft.txt | tr -s ' ')) legal rc=$r2 ($(grep -E '^ +Tests ' $O/plants/$id.legal.txt | tr -s ' '))"
  if [ $r1 -eq 0 ] && [ $r2 -eq 0 ]; then
    (cd $P && PERFT_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run src/perft.test.ts) > $O/plants/$id.perft-deep.txt 2>&1; r3=$?
    (cd $P && ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run src/legal.test.ts -t ABC-250) > $O/plants/$id.legal-deep.txt 2>&1; r4=$?
    line="$line | deep perft rc=$r3 legal-ABC-250 rc=$r4"
  fi
  echo "$line" >> $O/plants/summary.txt
  for f in apply.ts moves.ts zobrist.ts legal.ts perft.ts; do cp $Q/trees/H/src/$f $P/src/$f; done
done
diff -r $P/src $W/src > /dev/null && echo "FP src restored == worktree src" >> $O/plants/summary.txt
echo "plants $(ts)" >> $O/times.txt
lane ENGINE_DEEP-engine $W ENGINE_DEEP engine
echo "end $(ts)" >> $O/times.txt
