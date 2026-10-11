#!/bin/sh
# QE ABC-144 A6: each opt-in lane, over its own deep files, at head. Exit code + counts; no wall recorded.
T="$1"; O="$2"; cd "$T" || exit 2
printf 'lane\tload1_before\texit\ttests\tpassed\tfailed\tpending\ttodo\n' > "$O/lanes.tsv"
run() { lane="$1"; shift; l1=$(sysctl -n vm.loadavg | awk '{print $2}'); f="$O/lane-$lane.json"; rm -f "$f"
  env "$@" --reporter=default --reporter=json --outputFile.json="$f" > "$O/lane-$lane.log" 2>&1; ec=$?
  c=$(node -e 'try{const r=require(process.argv[1]);console.log([r.numTotalTests,r.numPassedTests,r.numFailedTests,r.numPendingTests,r.numTodoTests].join("\t"))}catch{console.log("NA\tNA\tNA\tNA\tNA")}' "$f")
  printf '%s\t%s\t%s\t%s\n' "$lane" "$l1" "$ec" "$c" >> "$O/lanes.tsv"; }
run PERFT_DEEP PERFT_DEEP=1 npx vitest run src/perft.test.ts
run INPUT_DEEP INPUT_DEEP=1 NODE_OPTIONS=--expose-gc npx vitest run src/line-input.test.ts
run ZOBRIST_DEEP ZOBRIST_DEEP=1 npx vitest run src/zobrist.test.ts
run PUZZLE_DEEP PUZZLE_DEEP=1 npx vitest run src/puzzle-suite.test.ts
run CLI_DEEP CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts
run LADDER_DEEP_1 LADDER_DEEP=1 npx vitest run src/ladder.test.ts
run ENGINE_DEEP ENGINE_DEEP=1 npx vitest run src/engine.test.ts src/transposition.test.ts src/search.pvs-lmr.test.ts src/levels.test.ts
run SEARCH_DEEP SEARCH_DEEP=1 npx vitest run src/search.test.ts src/search.ordering.test.ts src/transposition.test.ts src/search.pvs-lmr.test.ts src/quiescence.test.ts
echo done >> "$O/lanes.tsv"
