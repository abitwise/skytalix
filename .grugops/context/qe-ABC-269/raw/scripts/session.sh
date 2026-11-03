#!/bin/bash
# one G2 session + nps report, in one flock hold. $1 = session tag, $2 = order
S=/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/qe-ABC-269
O=$S/out/g2-$1.out
{ echo "start $(date -u +%Y-%m-%dT%H:%M:%SZ) uptime: $(uptime)"; node --version
  echo "B/C src=58fa3eb4 H=561fc028 src=4d6b117b U=110292d4 src=b8b44ff3"
  node $S/g2q.ts $S $2; echo "g2 exit=$?"
  echo "g2-end $(date -u +%Y-%m-%dT%H:%M:%SZ) uptime: $(uptime)"
  node $S/npsq.ts $S; echo "nps exit=$?"
  echo "end $(date -u +%Y-%m-%dT%H:%M:%SZ) uptime: $(uptime)"; } > $O 2>&1
