#!/bin/bash
# tlines.sh <tag> [row...] : the moved rows' -t lines at the tip sketch (rows default to all nine).
S="${SCRATCH:?set SCRATCH to <scratch>/arch302}"
cd $S/tree
tag=$1; shift
rows=${@:-R1 R2 R3 R4 R5 R6 R7 R8 R9}
for r in $rows; do
  case $r in
    R1) env SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/search.null-move.test.ts -t "A2 — the instrumented search makes 0 null moves in check, and 0 below three non-pawn pieces \[deep, SEARCH_DEEP=1\]" ;;
    R2) env ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci-session.test.ts -t "ABC-241 A4, A5 — UCI: the prior keys are repetition keys \[deep, ENGINE_DEEP=1\]" ;;
    R3) env SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/search.futility.test.ts -t "the doors — searchWithoutFutility and chooseMoveWithoutFutility turn futility off, as every older door does \[deep, SEARCH_DEEP=1\]" ;;
    R4) env ZOBRIST_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/zobrist.test.ts -t "ABC-075 property — the ep component tracks the ep FIELD, not availability \(ADR-0020\) \[deep, ZOBRIST_DEEP=1\]" ;;
    R5) env ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/engine.test.ts -t "ABC-170 A5 — the limits only shorten; the ceiling still holds \[deep, ENGINE_DEEP=1\]" ;;
    R6) env ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts -t "A7 — seeded, in deterministic mode \[deep\]" ;;
    R7) env ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts -t "ABC-174 A3 — the default plays as the engine: chooseMove at 4 000 ms \(ABC-228, ADR-0053 d10\) \[deep\]" ;;
    R8) env ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci-session.test.ts -t "ABC-241 A4, A7 — the CLI: a third occurrence through an uncapturable ep square \[deep, ENGINE_DEEP=1\]" ;;
    R9) env ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/engine.capacity.test.ts -t "ABC-122 A8: src/engine\.ts's KEY_ARRAY_CAPACITY guard, reached through chooseMove\(\) \[deep, ENGINE_DEEP=1\]" ;;
  esac > $S/out/t-$tag-$r.log 2>&1
  echo "$r exit $? $(grep -E '^\s+Tests ' $S/out/t-$tag-$r.log | sed 's/  */ /g')"
done
