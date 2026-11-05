#!/bin/bash
# qe-ABC-301-s0 batch 2, one sequential loop, under ONE host-lock hold (no inner flock). Scratch copies M and G only.
S=$1; WT=$2; O=$S/out; mkdir -p $O/b2 $O/emit; export NODE_OPTIONS=--max-old-space-size=400
red() { python3 - "$1" <<'P'
import json,sys
d=json.load(open(sys.argv[1]))
red=[t['title'][:70] for r in d['testResults'] for t in r['assertionResults'] if t['status']=='failed']
msg=[t['failureMessages'][0].split('\n')[0][:110] for r in d['testResults'] for t in r['assertionResults'] if t['status']=='failed']
print(f"pass {d['numPassedTests']} fail {d['numFailedTests']} red: "+" | ".join(red)+" :: "+" | ".join(msg))
P
}
# --- A. the row after a fit: shipped E4a non-zero
cd $S/M; : > $O/fit-shape.txt
for v in S0 S1 S2 S1E14 S1E15 S1E16; do
  cp $S/evaluate.clean.ts src/evaluate.ts; cp $S/evaluate-params.clean.ts src/evaluate-params.ts
  case $v in S1*|S2) python3 $S/params.py src/evaluate-params.ts S1;; esac
  [ $v = S2 ] && python3 $S/params.py src/evaluate-params.ts S2
  case $v in S1E*) python3 $S/mut301.py $S/evaluate.clean.ts src/evaluate.ts ${v#S1};; esac
  npx vitest run src/evaluate.passer.test.ts -t "ABC-301 P1" --reporter=json --outputFile=$O/b2/$v.json > $O/b2/$v.out 2>&1; rc=$?
  echo "$v exit=$rc $(red $O/b2/$v.json)" >> $O/fit-shape.txt
done
cp $S/evaluate.clean.ts src/evaluate.ts; cp $S/evaluate-params.clean.ts src/evaluate-params.ts
# --- B. P2 plants on G
cd $S/G; : > $O/plants.txt
for pl in CLEAN P-src-deep P-src-helper P-tools-py P-tools-test P-spike P-config P-package P-evaluate-call P-src-mjs P-src-js P-src-mts P-root-script P-root-mjs P-github P-alias P-dynamic; do
  planted=""; [ $pl != CLEAN ] && planted=$(python3 $S/plant.py $S/G $pl)
  npx vitest run src/evaluate.passer.test.ts -t "called from test files only" --reporter=json --outputFile=$O/b2/$pl.json > $O/b2/$pl.out 2>&1; rc=$?
  echo "$pl exit=$rc $(red $O/b2/$pl.json)" >> $O/plants.txt
  for f in $planted; do if git -C $WT cat-file -e HEAD:$f 2>/dev/null; then git -C $WT show HEAD:$f > $f; else rm -f $f; fi; done
  rm -rf src/aa tools/zz .github
done
diff -r $S/G/src $WT/src > /dev/null && diff -r $S/G/tools $WT/tools > /dev/null && echo "G restored" >> $O/plants.txt
# --- C. d5's row as written, wide
cd $S/M
node --max-old-space-size=1500 $S/tracerdirect.ts $S/M 1 > $O/tracerdirect.json 2> $O/tracerdirect.err; echo "tracerdirect exit=$?" >> $O/tracerdirect.err
# --- D. tool mutants: the row, and the direct read
: > $O/toolmut.txt
for m in CLEAN T8 T9 T10 T11 T12 T14 M3 M4 M5; do
  for f in tools/tune/tracer.ts tools/tune/tune.ts; do git -C $WT show HEAD:$f > $f; done
  [ $m != CLEAN ] && python3 $S/mut301t.py $S/M $m
  TUNE_DEEP=1 npx vitest run tools/tune/tune.test.ts -t "QE-271-i" --reporter=json --outputFile=$O/b2/t$m.json > $O/b2/t$m.out 2>&1; rc=$?
  dir=$(node --max-old-space-size=1000 $S/tracerdirect.ts $S/M 0.05 2>&1 | python3 -c "
import json,sys
try:
  d=json.loads(sys.stdin.read()); print({k:(v['seamMiss'],v['fixtureMiss'],v['gateMiss']) for k,v in d['sets'].items()})
except Exception as e: print('ERR',e)")
  rt=$(node $S/emitprobe.ts $S/M $S/main-params.ts $WT/.grugops/context/se-ABC-301-s0/raw/bt1-extract.json $O/emit 2>&1 | tail -1 | cut -c1-330)
  echo "$m exit=$rc $(red $O/b2/t$m.json) || direct(seamMiss,fixtureMiss,gateMiss) $dir || emitprobe $rt" >> $O/toolmut.txt
done
for f in tools/tune/tracer.ts tools/tune/tune.ts; do git -C $WT show HEAD:$f > $f; done
diff -r $S/M/src $WT/src > /dev/null && diff -r $S/M/tools $WT/tools > /dev/null && echo "M restored" >> $O/toolmut.txt
echo DONE >> $O/toolmut.txt
