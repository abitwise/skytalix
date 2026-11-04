#!/bin/bash
# qe-ABC-301-s0 batch 3, one sequential loop, under ONE host-lock hold (no inner flock). usage: batch3.sh <S> <worktree> <lichess file>
S=$1; WT=$2; LI=$3; O=$S/out; mkdir -p $O/b3 $O/lane
stamp() { echo "$(date -u +%FT%TZ) $*" >> $O/b3.log; }
: > $O/b3.log
# --- lanes on the tip
cd $WT
stamp tune-deep-start
TUNE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run tools/tune/tune.test.ts --reporter=json --outputFile=$O/b3/tune-deep.json > $O/b3/tune-deep.out 2>&1; stamp "tune-deep exit=$?"
npm run typecheck > $O/b3/typecheck.out 2>&1; stamp "typecheck exit=$?"
npm run lint > $O/b3/lint.out 2>&1; stamp "lint exit=$?"
npm run build > $O/b3/build.out 2>&1; stamp "build exit=$?"
VITEST_MAX_WORKERS=1 npm test > $O/b3/npmtest.out 2>&1; stamp "npm-test exit=$?"
cp .test-results/last-run.json $O/b3/last-run.json 2>/dev/null
NODE_OPTIONS=--max-old-space-size=128 VITEST_MAX_WORKERS=1 npx vitest run --reporter=json 2>/dev/null > $O/b3/lane.json; stamp "lane-json exit=$?"
n=$(jq '.numPendingTests + .numTodoTests' $O/b3/lane.json); stamp "skip-count=$n total=$(jq .numTotalTests $O/b3/lane.json) passed=$(jq .numPassedTests $O/b3/lane.json) files=$(jq '.testResults|length' $O/b3/lane.json)"
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count "$n" > $O/b3/skip-integrity.out 2>&1; stamp "skip-integrity exit=$?"
# --- the emission in a project: typecheck, lint, the passer rows (scratch copy G)
node $S/emitprobe.ts $WT $S/main-params.ts $WT/.grugops/context/se-ABC-301-s0/raw/bt1-extract.json $O/emit > $O/emitprobe.clean.json 2>&1; stamp "emitprobe exit=$?"
cd $S/G
for e in base fit; do
  cp $O/emit/$e.ts src/evaluate-params.ts
  npx tsc --noEmit > $O/b3/emit-$e-tsc.out 2>&1; stamp "emission-$e tsc exit=$?"
  npx biome check src/evaluate-params.ts > $O/b3/emit-$e-biome.out 2>&1; stamp "emission-$e biome exit=$?"
done
cp $O/emit/base.ts src/evaluate-params.ts
NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/evaluate.passer.test.ts > $O/b3/emit-base-passer.out 2>&1; stamp "emission-base passer exit=$?"
git -C $WT show HEAD:src/evaluate-params.ts > src/evaluate-params.ts
# --- default-lane cost: the one file, base and tip alternating, in-thread durations
for i in 1 2 3 4 5 6 7; do
  for t in B G; do
    cd $S/$t
    NODE_OPTIONS=--max-old-space-size=400 VITEST_MAX_WORKERS=1 npx vitest run src/evaluate.passer.test.ts --reporter=json --outputFile=$O/lane/$t$i.json > /dev/null 2>&1
  done
done
stamp lane-cost-done
# --- H5 and H6 through the whole lane on M, against M clean (M lacks the records, so read the DIFFERENCE of red rows)
cd $S/M
for m in CLEAN H5 H6; do
  cp $S/evaluate.clean.ts src/evaluate.ts
  [ $m != CLEAN ] && python3 $S/mut301.py $S/evaluate.clean.ts src/evaluate.ts $m
  NODE_OPTIONS=--max-old-space-size=128 VITEST_MAX_WORKERS=1 timeout 300 npx vitest run --reporter=json --outputFile=$O/b3/lane-$m.json > /dev/null 2>&1; stamp "lane-$m exit=$?"
done
cp $S/evaluate.clean.ts src/evaluate.ts
# --- B-T1 on the full set at the base values: extract only, no fit, no emit
cd $WT; rm -rf $S/bt1; mkdir -p $S/bt1
stamp bt1-start
node --max-old-space-size=3000 tools/tune/tune.ts extract $S/bt1 --lichess "$LI" > $O/bt1.log 2>&1; stamp "bt1 exit=$?"
stamp DONE
