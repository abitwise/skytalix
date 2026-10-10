#!/bin/bash
# SE (ABC-140) copy of ABC-137 timing137.sh, unchanged logic. Was: SE port (ABC-137) of ticket-to-pr-ABC-136/probe/timing.sh (ADR-0035 narrow-set reading):
# base/head/twin git-archive trees, twin diff -r -x node_modules verified, one fresh process per run,
# CPU = user+sys (bash time), rotated arm order, count 12 asserted, load1 logged before every run.
# usage: timing137.sh <repo> <scratch> <base> <head> <rounds> <tsv>
set -u
REPO=$1; SP=$2/timing; BASE=$3; HEAD=$4; ROUNDS=$5; TSV=$6
mkdir -p "$SP"
for arm in base head twin; do
  rm -rf "$SP/t-$arm"; mkdir -p "$SP/t-$arm"
  c=$BASE; [ $arm = head ] && c=$HEAD
  git -C "$REPO" archive "$c" | tar -x -C "$SP/t-$arm"
  ln -s "$REPO/node_modules" "$SP/t-$arm/node_modules"
done
diff -r -x node_modules "$SP/t-base" "$SP/t-twin" > /dev/null && echo "twin: diff -r -x node_modules IDENTICAL to base" || { echo "twin differs"; exit 2; }
printf "round\tarm\tload1\tuser\tsys\tcpu\twall\ttests\n" > "$TSV"
ARMS=(base head twin)
for ((r = 0; r < ROUNDS; r++)); do
  for ((k = 0; k < 3; k++)); do
    arm=${ARMS[$(( (r + k) % 3 ))]}
    load=$(sysctl -n vm.loadavg | awk '{print $2}')
    cd "$SP/t-$arm"
    TIMEFORMAT='%U %S %R'
    { time node node_modules/vitest/vitest.mjs run src/history-pane.nfr.test.ts > "$SP/run.log" 2>&1 ; } 2> "$SP/time.txt"
    read -r u s w < "$SP/time.txt"
    tests=$(grep -Eo "Tests +[0-9]+ passed \([0-9]+\)" "$SP/run.log" | grep -Eo "[0-9]+ passed" | grep -Eo "[0-9]+")
    [ "$tests" = 12 ] || { echo "COUNT ASSERT FAILED: $arm round $r tests=$tests"; exit 3; }
    printf "%d\t%s\t%s\t%s\t%s\t%.3f\t%s\t%s\n" $r $arm "$load" $u $s "$(echo "$u + $s" | bc)" $w $tests >> "$TSV"
  done
done
