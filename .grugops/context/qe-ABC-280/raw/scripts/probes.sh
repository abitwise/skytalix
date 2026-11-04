#!/bin/bash
# qe-ABC-280 probes in the scratch clone (never the branch). usage: probes.sh <lock> <clone> <out>
set -u
LOCK="$1"; C="$2"; O="$3"; mkdir -p "$O"; cd "$C"
log() { echo "$(date -u +%FT%TZ) $*" | tee -a "$O/probes.log"; }
[ -z "$(git status --porcelain)" ] || { log "clone dirty"; exit 1; }
# P1a: equal-length, wrong-content export (sparse, pin byte length) through the CLI
F="$O/fake/lichess_db_standard_rated_2017-03.pgn.zst"; mkdir -p "$O/fake"; truncate -s 2169142067 "$F"
flock "$LOCK" timeout 600 node tools/tune/tune.ts extract "$O/p1a-out" --lichess "$F" > "$O/p1a.out" 2> "$O/p1a.err"; rc=$?
log "P1a same-length wrong-sha CLI rc=$rc err=$(head -c 300 "$O/p1a.err") outdir-exists=$([ -e "$O/p1a-out" ] && echo yes || echo no)"
rm -f "$F"
# P1b: tiny file
printf 'x' > "$O/fake/tiny.pgn.zst"
flock "$LOCK" timeout 120 node tools/tune/tune.ts extract "$O/p1b-out" --lichess "$O/fake/tiny.pgn.zst" > "$O/p1b.out" 2> "$O/p1b.err"; rc=$?
log "P1b tiny-file CLI rc=$rc err=$(head -c 300 "$O/p1b.err") outdir-exists=$([ -e "$O/p1b-out" ] && echo yes || echo no)"
# P2: mutation, an untraced endgame-only +1 cp in evaluateAtPhase (F1's class); own games only
cp src/evaluate.ts "$O/evaluate.ts.orig"
sed -i 's|^  const score = whiteMinusBlack(position, true, true, true, phase);$|  const score = whiteMinusBlack(position, true, true, true, phase) + (phase <= 8 ? 1 : 0);|' src/evaluate.ts
git diff --stat -- src/evaluate.ts | tee -a "$O/probes.log"
flock "$LOCK" /usr/bin/time -v timeout 900 node --max-old-space-size=3000 tools/tune/tune.ts extract "$O/p2-out" > "$O/p2.out" 2> "$O/p2.err"; rc=$?
log "P2 mutated extract (own only) rc=$rc msg=$(grep -m1 -o 'identity gate miss.*' "$O/p2.err" | head -c 300) wall $(grep 'Elapsed (wall' "$O/p2.err" | awk '{print $NF}')"
git checkout -q -- src/evaluate.ts
[ -z "$(git status --porcelain)" ] && log "clone restored clean" || log "clone NOT clean"
log done
