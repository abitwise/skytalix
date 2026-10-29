#!/bin/bash
# qe-epic008-close M3 + gates chain, after both readings: trees, G6 session, deep lanes (G1, G5), gates (incl. G8, G9).
# usage: m3.sh <scratch> <worktree> <close-sha>
set -u
S=$1; W=$2; C=$3
. $S/scripts/common.sh
L=$S/m3.log
mkdir -p $S/trees/base $S/trees/head
git -C $W archive 3497aad21fd089f29fe1791d42f81c47ac7ca522 src data | tar -x -C $S/trees/base
git -C $W archive $C src data | tar -x -C $S/trees/head
echo "$(ts) trees ready" >> $L
$S/scripts/g6.sh $S; echo "$(ts) g6 rc=$?" >> $L
$S/scripts/deep.sh $S $W; echo "$(ts) deep rc=$?" >> $L
$S/scripts/gates.sh $S $W; echo "$(ts) gates rc=$?" >> $L
echo "$(ts) DONE" >> $L
