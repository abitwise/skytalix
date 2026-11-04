#!/bin/bash
cd "$1" || exit 2
out=$2
run() { local tag=$1; shift; local t0=$(date +%s); env "$@" > "$out/$tag.log" 2>&1; local ec=$?; echo "$tag exit $ec wall $(( $(date +%s) - t0 ))s" >> "$out/exits.txt"; }
H="NODE_OPTIONS=--max-old-space-size=400"
run bundle      SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/search.bundle.test.ts --reporter=verbose
run ord-search  SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/search.ordering.test.ts
run ord-engine  ENGINE_DEEP=1 $H timeout 1500 npx vitest run src/search.ordering.test.ts
run see         SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/see.test.ts
run futility    SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/search.futility.test.ts
run taper       SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/evaluate.taper.test.ts
run capacity    SEARCH_DEEP=1 $H timeout 1500 npx vitest run src/search.capacity.test.ts src/engine.capacity.test.ts
run lint        timeout 300 npm run lint
run typecheck   timeout 300 npm run typecheck
run build       timeout 300 npm run build
run skip        NODE_OPTIONS=--max-old-space-size=128 timeout 300 bash -c "npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'"
