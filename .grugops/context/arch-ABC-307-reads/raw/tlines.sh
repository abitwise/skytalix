#!/bin/bash
# tlines.sh <tag> <row>... : the moved rows' -t lines in the tip tree. The caller holds the lock and the core.
S="${SCRATCH:?set SCRATCH to <scratch>/arch307}"
cd "$S/tip" || exit 2
tag=$1; shift
Q=tools/grugops/qe-hop-integrity.test.ts; U=src/uci-session.test.ts; B=src/book.test.ts
D='\[deep, ENGINE_DEEP=1\]'
for r in "$@"; do
  case $r in
    Q1) f=$Q; t="ABC-105 A9 — the security-nfr substitute is visible, not silent \(real notes\) $D" ;;
    Q2) f=$Q; t="ABC-105 A3 — the refs-only false pass is closed \(real notes\) $D" ;;
    Q3) f=$Q; t="ABC-105 A4 — the sweep's counts partition the Done rows \(real board\) $D" ;;
    L1) f=$U; t="ABC-101 — --difficulty selects a level, and the played engine is that level $D" ;;
    L2) f=$U; t="ABC-241 A4, A7 — the CLI: the ep twin and the claim $D A4: with a legal ep capture available the same line is not a draw" ;;
    L3) f=$U; t="ABC-241 A4, A7 — the CLI: the ep twin and the claim $D A7: the move the search scores 0 is the move after which gameStatusOf reports the claim" ;;
    C1) f=$U; t="ABC-171 A7 — the blunder path $D" ;;
    C2) f=$U; t="ABC-212 A9 — Skill Level reaches 7, and levels 6-7 take the rate-0 path $D" ;;
    B1) f=$B; t="ABC-094 A3 — variety after 1\. e4 on seeds 1 to 10 $D" ;;
    *) echo "unknown row $r"; continue ;;
  esac
  o="$S/out/t-$tag-$r.log"
  ENGINE_DEEP=1 VITEST_MAX_WORKERS=1 NO_COLOR=1 NODE_OPTIONS=--max-old-space-size=400 node tools/grugops/run-bounded.js 120000 npx vitest run "$f" -t "$t" > "$o" 2>&1
  e=$?
  [ -s "$o" ] || { echo -e "$tag\t$r\tUNREAD\tempty log"; continue; }
  echo -e "$tag\t$r\texit $e\t$(grep -E '^\s+Tests ' "$o" | sed 's/  */ /g')"
done
