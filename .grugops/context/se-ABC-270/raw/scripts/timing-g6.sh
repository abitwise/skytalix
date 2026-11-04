#!/bin/bash
# se-ABC-270 K4 (G6) Engineer re-read, Tctl wait relaxed to <= 75.0 (see host.mjs); one host-lock hold.
T=<scratch>/se270/T; O=<scratch>/se270/out/timing; cd $T
echo "g6 re-read start $(date -u +%FT%TZ) $(uptime)" >> $O/session.txt
node scripts/g6.mjs $T $O/g6 g6 > $O/g6/stdout.txt 2>&1; echo "g6 exit $? $(date -u +%TZ)" >> $O/session.txt
node scripts/grade-g6.mjs $O/g6/g6.jsonl > $O/g6/grade.json 2>&1; echo "grade exit $?" >> $O/session.txt
echo "end $(date -u +%FT%TZ) $(uptime)" >> $O/session.txt
