#!/bin/bash
# secnfr-ABC-144-window-b: A6 asks that each *_DEEP lane's wall be REPORTED, not bounded. QE recorded exit and counts only.
# One run per lane per tree, B then H back to back for each lane, still width 1. Lane sets as QE's run-lanes.sh.
# LADDER_DEEP=verdict is NOT run (~44 h; ABC-146's). Usage: [LANES="A B"] bash deep-walls.sh <winb dir>
# LANES limits the run to the named lanes and appends to an existing TSV. LADDER_DEEP_1 was stopped part-way in the
# first pass (~14 min per tree, one file on one worker under any cap); the second pass ran ENGINE_DEEP and SEARCH_DEEP.
D="$1"; O="$D/abc144-deep-walls.tsv"
[ -e "$O" ] || printf 'lane\ttree\twall\tuser\tsys\tcpu\texit\ttests\tpassed\tfailed\tskipped\tload1_before\tload1_after\tthermal_before\tthermal_after\tpower\tutc\n' > "$O"
th() { notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}'; }
l1() { sysctl -n vm.loadavg | tr -d '{}' | awk '{print $1}'; }
run() { lane="$1"; shift
  [ -n "$LANES" ] && case " $LANES " in *" $lane "*) ;; *) return ;; esac
  for t in B H; do
    cd "$D/arms/$t" || exit 2; f="$D/deep-$lane-$t.json"; rm -f "$f"
    lb=$(l1); tb=$(th); u=$(date -u +%Y-%m-%dT%H:%M:%SZ); pw=$(pmset -g batt | sed -n "s/.*'\(.*\)'.*/\1/p")
    /usr/bin/time -p env "$@" --reporter=default --reporter=json --outputFile.json="$f" > "$D/deep-$lane-$t.log" 2> "$D/deep-$lane-$t.time"; ec=$?
    la=$(l1); ta=$(th)
    rl=$(awk '/^real/{print $2}' "$D/deep-$lane-$t.time"); us=$(awk '/^user/{print $2}' "$D/deep-$lane-$t.time"); sy=$(awk '/^sys/{print $2}' "$D/deep-$lane-$t.time")
    c=$(node -e 'try{const r=require(process.argv[1]);console.log([r.numTotalTests,r.numPassedTests,r.numFailedTests,(r.numPendingTests??0)+(r.numTodoTests??0)].join("\t"))}catch{console.log("NA\tNA\tNA\tNA")}' "$f")
    cpu=$(echo "$us + $sy" | bc)
    printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' "$lane" "$t" "$rl" "$us" "$sy" "$cpu" "$ec" "$c" "$lb" "$la" "$tb" "$ta" "$pw" "$u" >> "$O"
  done; }
run PERFT_DEEP PERFT_DEEP=1 npx vitest run src/perft.test.ts
run INPUT_DEEP INPUT_DEEP=1 NODE_OPTIONS=--expose-gc npx vitest run src/line-input.test.ts
run ZOBRIST_DEEP ZOBRIST_DEEP=1 npx vitest run src/zobrist.test.ts
run PUZZLE_DEEP PUZZLE_DEEP=1 npx vitest run src/puzzle-suite.test.ts
run CLI_DEEP CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts
run LADDER_DEEP_1 LADDER_DEEP=1 npx vitest run src/ladder.test.ts
run ENGINE_DEEP ENGINE_DEEP=1 npx vitest run src/engine.test.ts src/transposition.test.ts src/search.pvs-lmr.test.ts src/levels.test.ts
run SEARCH_DEEP SEARCH_DEEP=1 npx vitest run src/search.test.ts src/search.ordering.test.ts src/transposition.test.ts src/search.pvs-lmr.test.ts src/quiescence.test.ts
echo DEEP_DONE > "$D/DEEP_DONE"
