#!/bin/bash
# qe-ABC-174: started only after a foreground 180 s window read 0 foreign polls (window3.out).
# 1) N8-LANE narrow set, B=T=bd480c99, H=be6a5599; 2) NFR-008 full lane npm test, H=H2=be6a5599. Sampler beside both.
S=/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/c759514b-0b67-4176-b897-647bcb7478de/scratchpad
P=/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/.grugops/context/qe-ABC-174/probe
SET="src/book-engine.test.ts src/book.test.ts src/cli.test.ts src/engine.test.ts src/ladder.test.ts src/levels.test.ts src/uci-session.test.ts"
node $P/sampler174.mjs $S/sampler.tsv $$ & SP=$!
echo "start procs $(ps -u $(id -u) | wc -l) load $(sysctl -n vm.loadavg) $(date -u +%FT%TZ)"
ARMS=$S/arms CONDS=B,T,H BASE=B TWIN=T ROUNDS=9 GAP=0 TAG=n8-narrow CMD="env NODE_OPTIONS=--max-old-space-size=128 npx vitest run $SET --reporter=default --reporter=json --outputFile.json=.test-results/last-run.json" node $P/lane174.mjs
echo "mid procs $(ps -u $(id -u) | wc -l) load $(sysctl -n vm.loadavg) $(date -u +%FT%TZ)"
ARMS=$S/arms CONDS=H,H2 BASE=H TWIN=H2 ROUNDS=9 GAP=0 TAG=nfr008-full node $P/lane174.mjs
echo "end procs $(ps -u $(id -u) | wc -l) load $(sysctl -n vm.loadavg) $(date -u +%FT%TZ)"
kill -TERM $SP
