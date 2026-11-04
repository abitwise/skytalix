#!/bin/bash
# The nine ABC-302 A4 -t lines, run as spelled from the worktree; one summary line each.
cd "$1"
run() { local env="$1" file="$2" pat="$3"; local out; out=$(env $env NODE_OPTIONS=--max-old-space-size=400 npx vitest run "$file" -t "$pat" 2>&1); local rc=$?; echo "rc=$rc $env $file :: $(echo "$out" | grep -E '^\s+Tests ' | sed 's/  */ /g')"; }
run SEARCH_DEEP=1 src/search.null-move.test.ts "A2 — the instrumented search makes 0 null moves in check, and 0 below three non-pawn pieces \[deep, SEARCH_DEEP=1\]"
run ENGINE_DEEP=1 src/uci-session.test.ts "ABC-241 A4, A5 — UCI: the prior keys are repetition keys \[deep, ENGINE_DEEP=1\]"
run SEARCH_DEEP=1 src/search.futility.test.ts "the doors — searchWithoutFutility and chooseMoveWithoutFutility turn futility off, as every older door does \[deep, SEARCH_DEEP=1\]"
run ZOBRIST_DEEP=1 src/zobrist.test.ts "ABC-075 property — the ep component tracks the ep FIELD, not availability \(ADR-0020\) \[deep, ZOBRIST_DEEP=1\]"
run ENGINE_DEEP=1 src/engine.test.ts "ABC-170 A5 — the limits only shorten; the ceiling still holds \[deep, ENGINE_DEEP=1\]"
run ENGINE_DEEP=1 src/levels.test.ts "A7 — seeded, in deterministic mode \[deep\]"
run ENGINE_DEEP=1 src/levels.test.ts "ABC-174 A3 — the default plays as the engine: chooseMove at 4 000 ms \(ABC-228, ADR-0053 d10\) \[deep\]"
run ENGINE_DEEP=1 src/uci-session.test.ts "ABC-241 A4, A7 — the CLI: a third occurrence through an uncapturable ep square \[deep, ENGINE_DEEP=1\]"
run ENGINE_DEEP=1 src/engine.capacity.test.ts "ABC-122 A8: src/engine\.ts's KEY_ARRAY_CAPACITY guard, reached through chooseMove\(\) \[deep, ENGINE_DEEP=1\]"
