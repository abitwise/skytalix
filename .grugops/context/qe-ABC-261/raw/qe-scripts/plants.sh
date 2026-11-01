#!/bin/bash
# qe-ABC-261 plants: out-of-tree copies of the head (git archive of the QE worktree HEAD, src == dd8b17ea), one plant each.
# Copies include .grugops/context and plans/ (qe-hop-integrity and pgn rows read them). Run under flock host-test.lock.
set -u
W=/home/olger/projects/public/skytalix/.claude/worktrees/qe-ABC-261
S=/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/qe-261
P=$S/plants; O=$S/raw/plants
PLANT254=$W/.grugops/context/qe-ABC-254/raw/qe-scripts/plant.py
rm -rf "$P"; mkdir -p "$P" "$O"
mk() { local d="$P/$1"; mkdir -p "$d"; ( cd "$W" && git archive HEAD | tar -x -C "$d" ); ln -s "$W/node_modules" "$d/node_modules"; echo "$d"; }
mk C0-control >/dev/null
for id in PL3a PQ2 PL1; do d=$(mk $id); python3 "$PLANT254" "$d/src/legal.ts" $id; done
for id in QX1 QX2 QN QB QR; do d=$(mk $id); python3 "$S/qeplant.py" "$d" $id; done
for d in "$P"/*/; do n=$(basename "$d"); ( cd "$W" && diff -ru src "$d/src" > "$O/$n.diff" ); done
rows() { # the two ABC-261 rows, single-file spelling
  local n=$1 d="$P/$1"
  for f in gameend.nfr legal; do
    ( cd "$d" && NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run src/$f.test.ts --reporter=verbose > "$O/$n.$f.txt" 2>&1; echo "$n $f rc=$? :: $(grep -E '^\s+Tests ' "$O/$n.$f.txt" | tr -s ' ')" )
  done
}
for d in "$P"/*/; do rows "$(basename "$d")"; done
