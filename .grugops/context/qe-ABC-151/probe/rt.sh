#!/bin/sh
# usage: rt.sh <repo> <sha> <dir> <tag> [env...]; copies the tree, adds 6 probe files, runs only them.
R=$1; SHA=$2; D=$3; TAG=$4; shift 4
mkdir "$D" && git -C "$R" archive "$SHA" | tar -x -C "$D" && ln -s "$R/node_modules" "$D/node_modules"
for i in 1 2 3 4 5 6; do cp "$(dirname "$0")/rt-src/qe-pool.test.ts.txt" "$D/src/qe-pool-$i.test.ts"; done
LOG="$(dirname "$0")/out/rt-$TAG.log"; : > "$LOG"
(cd "$D" && env QE_POOL_LOG="$LOG" "$@" npx vitest run src/qe-pool- > "$LOG.out" 2>&1); ec=$?
printf '%s\texit=%s\tfiles_logged=%s\tdistinct_pool_ids=%s\tids=%s\n' "$TAG" "$ec" "$(wc -l < "$LOG" | tr -d ' ')" "$(cut -f1 "$LOG" | sort -u | wc -l | tr -d ' ')" "$(cut -f1 "$LOG" | sort -u | tr '\n' ',')"
