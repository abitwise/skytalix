#!/bin/bash
# one G2 session + nps report, in one flock hold. $1 = session tag, $2 = order
S=<scratch>/qe-ABC-274
O=$S/out/g2-$1.out
{ echo "start $(date -u +%Y-%m-%dT%H:%M:%SZ) uptime: $(uptime)"; node --version
  echo "B/C=54dee3f2 src=4d6b117b H=grugops/ABC-274 HEAD src=4cb84035 (7daae342) P=src tree 58fa3eb4"
  node $S/scripts/g2.ts $S $2; echo "g2 exit=$?"
  echo "g2-end $(date -u +%Y-%m-%dT%H:%M:%SZ) uptime: $(uptime)"
  node $S/scripts/nps.ts $S; echo "nps exit=$?"
  echo "end $(date -u +%Y-%m-%dT%H:%M:%SZ) uptime: $(uptime)"; } > $O 2>&1
