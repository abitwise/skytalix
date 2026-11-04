#!/bin/bash
# qe-ABC-271 after timing: deterministic reads, gates, N8-LANE, deep lanes, mutants; each its own lock hold.
# usage: post.sh <S> <lock> <worktree> <main checkout> <fixtures.json>
S=$1; L=$2; W=$3; MAINW=$4; FX=$5
log() { echo "$(date -u +%FT%TZ) $*" >> $S/out/post.log; }
cd $S; log "begin $(uptime)"
flock $L node scripts/k0.ts $S $FX > out/k0.out 2>&1; log "k0 exit=$? $(tail -1 out/k0.out)"
flock $L node scripts/k1.ts $S $FX H 1 > out/k1.out 2>&1; log "k1 exit=$? $(tail -1 out/k1.out)"
cd $W; flock $L npm test > $S/out/npm-test-head.out 2>&1; log "npm test head exit=$? $(grep -E '^ +(Test Files|Tests|Duration) ' $S/out/npm-test-head.out | tr -s ' ' | tr '\n' ' ')"
cd $MAINW; flock $L npm test > $S/out/npm-test-base.out 2>&1; log "npm test base(main) exit=$? $(grep -E '^ +(Test Files|Tests|Duration) ' $S/out/npm-test-base.out | tr -s ' ' | tr '\n' ' ')"
cd $W; flock $L npm test > $S/out/npm-test-head2.out 2>&1; log "npm test head (2nd) exit=$? $(grep -E '^ +(Test Files|Tests|Duration) ' $S/out/npm-test-head2.out | tr -s ' ' | tr '\n' ' ')"
flock $L npm run typecheck > $S/out/typecheck.out 2>&1; log "typecheck exit=$?"
flock $L npm run lint > $S/out/lint.out 2>&1; log "lint exit=$?"
flock $L npm run build > $S/out/build.out 2>&1; log "build exit=$?"
n=$(NODE_OPTIONS=--max-old-space-size=128 flock $L npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'); log "skip count=$n"
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count $n > $S/out/skip-integrity.out 2>&1; log "skip-integrity exit=$? $(cat $S/out/skip-integrity.out | tr '\n' ' ')"
$S/scripts/mutants.sh $S $L $FX; log "mutants done"
$S/scripts/deep.sh $W $S/out/deep $L; log "deep done"
log "end $(uptime)"
