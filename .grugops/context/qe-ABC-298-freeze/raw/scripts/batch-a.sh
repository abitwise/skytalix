#!/usr/bin/env bash
# qe-ABC-298-freeze batch A: SG0 (perft, default lane and PERFT_DEEP=1), SG1 (a), and G4's corpus part.
# Serial, one process at a time, one core. Run as:
#   flock <scratch>/host-test.lock taskset -c 0 bash batch-a.sh <worktree> <mainTree> <outDir>
# <worktree> is the freeze worktree (src/ = main's); <mainTree> a `git archive` of main beside it.
# holds.txt gets start and end UTC, for lock use only. No timing figure is taken.
set -u
W=$1; T=$2; O=$3; S=$(dirname "$(readlink -f "$0")"); mkdir -p "$O/vitest"
echo "A start $(date -u +%FT%TZ)" >> "$O/holds.txt"
cd "$W" || exit 2
NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run src/perft.test.ts --maxWorkers=1 \
  --reporter=default --reporter=json --outputFile.json="$O/vitest/default-perft.json" > "$O/vitest/default-perft.txt" 2>&1
echo "default perft exit $?" >> "$O/exits.txt"
PERFT_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run src/perft.test.ts --maxWorkers=1 \
  --reporter=default --reporter=json --outputFile.json="$O/vitest/PERFT_DEEP-perft.json" > "$O/vitest/PERFT_DEEP-perft.txt" 2>&1
echo "PERFT_DEEP perft exit $?" >> "$O/exits.txt"
node "$S/sg1a.mjs" "$T" > "$O/sg1a.jsonl" 2> "$O/sg1a.err"
echo "sg1a exit $?" >> "$O/exits.txt"
node "$S/g4.mjs" "$T" corpus > "$O/g4-0-corpus.jsonl" 2> "$O/g4-0-corpus.err"
echo "g4 corpus exit $?" >> "$O/exits.txt"
echo "A end $(date -u +%FT%TZ)" >> "$O/holds.txt"
