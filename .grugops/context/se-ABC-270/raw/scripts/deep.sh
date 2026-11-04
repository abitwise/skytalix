#!/bin/bash
# se-ABC-270 deep lanes (se-ABC-274's deep.sh list + the Levels lane, which AGENTS.md's command log triggers on any
# src/evaluate.ts change), one at a time, each under the host lock; exit code is vitest's own.
# usage: deep.sh <worktree> <outdir> <lock>
cd "$1" || exit 1
L=$3
D=$2; mkdir -p $D
run() { local name=$1 envv=$2 file=$3
  echo "$(date -u +%TZ) start $name" >> $D/exits.txt
  env $envv NODE_OPTIONS=--max-old-space-size=400 flock $L timeout 2400 npx vitest run $file --reporter=verbose > $D/$name.txt 2>&1; local rc=$?
  echo "$(date -u +%TZ) $name exit=$rc $(grep -E '^ +Tests ' $D/$name.txt | tr -s ' ')" >> $D/exits.txt
}
run taper SEARCH_DEEP=1 src/evaluate.taper.test.ts
run nullmove SEARCH_DEEP=1 src/search.null-move.test.ts
run futility SEARCH_DEEP=1 src/search.futility.test.ts
run search SEARCH_DEEP=1 src/search.test.ts
run quiescence SEARCH_DEEP=1 src/quiescence.test.ts
run tt-search SEARCH_DEEP=1 src/transposition.test.ts
run pvslmr SEARCH_DEEP=1 src/search.pvs-lmr.test.ts
run ordering SEARCH_DEEP=1 src/search.ordering.test.ts
run engine ENGINE_DEEP=1 src/engine.test.ts
run tt-engine ENGINE_DEEP=1 src/transposition.test.ts
run pawns ENGINE_DEEP=1 src/evaluate.pawns.test.ts
run levels ENGINE_DEEP=1 src/levels.test.ts
run puzzle PUZZLE_DEEP=1 src/puzzle-suite.test.ts
run puzzle-weakened PUZZLE_DEEP=weakened src/puzzle-suite.test.ts
echo "$(date -u +%TZ) ALL DONE" >> $D/exits.txt
