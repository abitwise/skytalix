#!/usr/bin/env bash
# qe-ABC-316 stage B (sealed in the PREREG before any graded game). Both levels, one after the other, under ONE hold
# of the host lock (the caller's flock):
#   CUTECHESS_CLI=<cutechess-cli> STOCKFISH=<stockfish> flock <scratch>/host-test.lock bash stage-b.sh <out-root> <repo>
# <out-root> must not exist yet and must lie outside <repo>. L1 reads into <out-root>/l1-e1320, L2 into <out-root>/l2-e1450.
# L2 starts only if L1's session exited 0 (a reading was written, whatever it says). A gate miss, a WAIT or a VOID at
# L1 stops here; nothing is re-run. No band step runs here: a step is a new run on the Orchestrator's word.
set -u
ROOT=${1:-}; REPO=${2:-}; HERE=$(cd "$(dirname "$0")" && pwd)
[ -n "$ROOT" ] && [ -n "$REPO" ] || { echo "usage: stage-b.sh <out-root> <repo>"; exit 2; }
[ -e "$ROOT" ] && { echo "out-root exists"; exit 2; }
case "$(realpath -m "$ROOT")/" in "$(realpath "$REPO")"/*) echo "out-root lies inside the repo"; exit 2;; esac
mkdir "$ROOT" || exit 2
bash "$HERE/session.sh" 1 "$ROOT/l1-e1320" "$REPO"; R1=$?
echo "$(date -u +%FT%TZ) stage-b L1 session exit $R1" | tee -a "$ROOT/stage-b.log"
[ $R1 -eq 0 ] || { echo "$(date -u +%FT%TZ) stage-b: L2 not started (L1 exit $R1)" | tee -a "$ROOT/stage-b.log"; exit $R1; }
bash "$HERE/session.sh" 2 "$ROOT/l2-e1450" "$REPO"; R2=$?
echo "$(date -u +%FT%TZ) stage-b L2 session exit $R2" | tee -a "$ROOT/stage-b.log"
exit $R2
