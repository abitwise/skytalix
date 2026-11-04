#!/usr/bin/env bash
# qe-ABC-283 chain, after the PREREG is sealed and committed: C2', S', Levels, NFR-008, G6, offline, lanes.
# Each match / timing session in ONE flock hold (alone); each lane in its own hold. usage: chain.sh <qe-dir> <worktree> <lockfile>
Q=$1; W=$2; L=$3; log=$Q/chain.log
echo "chain start $(date -u +%FT%TZ)" > $log
flock $L $Q/scripts/run-d.sh $Q $W $Q/tools.env; echo "c2 done $(date -u +%FT%TZ)" >> $log
flock $L $Q/scripts/run-r.sh $Q $W $Q/tools.env s1; echo "s1 done $(date -u +%FT%TZ)" >> $log
flock $L $Q/scripts/run-levels.sh $Q; echo "levels done $(date -u +%FT%TZ)" >> $log
flock $L bash -c "$Q/scripts/n8.sh $Q/arms $Q/out/n8 > $Q/out/n8.console 2>&1"; echo "n8 done $(date -u +%FT%TZ)" >> $log
mkdir -p $Q/out/g6; flock $L bash -c "echo \"start \$(date -u +%FT%TZ) \$(uptime)\" > $Q/out/g6/session.txt; node $Q/scripts/g6.mjs $Q $Q/out/g6 g6 > $Q/out/g6/stdout.txt 2>&1; echo \"g6 exit=\$? end \$(date -u +%FT%TZ) \$(uptime)\" >> $Q/out/g6/session.txt"; echo "g6 done $(date -u +%FT%TZ)" >> $log
flock $L $Q/scripts/offline.sh $Q; echo "offline done $(date -u +%FT%TZ)" >> $log
$Q/scripts/lanes.sh $W $Q/out/lanes $L; echo "lanes done $(date -u +%FT%TZ)" >> $log
echo "chain end $(date -u +%FT%TZ)" >> $log
