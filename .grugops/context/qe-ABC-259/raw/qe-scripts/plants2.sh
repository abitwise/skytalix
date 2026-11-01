#!/bin/bash
# qe-ABC-259 plants, second pass: A2-search with a true `budgetMs` read (the first pass's `qeBudgetMs` is a different identifier: capital B).
set -u
W=/home/olger/projects/public/skytalix/.claude/worktrees/qe-ABC-259
P=/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/qe-259/plants
mk() { local d="$P/$1"; rm -rf "$d"; mkdir -p "$d"; cp -r "$W/src" "$W/tools" "$W/vitest.config.ts" "$W/package.json" "$W/tsconfig.json" "$d/"; ln -s "$W/node_modules" "$d/node_modules"; echo "$d"; }
d=$(mk A2b-search-true-read); sed -i '193i\  const { budgetMs = 0 } = move as { budgetMs?: number }; if (budgetMs > 1) return 0;' "$d/src/search.ts"
for n in A2b-search-true-read; do
  d="$P/$n"; ( cd "$W" && diff -ru src "$d/src" > "$P/$n.diff" )
  ( cd "$d" && NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run src/levels.test.ts -t "ABC-259" --reporter=json --outputFile="$P/$n.json" > "$P/$n.log" 2>&1; echo "$n rc=$?" )
done
