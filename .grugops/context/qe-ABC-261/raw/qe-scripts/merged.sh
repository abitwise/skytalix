#!/bin/bash
# qe-ABC-261: one npm test on the merge-tree result of main + grugops/ABC-261 (tree b60ab0ff), out of tree. Under flock.
set -u
S=/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/qe-261
W=/home/olger/projects/public/skytalix/.claude/worktrees/qe-ABC-261
rm -rf "$S/merged"; mkdir -p "$S/merged"; ( cd "$W" && git archive b60ab0ffe6a9ae8700d61a79c97faa87de05a171 | tar -x -C "$S/merged" ); ln -s "$W/node_modules" "$S/merged/node_modules"
cd "$S/merged" && npm test > "$S/raw/merged-npm-test.txt" 2>&1; echo "merged npm test rc=$? :: $(grep -E '^\s+(Test Files|Tests) ' "$S/raw/merged-npm-test.txt" | tr -s ' ' | tr '\n' ' ')"
