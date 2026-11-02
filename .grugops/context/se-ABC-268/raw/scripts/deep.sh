#!/bin/bash
cd /home/olger/projects/public/skytalix/.claude/worktrees/se-ABC-268
S=/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad
O=$S/se268out
L=$S/host-test.lock
run() { name=$1; shift; s=$(date +%s); echo "START $name $(date -u +%T) load=$(cut -d' ' -f1 /proc/loadavg)" >> $O/deep-summary.txt
  env "$@" > $O/deep-$name.log 2>&1; rc=$?
  echo "END $name rc=$rc secs=$(( $(date +%s)-s )) $(grep -E 'Tests ' $O/deep-$name.log | tail -1)" >> $O/deep-summary.txt; }
V="./node_modules/.bin/vitest run"
R="--reporter=verbose --silent=false"
T="timeout 900"
run search SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 flock $L $T $V src/search.test.ts $R
run nullmove SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 flock $L $T $V src/search.null-move.test.ts $R
run pvslmr SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 flock $L $T $V src/search.pvs-lmr.test.ts $R
run quiescence SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 flock $L $T $V src/quiescence.test.ts $R
run tt-search SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 flock $L $T $V src/transposition.test.ts $R
run tt-engine ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 flock $L $T $V src/transposition.test.ts $R
run engine ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 flock $L $T $V src/engine.test.ts $R
run puzzle PUZZLE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 flock $L $T $V src/puzzle-suite.test.ts $R
run zobrist ZOBRIST_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 flock $L $T $V src/zobrist.test.ts $R
run cli CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 flock $L $T $V src/cli.real-engine.test.ts $R
run uci UCI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 flock $L $T $V src/uci.real-engine.test.ts $R
run uci-session ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 flock $L $T $V src/uci-session.test.ts $R
run ladder LADDER_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 flock $L $T $V src/ladder.test.ts $R
echo DONE >> $O/deep-summary.txt
