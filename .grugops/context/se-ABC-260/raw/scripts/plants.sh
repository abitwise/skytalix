#!/bin/bash
# se-ABC-260 plants: out-of-tree copies of the tip src, one plant each; run A8 + the ABC-259 rows.
# Run as: flock <host-test.lock> bash plants.sh <tip-or-base-worktree> <outdir>
set -u
W=$1
P=$2
rm -rf "$P"; mkdir -p "$P"
mk() { local d="$P/$1"; mkdir -p "$d"; cp -r "$W/src" "$W/tools" "$W/vitest.config.ts" "$W/package.json" "$W/tsconfig.json" "$d/"; ln -s "$W/node_modules" "$d/node_modules"; echo "$d"; }
mk C0-control >/dev/null
d=$(mk A2a-Q5-named-import-search); sed -i '1i\import { env as qeEnv } from "node:process";' "$d/src/search.ts"; sed -i '194i\  if (qeEnv.SKYTALIX_FAST) return 0;' "$d/src/search.ts"
d=$(mk A2b-259A3-process-env-search); sed -i '193i\  if (process.env.SKYTALIX_FAST) return 0;' "$d/src/search.ts"
d=$(mk A3-Q6-string-slashstar-search); sed -i '193i\  const qeGlob = "src/*.ts"; void qeGlob;\n  if (process.env.SKYTALIX_FAST) return 0;' "$d/src/search.ts"
d=$(mk A3x-template-slashstar-search); sed -i '193i\  const qeGlob = `src/*.ts`; void qeGlob;\n  if (process.env.SKYTALIX_FAST) return 0;' "$d/src/search.ts"
d=$(mk A4a-Q7-string-slashslash-engine); sed -i '704a\  const qeUrl = "http://x"; if (options.budgetMs <= 100) { void qeUrl; }' "$d/src/engine.ts"
d=$(mk A4b-string-slashslash-levels); sed -i '29a\const qeUrl = "http://x"; void qeUrl; process.stdout.write("");' "$d/src/levels.ts"
d=$(mk A5-comments-quiescence-search); sed -i '66a\/**\n * QE plant A5: budgetMs process.env ENGINE_DEEP VITEST NODE_ENV argv import.meta.env\n */\nvoid 0; // budgetMs process.env.SKYTALIX_FAST ENGINE_DEEP' "$d/src/quiescence.ts"; sed -i '193i\  // SE plant A5: a quoted "//" and the word process, inside a comment\n  /* and a block comment with "//", process and an apostrophe: it'"'"'s */' "$d/src/search.ts"
for d in "$P"/*/; do
  n=$(basename "$d"); ( cd "$W" && diff -ru src "$d/src" > "$P/$n.diff" )
  ( cd "$d" && NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run src/levels.test.ts -t "A8 — the level|ABC-259" --reporter=json --outputFile="$P/$n.json" > "$P/$n.log" 2>&1; echo "$n rc=$?" )
done
