#!/usr/bin/env bash
# se-ABC-283-merge offline reads on out-of-tree arms (B = git archive main 715beb1c, H = git archive the merge 62151993).
# usage: offline.sh <scripts-dir> <arms-dir> <outdir> <lockfile>   (one flock hold per part; no games)
D=$1/drv.ts; B=$2/B; H=$2/H; O=$3; L=$4; mkdir -p $O
echo "start $(date -u +%FT%TZ) $(uptime)" > $O/session.txt
run() { local t=$1 tree=$2 part=$3 s=$(date +%s); flock $L node $D $tree $part > $O/$t.jsonl 2> $O/$t.err; echo "$t exit=$? $(( $(date +%s) - s ))s" >> $O/session.txt; }
run k0-base $B k0-base; run k0-head $H k0-head; run k0-headshipped $H k0-base
run p0-base $B p0-base; run p0-head $H p0-head
run floor-base $B floor-base; run floor-head $H floor-head
run zug $H zug; run g1 $H g1; run g1-base $B g1; run ratio $H ratio; run ratio-base $B ratio
echo "end $(date -u +%FT%TZ) $(uptime)" >> $O/session.txt
