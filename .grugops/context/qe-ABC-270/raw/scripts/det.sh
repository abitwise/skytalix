#!/bin/bash
# qe-ABC-270 deterministic reads (K1 (c)/(a), K1 (e), K0 + cross-build, K1 (b) wide), each in its own host-lock hold.
S=<scratch>/qe270; L=<scratch>/host-test.lock; cd $S
log() { echo "$(date -u +%FT%TZ) $*" >> $S/out/det.log; }
log "begin $(uptime)"
flock $L node scripts/k1.ts $S $S/pairs.json H > out/k1.out 2>&1; log "k1 exit=$? $(tail -1 out/k1.out)"
flock $L node scripts/k1e.ts $S > out/k1e.out 2>&1; log "k1e exit=$? $(tail -1 out/k1e.out)"
flock $L node scripts/a1.ts $S > out/a1.out 2>&1; log "a1 exit=$? $(tail -c 300 out/a1.out | tr '\n' ' ')"
flock $L node scripts/a2.ts $S > out/a2.out 2>&1; log "a2 exit=$? $(tail -c 400 out/a2.out | tr '\n' ' ')"
log "end $(uptime)"
