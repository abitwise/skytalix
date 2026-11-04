#!/bin/bash
# se-ABC-282: R-281-a's four lines and ABC-302's nine, each under the lock. tlines.sh <lock> <out>
L="$1"; O="$2"; : > "$O"
run() { # label, env, file, pattern
  local out; out=$(flock "$L" env $2 NODE_OPTIONS=--max-old-space-size=400 npx vitest run "$3" -t "$4" 2>&1 | sed 's/\x1b\[[0-9;]*m//g' | grep -E "^ *Tests " ); echo -e "$1\t$out" >> "$O"
}
run "ABC-248" ENGINE_DEEP=1 src/uci-session.test.ts "ABC-167 A5 — the D4 time rule, read from the info line's time \[deep, ENGINE_DEEP=1\]"
run "ABC-281 R1" SEARCH_DEEP=1 src/search.null-move.test.ts "QE-208-a — an abort inside a null move's subtree still hands the root back byte-identical \[deep, SEARCH_DEEP=1\]"
run "ABC-281 R2" ENGINE_DEEP=1 src/engine.test.ts "ABC-230 A3 and A4 — no prior keys is base, node for node, and the doors take none \[deep, ENGINE_DEEP=1\]"
run "ABC-281 R3" ENGINE_DEEP=1 src/levels.test.ts "A9 — different seeds actually differ \[deep\]"
run "ABC-302 R1" SEARCH_DEEP=1 src/search.null-move.test.ts "A2 — the instrumented search makes 0 null moves in check, and 0 below three non-pawn pieces \[deep, SEARCH_DEEP=1\]"
run "ABC-302 R2" ENGINE_DEEP=1 src/uci-session.test.ts "ABC-241 A4, A5 — UCI: the prior keys are repetition keys \[deep, ENGINE_DEEP=1\]"
run "ABC-302 R3" SEARCH_DEEP=1 src/search.futility.test.ts "the doors — searchWithoutFutility and chooseMoveWithoutFutility turn futility off, as every older door does \[deep, SEARCH_DEEP=1\]"
run "ABC-302 R4" ZOBRIST_DEEP=1 src/zobrist.test.ts "ABC-075 property — the ep component tracks the ep FIELD, not availability \(ADR-0020\) \[deep, ZOBRIST_DEEP=1\]"
run "ABC-302 R5" ENGINE_DEEP=1 src/engine.test.ts "ABC-170 A5 — the limits only shorten; the ceiling still holds \[deep, ENGINE_DEEP=1\]"
run "ABC-302 R6" ENGINE_DEEP=1 src/levels.test.ts "A7 — seeded, in deterministic mode \[deep\]"
run "ABC-302 R7" ENGINE_DEEP=1 src/levels.test.ts "ABC-174 A3 — the default plays as the engine: chooseMove at 4 000 ms \(ABC-228, ADR-0053 d10\) \[deep\]"
run "ABC-302 R8" ENGINE_DEEP=1 src/uci-session.test.ts "ABC-241 A4, A7 — the CLI: a third occurrence through an uncapturable ep square \[deep, ENGINE_DEEP=1\]"
run "ABC-302 R9" ENGINE_DEEP=1 src/engine.capacity.test.ts "ABC-122 A8: src/engine\.ts's KEY_ARRAY_CAPACITY guard, reached through chooseMove\(\) \[deep, ENGINE_DEEP=1\]"
