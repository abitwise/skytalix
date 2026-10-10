#!/bin/bash
# ADR-0035 decision 2 narrow-set reading: `npx vitest run src/history-pane.nfr.test.ts src/render-seam.test.ts`, three out-of-tree trees
# (base, head, twin = a second copy of base, diff -r verified). One fresh process per run, CPU =
# user + sys of the process tree (bash `time`), 9 rounds with round 0 discarded, arm order rotated
# per round, count asserted on every run, load1 logged before every run (logged, never gated).
set -u
REPO=<repo>
SP=<scratchpad>/ABC-053/cost
BASE=$1; HEAD=$2; ROUNDS=${3:-9}
TSV=$SP/timing.tsv
for arm in base head twin; do
  rm -rf "$SP/t-$arm"; mkdir -p "$SP/t-$arm"
  c=$BASE; [ $arm = head ] && c=$HEAD
  git -C "$REPO" archive "$c" | tar -x -C "$SP/t-$arm"
  ln -s "$REPO/node_modules" "$SP/t-$arm/node_modules"
done
diff -r "$SP/t-base" "$SP/t-twin" > /dev/null && echo "twin: diff -r IDENTICAL to base" || { echo "twin differs"; exit 2; }
printf "round\tarm\tload1\tuser\tsys\tcpu\twall\ttests\n" > "$TSV"
ARMS=(base head twin)
for ((r = 0; r < ROUNDS; r++)); do
  for ((k = 0; k < 3; k++)); do
    arm=${ARMS[$(( (r + k) % 3 ))]}
    load=$(sysctl -n vm.loadavg | awk '{print $2}')
    cd "$SP/t-$arm"
    TIMEFORMAT='%U %S %R'
    { time npx vitest run src/history-pane.nfr.test.ts src/render-seam.test.ts > "$SP/run.log" 2>&1 ; } 2> "$SP/time.txt"
    read -r u s w < "$SP/time.txt"
    tests=$(grep -Eo "Tests +[0-9]+ passed \([0-9]+\)" "$SP/run.log" | grep -Eo "[0-9]+ passed" | grep -Eo "[0-9]+")
    want=22; [ $arm = head ] && want=23; [ "$tests" = "$want" ] || { echo "COUNT ASSERT FAILED: $arm round $r tests=$tests"; exit 3; }
    printf "%d\t%s\t%s\t%s\t%s\t%.3f\t%s\t%s\n" $r $arm "$load" $u $s "$(echo "$u + $s" | bc)" $w $tests >> "$TSV"
  done
done
cat "$TSV"
