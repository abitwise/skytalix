#!/bin/bash
# ABC-010 SE cost harness (ADR-0035 shape): base / head / identity twin, out-of-tree, `npx vitest run <set>`,
# CPU = user + sys of the run, one fresh process per run, 9 rounds rotated, round 0 dropped at analysis,
# test counts recorded per run, load1 logged before every run. Usage: cost.sh <label> <file...>
S=$(cd "$(dirname "$0")" && pwd); label=$1; shift
out=$S/cost-$label.tsv; : > $out
arms=(base head twin)
for r in 0 1 2 3 4 5 6 7 8; do
  for i in 0 1 2; do
    arm=${arms[$(( (r + i) % 3 ))]}
    load=$(sysctl -n vm.loadavg | awk '{print $2}')
    cd $S/tree-$arm
    /usr/bin/time -p npx vitest run "$@" > $S/cost-run.out 2> $S/cost-time.out
    rc=$?
    user=$(awk '/^user/{print $2}' $S/cost-time.out); sys=$(awk '/^sys/{print $2}' $S/cost-time.out); real=$(awk '/^real/{print $2}' $S/cost-time.out)
    tests=$(grep -E "^ +Tests " $S/cost-run.out | sed 's/\x1b\[[0-9;]*m//g' | tr -s ' ' | cut -d' ' -f3-)
    echo -e "$r\t$arm\t$rc\t$user\t$sys\t$real\t$load\t$tests" >> $out
  done
done
echo done >> $out
