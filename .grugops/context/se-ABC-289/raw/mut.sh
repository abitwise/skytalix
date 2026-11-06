#!/bin/bash
S=$1; O=$S/out/mut.txt; : > $O
for i in 0 1 2 3 4 5 6 7; do
  rm -rf $S/m; cp -r $S/head $S/m; n=$(python3 $S/mut.py $S/m $i)
  (cd $S/m && NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/quiescence.test.ts -t "ABC-289 DP1" --reporter=verbose > $S/out/mut-$i.txt 2>&1); rc=$?
  echo "$i $n exit=$rc $(sed 's/\x1b\[[0-9;]*m//g' $S/out/mut-$i.txt | grep -E '^ +Tests ')" >> $O
done
rm -rf $S/m
