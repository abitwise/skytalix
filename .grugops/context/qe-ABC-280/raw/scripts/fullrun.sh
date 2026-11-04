#!/bin/bash
# qe-ABC-280 A5/A6: one full extract | fit | emit through the tool's own CLI, unchanged (emit writes the
# scratch clone's src/evaluate-params.ts, never the branch's). usage: fullrun.sh <lock> <clone> <lichess> <out>
set -u
LOCK="$1"; C="$2"; LI="$3"; O="$4"
mkdir -p "$O"; cd "$C"
log() { echo "$(date -u +%FT%TZ) $*" | tee -a "$O/stages.log"; }
stage() { local n="$1"; shift; log "$n start"
  flock "$LOCK" /usr/bin/time -v timeout 1800 node --max-old-space-size=3000 "$@" > "$O/$n.out" 2> "$O/$n.err"; local rc=$?
  log "$n exit $rc wall $(grep 'Elapsed (wall' "$O/$n.err" | awk '{print $NF}') maxRSS $(grep 'Maximum resident' "$O/$n.err" | awk '{print $NF}')kB"; return $rc; }
[ -z "$(git status --porcelain)" ] || { log "clone dirty"; exit 1; }
log "clone HEAD $(git rev-parse HEAD); src/evaluate-params.ts sha256 $(sha256sum src/evaluate-params.ts | cut -c1-64)"
stage extract tools/tune/tune.ts extract "$O/run" --lichess "$LI" || exit 1
stage fit tools/tune/tune.ts fit "$O/run" || exit 1
stage emit tools/tune/tune.ts emit "$O/run" || exit 1
cp src/evaluate-params.ts "$O/emitted-evaluate-params.ts"
log "emitted sha256 $(sha256sum "$O/emitted-evaluate-params.ts" | cut -c1-64)"
git checkout -q -- src/evaluate-params.ts
[ -z "$(git status --porcelain)" ] && log "clone restored clean" || log "clone NOT clean"
