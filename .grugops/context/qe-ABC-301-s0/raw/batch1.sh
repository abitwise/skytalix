#!/bin/bash
# qe-ABC-301-s0 batch 1, one sequential loop on the scratch copy M, run under ONE host-lock hold (no inner flock).
S=$1; O=$S/out; cd $S/M; : > $O/summary.txt
export NODE_OPTIONS=--max-old-space-size=400
red() { python3 - "$1" <<'P'
import json,sys
d=json.load(open(sys.argv[1]))
red=[t['title'][:74] for r in d['testResults'] for t in r['assertionResults'] if t['status']=='failed']
print(f"pass {d['numPassedTests']} fail {d['numFailedTests']} red: "+" | ".join(red))
P
}
for m in CLEAN E14 E15 E16 H1 H3 H4 H5 H6 H7 H8 H9; do
  cp $S/evaluate.clean.ts src/evaluate.ts
  [ $m != CLEAN ] && python3 $S/mut301.py $S/evaluate.clean.ts src/evaluate.ts $m
  sum=$(sha256sum src/evaluate.ts | cut -c1-12)
  node $S/formprobe.ts $S/M/src/ $m > $O/$m.probe.json 2> $O/$m.probe.err
  npx vitest run src/evaluate.passer.test.ts --reporter=json --outputFile=$O/$m.json > $O/$m.out 2>&1; rc=$?
  [ "$(sha256sum src/evaluate.ts | cut -c1-12)" = "$sum" ] || rc="$rc FILE-CHANGED"
  echo "$m src=$sum exit=$rc $(red $O/$m.json)" >> $O/summary.txt
done
cp $S/evaluate.clean.ts src/evaluate.ts; cmp src/evaluate.ts $S/evaluate.clean.ts && echo restored >> $O/summary.txt
echo DONE >> $O/summary.txt
