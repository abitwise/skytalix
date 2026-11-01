#!/bin/bash
# qe-ABC-262 A3/A4/A5 re-read: out-of-tree git-archive copies of the QE worktree HEAD (src == 39a6237e), one plant each.
# Planters: qe-ABC-254 plant.py (PL3a), qe-ABC-261 qeplant.py (QX1, QX2, QB), qe-ABC-262 qeplant262.py (QBe, QKb; QE's own).
# The copy's ABC-262 early-exit row gets a scratch-only console.log of the spied count (never in tree). Run under flock host-test.lock.
set -u
W=/home/olger/projects/public/skytalix/.claude/worktrees/qe-ABC-262
S=/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/qe-262
P=$S/plants; O=$S/raw/plants
P254=$W/.grugops/context/qe-ABC-254/raw/qe-scripts/plant.py
P261=$W/.grugops/context/qe-ABC-261/raw/qe-scripts/qeplant.py
P262=$S/qe-scripts/qeplant262.py
rm -rf "$P" "$O"; mkdir -p "$P" "$O"
mk() { local d="$P/$1"; mkdir -p "$d"; ( cd "$W" && git archive HEAD | tar -x -C "$d" ); ln -s "$W/node_modules" "$d/node_modules"
  python3 - "$d/src/gameend.nfr.test.ts" <<'PY'
import sys
p=sys.argv[1]; s=open(p).read()
a='expect(attackTests).toBeLessThanOrEqual(1);'
assert s.count(a)==1
open(p,'w').write(s.replace(a,'console.log("B2COUNT", attackTests); // SCRATCH PROBE\n    '+a))
PY
  echo "$d"; }
mk C0-control >/dev/null
d=$(mk PL3a); python3 "$P254" "$d/src/legal.ts" PL3a
for id in QX1 QX2 QB; do d=$(mk $id); python3 "$P261" "$d" $id; done
for id in QBe QKb; do d=$(mk $id); python3 "$P262" "$d" $id; done
for d in "$P"/*/; do n=$(basename "$d"); ( cd "$W" && diff -ru src "$d/src" > "$O/$n.diff" ); done
for d in "$P"/*/; do n=$(basename "$d")
  for f in gameend.nfr legal; do
    ( cd "$d" && NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run src/$f.test.ts --reporter=verbose > "$O/$n.$f.txt" 2>&1; rc=$?
      echo "$n $f rc=$rc :: $(grep -E '^\s+Tests ' "$O/$n.$f.txt" | tr -s ' ') :: $(grep -o 'B2COUNT [0-9]*' "$O/$n.$f.txt" | head -1) :: fails: $(grep -E '^\s+×' "$O/$n.$f.txt" | tr -s ' ' | tr '\n' ';')" ) | tee -a "$O/summary.txt"
  done
done
# QB and QKb: the full default lane; C0 and QB: the ENGINE_DEEP ABC-254 A1 walk.
for n in QB QKb; do
  ( cd "$P/$n" && rm -f .test-results/last-run.json; npm test > "$O/$n.npm-test.txt" 2>&1; echo "$n npm test rc=$? :: $(grep -E '^\s+(Test Files|Tests) ' "$O/$n.npm-test.txt" | tr -s ' ' | tr '\n' ' ') :: fails: $(grep -E '^\s+×' "$O/$n.npm-test.txt" | tr -s ' ' | tr '\n' ';')" ) | tee -a "$O/summary.txt"
done
for n in C0-control QB; do
  ( cd "$P/$n" && ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run src/legal.test.ts -t "ABC-254 A1" > "$O/$n.ENGINE_DEEP-A1.txt" 2>&1; echo "$n ENGINE_DEEP A1 rc=$? :: $(grep -E '^\s+Tests ' "$O/$n.ENGINE_DEEP-A1.txt" | tr -s ' ') :: fails: $(grep -E '^\s+×' "$O/$n.ENGINE_DEEP-A1.txt" | tr -s ' ' | tr '\n' ';')" ) | tee -a "$O/summary.txt"
done
grep -h 'AssertionError' "$O/QB.ENGINE_DEEP-A1.txt" | head -2 | tee -a "$O/summary.txt"
