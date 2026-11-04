#!/usr/bin/env bash
# qe-ABC-283 offline reads on the out-of-tree arms (run under ONE flock). usage: offline.sh <qe-dir>
Q=$1; O=$Q/out/offline; mkdir -p $O; D=$Q/scripts/drv.ts; B=$Q/arms/B; H=$Q/arms/H
echo "start $(date -u +%FT%TZ) $(uptime)" > $O/session.txt
run() { local t=$1 tree=$2 part=$3 s=$(date +%s); node $D $tree $part > $O/$t.jsonl 2> $O/$t.err; echo "$t exit=$? $(( $(date +%s) - s ))s" >> $O/session.txt; }
run p0-base $B p0-base; run p0-head $H p0-head
run floor-base $B floor-base; run floor-head $H floor-head
run zug $H zug; run g1 $H g1; run g1-base $B g1; run drift $H drift; run ratio $H ratio; run ratio-base $B ratio
echo "end $(date -u +%FT%TZ) $(uptime)" >> $O/session.txt
