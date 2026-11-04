#!/bin/bash
# qe-ABC-280 A3/A4 gates. usage: gates.sh <lock> <worktree> <clone> <out>
set -u
LOCK="$1"; W="$2"; C="$3"; O="$4"
L() { flock "$LOCK" "$@"; }
log() { echo "$(date -u +%FT%TZ) $*" | tee -a "$O/gates.log"; }
# N on main (clone checked out at main's tip)
cd "$C" && git checkout -q main 2>/dev/null || git checkout -q "$(git -C "$W" rev-parse main)"
log "clone at $(git rev-parse --short HEAD) src sha $(git rev-parse HEAD:src)"
( time L npm test ) > "$O/main-npm-test.txt" 2>&1; log "main npm test rc=$?"
L env NODE_OPTIONS=--max-old-space-size=128 npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests' > "$O/main-skips.txt"; log "main skips $(cat "$O/main-skips.txt")"
git checkout -q edb9fddd; log "clone back at $(git rev-parse --short HEAD)"
# tip (worktree)
cd "$W"; log "worktree at $(git rev-parse --short HEAD) src sha $(git rev-parse HEAD:src)"
( time L npm test ) > "$O/tip-npm-test.txt" 2>&1; log "tip npm test rc=$?"
L env NODE_OPTIONS=--max-old-space-size=128 npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests' > "$O/tip-skips.txt"; log "tip skips $(cat "$O/tip-skips.txt")"
L node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count "$(cat "$O/tip-skips.txt")" > "$O/integrity.txt" 2>&1; log "integrity rc=$? $(cat "$O/integrity.txt")"
L npm run lint > "$O/lint.txt" 2>&1; log "lint rc=$?"
L npm run typecheck > "$O/typecheck.txt" 2>&1; log "typecheck rc=$?"
L npm run build > "$O/build.txt" 2>&1; log "build rc=$?"
find dist -type f | sort > "$O/dist-files.txt"; log "dist files $(wc -l < "$O/dist-files.txt"); tools-matches $(grep -c -i tune "$O/dist-files.txt") $(grep -c '^dist/tools' "$O/dist-files.txt")"
rm -rf dist; log "dist removed (absent before the build)"
( time L env TUNE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run tools/tune --reporter=verbose ) > "$O/tune-deep.txt" 2>&1; log "TUNE_DEEP rc=$?"
log done
