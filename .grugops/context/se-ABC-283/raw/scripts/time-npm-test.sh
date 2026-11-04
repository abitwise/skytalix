#!/bin/bash
# usage: time-npm-test.sh <dir> <out> <n>
cd "$1" || exit 2
for i in $(seq 1 "$3"); do
  t0=$(date +%s.%N); npm test > "$2.run$i.log" 2>&1; ec=$?; t1=$(date +%s.%N)
  echo "run $i exit $ec wall $(echo "$t1 - $t0" | bc)" >> "$2"
done
