#!/bin/bash
# lanes.sh <tree> <tag> <lock> <outdir> [lines] [deep...] : ABC-307's A4 in <tree>, each run under the host lock on its own.
T=$1; tag=$2; LOCK=$3; O=$4; shift 4
cd "$T" || exit 2
P="env ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run"
Q=tools/grugops/qe-hop-integrity.test.ts; U=src/uci-session.test.ts; B=src/book.test.ts
D='\[deep, ENGINE_DEEP=1\]'
line() { # name file pattern
  o="$O/$tag-t-$1.log"
  flock "$LOCK" $P "$2" -t "$3" > "$o" 2>&1; e=$?
  [ -s "$o" ] || { echo -e "$tag\t$1\tUNREAD empty log"; return; }
  echo -e "$tag\t$1\texit $e\t$(grep -E '^\s+Tests ' "$o" | sed 's/\x1b\[[0-9;]*m//g; s/  */ /g')"
}
lane() { # name file
  o="$O/$tag-deep-$1.log"; j="$O/$tag-deep-$1.json"; rm -f "$j"
  flock "$LOCK" $P "$2" --reporter=default --reporter=json --outputFile.json="$j" > "$o" 2>&1; e=$?
  [ -s "$o" ] && [ -s "$j" ] || { echo -e "$tag\tdeep-$1\tUNREAD empty output"; return; }
  echo -e "$tag\tdeep-$1\texit $e\t$(python3 -c "import json,sys; r=json.load(open(sys.argv[1])); print('total',r['numTotalTests'],'passed',r['numPassedTests'],'failed',r['numFailedTests'],'pending',r['numPendingTests'],'todo',r['numTodoTests'])" "$j")"
}
for a in "$@"; do case $a in
  lines)
    line Q1 $Q "ABC-105 A9 — the security-nfr substitute is visible, not silent \(real notes\) $D"
    line Q2 $Q "ABC-105 A3 — the refs-only false pass is closed \(real notes\) $D"
    line Q3 $Q "ABC-105 A4 — the sweep's counts partition the Done rows \(real board\) $D"
    line L1 $U "ABC-101 — --difficulty selects a level, and the played engine is that level $D"
    line L2 $U "ABC-241 A4, A7 — the CLI: the ep twin and the claim $D A4: with a legal ep capture available the same line is not a draw"
    line L3 $U "ABC-241 A4, A7 — the CLI: the ep twin and the claim $D A7: the move the search scores 0 is the move after which gameStatusOf reports the claim"
    line C1 $U "ABC-171 A7 — the blunder path $D"
    line C2 $U "ABC-212 A9 — Skill Level reaches 7, and levels 6-7 take the rate-0 path $D"
    line B1 $B "ABC-094 A3 — variety after 1\. e4 on seeds 1 to 10 $D"
    ;;
  book) lane book $B ;;
  qehop) lane qehop $Q ;;
  uci) lane uci $U ;;
esac; done
