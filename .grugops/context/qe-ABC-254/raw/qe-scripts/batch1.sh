#!/usr/bin/env bash
# qe-ABC-254 batch 1 (under flock): mandatory gates, G8, G1 rows, perft counts, QE fuzz, plants.
set -uo pipefail
Q=$1; W=$2; R=$3; S=$Q/scripts; O=$Q/out/b1; mkdir -p $O/plants
ts() { date -u +%FT%TZ; }
echo "start $(ts)" > $O/times.txt
cd $W
for g in lint typecheck build; do npm run $g > $O/$g.txt 2>&1; echo "$g rc=$? $(ts)" | tee -a $O/times.txt; done
rm -rf $W/dist
$S/g8.sh $Q/FB $W $O/g8; echo "g8 done $(ts)" >> $O/times.txt
node -e 'const j=require(process.argv[1]); console.log(JSON.stringify({total:j.numTotalTests,passed:j.numPassedTests,failed:j.numFailedTests,pending:j.numPendingTests,todo:j.numTodoTests}))' $W/.test-results/last-run.json > $O/last-run-counts.txt
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0 > $O/skip-integrity.txt 2>&1; echo "skip-integrity rc=$?" >> $O/skip-integrity.txt
node tools/grugops/lane-inventory.js > $O/lane-inventory.txt 2>&1; echo "lane-inventory rc=$?" >> $O/lane-inventory.txt
# G1 rows, out of tree
for t in B H; do node $W/.grugops/context/se-ABC-235/raw/g1.mjs $Q/trees/$t > $O/g1-$t.jsonl 2>$O/g1-$t.err; done
cmp $O/g1-B.jsonl $O/g1-H.jsonl > $O/g1-cmp.txt 2>&1 && echo "g1 rows B == H ($(wc -l < $O/g1-H.jsonl) rows)" >> $O/g1-cmp.txt; sha256sum $O/g1-*.jsonl >> $O/g1-cmp.txt
echo "g1 $(ts)" >> $O/times.txt
# perft counts (NFR-001)
npm run perft > $O/perft-H.txt 2>&1; (cd $Q/trees/B && node src/perft-bench.ts) > $O/perft-B.txt 2>&1
echo "perft $(ts)" >> $O/times.txt
# QE fuzz differential
node $S/fuzz.mjs $Q/trees/H 254 3000 300000 > $O/fuzz-H.json 2>&1; echo "fuzz rc=$? $(ts)" >> $O/times.txt
# plants (FP = full archive of 600d8de3, node_modules symlinked)
P=$Q/FP; orig=$O/plants/legal.ts.orig; cp $P/src/legal.ts $orig
for id in PL1 PL2 PL3a PL3b PQ1 PQ2 PQ3; do
  cp $orig $P/src/legal.ts; python3 $S/plant.py $P/src/legal.ts $id > $O/plants/$id.plant.txt 2>&1
  case $id in
    PL*) (cd $P && NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run src/gameend.nfr.test.ts) > $O/plants/$id.gameend-nfr.txt 2>&1; echo "$id gameend.nfr rc=$?" >> $O/plants/summary.txt ;;
    PQ*) (cd $P && NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run src/legal.test.ts) > $O/plants/$id.legal.txt 2>&1; echo "$id legal.test.ts rc=$?" >> $O/plants/summary.txt
         node $S/fuzz.mjs $P 254 300 30000 > $O/plants/$id.fuzz.json 2>&1; echo "$id fuzz rc=$? mismatches=$(node -e 'try{const j=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"));console.log(j.mismatches, "mutations", j.mutations)}catch(e){console.log("parse-error")}' $O/plants/$id.fuzz.json)" >> $O/plants/summary.txt ;;
  esac
  if [ $id = PL3a ]; then (cd $P && npm test) > $O/plants/PL3a.npm-test.txt 2>&1; echo "PL3a npm test rc=$?" >> $O/plants/summary.txt; fi
done
cp $orig $P/src/legal.ts; cmp $P/src/legal.ts $W/src/legal.ts && echo "FP legal.ts restored == worktree" >> $O/plants/summary.txt
echo "end $(ts)" >> $O/times.txt
