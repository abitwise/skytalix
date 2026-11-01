#!/bin/bash
# se-ABC-262 A4 probe: (1) QB and PQ2 against the ABC-261/262 rows run alone (-t), to read the epoch-0 alias;
# (2) a scratch-only priming call that stamps pinStamp[a2] before P1' (remedy candidate, never in tree). Under flock.
set -u
W=/home/olger/projects/public/skytalix/.claude/worktrees/se-ABC-262
S=/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/se-262
P=$S/plants; O=$S/raw/probe2; rm -rf "$O"; mkdir -p "$O"
P254=$W/.grugops/context/qe-ABC-254/raw/qe-scripts/plant.py
rm -rf "$P/PQ2"; mkdir -p "$P/PQ2"; ( cd "$W" && git ls-files -z | tar --null -T - -c | tar -x -C "$P/PQ2" ); ln -s "$W/node_modules" "$P/PQ2/node_modules"
python3 "$P254" "$P/PQ2/src/legal.ts" PQ2; ( cd "$W" && diff -ru src "$P/PQ2/src" > "$O/PQ2.diff" )
for n in C0-control QB PQ2; do for t in "ABC-261" "ABC-262"; do
  ( cd "$P/$n" && NODE_OPTIONS=--max-old-space-size=128 ./node_modules/.bin/vitest run src/legal.test.ts -t "$t" --reporter=verbose > "$O/$n.$t.alone.txt" 2>&1; echo "$n -t $t alone rc=$? :: $(grep -E '^\s+Tests ' "$O/$n.$t.alone.txt" | tr -s ' ')" ) | tee -a "$O/summary.txt"
done; done
# remedy candidate: prime pinStamp[a2] with a pinned black rook before the loop
for n in C0-control QB; do
  rm -rf "$P/$n-prime"; cp -r "$P/$n" "$P/$n-prime"; rm "$P/$n-prime/node_modules"; ln -s "$W/node_modules" "$P/$n-prime/node_modules"
  python3 - "$P/$n-prime/src/legal.test.ts" <<'PY'
import sys
p=sys.argv[1]; s=open(p).read()
a="""    for (const [name, fen, pawn, ahead, present] of boards) {
      const position = parseFen(fen);
      const from = parseSquareName(pawn);
      const to = parseSquareName(ahead);
      expect(position.blackToMove, name).toBe(true);"""
assert s.count(a)==1
b="""    legalCaptures(parseFen("k7/8/8/8/8/8/r7/R6K b - - 0 1")); // SCRATCH PRIME: stamp a2 as pinned
"""+a
open(p,'w').write(s.replace(a,b))
PY
  ( cd "$W" && diff -ru src "$P/$n-prime/src" > "$O/$n-prime.diff" )
  for mode in alone file; do
    if [ $mode = alone ]; then X=(-t ABC-262); else X=(); fi
    ( cd "$P/$n-prime" && NODE_OPTIONS=--max-old-space-size=128 ./node_modules/.bin/vitest run src/legal.test.ts "${X[@]}" --reporter=verbose > "$O/$n-prime.$mode.txt" 2>&1; echo "$n-prime $mode rc=$? :: $(grep -E '^\s+Tests ' "$O/$n-prime.$mode.txt" | tr -s ' ') :: $(grep -E '^\s+×' "$O/$n-prime.$mode.txt" | tr -s ' ' | tr '\n' ';')" ) | tee -a "$O/summary.txt"
  done
done
