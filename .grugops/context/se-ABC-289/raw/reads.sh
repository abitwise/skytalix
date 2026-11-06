#!/bin/bash
# se-ABC-289: offline reads, one lock hold each, deterministic counts, no timing. bash reads.sh <scratch> <driver> <lock>
M=$1 D=$2 L=$3; O=$M/out; cd "$M"
r() { n=$1; shift; st=$(date +%s); flock "$L" timeout 900 "$@" > "$O/$n" 2>"$O/$n.err"; rc=$?; echo "$n exit=$rc seconds=$(( $(date +%s)-st )) bytes=$(wc -c < "$O/$n")" >> "$O/exits.txt"; }
r s1.jsonl node "$D" s1 "$M/head" "$M/base"
r nodes.jsonl node "$D" nodes "$M/head"
r reach.jsonl node "$D" reach "$M/head"
r drift.jsonl node "$D" drift "$M/head"
r floor.jsonl node "$D" floor "$M/head"
r zug.jsonl node "$D" zug "$M/head"
r g1.jsonl node "$D" g1 "$M/head"
r krk.jsonl node "$D" krk "$M/head"
r s2.jsonl node "$D" s2 "$M/head" "$M/base"
