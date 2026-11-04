#!/bin/bash
# one timing session: N runs of `npm test` in the worktree, run 0 = warm-up (discarded)
W=<worktree>
OUT=$1; N=$2; TAG=$3
cd $W || exit 2
echo -e "tag\trun\tstart_utc\tload1_before\texit\twall_s\tuser_s\tsys_s\tcpu_s\tfiles\ttests\tvitestproc_foreign" > $OUT/$TAG.tsv
for i in $(seq 0 $((N-1))); do
  l1=$(cut -d' ' -f1 /proc/loadavg)
  foreign=$(ps -eo args | grep -c '[v]itest run')
  st=$(date -u +%H:%M:%S)
  /usr/bin/time -f "%e %U %S" -o $OUT/$TAG-time-$i.txt npm test > $OUT/$TAG-out-$i.txt 2>&1
  ex=$?
  read w u s < $OUT/$TAG-time-$i.txt
  cp .test-results/last-run.json $OUT/$TAG-json-$i.json
  f=$(node -e 'const j=require(process.argv[1]);console.log(j.numTotalTestSuites+"\t"+j.numTotalTests)' $OUT/$TAG-json-$i.json)
  cpu=$(echo "$u + $s" | bc)
  echo -e "$TAG\t$i\t$st\t$l1\t$ex\t$w\t$u\t$s\t$cpu\t$f\t$foreign" >> $OUT/$TAG.tsv
done
