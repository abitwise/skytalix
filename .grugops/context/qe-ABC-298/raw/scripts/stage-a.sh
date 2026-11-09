#!/usr/bin/env bash
# qe-ABC-298 stage A (ADR-0077 d9 step 7, untimed). One step per hold of the host lock, one core, one process at a time,
# vitest with one worker. It calls qe-ABC-298-freeze's frozen scripts IN PLACE and unchanged (batch-a.sh, run-g4.sh,
# join.sh, deep.sh; their sha256 are the freeze's table), so the head is read by the instrument that read main.
# No timing figure is taken: holds.txt keeps each hold's start and end UTC for lock use only.
# Run as:
#   flock <scratch>/<home>/<repo>/host-test.lock taskset -c 0 bash stage-a.sh <step> <worktree> <headTree> <outDir>
# steps:
#   a      SG0 (perft default and PERFT_DEEP=1, in the worktree), SG1 (a) (sg1a.mjs on headTree), G4 corpus (batch-a.sh)
#   g4a    G4 lists, choose, search, doors, unpruned, sample, ordering 0/16
#   g4b    G4 ordering 1/16 .. 15/16, then join.sh
#   gates  npm run typecheck; npm run lint; tsc -p tsconfig.build.json emitted to <outDir>/build (deleted after); the
#          default lane whole with one worker (deep.sh default)
#   pins   the ADR-0077 pin lanes and the SG rows' deep lanes (deep.sh): ENGINE_DEEP engine, uci-session, legal, moves;
#          SEARCH_DEEP search.bundle, search.null-move, search.futility; PUZZLE_DEEP puzzle-suite
# <headTree> is a `git archive` of the head's src/, package.json and tsconfig.json; its src/ is diff-equal to the
# worktree's. <worktree> is this task's worktree (src/ = grugops/ABC-298 b40a2d7e).
set -u
STEP=$1; W=$2; T=$3; O=$4
F="$W/.grugops/context/qe-ABC-298-freeze/raw/scripts"
mkdir -p "$O"
echo "$STEP start $(date -u +%FT%TZ)" >> "$O/holds.txt"
case $STEP in
  a) bash "$F/batch-a.sh" "$W" "$T" "$O/a" ;;
  g4a) bash "$F/run-g4.sh" "$T" "$O/g4" lists choose search doors unpruned sample ordering:0/16 ;;
  g4b)
    parts=(); for i in $(seq 1 15); do parts+=("ordering:$i/16"); done
    bash "$F/run-g4.sh" "$T" "$O/g4" "${parts[@]}"
    cp "$O/a/g4-0-corpus.jsonl" "$O/g4/" && bash "$F/join.sh" "$O/g4" > /dev/null; echo "join exit $?" >> "$O/g4/exits.txt" ;;
  gates)
    mkdir -p "$O/gates"; cd "$W" || exit 2
    npm run typecheck > "$O/gates/typecheck.txt" 2>&1; echo "typecheck exit $?" >> "$O/gates/exits.txt"
    npm run lint > "$O/gates/lint.txt" 2>&1; echo "lint exit $?" >> "$O/gates/exits.txt"
    ./node_modules/.bin/tsc -p tsconfig.build.json --outDir "$O/build" > "$O/gates/build.txt" 2>&1
    echo "build exit $? files $(find "$O/build" -name '*.js' | wc -l)" >> "$O/gates/exits.txt"; rm -rf "$O/build"
    bash "$F/deep.sh" "$W" "$O/lanes" default ;;
  pins)
    bash "$F/deep.sh" "$W" "$O/lanes" ENGINE_DEEP:engine ENGINE_DEEP:uci-session ENGINE_DEEP:legal ENGINE_DEEP:moves \
      SEARCH_DEEP:search.bundle SEARCH_DEEP:search.null-move SEARCH_DEEP:search.futility PUZZLE_DEEP:puzzle-suite ;;
  *) echo "unknown step $STEP" >&2; exit 2 ;;
esac
echo "$STEP end $(date -u +%FT%TZ)" >> "$O/holds.txt"
