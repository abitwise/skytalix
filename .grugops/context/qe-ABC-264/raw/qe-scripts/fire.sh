#!/usr/bin/env bash
# qe-ABC-264 firing-rate session (under flock): instrument check, then 5 rounds x 3 boards at 100 ms real clock, fresh process each.
set -uo pipefail
S=$1; O=$2; mkdir -p $O; F=$S/F
echo "start $(date -u +%FT%TZ) load1=$(cut -d' ' -f1 /proc/loadavg)" > $O/times.txt
node $S/scripts/fire.mjs $F kiwipete frozen:8 | tee $O/check.jsonl
for r in 1 2 3 4 5; do for b in startpos kiwipete position-6; do
  node $S/scripts/fire.mjs $F $b real:100 | sed "s/^{/{\"round\":$r,\"load1\":$(cut -d' ' -f1 /proc/loadavg),/" | tee -a $O/real100.jsonl
done; done
echo "end $(date -u +%FT%TZ) load1=$(cut -d' ' -f1 /proc/loadavg)" >> $O/times.txt
