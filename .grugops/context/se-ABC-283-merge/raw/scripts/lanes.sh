#!/bin/bash
# se-ABC-283-merge: R-281-a's four -t lines, the lanes that read the merged files, then the gates.
# usage: lanes.sh <worktree> <outdir> <lockfile>. One lane at a time, each under its own lock hold and timeout 1500. No games.
cd "$1" || exit 2; out=$2; lock=$3; mkdir -p "$out"; : > "$out/exits.txt"
echo "head=$(git rev-parse --short HEAD) src=$(git rev-parse --short HEAD:src) dirty=$(git status --porcelain -- src | wc -l) start $(date -u +%FT%TZ)" >> "$out/exits.txt"
run() { local tag=$1; shift; local t0=$(date +%s); flock "$lock" env "$@" > "$out/$tag.log" 2>&1; local ec=$?; echo "$tag exit $ec wall $(( $(date +%s) - t0 ))s $(grep -E '^ +Tests ' "$out/$tag.log" | tail -1 | sed 's/  */ /g')" >> "$out/exits.txt"; }
H="NODE_OPTIONS=--max-old-space-size=400"
run t-A5        ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/uci-session.test.ts -t "ABC-167 A5 — the D4 time rule, read from the info line's time \[deep, ENGINE_DEEP=1\]"
run t-QE208a    SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/search.null-move.test.ts -t "QE-208-a — an abort inside a null move's subtree still hands the root back byte-identical \[deep, SEARCH_DEEP=1\]"
run t-ABC230    ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/engine.test.ts -t "ABC-230 A3 and A4 — no prior keys is base, node for node, and the doors take none \[deep, ENGINE_DEEP=1\]"
run t-A9        ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/levels.test.ts -t "A9 — different seeds actually differ \[deep\]"
run bundle      SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/search.bundle.test.ts --reporter=verbose
run taper       SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/evaluate.taper.test.ts
run tt-search   SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/transposition.test.ts
run tt-engine   ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/transposition.test.ts
run pawns-eng   ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/evaluate.pawns.test.ts
run passer      $H timeout 1500 npx vitest run src/evaluate.passer.test.ts
run puzzle      PUZZLE_DEEP=1 $H timeout 1500 npx vitest run src/puzzle-suite.test.ts --reporter=verbose
g() { local tag=$1; shift; local t0=$(date +%s); flock "$lock" "$@" > "$out/$tag.log" 2>&1; echo "$tag exit $? wall $(( $(date +%s) - t0 ))s" >> "$out/exits.txt"; }
g npmtest npm test
g typecheck npm run typecheck
g lint npm run lint
g build npm run build
sk=$(flock "$lock" bash -c "NODE_OPTIONS=--max-old-space-size=128 npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'"); echo "skip-count ${sk:-UNKNOWN}" >> "$out/exits.txt"
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count "${sk:-x}" > "$out/integrity.log" 2>&1; echo "integrity exit $? $(tr '\n' ' ' < "$out/integrity.log")" >> "$out/exits.txt"
echo "DONE $(date -u +%FT%TZ)" >> "$out/exits.txt"
