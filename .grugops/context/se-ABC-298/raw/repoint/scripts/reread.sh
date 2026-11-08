#!/usr/bin/env bash
# se-ABC-298-repoint: item 2's re-read, one hold, serial, one core, vitest one worker.
#   flock <lock> taskset -c 0 bash reread.sh <worktree> <outDir> <buildOutDir>
set -u
W=$1; O=$2; B=$3; S=$(dirname "$(readlink -f "$0")"); mkdir -p "$O"; cd "$W" || exit 2
./node_modules/.bin/tsc --noEmit > "$O/tsc.txt" 2>&1; echo "tsc exit=$?" >> "$O/gates.txt"
./node_modules/.bin/biome check . > "$O/lint.txt" 2>&1; echo "lint exit=$?" >> "$O/gates.txt"
bash "$S/lanes.sh" "$W" "$O" default SEARCH_DEEP:search.bundle SEARCH_DEEP:search.null-move
./node_modules/.bin/tsc -p tsconfig.build.json --outDir "$B" > "$O/build.txt" 2>&1; echo "build exit=$?" >> "$O/gates.txt"
