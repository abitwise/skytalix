#!/bin/bash
# poll a D reading for up to ~9.5 min; print progress. usage: waitd.sh <reading-dir>
D=$1; for i in $(seq 1 57); do grep -q "harness end" $D/mon/wait.log 2>/dev/null && break; sleep 10; done
echo "finished: $(grep -c '^.* Finished game' $D/mon/games.log) / 400"; tail -1 $D/mon/sampler.log; grep "harness end" $D/mon/wait.log
grep -E "^Score of" $D/out/d.out | tail -1
