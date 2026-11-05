#!/usr/bin/env bash
# qe-ABC-282 offline reads on the out-of-tree arms (run under ONE flock). usage: offline.sh <qe-dir> <raw scripts dir> <K25 dir>
Q=$1; S=$2; K=$3; O=$Q/out/offline; mkdir -p $O; B=$Q/arms/B; H=$Q/arms/H; I=$Q/arms/I
echo "start $(date -u +%FT%TZ) $(uptime)" > $O/session.txt
run() { local t=$1 tree=$2 part=$3 s=$(date +%s); node $S/drv282.ts $tree $K/named.json $K/positions.json $part > $O/$t.jsonl 2> $O/$t.err; echo "$t exit=$? $(( $(date +%s) - s ))s" >> $O/session.txt; }
r3() { local t=$1 tree=$2 part=$3 s=$(date +%s); node $S/drv283.ts $tree $part > $O/$t.jsonl 2> $O/$t.err; echo "$t exit=$? $(( $(date +%s) - s ))s" >> $O/session.txt; }
run a0-base $B a0; run a0-head $H a0; run a03-base $B a03; run a03-head $H a03
run ident-base $B ident; run ident-head $H ident
run a1c-head $H a1c; run a1c-instr $I a1c
run sweep $I sweep; run r12 $I r12; run r12x $I r12x; run b-base $B b
r3 floor-base $B floor-base; r3 floor-head $H floor-base; r3 zug-head $H zug; r3 g1-head $H g1; r3 g1-base $B g1
echo "end $(date -u +%FT%TZ) $(uptime)" >> $O/session.txt
