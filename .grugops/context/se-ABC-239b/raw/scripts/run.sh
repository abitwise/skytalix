#!/bin/bash
# se-ABC-239b: one extract | fit | emit run from the base table. Caller holds the host lock.
# usage: run.sh <scratch> <worktree> <outdir> [skip-extract]
set -u
S="$1"; W="$2"; O="$3"; SKIPX="${4:-}"
LI="$S/lichess/lichess_db_standard_rated_2017-03.pgn.zst"
cd "$W"
mkdir -p "$O"
git checkout HEAD -- src/evaluate-params.ts
log() { echo "$(date -u +%FT%TZ) $*" >> "$O/stages.log"; }
stage() {
  local name="$1"; shift
  log "$name start"
  /usr/bin/time -v timeout 1800 node --max-old-space-size=3000 tools/tune/tune.ts "$@" > "$O/$name.out" 2> "$O/$name.err"
  local rc=$?
  local wall rss
  wall=$(grep "Elapsed (wall" "$O/$name.err" | awk '{print $NF}')
  rss=$(grep "Maximum resident" "$O/$name.err" | awk '{print $NF}')
  log "$name exit $rc wall $wall maxRSS ${rss}kB"
  return $rc
}
if [ -z "$SKIPX" ]; then stage extract extract "$O" --lichess "$LI" || exit 1; fi
stage fit fit "$O" || exit 1
stage emit emit "$O" || exit 1
cp src/evaluate-params.ts "$O/evaluate-params.ts"
log "emitted sha256 $(sha256sum src/evaluate-params.ts | cut -c1-64)"
