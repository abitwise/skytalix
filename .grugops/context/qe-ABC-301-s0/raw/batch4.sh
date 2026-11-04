#!/bin/bash
# qe-ABC-301-s0 batch 4: the emitter mutants through the WHOLE TUNE_DEEP lane on M, under ONE host-lock hold (no inner flock).
S=$1; WT=$2; O=$S/out; cd $S/M; : > $O/emitlane.txt
for m in M3 M4 M5; do
  for f in tools/tune/tracer.ts tools/tune/tune.ts; do git -C $WT show HEAD:$f > $f; done
  python3 $S/mut301t.py $S/M $m
  TUNE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run tools/tune/tune.test.ts --reporter=json --outputFile=$O/b2/lane$m.json > $O/b2/lane$m.out 2>&1; rc=$?
  echo "$m exit=$rc $(jq -c '[.numPassedTests,.numFailedTests,([.testResults[].assertionResults[]|select(.status=="failed")|.title[0:80]])]' $O/b2/lane$m.json)" >> $O/emitlane.txt
done
for f in tools/tune/tracer.ts tools/tune/tune.ts; do git -C $WT show HEAD:$f > $f; done
diff -r $S/M/tools $WT/tools > /dev/null && echo "M restored" >> $O/emitlane.txt
