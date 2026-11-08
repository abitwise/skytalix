#!/usr/bin/env bash
# qe-ABC-298-freeze batch C: SG2's hand cases against main's oracle (real, then planted), SG2 (c)'s reference rows
# on a `git archive` of main, the default lane run with one worker, and every deep lane listed (collect only).
# Run as: flock <scratch>/host-test.lock taskset -c 0 bash batch-c.sh <worktree> <mainTree> <outDir>
set -u
W=$1; T=$2; O=$3; S=$(dirname "$(readlink -f "$0")"); R=$(dirname "$S"); mkdir -p "$O/sg2"
echo "C start $(date -u +%FT%TZ)" >> "$O/holds.txt"
node "$S/sg2-oracle.mjs" "$T" "$R/sg2-cases.json" > "$O/sg2/oracle.jsonl" 2>&1; echo "sg2 oracle exit $?" >> "$O/exits.txt"
node "$S/sg2-oracle.mjs" "$T" "$R/sg2-cases.json" plant > "$O/sg2/oracle-plant.jsonl" 2>&1; echo "sg2 oracle plant exit $?" >> "$O/exits.txt"
cp "$S/sg2c.ref.ts" "$T/src/qe298-sg2c.ref.test.ts"
( cd "$T" && SG2_CASES="$R/sg2-cases.json" NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run src/qe298-sg2c.ref.test.ts \
    --maxWorkers=1 --reporter=verbose > "$O/sg2/sg2c-ref.txt" 2>&1; echo "sg2c ref exit $?" >> "$O/exits.txt" )
rm -f "$T/src/qe298-sg2c.ref.test.ts"
echo "C end $(date -u +%FT%TZ)" >> "$O/holds.txt"
bash "$S/deep.sh" "$W" "$O" default
bash "$S/list.sh" "$W" "$O"
