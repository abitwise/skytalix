#!/usr/bin/env bash
# qe-ABC-282: R-281-a's four lines, whose first logs the quota blanked. Each in its own hold. usage: rerun-t.sh <worktree> <outdir> <lockfile>
cd "$1" || exit 2; out=$2; lock=$3; mkdir -p "$out"; : > "$out/exits.txt"
echo "head=$(git rev-parse --short HEAD) src=$(git rev-parse --short HEAD:src) dirty=$(git status --porcelain -- src | wc -l) start $(date -u +%FT%TZ)" >> "$out/exits.txt"
run() { local tag=$1; shift; flock "$lock" env "$@" > "$out/$tag.txt" 2>&1; local ec=$?; echo "$tag exit $ec $(sed 's/\x1b\[[0-9;]*m//g' "$out/$tag.txt" | grep -E '^ +Tests ' | tail -1 | sed 's/  */ /g')" >> "$out/exits.txt"; }
H="NODE_OPTIONS=--max-old-space-size=400"
run t-ABC167A5  ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/uci-session.test.ts -t "ABC-167 A5 — the D4 time rule, read from the info line's time \[deep, ENGINE_DEEP=1\]"
run t-QE208a    SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/search.null-move.test.ts -t "QE-208-a — an abort inside a null move's subtree still hands the root back byte-identical \[deep, SEARCH_DEEP=1\]"
run t-ABC230    ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/engine.test.ts -t "ABC-230 A3 and A4 — no prior keys is base, node for node, and the doors take none \[deep, ENGINE_DEEP=1\]"
run t-A9        ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/levels.test.ts -t "A9 — different seeds actually differ \[deep\]"
echo "DONE $(date -u +%FT%TZ)" >> "$out/exits.txt"
