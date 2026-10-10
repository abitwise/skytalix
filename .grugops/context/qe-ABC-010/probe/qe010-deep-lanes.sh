#!/bin/bash
# QE qe-ABC-010: the 9(f) lanes + PERFT_DEEP, sequential, in the QE worktree. Logs exit, wall, load1 start/end.
cd "$1" || exit 2
OUT="$2"
run() {
  local name="$1"; shift
  local l0=$(sysctl -n vm.loadavg | awk '{print $2}'); local t0=$(date +%s); local s0=$(date -u +%H:%M:%SZ)
  env "$@" > "$OUT/deep-$name.txt" 2>&1; local rc=$?
  local t1=$(date +%s); local l1=$(sysctl -n vm.loadavg | awk '{print $2}')
  local tests=$(grep -E '^\s+Tests' "$OUT/deep-$name.txt" | tail -1 | sed 's/  */ /g')
  echo "$name	exit=$rc	wall=$((t1-t0))s	start=$s0	load1_start=$l0	load1_end=$l1	$tests" >> "$OUT/deep-lanes.log"
}
run puzzle PUZZLE_DEEP=1 npx vitest run src/puzzle-suite.test.ts
run perft PERFT_DEEP=1 npx vitest run src/perft.test.ts
run quiescence SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts
run zobrist ZOBRIST_DEEP=1 npx vitest run src/zobrist.test.ts
run levels ENGINE_DEEP=1 npx vitest run src/levels.test.ts
echo DONE >> "$OUT/deep-lanes.log"
