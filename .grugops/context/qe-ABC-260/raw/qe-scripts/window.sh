#!/bin/bash
set -u
Q=/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/qe-260
echo "window start $(date -u +%T)"
bash $Q/gates.sh
echo "gates end $(date -u +%T)"
node $Q/harness/g8.mjs /home/olger/projects/public/skytalix/.claude/worktrees/qe-ABC-260 $Q/base $Q/raw/g8
echo "g8 rc=$? end $(date -u +%T)"
bash $Q/merged.sh
echo "merged end $(date -u +%T)"
