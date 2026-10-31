#!/bin/bash
# qe-EPIC-010-m1-batch-2: the batch re-run (PREREG 316833e1; VOID 1 rule). Started with setsid -f (ppid 1): no job-control parent sees the watcher SIGSTOP. exec keeps the harness pid = this pid.
. <scratch>/qe-batch2/env
cd /home/olger/projects/public/skytalix/.claude/worktrees/qe-EPIC-010-m1-batch-2
echo $$ > <scratch>/qe-batch2/harness.pid
date -u +%Y-%m-%dT%H:%M:%SZ > <scratch>/qe-batch2/session-start.txt
exec node tools/rating/rating.ts rpair ca6e675c137fb1dac16eef6b849d72a2f32cc514 51902be5cfb0e13a340d9d342767f64b1dd01cee <scratch>/qe-batch2/out2 --elo 1910 --rounds 100 --concurrency 1 > <scratch>/qe-batch2/batch.log 2>&1
