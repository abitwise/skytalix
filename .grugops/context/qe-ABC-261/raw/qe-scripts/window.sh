#!/bin/bash
set -u
echo "window start $(date -u +%T)"
/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/qe-261/gates.sh
echo "gates end $(date -u +%T)"
node /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/qe-261/harness/g8.mjs /home/olger/projects/public/skytalix/.claude/worktrees/qe-ABC-261 /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/qe-261/base /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/qe-261/raw/g8
echo "g8 rc=$? end $(date -u +%T)"
