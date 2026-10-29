#!/bin/bash
# usage: waitr.sh <scratch> <reading r1|r2> <minutes> : returns when the reading ends, the chain dies, or after <minutes>.
S=$1; R=$2; M=$3; PID=$(cat $S/readings.pid)
for i in $(seq 1 $((M*6))); do
  grep -q "harness end" $S/$R/mon/wait.log 2>/dev/null && break
  kill -0 $PID 2>/dev/null || { echo "chain pid $PID gone"; break; }
  sleep 10
done
echo "finished: $(grep -c ' Finished game' $S/$R/mon/games.log 2>/dev/null) / 200"; tail -1 $S/$R/mon/sampler.log
grep -E "harness end|STOP|PIN" $S/$R/mon/wait.log; grep -E "^Score of" $S/$R/out/r.out 2>/dev/null | tail -1; grep -E "^Elo difference" $S/$R/out/r.out 2>/dev/null | tail -1
echo "load1 max: $(grep -oE 'load1=[0-9.]+' $S/$R/mon/sampler.log | cut -d= -f2 | sort -n | tail -1)"
echo "vitest samples: $(grep -c "vitest=[1-9]" $S/$R/mon/sampler.log)  foreign cutechess samples: $(grep -c "cutechess_foreign=[1-9]" $S/$R/mon/sampler.log)"
grep -E 'loses on time|illegal|disconnect|stall' $S/$R/mon/games.log | head -3; cat $S/readings.log
