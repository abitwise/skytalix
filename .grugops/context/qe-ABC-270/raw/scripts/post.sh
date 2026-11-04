#!/bin/bash
# qe-ABC-270 after timing: npm test head + base (N8-LANE), typecheck/lint head, deep lanes head, mutants; each its own lock hold.
S=<scratch>/qe270; L=<scratch>/host-test.lock; W=<repo>/.claude/worktrees/se-ABC-270
log() { echo "$(date -u +%FT%TZ) $*" >> $S/out/post.log; }
cd $W; flock $L npm test > $S/out/npm-test-head.out 2>&1; log "npm test head exit=$? $(grep -E '^ +(Test Files|Tests|Duration) ' $S/out/npm-test-head.out | tr -s ' ' | tr '\n' ' ')"
cd $S/mainwt; flock $L npm test > $S/out/npm-test-base.out 2>&1; log "npm test base exit=$? $(grep -E '^ +(Test Files|Tests|Duration) ' $S/out/npm-test-base.out | tr -s ' ' | tr '\n' ' ')"
cd $W; flock $L npm run typecheck > $S/out/typecheck.out 2>&1; log "typecheck exit=$?"
flock $L npm run lint > $S/out/lint.out 2>&1; log "lint exit=$?"
$S/scripts/deep.sh $W $S/out/deep-head $L; log "deep done"
$S/scripts/mutants.sh $S $L; log "mutants done"
