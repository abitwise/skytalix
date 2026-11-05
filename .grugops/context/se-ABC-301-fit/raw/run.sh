#!/bin/bash
# se-ABC-301-fit: stages of one run from the base table. The caller holds the host lock.
# usage: run.sh <outdir> extract|fit|emit ...
set -u
S=<scratch>
W=<repo>/.claude/worktrees/se-ABC-301
O="$1"; shift
LI="$S/lichess/lichess_db_standard_rated_2017-03.pgn.zst"
cd "$W"; mkdir -p "$O"
log() { echo "$(date -u +%FT%TZ) $*" >> "$O/stages.log"; }
stage() {
  local name="$1"; shift
  log "$name start"
  /usr/bin/time -v timeout 3500 node --max-old-space-size=3000 tools/tune/tune.ts "$@" > "$O/$name.out" 2> "$O/$name.err"
  local rc=$?
  log "$name exit $rc wall $(grep 'Elapsed (wall' "$O/$name.err" | awk '{print $NF}') maxRSS $(grep 'Maximum resident' "$O/$name.err" | awk '{print $NF}')kB"
  return $rc
}
for st in "$@"; do
  case "$st" in
    extract) stage extract extract "$O" --lichess "$LI" || exit 1 ;;
    fit) stage fit fit "$O" || exit 1 ;;
    emit) stage emit emit "$O" || exit 1
      cp src/evaluate-params.ts "$O/evaluate-params.ts"
      log "emitted sha256 $(sha256sum src/evaluate-params.ts | cut -c1-64)" ;;
  esac
done
