#!/bin/bash
# qe-ABC-260 plants: out-of-tree copies of a tree's src (tip worktree, or base 524b7949), one plant each; run A8 + the ABC-259 rows (5).
# usage (under flock host-test.lock): bash plants.sh <tree> <outdir>
set -u
W=$1; P=$2
rm -rf "$P"; mkdir -p "$P"
mk() { local d="$P/$1"; mkdir -p "$d"; cp -r "$W/src" "$W/tools" "$W/vitest.config.ts" "$W/package.json" "$W/tsconfig.json" "$d/"; ln -s /home/olger/projects/public/skytalix/node_modules "$d/node_modules"; echo "$d"; }
mk C0-control >/dev/null
# ticket plants re-applied by QE (SE's se-260 plants.sh lines, verbatim sed)
d=$(mk A2a-Q5-named-import-search); sed -i '1i\import { env as qeEnv } from "node:process";' "$d/src/search.ts"; sed -i '194i\  if (qeEnv.SKYTALIX_FAST) return 0;' "$d/src/search.ts"
d=$(mk A2b-259A3-process-env-search); sed -i '193i\  if (process.env.SKYTALIX_FAST) return 0;' "$d/src/search.ts"
d=$(mk A3-Q6-string-slashstar-search); sed -i '193i\  const qeGlob = "src/*.ts"; void qeGlob;\n  if (process.env.SKYTALIX_FAST) return 0;' "$d/src/search.ts"
d=$(mk A4a-Q7-string-slashslash-engine); sed -i '704a\  const qeUrl = "http://x"; if (options.budgetMs <= 100) { void qeUrl; }' "$d/src/engine.ts"
d=$(mk A4b-string-slashslash-levels); sed -i '29a\const qeUrl = "http://x"; void qeUrl; process.stdout.write("");' "$d/src/levels.ts"
# A5 comment controls: ABC-259 A5's quiescence plant + a search.ts comment with a quoted "//" and process (+ QE: apostrophe/backtick/quote in comments)
d=$(mk A5-comments-quiescence-search); sed -i '66a\/**\n * QE plant A5: budgetMs process.env ENGINE_DEEP VITEST NODE_ENV argv import.meta.env\n */\nvoid 0; // budgetMs process.env.SKYTALIX_FAST ENGINE_DEEP' "$d/src/quiescence.ts"; sed -i '193i\  // QE plant A5: a quoted "//" and the word process, inside a comment\n  /* block: "//", process, an apostrophe it'"'"'s, a backtick ` and a lone quote " */' "$d/src/search.ts"
d=$(mk A5q-comment-oddquotes-search); sed -i '193i\  // QE: odd tokens in a line comment: it'"'"'s " ` /* process\n  void 0; /* trailing block with ` and '"'"' and " and process */ void 0;' "$d/src/search.ts"
# QE plants
d=$(mk Q8-regex-quote-then-string-slashslash-engine); sed -i '704a\  const qeRe = /"/; const qeUrl = "http://x"; if (options.budgetMs <= 100) { void qeRe; void qeUrl; }' "$d/src/engine.ts"
d=$(mk Q8b-regex-quote-then-code-search); sed -i '193i\  const qeRe = /"/; if (process.env.SKYTALIX_FAST) return qeRe.source.length;' "$d/src/search.ts"
d=$(mk Q9-regex-escaped-slashes-engine); sed -i '704a\  const qeRe = /:\\/\\//; if (options.budgetMs <= 100) { void qeRe; }' "$d/src/engine.ts"
d=$(mk Q10-escaped-dquote-in-string-search); sed -i '193i\  const qeS = "a\\"b // c"; if (process.env.SKYTALIX_FAST) return qeS.length;' "$d/src/search.ts"
d=$(mk Q10b-escaped-squote-in-string-search); sed -i "193i\\  const qeS = 'it\\\\'s // c'; if (process.env.SKYTALIX_FAST) return qeS.length;" "$d/src/search.ts"
d=$(mk Q11-template-interp-process-search); sed -i '193i\  const qeT = `${process.env.SKYTALIX_FAST}`; void qeT;' "$d/src/search.ts"
d=$(mk Q11b-template-nested-backtick-engine); sed -i '704a\  const qeT = `${"`"}`; const qeUrl = "http://x"; if (options.budgetMs <= 100) { void qeT; void qeUrl; }' "$d/src/engine.ts"
d=$(mk Q12-globalthis-process-transposition); sed -i '42a\const qeFast = globalThis.process?.env?.SKYTALIX_FAST; void qeFast;' "$d/src/transposition.ts"
d=$(mk Q13-node-process-import-levels); sed -i '1i\import { stdout as qeOut } from "node:process";' "$d/src/levels.ts"; sed -i '31a\qeOut.write("");' "$d/src/levels.ts"
for d in "$P"/*/; do
  n=$(basename "$d"); ( cd "$W" && diff -ru src "$d/src" > "$P/$n.diff" )
  ( cd "$d" && NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run src/levels.test.ts -t "A8 — the level|ABC-259" --reporter=json --outputFile="$P/$n.json" > "$P/$n.log" 2>&1; echo "$n rc=$?" )
done
