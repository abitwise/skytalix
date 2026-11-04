#!/bin/bash
# se-ABC-280: one extract | fit | emit run from main's table, emitting to a scratch file. Caller holds the host lock.
# usage: run.sh <scratch> <worktree> <outdir>
set -u
S="$1"; W="$2"; O="$3"; D="$(cd "$(dirname "$0")" && pwd)"
LI="$S/lichess/lichess_db_standard_rated_2017-03.pgn.zst"
cd "$W"
mkdir -p "$O"
log() { echo "$(date -u +%FT%TZ) $*" >> "$O/stages.log"; }
stage() {
  local name="$1"; shift
  log "$name start"
  /usr/bin/time -v timeout 1800 node --max-old-space-size=3000 "$@" > "$O/$name.out" 2> "$O/$name.err"
  local rc=$?
  log "$name exit $rc wall $(grep 'Elapsed (wall' "$O/$name.err" | awk '{print $NF}') maxRSS $(grep 'Maximum resident' "$O/$name.err" | awk '{print $NF}')kB"
  return $rc
}
[ -z "$(git status --porcelain -- tools/tune src)" ] || { log "dirty tools/tune or src"; exit 1; }
log "src/evaluate-params.ts sha256 $(sha256sum src/evaluate-params.ts | cut -c1-64)"
TC=$(git log -1 --format=%H -- tools/tune)
stage extract tools/tune/tune.ts extract "$O" --lichess "$LI" || exit 1
stage fit tools/tune/tune.ts fit "$O" || exit 1
stage emit "$D/emit-to.ts" "$W" "$O" "$O/evaluate-params.ts" "$TC" || exit 1
log "emitted sha256 $(sha256sum "$O/evaluate-params.ts" | cut -c1-64) (tool commit $TC)"
[ -z "$(git status --porcelain -- src)" ] || { log "src changed"; exit 1; }
