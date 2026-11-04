#!/bin/bash
# usage: lanes.sh <worktree> <outdir>. One lane at a time; each under timeout 1500.
cd "$1" || exit 2
out=$2
run() { local tag=$1; shift; local t0=$(date +%s); env "$@" > "$out/$tag.log" 2>&1; local ec=$?; echo "$tag exit $ec wall $(( $(date +%s) - t0 ))s" >> "$out/exits.txt"; }
H="NODE_OPTIONS=--max-old-space-size=400"
run search      SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/search.test.ts
run see         SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/see.test.ts
run futility    SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/search.futility.test.ts
run nullmove    SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/search.null-move.test.ts
run pvslmr      SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/search.pvs-lmr.test.ts
run taper       SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/evaluate.taper.test.ts
run quiescence  SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/quiescence.test.ts
run tt-search   SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/transposition.test.ts
run tt-engine   ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/transposition.test.ts
run engine      ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/engine.test.ts
run levels      ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/levels.test.ts --reporter=verbose
run puzzle      PUZZLE_DEEP=1 $H timeout 1500 npx vitest run src/puzzle-suite.test.ts
run zobrist     ZOBRIST_DEEP=1 $H timeout 1500 npx vitest run src/zobrist.test.ts
run tune        TUNE_DEEP=1 $H timeout 1500 npx vitest run tools/tune/tune.test.ts
run cli         CLI_DEEP=1 $H timeout 1500 npx vitest run src/cli.real-engine.test.ts
run uci         UCI_DEEP=1 $H timeout 1500 npx vitest run src/uci.real-engine.test.ts
run ucisession  ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/uci-session.test.ts
