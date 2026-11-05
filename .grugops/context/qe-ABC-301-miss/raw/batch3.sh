#!/bin/bash
# qe-ABC-301-miss batch 3. The caller holds the host lock. usage: batch3.sh <cand> <base> <plant> <rawdir> <fit.json> <outdir> <lichess>
C=$1; B=$2; P=$3; D=$4; FIT=$5; O=$6; LI=$7
scrub() { sed -e 's/\x1b\[[0-9;]*m//g' -e "s#$C#<cand>#g" -e "s#$B#<base>#g" -e "s#$P#<plant>#g" -e "s#$O#<out>#g" -e "s#$LI#<lichess>#g" -e "s#$HOME#<home>#g"; }
node $D/params-diff.ts $C $B $FIT 2>&1 | scrub > $D/params-diff.txt
{ echo "cand"; node $D/treecheck.ts $C 4 2>&1; echo "base"; node $D/treecheck.ts $B 4 2>&1; echo "plant: enemy distance capped at 4, not 5, in passerTerms, emitted table"; node $D/treecheck.ts $P 4 2>&1; } | scrub > $D/treecheck.txt
{ echo "the tool's own gate on the plant, emitted table:"; (cd $P && timeout 300 node --max-old-space-size=3000 tools/tune/tune.ts extract $O/plant --lichess $LI 2>&1 | tail -4; echo "exit ${PIPESTATUS[0]}"); } | scrub | cut -c1-240 > $D/plant-gate.txt
for n in cand base; do
  T=$C; [ $n = base ] && T=$B
  (cd $T && SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/evaluate.taper.test.ts -t 'ABC-269 B2' --reporter=verbose 2>&1; echo "exit $?") | scrub | grep -v ' ↓ ' > $D/matefloor-$n.txt
  (cd $T && PUZZLE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/puzzle-suite.test.ts --reporter=verbose 2>&1; echo "exit $?") | scrub | grep -v ' ↓ ' > $D/g1-$n.txt
done
(cd $B && TUNE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run tools/tune --reporter=verbose 2>&1; echo "exit $?") | scrub > $D/tune-deep-b297ab89.txt
