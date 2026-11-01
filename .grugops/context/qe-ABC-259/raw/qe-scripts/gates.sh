#!/bin/bash
# qe-ABC-259 A9 static gates at the head (worktree src == e1c10e19 src). Run under flock host-test.lock.
set -u
W=/home/olger/projects/public/skytalix/.claude/worktrees/qe-ABC-259
O=/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/qe-259/raw/gates
cd "$W"
echo "head $(git rev-parse --short HEAD); src tree == e1c10e19: $(git diff --quiet e1c10e19 HEAD -- src tools vitest.config.ts package.json && echo yes || echo NO)" > "$O/head.txt"
npm run lint > "$O/lint.txt" 2>&1; echo "lint rc=$?" | tee -a "$O/lint.txt"
npm run typecheck > "$O/typecheck.txt" 2>&1; echo "typecheck rc=$?" | tee -a "$O/typecheck.txt"
npm run build > "$O/build.txt" 2>&1; echo "build rc=$?" | tee -a "$O/build.txt"
node tools/grugops/lane-inventory.js > "$O/lane-inv.txt" 2>&1; echo "lane-inventory rc=$?" | tee -a "$O/lane-inv.txt"
N=$(NODE_OPTIONS=--max-old-space-size=128 npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'); echo "skip-count capture (AGENTS.md spelling): ${N:-EMPTY} rc=$?" | tee "$O/skip-count.txt"
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count "${N:-UNKNOWN}" > "$O/skip-integrity.txt" 2>&1; echo "skip-integrity rc=$?" | tee -a "$O/skip-integrity.txt"
