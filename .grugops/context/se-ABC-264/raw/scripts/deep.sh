#!/bin/bash
cd <worktree>
S=<scratch>
L=/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock
run() { name=$1; shift; s=$(date +%s); echo "START $name $(date -u +%T) load=$(cut -d' ' -f1 /proc/loadavg)" >> $S/deep-summary.txt
  env "$@" > $S/deep-$name.log 2>&1; rc=$?
  echo "END $name rc=$rc secs=$(( $(date +%s)-s )) $(grep -E 'Tests ' $S/deep-$name.log | tail -1)" >> $S/deep-summary.txt; }
V="./node_modules/.bin/vitest run"
O="--reporter=verbose --silent=false"
run search SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 flock $L $V src/search.test.ts $O
run nullmove SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 flock $L $V src/search.null-move.test.ts $O
run pvslmr SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 flock $L $V src/search.pvs-lmr.test.ts $O
run quiescence SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 flock $L $V src/quiescence.test.ts $O
run tt-search SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 flock $L $V src/transposition.test.ts $O
run tt-engine ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 flock $L $V src/transposition.test.ts $O
run engine ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 flock $L $V src/engine.test.ts $O
run puzzle PUZZLE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 flock $L $V src/puzzle-suite.test.ts $O
run zobrist ZOBRIST_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 flock $L $V src/zobrist.test.ts $O
run cli CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 flock $L $V src/cli.real-engine.test.ts $O
run uci UCI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 flock $L $V src/uci.real-engine.test.ts $O
run uci-session ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 flock $L $V src/uci-session.test.ts $O
run ladder LADDER_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 flock $L $V src/ladder.test.ts $O
echo DONE >> $S/deep-summary.txt
