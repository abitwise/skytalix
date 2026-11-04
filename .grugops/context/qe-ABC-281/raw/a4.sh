#!/bin/bash
# qe-ABC-281 A4: the page's three -t lines and the three full deep lanes (as AGENTS.md spells them) at the tip; deep
# collect counts (vitest list, flag set) at base and tip. Run inside one `flock <lock>` hold.
# Usage: a4.sh <tip checkout> <base arm> <out dir>
W=$1; B=$2; O=$3
cd $W
SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/search.null-move.test.ts -t "QE-208-a — an abort inside a null move's subtree still hands the root back byte-identical \[deep, SEARCH_DEEP=1\]" > $O/t-null.txt 2>&1; echo "t-null exit $?"
ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/engine.test.ts -t "ABC-230 A3 and A4 — no prior keys is base, node for node, and the doors take none \[deep, ENGINE_DEEP=1\]" > $O/t-engine.txt 2>&1; echo "t-engine exit $?"
ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts -t "A9 — different seeds actually differ \[deep\]" > $O/t-levels.txt 2>&1; echo "t-levels exit $?"
for d in base:$B tip:$W; do n=${d%%:*}; p=${d#*:}
  (cd $p && SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest list src/search.null-move.test.ts > $O/list-$n-null.txt 2>&1; echo "list $n null $? $(grep -c '' $O/list-$n-null.txt)")
  (cd $p && ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest list src/engine.test.ts > $O/list-$n-engine.txt 2>&1; echo "list $n engine $? $(grep -c '' $O/list-$n-engine.txt)")
  (cd $p && ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest list src/levels.test.ts > $O/list-$n-levels.txt 2>&1; echo "list $n levels $? $(grep -c '' $O/list-$n-levels.txt)")
done
cd $W
s=$(date +%s); SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/search.null-move.test.ts > $O/deep-null.txt 2>&1; echo "deep-null exit $? $(( $(date +%s)-s )) s"
s=$(date +%s); ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/engine.test.ts > $O/deep-engine.txt 2>&1; echo "deep-engine exit $? $(( $(date +%s)-s )) s"
s=$(date +%s); ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts --reporter=verbose > $O/deep-levels.txt 2>&1; echo "deep-levels exit $? $(( $(date +%s)-s )) s"
echo "a4 done $(date -u +%FT%TZ)"
