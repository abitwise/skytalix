#!/bin/bash
# se-ABC-283-k3: interleaved base/head `npm test` pairs, each pair under one lock hold.
# usage: time-pairs.sh <baseDir> <headDir> <out> <n> <lockfile>
base=$1; head=$2; out=$3; n=$4; lock=$5
one() { local tag=$1 dir=$2 i=$3; local t0 t1 ec; t0=$(date +%s.%N); (cd "$dir" && npm test > "$out.$tag.run$i.log" 2>&1); ec=$?; t1=$(date +%s.%N)
  echo "pair $i $tag exit $ec wall $(echo "$t1 - $t0" | bc) $(grep -E '^ +Tests ' "$out.$tag.run$i.log" | tail -1 | sed 's/  */ /g')" >> "$out"; }
for i in $(seq 1 "$n"); do
  flock "$lock" bash -c "$(declare -f one); out='$out'; one base '$base' $i; one head '$head' $i"
done
