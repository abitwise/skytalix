#!/bin/bash
# qe-ABC-271 mutants, the graded pass: ONE sequential loop on its own scratch copy M2 (src + tools), never the worktree.
# Per mutant: QE's k1.ts (tree M2, scale 0.05) and the build's own src/evaluate.passer.test.ts, each under the host lock.
# (The first pass on M raced a second loop on the same file and is discarded.) usage: mutants2.sh <S> <lock> <fixtures.json>
S=$1; L=$2; FX=$3; O=$S/out/mutants2; mkdir -p $O; cd $S/M2
for m in CLEAN E1 E2 E3 E4 E5 E6 E7 E8 E9 E10 E11 E12 E13 E14 E15 E16; do
  cp $S/H/src/evaluate.ts src/evaluate.ts
  [ $m != CLEAN ] && python3 $S/scripts/mutate.py $S/H/src/evaluate.ts src/evaluate.ts $m
  sum=$(sha256sum src/evaluate.ts | cut -c1-12)
  flock $L node $S/scripts/k1.ts $S $FX M2 0.05 > $O/$m-k1.out 2>&1; k=$(tail -1 $O/$m-k1.out)
  [ "$(sha256sum src/evaluate.ts | cut -c1-12)" = "$sum" ] || k="$k (FILE CHANGED DURING RUN)"
  NODE_OPTIONS=--max-old-space-size=400 flock $L npx vitest run src/evaluate.passer.test.ts > $O/$m-vitest.out 2>&1; rc=$?
  [ "$(sha256sum src/evaluate.ts | cut -c1-12)" = "$sum" ] || rc="$rc (FILE CHANGED DURING RUN)"
  echo "$(date -u +%TZ) $m src=$sum k1: $k | passer.test exit=$rc $(grep -E '^ +Tests ' $O/$m-vitest.out | tr -s ' ') red: $(grep -E '^ +(×|✗) ' $O/$m-vitest.out | sed -E 's/^ +//' | cut -c1-100 | tr '\n' '|')" >> $O/summary.txt
done
cp $S/H/src/evaluate.ts src/evaluate.ts; cmp src/evaluate.ts $S/H/src/evaluate.ts && echo "restored" >> $O/summary.txt
