#!/bin/bash
# qe-ABC-259 plants: out-of-tree copies of the head (e1c10e19 src), one plant each, run the 3 ABC-259 rows.
set -u
W=/home/olger/projects/public/skytalix/.claude/worktrees/qe-ABC-259
P=/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/qe-259/plants
rm -rf "$P"; mkdir -p "$P"
mk() { local d="$P/$1"; mkdir -p "$d"; cp -r "$W/src" "$W/tools" "$W/vitest.config.ts" "$W/package.json" "$W/tsconfig.json" "$d/"; ln -s "$W/node_modules" "$d/node_modules"; echo "$d"; }
mk C0-control >/dev/null
# ticket plants, re-applied by QE
d=$(mk A2-engine);  sed -i '704a\  if (options.budgetMs <= 100) { void 0; }' "$d/src/engine.ts"
d=$(mk A2-search);  sed -i '193i\  const qeBudgetMs = 0; if (qeBudgetMs > 1) return 0;' "$d/src/search.ts"
d=$(mk A3-search);  sed -i '193i\  if (process.env.SKYTALIX_FAST) return 0;' "$d/src/search.ts"
d=$(mk A4-evaluate); sed -i '200i\  if (SEARCH_DEEP) return false;' "$d/src/evaluate.ts"; sed -i '195i\const SEARCH_DEEP = false;' "$d/src/evaluate.ts"
d=$(mk A5-quiescence); sed -i '66a\/**\n * QE plant A5: budgetMs process.env ENGINE_DEEP VITEST NODE_ENV argv import.meta.env\n */\nvoid 0; // budgetMs process.env.SKYTALIX_FAST ENGINE_DEEP' "$d/src/quiescence.ts"
# QE plants the SE did not try
d=$(mk Q1-alias-destructure-engine); sed -i '704a\  const { budgetMs: fastBudget } = options; if (fastBudget <= 100) { void 0; }' "$d/src/engine.ts"
d=$(mk Q2-alias-computed-key-engine); sed -i '704a\  if ((options as unknown as Record<string, number>)["budget" + "Ms"] <= 100) { void 0; }' "$d/src/engine.ts"
d=$(mk Q3-deadline-threshold-engine); sed -i '720a\  if (budget.deadline - start <= 100) { void 0; }' "$d/src/engine.ts"
d=$(mk Q4-deep-const-transposition); sed -i '42a\const TT_DEEP = false; void TT_DEEP;' "$d/src/transposition.ts"
d=$(mk Q5-env-named-import-search); sed -i '1i\import { env as qeEnv } from "node:process";' "$d/src/search.ts"; sed -i '194i\  if (qeEnv.SKYTALIX_FAST) return 0;' "$d/src/search.ts"
d=$(mk Q6-string-slashstar-hides-search); sed -i '193i\  const qeGlob = "src/*.ts"; void qeGlob;\n  if (process.env.SKYTALIX_FAST) return 0;' "$d/src/search.ts"
d=$(mk Q7-string-slashslash-hides-engine); sed -i '704a\  const qeUrl = "http://x"; if (options.budgetMs <= 100) { void qeUrl; }' "$d/src/engine.ts"
for d in "$P"/*/; do
  n=$(basename "$d"); ( cd "$W" && diff -ru src "$d/src" > "$P/$n.diff" )
  ( cd "$d" && NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run src/levels.test.ts -t "ABC-259" --reporter=json --outputFile="$P/$n.json" > "$P/$n.log" 2>&1; echo "$n rc=$?" )
done
