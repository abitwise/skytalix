#!/bin/bash
# qe-ABC-270 mutants on a SCRATCH COPY of the build's src/ (M/), never the worktree. Per mutant: QE's k1.ts (tree M) and
# the build's own new test file (src/evaluate.queen-on.test.ts) + the king-mobility file, each under the host lock.
S=$1; L=$2; O=$S/out/mutants; mkdir -p $O; cd $S/M
for m in CLEAN Q1 Q2 Q3 Q4 Q5 Q6 Q7; do
  cp $S/H/src/evaluate.ts src/evaluate.ts
  [ $m != CLEAN ] && python3 $S/scripts/mutate.py $S/H/src/evaluate.ts src/evaluate.ts $m
  flock $L node $S/scripts/k1.ts $S $S/pairs.json M > $O/$m-k1.out 2>&1; k=$(tail -1 $O/$m-k1.out)
  NODE_OPTIONS=--max-old-space-size=400 flock $L npx vitest run src/evaluate.queen-on.test.ts > $O/$m-vitest.out 2>&1; rc=$?
  echo "$(date -u +%TZ) $m k1: $k | queen-on.test exit=$rc $(grep -E '^ +Tests ' $O/$m-vitest.out | tr -s ' ')" >> $O/summary.txt
done
cp $S/H/src/evaluate.ts src/evaluate.ts; cmp src/evaluate.ts $S/H/src/evaluate.ts && echo "restored" >> $O/summary.txt
