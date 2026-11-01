#!/bin/bash
# qe-ABC-262 A6-A8 window (run whole under flock host-test.lock): static gates at the head, G8 (b h h b b h, wait-clear before
# every run, 15-min shared cap), skip-integrity from a G8 head run's JSON, lane-inventory, and npm test on the merge-tree of main + grugops/ABC-262.
set -u
W=/home/olger/projects/public/skytalix/.claude/worktrees/qe-ABC-262
S=/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/qe-262
G=$S/raw/gates; R=$S/raw/g8; MT=0988f0040e00590583f72742965b27302d9debbf
rm -rf "$G" "$R"; mkdir -p "$G" "$R"
# Base and merged trees are detached git worktrees on the home volume (the /tmp scratch volume hit EDQUOT on git-archive copies):
# BASE = 767a2e3e, MERGED = dangling commit b0ae51b6 whose tree is merge-tree $MT; node_modules symlinked to the QE worktree.
BASE=/home/olger/projects/public/skytalix/.claude/worktrees/qe-ABC-262-base; MERGED=/home/olger/projects/public/skytalix/.claude/worktrees/qe-ABC-262-merged
echo "window start $(date -u +%T) load1=$(cut -d' ' -f1 /proc/loadavg)"
cd "$W"
echo "head $(git rev-parse --short HEAD); src+tools+config == 39a6237e: $(git diff --quiet 39a6237e HEAD -- src tools vitest.config.ts package.json package-lock.json && echo yes || echo NO)" | tee "$G/head.txt"
npm run lint > "$G/lint.txt" 2>&1; echo "lint rc=$?" | tee -a "$G/lint.txt"
npm run typecheck > "$G/typecheck.txt" 2>&1; echo "typecheck rc=$?" | tee -a "$G/typecheck.txt"
npm run build > "$G/build.txt" 2>&1; echo "build rc=$?" | tee -a "$G/build.txt"
git status --porcelain > "$G/status-after-build.txt"; echo "status after build: $(wc -l < "$G/status-after-build.txt") lines"
NODE_OPTIONS=--max-old-space-size=128 node tools/grugops/lane-inventory.js > "$G/lane-inv.txt" 2>&1; echo "lane-inventory rc=$? :: $(tr '\n' ' ' < "$G/lane-inv.txt")"
echo "g8 start $(date -u +%T)"
echo "merged tree == $MT: $(git -C "$MERGED" rev-parse HEAD^{tree})"
node "$S/harness/g8.mjs" "$W" "$BASE" "$R"; echo "g8 rc=$? end $(date -u +%T)"
N=$(node -e 'const j=require(process.argv[1]);console.log(j.numPendingTests+j.numTodoTests)' "$R/g8-2-head.last-run.json"); echo "skip count (g8 run 2 head JSON)=$N" | tee "$G/skip-count.txt"
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count "$N" > "$G/skip-integrity.txt" 2>&1; echo "skip-integrity rc=$? :: $(tr '\n' ' ' < "$G/skip-integrity.txt")"
( cd "$MERGED" && npm test > "$S/raw/merged-npm-test.txt" 2>&1; echo "merged npm test rc=$? :: $(grep -E '^\s+(Test Files|Tests) ' "$S/raw/merged-npm-test.txt" | tr -s ' ' | tr '\n' ' ')" )
echo "window end $(date -u +%T)"
