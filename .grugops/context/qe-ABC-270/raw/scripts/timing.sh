#!/bin/bash
# qe-ABC-270 timing under PREREG …f8ab73a7: K3 session 1 [B,C,H], K3 session 2 [H,C,B], K4 G6; each ONE flock hold.
S=<scratch>/qe270; L=<scratch>/host-test.lock
log() { echo "$(date -u +%FT%TZ) $*" >> $S/out/timing.log; }
log "wait-lock s1"; flock $L $S/scripts/session.sh s1 B,C,H $S; log "s1 done $(grep r_s $S/out/g2-s1.out)"
log "wait-lock s2"; flock $L $S/scripts/session.sh s2 H,C,B $S; log "s2 done $(grep r_s $S/out/g2-s2.out)"
log "wait-lock g6"; flock $L $S/scripts/g6session.sh $S; log "g6 done $(grep -o '\"verdict\": \"[A-Z]*\"' $S/out/g6/grade.json)"
