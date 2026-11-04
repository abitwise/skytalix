#!/usr/bin/env bash
# qe-ABC-279: after C2' ends, S', Levels, A1/A2, G6+G11, N8, lanes; each step under its own flock (one job at a time).
# usage: chain.sh <scratch> <scratch-qe-dir> <worktree>
S=$1; Q=$2; W=$3; L=$S/host-test.lock
until grep -q '^end ' $Q/c2.times 2>/dev/null; do sleep 20; done
echo "chain start $(date -u +%FT%TZ)" > $Q/chain.log
flock $L $Q/scripts/run-r.sh $Q $W $S/tools.env s1; echo "s1 done $(date -u +%FT%TZ)" >> $Q/chain.log
flock $L $Q/scripts/run-levels.sh $Q $W; echo "levels done $(date -u +%FT%TZ)" >> $Q/chain.log
flock $L bash -c "cd $Q && node scripts/a1.ts $Q > out/a1.txt 2>&1; echo a1 exit=\$? >> $Q/chain.log; node scripts/a2.ts $Q > out/a2.txt 2>&1; echo a2 exit=\$? >> $Q/chain.log"
mkdir -p $Q/out/g6; flock $L bash -c "echo \"start \$(date -u +%FT%TZ) \$(uptime)\" > $Q/out/g6/session.txt; node $Q/scripts/g6.mjs $Q $Q/out/g6 both > $Q/out/g6/stdout.txt 2>&1; echo \"g6 exit=\$? end \$(date -u +%FT%TZ) \$(uptime)\" >> $Q/out/g6/session.txt"; echo "g6 done $(date -u +%FT%TZ)" >> $Q/chain.log
flock $L $Q/scripts/n8.sh $Q; echo "n8 done $(date -u +%FT%TZ)" >> $Q/chain.log
flock $L $Q/scripts/lanes.sh $W $Q/out/lanes; echo "lanes done $(date -u +%FT%TZ)" >> $Q/chain.log
echo "chain end $(date -u +%FT%TZ)" >> $Q/chain.log
