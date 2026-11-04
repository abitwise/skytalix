#!/bin/bash
# se-ABC-270 K3 (G2, two sessions, reverse order, main-copy control) + S2 nps report after each, then K4 (G6), all in ONE host-lock hold.
T=<scratch>/se270/T; O=<scratch>/se270/out/timing; mkdir -p $O $O/g6; cd $T
echo "start $(date -u +%FT%TZ) $(uptime)" >> $O/session.txt
node scripts/g2.ts $T B,C,H > $O/g2-s1.out 2>&1; echo "g2-s1 exit $? $(date -u +%TZ) $(cat /proc/loadavg)" >> $O/session.txt
node scripts/nps.ts $T > $O/nps-s1.out 2>&1; echo "nps-s1 exit $? $(date -u +%TZ)" >> $O/session.txt
node scripts/g2.ts $T H,C,B > $O/g2-s2.out 2>&1; echo "g2-s2 exit $? $(date -u +%TZ) $(cat /proc/loadavg)" >> $O/session.txt
node scripts/nps.ts $T > $O/nps-s2.out 2>&1; echo "nps-s2 exit $? $(date -u +%TZ)" >> $O/session.txt
node scripts/g6.mjs $T $O/g6 g6 > $O/g6/stdout.txt 2>&1; echo "g6 exit $? $(date -u +%TZ)" >> $O/session.txt
node scripts/grade-g6.mjs $O/g6/g6.jsonl > $O/g6/grade.json 2>&1; echo "grade exit $?" >> $O/session.txt
echo "end $(date -u +%FT%TZ) $(uptime)" >> $O/session.txt
