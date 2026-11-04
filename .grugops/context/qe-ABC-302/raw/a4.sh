#!/bin/bash
# qe-ABC-302 A4 / A7 run rule: the nine -t lines and ADR-0046's four run-rule lines (arm H), then the touched files'
# full deep lanes as AGENTS.md spells them, at the tip (arm H) and base (arm B). Each command exactly as spelled; the
# count is read from vitest's own "Tests" summary line. Run inside one `flock <scratch>/host-test.lock` hold.
# Usage: a4.sh <arms dir> <out dir>
A=$1; O=$2; mkdir -p $O/out; T=$O/a4.tsv
echo -e "arm\tid\texit\tsecs\tsummary" > $T
run() { # run <arm> <id> <env> <file> [pattern]
  local st=$(date +%s)
  if [ -n "$5" ]; then (cd $A/$1 && env ${3:+$3} NODE_OPTIONS=--max-old-space-size=400 npx vitest run $4 -t "$5" > $O/out/$1-$2.txt 2>&1)
  else (cd $A/$1 && env ${3:+$3} NODE_OPTIONS=--max-old-space-size=400 npx vitest run $4 > $O/out/$1-$2.txt 2>&1); fi
  local ex=$?
  echo -e "$1\t$2\t$ex\t$(( $(date +%s) - st ))\t$(sed 's/\x1b\[[0-9;]*m//g' $O/out/$1-$2.txt | grep -E '^ +Tests ' | tr -s ' ')" >> $T
}
run H t-R1 SEARCH_DEEP=1 src/search.null-move.test.ts "A2 — the instrumented search makes 0 null moves in check, and 0 below three non-pawn pieces \[deep, SEARCH_DEEP=1\]"
run H t-R2 ENGINE_DEEP=1 src/uci-session.test.ts "ABC-241 A4, A5 — UCI: the prior keys are repetition keys \[deep, ENGINE_DEEP=1\]"
run H t-R3 SEARCH_DEEP=1 src/search.futility.test.ts "the doors — searchWithoutFutility and chooseMoveWithoutFutility turn futility off, as every older door does \[deep, SEARCH_DEEP=1\]"
run H t-R4 ZOBRIST_DEEP=1 src/zobrist.test.ts "ABC-075 property — the ep component tracks the ep FIELD, not availability \(ADR-0020\) \[deep, ZOBRIST_DEEP=1\]"
run H t-R5 ENGINE_DEEP=1 src/engine.test.ts "ABC-170 A5 — the limits only shorten; the ceiling still holds \[deep, ENGINE_DEEP=1\]"
run H t-R6 ENGINE_DEEP=1 src/levels.test.ts "A7 — seeded, in deterministic mode \[deep\]"
run H t-R7 ENGINE_DEEP=1 src/levels.test.ts "ABC-174 A3 — the default plays as the engine: chooseMove at 4 000 ms \(ABC-228, ADR-0053 d10\) \[deep\]"
run H t-R8 ENGINE_DEEP=1 src/uci-session.test.ts "ABC-241 A4, A7 — the CLI: a third occurrence through an uncapturable ep square \[deep, ENGINE_DEEP=1\]"
run H t-R9 ENGINE_DEEP=1 src/engine.capacity.test.ts "ABC-122 A8: src/engine\.ts's KEY_ARRAY_CAPACITY guard, reached through chooseMove\(\) \[deep, ENGINE_DEEP=1\]"
run H t-R9-unescaped ENGINE_DEEP=1 src/engine.capacity.test.ts "ABC-122 A8: src/engine\.ts's KEY_ARRAY_CAPACITY guard, reached through chooseMove() \[deep, ENGINE_DEEP=1\]"
run H rr-248 ENGINE_DEEP=1 src/uci-session.test.ts "ABC-167 A5 — the D4 time rule, read from the info line's time \[deep, ENGINE_DEEP=1\]"
run H rr-281R1 SEARCH_DEEP=1 src/search.null-move.test.ts "QE-208-a — an abort inside a null move's subtree still hands the root back byte-identical \[deep, SEARCH_DEEP=1\]"
run H rr-281R2 ENGINE_DEEP=1 src/engine.test.ts "ABC-230 A3 and A4 — no prior keys is base, node for node, and the doors take none \[deep, ENGINE_DEEP=1\]"
run H rr-281R3 ENGINE_DEEP=1 src/levels.test.ts "A9 — different seeds actually differ \[deep\]"
for arm in H B; do
  run $arm deep-null SEARCH_DEEP=1 src/search.null-move.test.ts
  run $arm deep-futility SEARCH_DEEP=1 src/search.futility.test.ts
  run $arm deep-zobrist ZOBRIST_DEEP=1 src/zobrist.test.ts
  run $arm deep-engine ENGINE_DEEP=1 src/engine.test.ts
  run $arm deep-capacity ENGINE_DEEP=1 src/engine.capacity.test.ts
  run $arm cli-single "" src/cli.test.ts
  run $arm deep-uci ENGINE_DEEP=1 src/uci-session.test.ts
  run $arm deep-levels ENGINE_DEEP=1 src/levels.test.ts
done
echo "a4 done $(date -u +%FT%TZ)"
