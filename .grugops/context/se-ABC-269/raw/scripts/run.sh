#!/bin/bash
# se-ABC-269 deep lanes, one at a time, each under the host lock.
cd /home/olger/projects/public/skytalix/.claude/worktrees/se-ABC-269
L=/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock
D=$1
run() { # name env file
  local name=$1 envv=$2 file=$3
  echo "$(date -u +%TZ) start $name" >> $D/exits.txt
  env $envv NODE_OPTIONS=--max-old-space-size=400 flock $L timeout 2400 npx vitest run $file > $D/$name.txt 2>&1
  echo "$(date -u +%TZ) $name exit=$? $(grep -E 'Tests ' $D/$name.txt | tr -s ' ')" >> $D/exits.txt
}
run taper SEARCH_DEEP=1 src/evaluate.taper.test.ts
run nullmove SEARCH_DEEP=1 src/search.null-move.test.ts
run futility SEARCH_DEEP=1 src/search.futility.test.ts
run search SEARCH_DEEP=1 src/search.test.ts
run engine ENGINE_DEEP=1 src/engine.test.ts
run quiescence SEARCH_DEEP=1 src/quiescence.test.ts
run tt-search SEARCH_DEEP=1 src/transposition.test.ts
run tt-engine ENGINE_DEEP=1 src/transposition.test.ts
run pvslmr SEARCH_DEEP=1 src/search.pvs-lmr.test.ts
run ordering SEARCH_DEEP=1 src/search.ordering.test.ts
run puzzle PUZZLE_DEEP=1 src/puzzle-suite.test.ts
run pawns ENGINE_DEEP=1 src/evaluate.pawns.test.ts
echo "$(date -u +%TZ) ALL DONE" >> $D/exits.txt
