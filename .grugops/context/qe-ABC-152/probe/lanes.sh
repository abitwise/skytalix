#!/bin/bash
# QE ABC-152 V8: each opt-in lane's EXIT and counts at a tree, one at a time. NO wall is read (the task fences
# timing out of QE). Also: PUZZLE_DEEP=weakened (must exit 1) and the two coverage commands.
# usage: lanes.sh <tree> <outdir>
tree="$1"; out="$2"; mkdir -p "$out"
cd "$tree" || exit 2
export PATH="$tree/node_modules/.bin:$PATH"
printf 'lane\texit\tfiles\tpassed\tfailed\ttotal\tpending\ttodo\tforeign_vitest_at_start\n' > "$out/lanes.tsv"
run() {
  local name="$1"; shift
  local foreign; foreign=$(pgrep -fl '[v]itest' | grep -v "$tree" | wc -l | tr -d ' ')
  env "$@" vitest run --reporter=dot --reporter=json --outputFile.json="$out/$name.json" > "$out/$name.log" 2>&1
  local code=$?
  local s="NA\tNA\tNA\tNA\tNA\tNA"
  [ -f "$out/$name.json" ] && s=$(jq -r '[(.testResults|length), .numPassedTests, .numFailedTests, .numTotalTests, .numPendingTests, .numTodoTests] | map(tostring) | join("\t")' "$out/$name.json")
  printf '%s\t%s\t%b\t%s\n' "$name" "$code" "$s" "$foreign" >> "$out/lanes.tsv"
  echo "$name exit $code"
}
run PERFT_DEEP PERFT_DEEP=1
run SEARCH_DEEP SEARCH_DEEP=1
run ENGINE_DEEP ENGINE_DEEP=1
run INPUT_DEEP INPUT_DEEP=1 NODE_OPTIONS=--expose-gc
run ZOBRIST_DEEP ZOBRIST_DEEP=1
run PUZZLE_DEEP PUZZLE_DEEP=1
run CLI_DEEP CLI_DEEP=1
run LADDER_DEEP LADDER_DEEP=1
# PUZZLE_DEEP=weakened is the red demonstration: it must exit 1 (AGENTS.md), on its own file
env PUZZLE_DEEP=weakened vitest run src/puzzle-suite.test.ts > "$out/PUZZLE_weakened.log" 2>&1; echo -e "PUZZLE_DEEP=weakened src/puzzle-suite.test.ts\t$?" >> "$out/lanes.tsv"
vitest run --coverage > "$out/coverage.log" 2>&1; echo -e "coverage\t$?" >> "$out/lanes.tsv"
vitest run --coverage --coverage.include='src/**' > "$out/coverage-src.log" 2>&1; echo -e "coverage src/**\t$?" >> "$out/lanes.tsv"
rm -rf "$tree/coverage"
echo done
