#!/usr/bin/env bash
# qe-ABC-282: the rows the /tmp quota blanked (node exits 0 when stdout's writes fail), plus the r12 control. Outputs go to <worktree>/…/raw, on /. Run under ONE flock.
# usage: rerun.sh <qe-dir> <raw scripts dir> <K25 dir> <out dir>
Q=$1; S=$2; K=$3; O=$4; mkdir -p $O; B=$Q/arms/B; H=$Q/arms/H; I=$Q/arms/I
echo "start $(date -u +%FT%TZ) $(uptime)" > $O/session.txt
run() { local t=$1 tree=$2 part=$3 d=${4:-drv282.ts} s=$(date +%s); node $S/$d $tree $K/named.json $K/positions.json $part > $O/$t.jsonl 2> $O/$t.err; echo "$t exit=$? $(( $(date +%s) - s ))s lines=$(wc -l < $O/$t.jsonl)" >> $O/session.txt; }
r3() { local t=$1 tree=$2 part=$3 s=$(date +%s); node $S/drv283.ts $tree $part > $O/$t.jsonl 2> $O/$t.err; echo "$t exit=$? $(( $(date +%s) - s ))s lines=$(wc -l < $O/$t.jsonl)" >> $O/session.txt; }
run sweep $I sweep
r3 floor-base $B floor-base; r3 floor-head $H floor-base; r3 zug-head $H zug; r3 g1-head $H g1; r3 g1-base $B g1
run r12-control $I r12x drv282c.ts
echo "end $(date -u +%FT%TZ) $(uptime)" >> $O/session.txt
