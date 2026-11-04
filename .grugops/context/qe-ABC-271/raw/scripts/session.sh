#!/bin/bash
# qe-ABC-271 one K3 session + its S2 nps report, INSIDE one flock hold by the caller. $1 tag, $2 order, $3 = S.
# Host gate first (PREREG): host.mjs waitClear (0 foreign vitest, 0 cutechess-cli, load1 <= 2.0, Tctl <= 60.0), not relaxed.
S=$3; O=$S/out/g2-$1.out
{ node -e "import('$S/scripts/host.mjs').then(h=>{const r=h.waitClear('k3 $1',s=>console.log('gate',s));console.log('gate clear load1='+r.l.toFixed(2)+' tctl='+r.t.toFixed(1))})"
  g=$?; echo "gate exit=$g"; if [ $g -ne 0 ]; then echo "GATE NOT MET: no K3 reading in this slot"; exit 3; fi
  $S/scripts/host-state.sh start; node --version
  echo "B/C=main src=4fb3da04  H=grugops/ABC-271 10f29a82 src=08e56302"
  node $S/scripts/g2.ts $S $2; echo "g2 exit=$?"
  $S/scripts/host-state.sh g2-end
  node $S/scripts/nps.ts $S; echo "nps exit=$?"
  node $S/scripts/npseg.ts $S; echo "npseg exit=$?"
  $S/scripts/host-state.sh end; } > $O 2>&1
