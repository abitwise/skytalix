#!/usr/bin/env bash
# qe-ABC-282: R-281-a's four and ABC-302's nine -t lines, the lanes W1's diff touches, then the gates. One at a time, each under its own lock hold.
# usage: lanes.sh <worktree> <outdir> <lockfile>
cd "$1" || exit 2; out=$2; lock=$3; mkdir -p "$out"; : > "$out/exits.txt"
echo "head=$(git rev-parse --short HEAD) src=$(git rev-parse --short HEAD:src) dirty=$(git status --porcelain -- src | wc -l) start $(date -u +%FT%TZ) $(uptime)" >> "$out/exits.txt"
run() { local tag=$1; shift; local t0=$(date +%s); flock "$lock" env "$@" > "$out/$tag.log" 2>&1; local ec=$?; echo "$tag exit $ec wall $(( $(date +%s) - t0 ))s $(sed 's/\x1b\[[0-9;]*m//g' "$out/$tag.log" | grep -E '^ +Tests ' | tail -1 | sed 's/  */ /g')" >> "$out/exits.txt"; }
H="NODE_OPTIONS=--max-old-space-size=400"
run t-ABC167A5  ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/uci-session.test.ts -t "ABC-167 A5 — the D4 time rule, read from the info line's time \[deep, ENGINE_DEEP=1\]"
run t-QE208a    SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/search.null-move.test.ts -t "QE-208-a — an abort inside a null move's subtree still hands the root back byte-identical \[deep, SEARCH_DEEP=1\]"
run t-ABC230    ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/engine.test.ts -t "ABC-230 A3 and A4 — no prior keys is base, node for node, and the doors take none \[deep, ENGINE_DEEP=1\]"
run t-A9        ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/levels.test.ts -t "A9 — different seeds actually differ \[deep\]"
run t302-R1 SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/search.null-move.test.ts -t "A2 — the instrumented search makes 0 null moves in check, and 0 below three non-pawn pieces \[deep, SEARCH_DEEP=1\]"
run t302-R2 ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/uci-session.test.ts -t "ABC-241 A4, A5 — UCI: the prior keys are repetition keys \[deep, ENGINE_DEEP=1\]"
run t302-R3 SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/search.futility.test.ts -t "the doors — searchWithoutFutility and chooseMoveWithoutFutility turn futility off, as every older door does \[deep, SEARCH_DEEP=1\]"
run t302-R4 ZOBRIST_DEEP=1 $H timeout 1500 npx vitest run src/zobrist.test.ts -t "ABC-075 property — the ep component tracks the ep FIELD, not availability \(ADR-0020\) \[deep, ZOBRIST_DEEP=1\]"
run t302-R5 ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/engine.test.ts -t "ABC-170 A5 — the limits only shorten; the ceiling still holds \[deep, ENGINE_DEEP=1\]"
run t302-R6 ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/levels.test.ts -t "A7 — seeded, in deterministic mode \[deep\]"
run t302-R7 ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/levels.test.ts -t "ABC-174 A3 — the default plays as the engine: chooseMove at 4 000 ms \(ABC-228, ADR-0053 d10\) \[deep\]"
run t302-R8 ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/uci-session.test.ts -t "ABC-241 A4, A7 — the CLI: a third occurrence through an uncapturable ep square \[deep, ENGINE_DEEP=1\]"
run t302-R9 ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/engine.capacity.test.ts -t "ABC-122 A8: src/engine\.ts's KEY_ARRAY_CAPACITY guard, reached through chooseMove\(\) \[deep, ENGINE_DEEP=1\]"
run engine      ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/engine.test.ts
run ucisession  ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/uci-session.test.ts
run nullmove    SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/search.null-move.test.ts
run pvslmr      SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/search.pvs-lmr.test.ts
run bundle      SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/search.bundle.test.ts
run puzzle      PUZZLE_DEEP=1 $H timeout 1500 npx vitest run src/puzzle-suite.test.ts
run uci         UCI_DEEP=1 $H timeout 1500 npx vitest run src/uci.real-engine.test.ts
run cli         CLI_DEEP=1 $H timeout 1500 npx vitest run src/cli.real-engine.test.ts
g() { local tag=$1; shift; local t0=$(date +%s); flock "$lock" "$@" > "$out/$tag.log" 2>&1; echo "$tag exit $? wall $(( $(date +%s) - t0 ))s" >> "$out/exits.txt"; }
g npmtest npm test
g typecheck npm run typecheck
g lint npm run lint
g build npm run build
sk=$(flock "$lock" bash -c "NODE_OPTIONS=--max-old-space-size=128 npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'"); echo "skip-count ${sk:-UNKNOWN}" >> "$out/exits.txt"
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count "${sk:-x}" > "$out/integrity.log" 2>&1; echo "integrity exit $? $(tr '\n' ' ' < "$out/integrity.log")" >> "$out/exits.txt"
echo "DONE $(date -u +%FT%TZ) $(uptime)" >> "$out/exits.txt"
