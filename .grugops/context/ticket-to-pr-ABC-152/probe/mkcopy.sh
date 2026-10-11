#!/bin/bash
# usage: mkcopy.sh <name> [rev]  -> prints dir. A git-archive copy of the worktree at rev, outside the repo,
# node_modules symlinked to the WORKTREE's (vitest 4.1.11), never the main checkout's.
W=/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-ABC-152
S=/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/8527bcf0-376e-4738-b2d4-7789ea9bdd71/scratchpad/abc152
D=$S/plants/$1; rm -rf "$D"; mkdir -p "$D"
git -C $W archive "${2:-HEAD}" | tar -x -C "$D"
ln -s $W/node_modules "$D/node_modules"
echo "$D"
