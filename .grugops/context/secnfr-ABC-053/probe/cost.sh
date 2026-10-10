#!/bin/bash
# Usage: cost.sh <scratch> <rounds>. Narrow set (the two modified files), three out-of-tree trees
# (base e15eb31d, head 218677eb, twin = second copy of base). Fresh process per run, CPU = user + sys
# (bash time), arm order rotated, round 0 discarded at scoring, count asserted, load1 logged.
set -u
S=$1; ROUNDS=${2:-9}; TSV=$S/cost.tsv
printf "round\tarm\tload1\tuser\tsys\tcpu\twall\ttests\n" > "$TSV"
ARMS=(base head twin)
for ((r = 0; r < ROUNDS; r++)); do
  for ((k = 0; k < 3; k++)); do
    arm=${ARMS[$(( (r + k) % 3 ))]}
    load=$(sysctl -n vm.loadavg | awk '{print $2}')
    cd "$S/$arm"
    TIMEFORMAT='%U %S %R'
    { time node node_modules/vitest/vitest.mjs run src/history-pane.nfr.test.ts src/render-seam.test.ts > "$S/cost-run.log" 2>&1 ; } 2> "$S/cost-time.txt"
    read -r u s w < "$S/cost-time.txt"
    tests=$(grep -Eo "Tests +[0-9]+ passed \([0-9]+\)" "$S/cost-run.log" | grep -Eo "^Tests +[0-9]+" | grep -Eo "[0-9]+")
    want=22; [ $arm = head ] && want=23
    [ "$tests" = "$want" ] || { echo "COUNT ASSERT FAILED: $arm round $r tests=$tests"; exit 3; }
    printf "%d\t%s\t%s\t%s\t%s\t%.3f\t%s\t%s\n" $r $arm "$load" $u $s "$(echo "$u + $s" | bc)" $w $tests >> "$TSV"
  done
done
