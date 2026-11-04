#!/usr/bin/env bash
# qe-ABC-283: R-281-a's four -t lines, every game-free deep lane (AGENTS.md spellings; no ladder: it plays games;
# Levels runs separately, ALONE, as a bar), then the gates. One lane at a time, each under its own lock hold.
# usage: lanes.sh <worktree> <outdir> <lockfile>
cd "$1" || exit 2; out=$2; lock=$3; mkdir -p "$out"; : > "$out/exits.txt"
echo "head=$(git rev-parse --short HEAD) src=$(git rev-parse --short HEAD:src) dirty=$(git status --porcelain -- src | wc -l) start $(date -u +%FT%TZ) $(uptime)" >> "$out/exits.txt"
run() { local tag=$1; shift; local t0=$(date +%s); flock "$lock" env "$@" > "$out/$tag.log" 2>&1; local ec=$?; echo "$tag exit $ec wall $(( $(date +%s) - t0 ))s $(grep -E '^ +Tests ' "$out/$tag.log" | tail -1 | sed 's/  */ /g')" >> "$out/exits.txt"; }
H="NODE_OPTIONS=--max-old-space-size=400"
run t-A5        ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/uci-session.test.ts -t "ABC-167 A5 — the D4 time rule, read from the info line's time \[deep, ENGINE_DEEP=1\]"
run t-QE208a    SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/search.null-move.test.ts -t "QE-208-a — an abort inside a null move's subtree still hands the root back byte-identical \[deep, SEARCH_DEEP=1\]"
run t-ABC230    ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/engine.test.ts -t "ABC-230 A3 and A4 — no prior keys is base, node for node, and the doors take none \[deep, ENGINE_DEEP=1\]"
run t-A9        ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/levels.test.ts -t "A9 — different seeds actually differ \[deep\]"
run bundle      SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/search.bundle.test.ts --reporter=verbose
run search      SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/search.test.ts
run see         SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/see.test.ts
run futility    SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/search.futility.test.ts
run taper       SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/evaluate.taper.test.ts
run nullmove    SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/search.null-move.test.ts
run pvslmr      SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/search.pvs-lmr.test.ts
run quiescence  SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/quiescence.test.ts
run tt-search   SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/transposition.test.ts
run tt-engine   ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/transposition.test.ts
run ord-search  SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/search.ordering.test.ts
run ord-engine  ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/search.ordering.test.ts
run pvslmr-eng  ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/search.pvs-lmr.test.ts
run quies-eng   ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/quiescence.test.ts
run engine      ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/engine.test.ts
run pawns-eng   ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/evaluate.pawns.test.ts
run legal-eng   ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/legal.test.ts
run moves-eng   ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/moves.test.ts
run gameend-eng ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/gameend.test.ts
run puzzle      PUZZLE_DEEP=1 $H timeout 1500 npx vitest run src/puzzle-suite.test.ts --reporter=verbose
run zobrist     ZOBRIST_DEEP=1 $H timeout 1500 npx vitest run src/zobrist.test.ts
run perft       PERFT_DEEP=1 $H timeout 1500 npx vitest run src/perft.test.ts
run input       INPUT_DEEP=1 NODE_OPTIONS="--expose-gc --max-old-space-size=400" timeout 1500 npx vitest run src/line-input.test.ts
run tune        TUNE_DEEP=1 $H timeout 1500 npx vitest run tools/tune/tune.test.ts
run cli         CLI_DEEP=1 $H timeout 1500 npx vitest run src/cli.real-engine.test.ts
run uci         UCI_DEEP=1 $H timeout 1500 npx vitest run src/uci.real-engine.test.ts
run ucisession  ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/uci-session.test.ts
# gates
g() { local tag=$1; shift; local t0=$(date +%s); flock "$lock" "$@" > "$out/$tag.log" 2>&1; echo "$tag exit $? wall $(( $(date +%s) - t0 ))s" >> "$out/exits.txt"; }
g npmtest npm test
g typecheck npm run typecheck
g lint npm run lint
g build npm run build
sk=$(flock "$lock" bash -c "NODE_OPTIONS=--max-old-space-size=128 npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'"); echo "skip-count ${sk:-UNKNOWN}" >> "$out/exits.txt"
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count "${sk:-x}" > "$out/integrity.log" 2>&1; echo "integrity exit $? $(cat "$out/integrity.log" | tr '\n' ' ')" >> "$out/exits.txt"
echo "DONE $(date -u +%FT%TZ) $(uptime)" >> "$out/exits.txt"
