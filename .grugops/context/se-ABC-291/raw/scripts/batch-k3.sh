#!/bin/bash
S=<scratch>/se291; L=<scratch>/host-test.lock; W=<repo>/.claude/worktrees/se-ABC-291
export PGNS="$W/.grugops/context/qe-ABC-269/raw/out/b8/d.pgn,$W/.grugops/context/qe-ABC-279/raw/out/c2/d.pgn"
cd $S/build
j() { t=$1; shift; st=$(date +%s); flock $L timeout 590 env "$@" > $S/out/$t.out 2>&1; echo "$t rc=$? s=$(($(date +%s)-st)) bytes=$(stat -c %s $S/out/$t.out)" >> $S/out/k3-summary.txt; }
: > $S/out/k3-summary.txt
j load node e4bprobe.ts load ON
j row1632-head node $S/scripts/row1632.ts $S/build
j row1632-door node $S/scripts/row1632.ts $S/build chooseMoveWithoutPawnShape
j row1632-base node $S/scripts/row1632.ts $S/base
j PR6-zug node e4bprobe.ts zug ON
j PR7-g1 node e4bprobe.ts g1 ON
j PR5-mate45 D=4 PLUS=1 node e4bprobe.ts mate ON
j PR5-mate55 D=5 PLUS=0 node e4bprobe.ts mate ON
j PR2-mirror node e4bprobe.ts mirror ON
j PR3-arith node e4bprobe.ts arith ON
j PR4-memo node e4bprobe.ts memo ON
j reach-ON node e4bprobe.ts reach ON
j reach-OFF node e4bprobe.ts reach OFF
j drift node e4bprobe.ts drift ON
echo ALLDONE >> $S/out/k3-summary.txt
