#!/bin/bash
# qe-ABC-270 K4 G6 session, INSIDE one flock hold by the caller; qe-ABC-268 g6.mjs/timed.mjs/host.mjs unchanged (Tctl <= 60.0).
S=$1; O=$S/out/g6; mkdir -p $O
$S/scripts/host-state.sh start >> $O/session.txt
node $S/scripts/g6.mjs $S $O g6 > $O/stdout.txt 2>&1; echo "g6 exit=$? $(date -u +%FT%TZ)" >> $O/session.txt
node $S/scripts/grade-g6.mjs $O/g6.jsonl > $O/grade.json 2>&1; echo "grade exit=$?" >> $O/session.txt
$S/scripts/host-state.sh end >> $O/session.txt
