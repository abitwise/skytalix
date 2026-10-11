#!/bin/bash
# QE ABC-083: gates and deep lanes on the branch tip, sequential, load1 + thermal per step.
cd "$1" || exit 2
mk() { printf '%s load1=%s thermal=%s' "$(date -u +%FT%TZ)" "$(sysctl -n vm.loadavg | awk '{print $2}')" "$(notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}')"; }
step() { name=$1; shift; echo "## $name | $* | start $(mk)"; local t0=$SECONDS; env "$@" > "$OUT/lane-$name.log" 2>&1; ec=$?; echo "## $name | exit=$ec | $((SECONDS-t0)) s | end $(mk)"; grep -E 'Test Files|Tests  |No findings|^[0-9]+$' "$OUT/lane-$name.log" | tail -3; }
OUT=$2
echo "# tree $(git rev-parse --short=8 HEAD)"
step lint npm run lint
step typecheck npm run typecheck
step build npm run build
step test npm test
step skipcount sh -c "npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'"
SK=$(cat "$OUT/lane-skipcount.log" | tail -1)
step integrity node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count "$SK"
step evaluate-files npx vitest run src/evaluate.king-mobility.test.ts src/evaluate.pawns.test.ts src/evaluate.test.ts
step search-deep SEARCH_DEEP=1 npx vitest run src/search.test.ts
step quiescence-deep SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts
step ordering-deep SEARCH_DEEP=1 npx vitest run src/search.ordering.test.ts
step transposition-search-deep SEARCH_DEEP=1 npx vitest run src/transposition.test.ts
step transposition-engine-deep ENGINE_DEEP=1 npx vitest run src/transposition.test.ts
step zobrist-deep ZOBRIST_DEEP=1 npx vitest run src/zobrist.test.ts
step engine-deep ENGINE_DEEP=1 npx vitest run src/engine.test.ts
step levels-deep ENGINE_DEEP=1 npx vitest run src/levels.test.ts
step cli-deep CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts
step puzzle-weakened PUZZLE_DEEP=weakened npx vitest run src/puzzle-suite.test.ts
echo "# done $(mk)"
