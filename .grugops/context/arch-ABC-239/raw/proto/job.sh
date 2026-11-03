#!/bin/bash
# arch-ABC-239 prototype job: extract then fit, one process at a time, under the host lock (caller wraps in flock).
set -e
S="$1"   # the scratch dir holding e1/src (git archive grugops/ABC-269 src package.json), pgns.txt and proto/
cd $S
date -u +%FT%TZ > $S/out/job.start
timeout 1700 node proto/extract.ts $S/e1/src $S/out/pos.jsonl $(cat $S/pgns.txt) > $S/out/extract.json 2> $S/out/extract.err
timeout 1700 node --max-old-space-size=3000 proto/fit.ts $S/e1/src $S/out/pos.jsonl $S/out/fit.json > $S/out/fit.log 2> $S/out/fit.err
date -u +%FT%TZ > $S/out/job.end
