#!/bin/bash
# qe-ABC-270 one G2 session + its nps report, run INSIDE one flock hold by the caller. $1 = session tag, $2 = order. S = scratch/qe270
S=$3; O=$S/out/g2-$1.out
{ $S/scripts/host-state.sh start; node --version
  echo "B/C=main 4b9c5357 src=4cb84035  H=grugops/ABC-270 795a6b61 src=0f393c18"
  node $S/scripts/g2.ts $S $2; echo "g2 exit=$?"
  $S/scripts/host-state.sh g2-end
  node $S/scripts/nps.ts $S; echo "nps exit=$?"
  $S/scripts/host-state.sh end; } > $O 2>&1
