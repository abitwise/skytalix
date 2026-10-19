#!/bin/bash
# qe-ABC-173: every AGENTS.md vitest lane at 840ebbf7, typed exactly as AGENTS.md spells it, one at a time.
cd /Users/olgeroeselg/Projects/hacks/grugops-examples/wt-qe-ABC-173 || exit 9
O=/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/8527bcf0-376e-4738-b2d4-7789ea9bdd71/scratchpad/qe173/lanes
unset NODE_OPTIONS PERFT_DEEP SEARCH_DEEP ENGINE_DEEP INPUT_DEEP ZOBRIST_DEEP PUZZLE_DEEP CLI_DEEP LADDER_DEEP VITEST_MAX_WORKERS
lane() { local tag="$1"; shift; local t0=$(date -u +%H:%M:%SZ); bash -c "$*" > "$O/$tag.log" 2>&1; local rc=$?
  local tests=$(grep -E '^ +Tests ' "$O/$tag.log" | tail -1 | sed 's/\x1b\[[0-9;]*m//g' | tr -s ' ')
  local oom=$(grep -c -E 'heap out of memory|JavaScript heap|Worker exited unexpectedly|ERR_WORKER_OUT_OF_MEMORY|heap-guard: refused' "$O/$tag.log")
  echo -e "$tag\t$t0\texit=$rc\t$tests\toom_or_refusal=$oom" | tee -a "$O/summary.tsv"; }
lane perft      'PERFT_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/perft.test.ts'
lane search     'SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/search.test.ts'
lane input      'INPUT_DEEP=1 NODE_OPTIONS="--expose-gc --max-old-space-size=400" npx vitest run src/line-input.test.ts'
lane trans-s    'SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/transposition.test.ts'
lane trans-e    'ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/transposition.test.ts'
lane zobrist    'ZOBRIST_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/zobrist.test.ts'
lane quiesce    'SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/quiescence.test.ts'
lane puzzle     'PUZZLE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/puzzle-suite.test.ts'
lane cli        'CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.real-engine.test.ts'
lane single     'NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/fen.test.ts'
lane coverage   'NODE_OPTIONS=--max-old-space-size=128 npx vitest run --coverage'
lane cov-src    "NODE_OPTIONS=--max-old-space-size=128 npx vitest run --coverage --coverage.include='src/**'"
lane levels     'ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts'
lane engine     'ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/engine.test.ts'
lane ladder     'LADDER_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/ladder.test.ts'
lane pvslmr     'SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/search.pvs-lmr.test.ts'
echo ALL-DONE >> "$O/summary.tsv"
