#!/bin/bash
# se-ABC-303-main: offline reads, one lock hold each. bash reads.sh <scratch-m> <raw> <lock> <named> <positions> <arch-raw> <se282-raw>
M=$1 R=$2 L=$3 N=$4 P=$5 A=$6 Q=$7; O=$M/out; cd "$M"
r() { n=$1; shift; st=$(date +%s); flock "$L" "$@" > "$O/$n" 2>"$O/$n.err"; rc=$?; echo "$n exit=$rc seconds=$(( $(date +%s)-st )) bytes=$(wc -c < "$O/$n")" >> "$O/exits.txt"; }
r s1.jsonl node "$R/read.ts" s1 "$M/head" "$M/base"
r nodes.jsonl node "$R/read.ts" nodes "$M/head"
r reach.jsonl node "$R/read.ts" reach "$M/head"
r drift.jsonl node "$R/read.ts" drift "$M/head"
r audit.jsonl node "$R/audit.ts" audit "$M/audit"
r bytes.jsonl node "$R/read.ts" bytes "$M/head"
r p1p2-head.jsonl node "$A/p1p2.mjs" "$M/head" "$N" "$P"
r p1p2-base.jsonl node "$A/p1p2.mjs" "$M/base" "$N" "$P"
r a0-3-head.jsonl node "$Q/a0-3.mjs" "$M/head" "$N"
r a0-3-base.jsonl node "$Q/a0-3.mjs" "$M/base" "$N"
r s2.jsonl node "$R/read.ts" s2 "$M/head" "$M/base"
r floor.jsonl node "$R/read.ts" floor "$M/head"
r zug.jsonl node "$R/read.ts" zug "$M/head"
r g1.jsonl node "$R/read.ts" g1 "$M/head"
r krk.jsonl node "$R/read.ts" krk "$M/head"
