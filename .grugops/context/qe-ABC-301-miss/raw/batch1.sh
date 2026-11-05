#!/bin/bash
# qe-ABC-301-miss batch 1. The caller holds the host lock. usage: batch1.sh <cand> <base> <rawdir>
# The row, the seven rows with SEARCH_DEEP=1, A9, the driver in a fresh process x3, UCI from src/ and from a fresh build.
C=$1; B=$2; D=$3
scrub() { sed -e 's/\x1b\[[0-9;]*m//g' -e "s#$C#<cand>#g" -e "s#$B#<base>#g" -e "s#$HOME#<home>#g"; }
U='position fen 8/8/p1p5/1p5p/1P5p/8/PPP2K1p/4R1rk w - - 0 1\ngo depth 9\n'
for n in cand base; do
  T=$C; [ $n = base ] && T=$B
  { echo "== row $n HEAD $(git -C $T rev-parse --short HEAD) dirty $(git -C $T status --short | wc -l)"
    (cd $T && NODE_OPTIONS=--max-old-space-size=128 npx vitest run src/search.null-move.test.ts -t 'zugzwang.001' --reporter=verbose 2>&1; echo "exit $?"); } | scrub > $D/row-$n.txt
  { (cd $T && SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/search.null-move.test.ts -t 'the shipped engine plays the recorded move' --reporter=verbose 2>&1; echo "exit $?"); } | scrub > $D/zugzwang7-$n.txt
  { (cd $T && NODE_OPTIONS=--max-old-space-size=128 npx vitest run src/evaluate.taper.test.ts -t 'ABC-274 A9' --reporter=verbose 2>&1; echo "exit $?"); } | scrub > $D/a9-$n.txt
  : > $D/driver-$n.jsonl
  for i in 1 2 3; do node $D/zz001.ts $T 9 >> $D/driver-$n.jsonl 2>&1; done
  { echo "== uci from src/, $n"; (cd $T && (printf "$U"; sleep 3; echo quit) | node src/uci.ts 2>&1 | tail -4)
    (cd $T && rm -rf dist && npx tsc -p tsconfig.build.json; echo "build exit $?")
    echo "== uci from a fresh dist/, $n"; (cd $T && (printf "$U"; sleep 3; echo quit) | node dist/uci.js 2>&1 | tail -4); } | scrub > $D/uci-$n.txt
done
