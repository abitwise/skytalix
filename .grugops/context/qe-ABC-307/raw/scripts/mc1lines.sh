#!/bin/bash
# mc1lines.sh <tree> <tag> : C1's row alone on its -t line in <tree>, default lane. base: the full row; tip: the remnant. The caller holds the lock and the core.
S="${SCRATCH:?set SCRATCH to <scratch>/qe307}"
cd "$S/$1" || exit 2
if [ "$1" = base ]; then t="ABC-171 A7 — the blunder path two sessions on the same seededRandom\(k\) write the same bestmove sequence"
else t="ABC-171 A7 — the blunder path two sessions on seededRandom\(2\), over the first two gos \(a blunder, then the engine\), write the same bestmove sequence"; fi
o="$S/out/alone-$2.log"
VITEST_MAX_WORKERS=1 NO_COLOR=1 NODE_OPTIONS=--max-old-space-size=400 node tools/grugops/run-bounded.js 120000 npx vitest run src/uci-session.test.ts -t "$t" > "$o" 2>&1
e=$?
[ -s "$o" ] || { echo -e "$2\talone\tUNREAD\tempty log"; exit 0; }
echo -e "$2\talone\texit $e\t$(grep -E '^\s+Tests ' "$o" | sed 's/  */ /g')"
