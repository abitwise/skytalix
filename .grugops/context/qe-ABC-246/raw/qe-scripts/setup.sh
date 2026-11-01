#!/usr/bin/env bash
# qe-ABC-246 scratch trees (frozen in PREREG.txt). usage: setup.sh <repo> <scratch qe-246 dir>
# H = git archive a1942ea0 (full: tests read .grugops/, plans/). node_modules = ONE symlink to the main checkout's.
# B = hard-link tree of H with src/uci-session.test.ts and src/engine.test.ts REAL copies of 832ff246's (the only
# src/ tools/ data/ package* files that differ, checked below). P (plants) is built by plant.mjs.
set -euo pipefail
REPO="$1"; S="$2"
mkdir -p "$S"; rm -rf "$S/H" "$S/B" "$S/P"
mkdir "$S/H"; git -C "$REPO" archive a1942ea0 | tar -x -C "$S/H"
ln -s "$REPO/node_modules" "$S/H/node_modules"
test "$(git -C "$REPO" diff --name-only 832ff246 a1942ea0 -- src tools data package.json package-lock.json vitest.config.ts tsconfig.json tsconfig.build.json biome.json)" = "$(printf 'src/engine.test.ts\nsrc/uci-session.test.ts')"
cp -al "$S/H" "$S/B"
for f in src/uci-session.test.ts src/engine.test.ts; do rm "$S/B/$f"; git -C "$REPO" show "832ff246:$f" > "$S/B/$f"; done
git -C "$REPO" diff --quiet 832ff246 a1942ea0 -- package.json package-lock.json
git -C "$REPO" diff --quiet main a1942ea0 -- package.json package-lock.json
echo "setup ok"; du -sh "$S" | tail -1
