#!/usr/bin/env bash
# ruling-abc082-levels: the three scratch-copy checks behind rulings 1-3. Nothing under the real
# src/ is edited: each check runs in a `git archive` copy of a commit, with node_modules symlinked.
# Usage: bash scratch-checks.sh <repo> <scratch-dir>      (repo = the checkout holding the commits)
set -euo pipefail
REPO="$1"; SC="$2"
BASE=5ebe1d8; BRANCH=bef7d43
fresh() { rm -rf "$SC/$1"; mkdir -p "$SC/$1"; git -C "$REPO" archive "$2" | tar -x -C "$SC/$1"; ln -s "$REPO/node_modules" "$SC/$1/node_modules"; }
run() { (cd "$SC/$1" && shift && "$@") 2>&1; }
P3LOG='s|(  it\("position-3 at depth 4 — the default lane.s standing guard", \(\) => \{\n)|$1    console.log(`ABC-081 A2 position-3 d4 \${(100 * hitRate(() => searchWithoutPvsOrReductions(parseFen(fenOf("position-3")), 4))).toFixed(2)}%`);\n|'

echo "## date $(date -u +%Y-%m-%dT%H:%M:%SZ) load $(uptime | sed 's/.*averages: //')"

echo "## RULING 1: ABC-079 A1 with the red pair replaced (C2: + black g7 / mirror + white g2), branch $BRANCH"
fresh r1 "$BRANCH"
sed -i '' 's|fen: "4k3/8/8/8/8/b7/1p6/1R2K3 w - - 0 1", losing: "b1b2"|fen: "4k3/6p1/8/8/8/b7/1p6/1R2K3 w - - 0 1", losing: "b1b2"|; s|fen: "1r2k3/1P6/B7/8/8/8/8/4K3 b - - 0 1", losing: "b8b7"|fen: "1r2k3/1P6/B7/8/8/8/6P1/4K3 b - - 0 1", losing: "b8b7"|' "$SC/r1/src/quiescence.test.ts"
echo "# whole file, SEARCH_DEEP=1"; run r1 env SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts | grep -E "A1 depth 3|Tests " || true
echo "# mutant: A1's with-quiescence arms call searchWithoutQuiescence (no quiescence)"
sed -i '' 's|const withQuiescence = hangingArm(search, 1);|const withQuiescence = hangingArm(searchWithoutQuiescence, 1);|; s|const withQuiescence = hangingArm(search, 3);|const withQuiescence = hangingArm(searchWithoutQuiescence, 3);|' "$SC/r1/src/quiescence.test.ts"
run r1 env SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts -t A1 | grep -E "A1 depth 3|Tests |expected [0-9]+ to be" | sort -u || true

echo "## RULING 2: ABC-081 A2 hit rates (position-3 default guard printed by an added console.log)"
for T in "base:$BASE" "branch:$BRANCH"; do
  N="${T%%:*}"; C="${T##*:}"; fresh "r2-$N" "$C"; perl -0pi -e "$P3LOG" "$SC/r2-$N/src/transposition.test.ts"
  echo "# $N $C"; run "r2-$N" env SEARCH_DEEP=1 npx vitest run src/transposition.test.ts -t A2 | grep -E "ABC-081 A2|Tests |expected 0\.[0-9]+ to be" || true
done
echo "# mutant on branch: search.ts interior never stores (line 'if (switches.table) storeEntry(key, ...')"
sed -i '' 's|  if (switches.table) storeEntry(key, depth, boundOf(best, alphaIn, beta), best, ply, bestMove);|  if (false \&\& switches.table) storeEntry(key, depth, boundOf(best, alphaIn, beta), best, ply, bestMove);|' "$SC/r2-branch/src/search.ts"
run r2-branch env SEARCH_DEEP=1 npx vitest run src/transposition.test.ts -t A2 | grep -E "ABC-081 A2|Tests " || true

echo "## RULING 3: ABC-121 A4 search() row, (b) A4_SEARCH_FEN [10, b1c1] vs (a) A4_FEN [95, h5e5]"
DISCARD='s|(  if \(score > alpha && reduction > 0\) \{\n)    score =\n|$1    const discarded =\n|'
REVERT='s|const shipped = search\(parseFen\(A4_SEARCH_FEN\), A4_DEPTH\);|const shipped = search(parseFen(A4_FEN), A4_DEPTH);|; s|const reference = searchWithoutReductions\(parseFen\(A4_SEARCH_FEN\), A4_DEPTH\);|const reference = searchWithoutReductions(parseFen(A4_FEN), A4_DEPTH);|; s|toEqual\(\[10, "b1c1"\]\)|toEqual([95, "h5e5"])|'
for V in b a; do
  fresh "r3-$V" "$BRANCH"
  [ "$V" = a ] && perl -0pi -e "$REVERT" "$SC/r3-$V/src/search.pvs-lmr.test.ts"
  echo "# ($V) clean"; run "r3-$V" npx vitest run src/search.pvs-lmr.test.ts | grep -E "Tests " || true
  perl -0pi -e "$DISCARD" "$SC/r3-$V/src/search.ts"
  echo "# ($V) mutant: search.ts runs the LMR full-depth re-search and DISCARDS its result"
  run "r3-$V" npx vitest run src/search.pvs-lmr.test.ts | grep -E "Tests |AssertionError" | sort -u || true
done
