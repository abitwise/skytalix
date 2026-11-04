#!/bin/bash
# qe-ABC-271 deep lanes + R-281-a's four -t lines, one at a time, each under the host lock; exit code is vitest's own.
# Runs on the QE worktree itself (HEAD src = the build's 08e56302 + records only). usage: deep.sh <worktree> <outdir> <lock>
cd "$1" || exit 1; L=$3; D=$2; mkdir -p $D
echo "$(date -u +%FT%TZ) begin $(git rev-parse --short=8 HEAD) src=$(git rev-parse --short=8 HEAD:src) $(uptime)" >> $D/exits.txt
run() { local name=$1 envv=$2 file=$3; shift 3
  local t0=$(date +%s)
  env $envv NODE_OPTIONS="${NO:---max-old-space-size=400}" flock $L timeout 2400 npx vitest run $file --reporter=verbose "$@" > $D/$name.txt 2>&1; local rc=$?
  echo "$(date -u +%TZ) $name exit=$rc secs=$(( $(date +%s) - t0 )) $(grep -E '^ +Tests ' $D/$name.txt | tr -s ' ')" >> $D/exits.txt
}
# R-281-a (ADR-0046 dated 2026-11-04): expected passed counts 4, 1, 1, 1
run r281-A5 ENGINE_DEEP=1 src/uci-session.test.ts -t "ABC-167 A5 — the D4 time rule, read from the info line's time \[deep, ENGINE_DEEP=1\]"
run r281-QE208a SEARCH_DEEP=1 src/search.null-move.test.ts -t "QE-208-a — an abort inside a null move's subtree still hands the root back byte-identical \[deep, SEARCH_DEEP=1\]"
run r281-ABC230 ENGINE_DEEP=1 src/engine.test.ts -t "ABC-230 A3 and A4 — no prior keys is base, node for node, and the doors take none \[deep, ENGINE_DEEP=1\]"
run r281-levelsA9 ENGINE_DEEP=1 src/levels.test.ts -t "A9 — different seeds actually differ \[deep\]"
# lanes SE left UNKNOWN, cheap and game-free (CLI_DEEP drives a CLI game session and LADDER_DEEP plays games: not run)
run perft PERFT_DEEP=1 src/perft.test.ts
run zobrist ZOBRIST_DEEP=1 src/zobrist.test.ts
NO="--expose-gc --max-old-space-size=400" run input INPUT_DEEP=1 src/line-input.test.ts
run uci-real UCI_DEEP=1 src/uci.real-engine.test.ts
run uci-session ENGINE_DEEP=1 src/uci-session.test.ts
# SE's lanes, re-run by QE (K0's "every door", K2's "any other re-pin, in any lane")
run passer-k0 SEARCH_DEEP=1 src/evaluate.passer.test.ts
run taper SEARCH_DEEP=1 src/evaluate.taper.test.ts
run see SEARCH_DEEP=1 src/see.test.ts
run nullmove SEARCH_DEEP=1 src/search.null-move.test.ts
run futility SEARCH_DEEP=1 src/search.futility.test.ts
run search SEARCH_DEEP=1 src/search.test.ts
run quiescence SEARCH_DEEP=1 src/quiescence.test.ts
run tt-search SEARCH_DEEP=1 src/transposition.test.ts
run pvslmr SEARCH_DEEP=1 src/search.pvs-lmr.test.ts
run ordering SEARCH_DEEP=1 src/search.ordering.test.ts
run tune TUNE_DEEP=1 tools/tune/tune.test.ts
run engine ENGINE_DEEP=1 src/engine.test.ts
run tt-engine ENGINE_DEEP=1 src/transposition.test.ts
run pawns ENGINE_DEEP=1 src/evaluate.pawns.test.ts
run puzzle PUZZLE_DEEP=1 src/puzzle-suite.test.ts
run puzzle-weakened PUZZLE_DEEP=weakened src/puzzle-suite.test.ts
run levels ENGINE_DEEP=1 src/levels.test.ts
echo "$(date -u +%TZ) ALL DONE" >> $D/exits.txt
