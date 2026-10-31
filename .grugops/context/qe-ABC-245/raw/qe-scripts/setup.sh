#!/usr/bin/env bash
# qe-ABC-245 scratch trees (frozen in PREREG.txt). usage: setup.sh <repo> <scratch qe-245 dir>
# H = git archive 7e81732e (full: tests read .grugops/, plans/). node_modules = ONE symlink to the main checkout's
# (package.json / package-lock.json equal at 9c008db4, 7e81732e and main; a hard link cannot cross from /home to the
# tmpfs scratchpad). B = hard-link tree of H with src/levels.test.ts replaced by a REAL copy of 9c008db4's (the only file
# that differs, checked below). P (plants) is built by plant.mjs as a hard-link tree of H with a real src/.
set -euo pipefail
REPO="$1"; S="$2"
mkdir -p "$S"; rm -rf "$S/H" "$S/B" "$S/P"
mkdir "$S/H"; git -C "$REPO" archive 7e81732e | tar -x -C "$S/H"
ln -s "$REPO/node_modules" "$S/H/node_modules"
test "$(git -C "$REPO" diff --name-only 9c008db4 7e81732e)" = "src/levels.test.ts"
cp -al "$S/H" "$S/B"; rm "$S/B/src/levels.test.ts"; git -C "$REPO" show 9c008db4:src/levels.test.ts > "$S/B/src/levels.test.ts"
git -C "$REPO" show 4387d4e8:src/levels.ts > "$S/levels-4387d4e8.ts"
git -C "$REPO" diff --quiet 9c008db4 7e81732e -- package.json package-lock.json
git -C "$REPO" diff --quiet main 7e81732e -- package.json package-lock.json
du -sh "$S" ; du -sh --apparent-size "$S/H" | tail -1
