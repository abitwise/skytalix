#!/bin/bash
# usage: mutrun.sh <scratch dir> <lock>. Plants each mutant on the scratch copy M, never the worktree; one sequential loop.
S=$1; L=$2; M=$S/M; O=$S/mut; rm -rf $O; mkdir -p $O; cd $M
restore() { for f in src/evaluate.ts tools/tune/tracer.ts tools/tune/tune.ts; do git -C "$W" show HEAD:$f > $f; done; }
W=$3
report() { python3 - "$1" <<'E'
import json,sys
d=json.load(open(sys.argv[1]))
red=[t['title'][:70] for r in d['testResults'] for t in r['assertionResults'] if t['status']=='failed']
print(f"pass {d['numPassedTests']} fail {d['numFailedTests']} red: "+" | ".join(red))
E
}
for m in CLEAN E14 E15 E16 H1; do
  restore; [ $m != CLEAN ] && python3 $S/mut.py $m $M
  NODE_OPTIONS=--max-old-space-size=400 flock $L npx vitest run src/evaluate.passer.test.ts --reporter=json --outputFile=$O/$m.json > $O/$m.out 2>&1
  echo "$m passer.test exit=$? $(report $O/$m.json)" >> $O/summary.txt
done
for m in CLEAN T1 T2 T3 T4 T5 T6 T7 M1 M2; do
  restore; [ $m != CLEAN ] && python3 $S/mut.py $m $M
  TUNE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 flock $L npx vitest run tools/tune/tune.test.ts -t "QE-271-i" --reporter=json --outputFile=$O/$m-tune.json > $O/$m-tune.out 2>&1
  echo "$m tune.test exit=$? $(report $O/$m-tune.json)" >> $O/summary.txt
done
restore
