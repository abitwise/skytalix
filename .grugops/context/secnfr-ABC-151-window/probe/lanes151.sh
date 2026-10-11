#!/bin/bash
# secnfr-ABC-151-window, step 5 (ADR-0040 addendum 2; QE-151-d): each opt-in lane of ABC-151 A6 once, timed, at width 1.
# Shape: secnfr-ABC-144-window-b/probe/deep-walls.sh. Differences: each lane runs its variable over the WHOLE tree
# (`npx vitest run`, no file list), which is exactly the configuration QE compared for equal collection
# (qe-ABC-151/probe/collect.mjs); the tree list is a parameter; a `files` column; cpu printed with a leading zero.
# LADDER_DEEP=verdict is not run (ABC-146's). Usage: TREES="H" [LANES="A B"] bash lanes151.sh <w151 dir>
D="$1"; O="$D/abc151-lanes.tsv"; TREES="${TREES:-H}"
[ -e "$O" ] || printf 'lane\ttree\twall\tuser\tsys\tcpu\texit\tfiles\ttests\tpassed\tfailed\tskipped\tload1_before\tload1_after\tthermal_before\tthermal_after\tpower\tutc\n' > "$O"
th() { notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}'; }
l1() { sysctl -n vm.loadavg | tr -d '{}' | awk '{print $1}'; }
run() { lane="$1"; shift
  [ -n "$LANES" ] && case " $LANES " in *" $lane "*) ;; *) return ;; esac
  for t in $TREES; do
    cd "$D/arms/$t" || exit 2; f="$D/lane-$lane-$t.json"; rm -f "$f"
    lb=$(l1); tb=$(th); u=$(date -u +%Y-%m-%dT%H:%M:%SZ); pw=$(pmset -g batt | sed -n "s/.*'\(.*\)'.*/\1/p")
    /usr/bin/time -p env "$@" --reporter=default --reporter=json --outputFile.json="$f" > "$D/lane-$lane-$t.log" 2> "$D/lane-$lane-$t.time"; ec=$?
    la=$(l1); ta=$(th)
    rl=$(awk '/^real/{print $2}' "$D/lane-$lane-$t.time"); us=$(awk '/^user/{print $2}' "$D/lane-$lane-$t.time"); sy=$(awk '/^sys/{print $2}' "$D/lane-$lane-$t.time")
    c=$(node -e 'try{const r=require(process.argv[1]);console.log([r.testResults.length,r.numTotalTests,r.numPassedTests,r.numFailedTests,(r.numPendingTests??0)+(r.numTodoTests??0)].join("\t"))}catch{console.log("NA\tNA\tNA\tNA\tNA")}' "$f")
    cpu=$(echo "$us $sy" | awk '{printf "%.2f", $1 + $2}')
    printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' "$lane" "$t" "$rl" "$us" "$sy" "$cpu" "$ec" "$c" "$lb" "$la" "$tb" "$ta" "$pw" "$u" >> "$O"
  done; }
run PERFT_DEEP PERFT_DEEP=1 npx vitest run
run INPUT_DEEP INPUT_DEEP=1 NODE_OPTIONS=--expose-gc npx vitest run
run ZOBRIST_DEEP ZOBRIST_DEEP=1 npx vitest run
run PUZZLE_DEEP PUZZLE_DEEP=1 npx vitest run
run CLI_DEEP CLI_DEEP=1 npx vitest run
run ENGINE_DEEP ENGINE_DEEP=1 npx vitest run
run SEARCH_DEEP SEARCH_DEEP=1 npx vitest run
run LADDER_DEEP_1 LADDER_DEEP=1 npx vitest run
echo "lanes_end $(date -u +%Y-%m-%dT%H:%M:%SZ) TREES=$TREES LANES=$LANES" >> "$D/lanes-done.txt"
