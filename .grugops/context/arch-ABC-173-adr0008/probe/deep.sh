cd /private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/8527bcf0-376e-4738-b2d4-7789ea9bdd71/scratchpad/copy
run() { name=$1; shift; rm -f /private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/8527bcf0-376e-4738-b2d4-7789ea9bdd71/scratchpad/probe/$name.jsonl; env HEAP_PROBE_LOG=/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/8527bcf0-376e-4738-b2d4-7789ea9bdd71/scratchpad/probe/$name.jsonl "$@" > /private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/8527bcf0-376e-4738-b2d4-7789ea9bdd71/scratchpad/probe/$name.out 2>&1; echo "$name exit $? $(grep -E 'Tests  ' /private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/8527bcf0-376e-4738-b2d4-7789ea9bdd71/scratchpad/probe/$name.out | tr -s ' ') oom=$(grep -c 'out of memory' /private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/8527bcf0-376e-4738-b2d4-7789ea9bdd71/scratchpad/probe/$name.out)"; }
P="--import=/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/8527bcf0-376e-4738-b2d4-7789ea9bdd71/scratchpad/probe/pre.mjs --max-old-space-size=128"
run puzzle PUZZLE_DEEP=1 NODE_OPTIONS="$P" npx vitest run src/puzzle-suite.test.ts
run quiesce SEARCH_DEEP=1 NODE_OPTIONS="$P" npx vitest run src/quiescence.test.ts
run tt_engine ENGINE_DEEP=1 NODE_OPTIONS="$P" npx vitest run src/transposition.test.ts
run input INPUT_DEEP=1 NODE_OPTIONS="--expose-gc $P" npx vitest run src/line-input.test.ts
run input_nogc INPUT_DEEP=1 NODE_OPTIONS="$P" npx vitest run src/line-input.test.ts
run cli_deep CLI_DEEP=1 NODE_OPTIONS="$P" npx vitest run src/cli.real-engine.test.ts
run zobrist ZOBRIST_DEEP=1 NODE_OPTIONS="$P" npx vitest run src/zobrist.test.ts
run tt_search SEARCH_DEEP=1 NODE_OPTIONS="$P" npx vitest run src/transposition.test.ts
echo DONE
