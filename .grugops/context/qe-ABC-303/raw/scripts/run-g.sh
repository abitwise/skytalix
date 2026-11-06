#!/bin/bash
# qe-ABC-303 Stage B, one stage inside one hold: fsample beside the sealed command, nothing else. usage: run-g.sh <name> <qe scratch> <cwd> <cmd...>
N=$1; Q=$2; C=$3; shift 3; G=$Q/games; mkdir -p "$G"
"$Q/scripts/fsample.sh" "$Q/arms" "$G/$N.foreign.tsv" & SP=$!
trap 'kill $SP 2>/dev/null' EXIT
echo "start $(date -u +%FT%TZ) load1 $(cut -d' ' -f1 /proc/loadavg)" > "$G/$N.times"
cd "$C" && "$@" > "$G/$N.console" 2>&1; rc=$?
echo "rc=$rc" >> "$G/$N.times"; echo "end $(date -u +%FT%TZ) load1 $(cut -d' ' -f1 /proc/loadavg)" >> "$G/$N.times"
exit $rc
