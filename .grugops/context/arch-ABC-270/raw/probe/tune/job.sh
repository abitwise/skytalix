#!/bin/bash
# arch-ABC-270 D5 job: extract (arch-ABC-239's, + three queen-on features), then diag5 (D4r, D5). One process at a time;
# the caller wraps it in flock <host-test.lock>. Usage: job.sh <scratch tune dir holding e1/src, pgns.txt, proto/>
set -e
S="$1"; cd "$S"
date -u +%FT%TZ > out/job.start
timeout 1500 node proto/extract.ts "$S/e1/src" "$S/out/pos.jsonl" $(cat pgns.txt) > out/extract.json 2> out/extract.err
timeout 1500 node --max-old-space-size=3000 proto/diag5.ts "$S/e1/src" "$S/out/pos.jsonl" "$S/out/diag5.json" > out/diag5.log 2> out/diag5.err
date -u +%FT%TZ > out/job.end
