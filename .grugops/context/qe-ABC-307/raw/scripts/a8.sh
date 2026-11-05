#!/bin/bash
# a8.sh <worktree> <out dir> : A3, A4 and A8. Each run under the host lock on its own, core 0. Gates that read the checkout run in <worktree>, with node_modules borrowed by the caller.
W=$1; O=$2; S="${SCRATCH:?}"; L="${LOCK:?}"; mkdir -p "$O/log"; T=$O/a8.tsv
K="flock $L taskset -c 0"
strip() { sed 's/\x1b\[[0-9;]*m//g' "$1"; }
row() { # row <tree> <id> <env> <file> [pattern]
  local st=$(date +%s) o="$O/log/$1-$2.txt"
  if [ -n "$5" ]; then (cd "$S/$1" && $K env ${3:+$3} NODE_OPTIONS=--max-old-space-size=400 npx vitest run "$4" -t "$5" > "$o" 2>&1)
  else (cd "$S/$1" && $K env ${3:+$3} NODE_OPTIONS=--max-old-space-size=400 npx vitest run "$4" > "$o" 2>&1); fi
  local ex=$?
  [ -s "$o" ] || { echo -e "$1\t$2\tUNREAD\t\tempty log" >> "$T"; return; }
  echo -e "$1\t$2\t$ex\t$(( $(date +%s) - st ))\t$(strip "$o" | grep -E '^ +Tests ' | tr -s ' ')" >> "$T"
}
echo -e "tree\tid\texit\tsecs\tsummary" > "$T"
gate() { local o="$O/log/gate-$1.txt"; shift; (cd "$W" && $K "$@" > "$o" 2>&1); echo -e "worktree\t$(basename "$o" .txt)\t$?\t\t$(tail -1 "$o" | tr -s ' ' | cut -c1-120)" >> "$T"; }
gate typecheck npm run typecheck
gate lint npm run lint
gate build npm run build
for t in base tip; do
  (cd "$S/$t" && rm -f .test-results/last-run.json; $K npm test > "$O/log/$t-npmtest.txt" 2>&1); e=$?
  j="$S/$t/.test-results/last-run.json"
  if [ -s "$j" ] && [ -s "$O/log/$t-npmtest.txt" ]; then cp "$j" "$S/out/a3-$t.json"; echo -e "$t\tnpm-test\t$e\t\t$(strip "$O/log/$t-npmtest.txt" | grep -E '^ +Tests ' | tr -s ' ')" >> "$T"
  else echo -e "$t\tnpm-test\tUNREAD\t\texit $e, empty output" >> "$T"; fi
done
N=$(cd "$W" && $K env NODE_OPTIONS=--max-old-space-size=128 npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests')
echo -e "worktree\tskip-count\t\t\t${N:-UNREAD}" >> "$T"
[ -n "$N" ] && gate skip-integrity node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count "$N"
gate lane-inventory node tools/grugops/lane-inventory.js
D='\[deep, ENGINE_DEEP=1\]'; Q=tools/grugops/qe-hop-integrity.test.ts; U=src/uci-session.test.ts; B=src/book.test.ts; E=ENGINE_DEEP=1
# the 22 lines: ADR-0046's run rule, four and nine, then A4's nine
row tip rr-248 $E $U "ABC-167 A5 — the D4 time rule, read from the info line's time $D"
row tip rr-281R1 SEARCH_DEEP=1 src/search.null-move.test.ts "QE-208-a — an abort inside a null move's subtree still hands the root back byte-identical \[deep, SEARCH_DEEP=1\]"
row tip rr-281R2 $E src/engine.test.ts "ABC-230 A3 and A4 — no prior keys is base, node for node, and the doors take none $D"
row tip rr-281R3 $E src/levels.test.ts "A9 — different seeds actually differ \[deep\]"
row tip t-R1 SEARCH_DEEP=1 src/search.null-move.test.ts "A2 — the instrumented search makes 0 null moves in check, and 0 below three non-pawn pieces \[deep, SEARCH_DEEP=1\]"
row tip t-R2 $E $U "ABC-241 A4, A5 — UCI: the prior keys are repetition keys $D"
row tip t-R3 SEARCH_DEEP=1 src/search.futility.test.ts "the doors — searchWithoutFutility and chooseMoveWithoutFutility turn futility off, as every older door does \[deep, SEARCH_DEEP=1\]"
row tip t-R4 ZOBRIST_DEEP=1 src/zobrist.test.ts "ABC-075 property — the ep component tracks the ep FIELD, not availability \(ADR-0020\) \[deep, ZOBRIST_DEEP=1\]"
row tip t-R5 $E src/engine.test.ts "ABC-170 A5 — the limits only shorten; the ceiling still holds $D"
row tip t-R6 $E src/levels.test.ts "A7 — seeded, in deterministic mode \[deep\]"
row tip t-R7 $E src/levels.test.ts "ABC-174 A3 — the default plays as the engine: chooseMove at 4 000 ms \(ABC-228, ADR-0053 d10\) \[deep\]"
row tip t-R8 $E $U "ABC-241 A4, A7 — the CLI: a third occurrence through an uncapturable ep square $D"
row tip t-R9 $E src/engine.capacity.test.ts "ABC-122 A8: src/engine\.ts's KEY_ARRAY_CAPACITY guard, reached through chooseMove\(\) $D"
row tip t-Q1 $E $Q "ABC-105 A9 — the security-nfr substitute is visible, not silent \(real notes\) $D"
row tip t-Q2 $E $Q "ABC-105 A3 — the refs-only false pass is closed \(real notes\) $D"
row tip t-Q3 $E $Q "ABC-105 A4 — the sweep's counts partition the Done rows \(real board\) $D"
row tip t-L1 $E $U "ABC-101 — --difficulty selects a level, and the played engine is that level $D"
row tip t-L2 $E $U "ABC-241 A4, A7 — the CLI: the ep twin and the claim $D A4: with a legal ep capture available the same line is not a draw"
row tip t-L3 $E $U "ABC-241 A4, A7 — the CLI: the ep twin and the claim $D A7: the move the search scores 0 is the move after which gameStatusOf reports the claim"
row tip t-C1 $E $U "ABC-171 A7 — the blunder path $D"
row tip t-C2 $E $U "ABC-212 A9 — Skill Level reaches 7, and levels 6-7 take the rate-0 path $D"
row tip t-B1 $E $B "ABC-094 A3 — variety after 1\. e4 on seeds 1 to 10 $D"
# A4's whole deep lanes, tip and base
for t in tip base; do
  row $t deep-book $E $B
  row $t deep-qehop $E $Q
  row $t deep-uci $E $U
done
echo "a8 done $(date -u +%FT%TZ)"
